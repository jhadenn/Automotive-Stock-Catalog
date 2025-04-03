import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Product } from '@/lib/types'

export interface RestockingAlert {
  id?: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  createdAt?: string;
  status: 'active' | 'resolved';
}

export class RestockingService {
  // Check which products are below the stock threshold
  async checkLowStockItems(threshold: number): Promise<Product[]> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', threshold)
        .order('stock', { ascending: true });
        
      if (error) {
        console.error('Error fetching low stock items:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('RestockingService.checkLowStockItems error:', error);
      throw error;
    }
  }

  // Generate alerts for products below threshold
  async generateRestockingAlerts(threshold: number): Promise<RestockingAlert[]> {
    try {
      // Get all products below threshold
      const lowStockItems = await this.checkLowStockItems(threshold);
      
      if (lowStockItems.length === 0) {
        return [];
      }
      
      const supabase = createClientComponentClient();
      const alerts: RestockingAlert[] = [];
      
      // Create alerts for each low stock item
      for (const product of lowStockItems) {
        // Check if an active alert already exists for this product
        const { data: existingAlerts } = await supabase
          .from('restocking_alerts')
          .select('*')
          .eq('product_id', product.id)
          .eq('status', 'active')
          .single();
          
        if (existingAlerts) {
          // Alert already exists, add to our list
          alerts.push(this.mapToRestockingAlert(existingAlerts));
          continue;
        }
        
        // Create a new alert
        const newAlert = {
          product_id: product.id,
          product_name: product.name,
          current_stock: product.stock,
          threshold: threshold,
          status: 'active',
          created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('restocking_alerts')
          .insert([newAlert])
          .select()
          .single();
          
        if (error) {
          console.error('Error creating alert:', error);
          continue;
        }
        
        alerts.push(this.mapToRestockingAlert(data));
      }
      
      return alerts;
    } catch (error) {
      console.error('RestockingService.generateRestockingAlerts error:', error);
      throw error;
    }
  }

  // Retrieve all active alerts
  async getActiveAlerts(): Promise<RestockingAlert[]> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase
        .from('restocking_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching active alerts:', error);
        throw error;
      }
      
      return (data || []).map(this.mapToRestockingAlert);
    } catch (error) {
      console.error('RestockingService.getActiveAlerts error:', error);
      throw error;
    }
  }

  // Get product threshold settings
  async getProductThreshold(productId: string): Promise<number | null> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase
        .from('product_thresholds')
        .select('threshold')
        .eq('product_id', productId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          return null;
        }
        console.error('Error fetching product threshold:', error);
        throw error;
      }
      
      return data?.threshold || null;
    } catch (error) {
      console.error('RestockingService.getProductThreshold error:', error);
      throw error;
    }
  }

  // Set product threshold
  async setProductThreshold(productId: string, threshold: number): Promise<void> {
    const supabase = createClientComponentClient();
    
    try {
      // Check if threshold already exists
      const currentThreshold = await this.getProductThreshold(productId);
      
      if (currentThreshold !== null) {
        // Update existing threshold
        const { error } = await supabase
          .from('product_thresholds')
          .update({ threshold })
          .eq('product_id', productId);
          
        if (error) {
          console.error('Error updating threshold:', error);
          throw error;
        }
      } else {
        // Create new threshold
        const { error } = await supabase
          .from('product_thresholds')
          .insert([{ 
            product_id: productId,
            threshold 
          }]);
          
        if (error) {
          console.error('Error creating threshold:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('RestockingService.setProductThreshold error:', error);
      throw error;
    }
  }

  // Mark an alert as resolved
  async markAlertResolved(alertId: string): Promise<RestockingAlert> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase
        .from('restocking_alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();
        
      if (error) {
        console.error('Error resolving alert:', error);
        throw error;
      }
      
      return this.mapToRestockingAlert(data);
    } catch (error) {
      console.error('RestockingService.markAlertResolved error:', error);
      throw error;
    }
  }

  // Helper method to map database response to RestockingAlert interface
  private mapToRestockingAlert(data: any): RestockingAlert {
    return {
      id: data.id,
      productId: data.product_id,
      productName: data.product_name,
      currentStock: data.current_stock,
      threshold: data.threshold,
      createdAt: data.created_at,
      status: data.status
    };
  }
} 