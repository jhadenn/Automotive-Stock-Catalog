import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Product } from '@/lib/types'

/**
 * Represents an alert for a product that needs restocking.
 * This is used to track products with stock levels below their defined thresholds.
 */
export interface RestockingAlert {
  /** Unique identifier for the alert (auto-generated) */
  id?: string;
  /** ID of the product that needs restocking */
  productId: string;
  /** Name of the product that needs restocking */
  productName: string;
  /** Current stock level of the product */
  currentStock: number;
  /** Threshold value that triggered this alert */
  threshold: number;
  /** Timestamp when the alert was created */
  createdAt?: string;
  /** Current status of the alert */
  status: 'active' | 'resolved';
}

/**
 * Service responsible for monitoring and managing product stock levels.
 * Provides functionality for checking low stock, generating alerts, and managing threshold settings.
 */
export class RestockingService {
  /**
   * Retrieves all products with stock levels below the specified threshold.
   * 
   * @param threshold - The minimum stock level before a product is considered low
   * @returns Promise resolving to an array of products below the threshold
   * @throws Error if the database query fails
   */
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

  /**
   * Creates restocking alerts for all products below the specified threshold.
   * Skips products that already have active alerts.
   * 
   * @param threshold - The stock threshold to check against
   * @returns Promise resolving to an array of created or existing alerts
   * @throws Error if the alert generation process fails
   */
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

  /**
   * Retrieves all active restocking alerts.
   * 
   * @returns Promise resolving to an array of active restocking alerts
   * @throws Error if the database query fails
   */
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

  /**
   * Gets the custom threshold setting for a specific product.
   * 
   * @param productId - The ID of the product to get the threshold for
   * @returns Promise resolving to the threshold value or null if not set
   * @throws Error if the database query fails
   */
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

  /**
   * Sets a custom threshold for a specific product.
   * If a threshold already exists, it will be updated; otherwise, a new one is created.
   * 
   * @param productId - The ID of the product to set the threshold for
   * @param threshold - The threshold value to set
   * @throws Error if the database operation fails
   */
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

  /**
   * Marks a restocking alert as resolved.
   * 
   * @param alertId - The ID of the alert to mark as resolved
   * @returns Promise resolving to the updated alert
   * @throws Error if the database operation fails
   */
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
        console.error('Error marking alert as resolved:', error);
        throw error;
      }
      
      return this.mapToRestockingAlert(data);
    } catch (error) {
      console.error('RestockingService.markAlertResolved error:', error);
      throw error;
    }
  }

  /**
   * Helper method to map database response to the RestockingAlert interface.
   * 
   * @param data - Raw data from the database
   * @returns A properly formatted RestockingAlert object
   * @private
   */
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