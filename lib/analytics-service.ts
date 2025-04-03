import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Product } from '@/lib/types'

export interface StockEvent {
  id?: string;
  productId: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  eventType: 'update' | 'restock' | 'sale' | 'adjustment';
  timestamp: string;
  userId?: string;
  notes?: string;
}

export interface ProductHistory {
  events: StockEvent[];
  statistics: {
    averageStockLevel: number;
    restockFrequency: number; // Average days between restocks
    stockTurnover: number;    // Rate at which inventory is sold
    daysOutOfStock: number;
  };
}

export class AnalyticsService {
  // Record a stock change event
  async recordStockChange(
    productId: string,
    previousStock: number,
    newStock: number,
    eventType: StockEvent['eventType'] = 'update',
    notes: string = ''
  ): Promise<StockEvent> {
    const supabase = createClientComponentClient();
    
    try {
      const changeAmount = newStock - previousStock;
      
      const event: {
        product_id: string;
        previous_stock: number;
        new_stock: number;
        change_amount: number;
        event_type: StockEvent['eventType'];
        timestamp: string;
        notes: string;
        user_id?: string;
      } = {
        product_id: productId,
        previous_stock: previousStock,
        new_stock: newStock,
        change_amount: changeAmount,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        notes
      };
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        event.user_id = session.user.id;
      }
      
      // Insert the event
      const { data, error } = await supabase
        .from('stock_events')
        .insert([event])
        .select()
        .single();
        
      if (error) {
        console.error('Error recording stock change:', error);
        throw error;
      }
      
      return this.mapToStockEvent(data);
    } catch (error) {
      console.error('AnalyticsService.recordStockChange error:', error);
      throw error;
    }
  }
  
  // Get stock history for a product
  async getProductHistory(productId: string): Promise<StockEvent[]> {
    const supabase = createClientComponentClient();
    
    try {
      const { data, error } = await supabase
        .from('stock_events')
        .select('*')
        .eq('product_id', productId)
        .order('timestamp', { ascending: false });
        
      if (error) {
        console.error('Error fetching product history:', error);
        throw error;
      }
      
      return (data || []).map(this.mapToStockEvent);
    } catch (error) {
      console.error('AnalyticsService.getProductHistory error:', error);
      throw error;
    }
  }
  
  // Calculate statistics for a product
  async getProductAnalytics(productId: string): Promise<ProductHistory> {
    try {
      const events = await this.getProductHistory(productId);
      
      if (events.length === 0) {
        return {
          events: [],
          statistics: {
            averageStockLevel: 0,
            restockFrequency: 0,
            stockTurnover: 0,
            daysOutOfStock: 0
          }
        };
      }
      
      // Calculate average stock level
      const stockLevels = events.map(event => event.newStock);
      const averageStockLevel = stockLevels.reduce((sum, stock) => sum + stock, 0) / stockLevels.length;
      
      // Calculate restock frequency (days between restocks)
      const restockEvents = events.filter(event => event.eventType === 'restock');
      let restockFrequency = 0;
      
      if (restockEvents.length > 1) {
        const timestamps = restockEvents.map(event => new Date(event.timestamp).getTime());
        let totalDays = 0;
        
        for (let i = 0; i < timestamps.length - 1; i++) {
          const daysDiff = (timestamps[i] - timestamps[i + 1]) / (1000 * 3600 * 24);
          totalDays += daysDiff;
        }
        
        restockFrequency = totalDays / (restockEvents.length - 1);
      }
      
      // Calculate stock turnover
      const saleEvents = events.filter(event => event.eventType === 'sale');
      const totalSold = saleEvents.reduce((sum, event) => sum + Math.abs(event.changeAmount), 0);
      const stockTurnover = events.length > 0 ? totalSold / averageStockLevel : 0;
      
      // Calculate days out of stock
      const outOfStockEvents = events.filter(event => event.newStock === 0);
      let daysOutOfStock = 0;
      
      if (outOfStockEvents.length > 0) {
        for (let i = 0; i < outOfStockEvents.length; i++) {
          const currentEvent = outOfStockEvents[i];
          
          // Find the next event where stock became > 0
          const nextInStockEvent = events.find(
            event => new Date(event.timestamp) < new Date(currentEvent.timestamp) && event.newStock > 0
          );
          
          if (nextInStockEvent) {
            const start = new Date(currentEvent.timestamp);
            const end = new Date(nextInStockEvent.timestamp);
            const daysDiff = (start.getTime() - end.getTime()) / (1000 * 3600 * 24);
            daysOutOfStock += daysDiff;
          }
        }
      }
      
      return {
        events,
        statistics: {
          averageStockLevel,
          restockFrequency,
          stockTurnover,
          daysOutOfStock
        }
      };
    } catch (error) {
      console.error('AnalyticsService.getProductAnalytics error:', error);
      throw error;
    }
  }
  
  // Simulate a method to get analytics for the dashboard
  async getDashboardAnalytics(): Promise<{ 
    lowStockCount: number;
    totalProducts: number;
    outOfStockCount: number;
    recentChanges: StockEvent[];
  }> {
    const supabase = createClientComponentClient();
    
    try {
      // Get total products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, stock');
        
      if (productsError) {
        throw productsError;
      }
      
      const totalProducts = productsData.length;
      const lowStockCount = productsData.filter(p => p.stock < 5).length;
      const outOfStockCount = productsData.filter(p => p.stock === 0).length;
      
      // Get recent stock changes
      const { data: eventsData, error: eventsError } = await supabase
        .from('stock_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
        
      if (eventsError) {
        throw eventsError;
      }
      
      return {
        lowStockCount,
        totalProducts,
        outOfStockCount,
        recentChanges: (eventsData || []).map(this.mapToStockEvent)
      };
    } catch (error) {
      console.error('AnalyticsService.getDashboardAnalytics error:', error);
      throw error;
    }
  }

  // Helper method to map database response to StockEvent interface
  private mapToStockEvent(data: any): StockEvent {
    return {
      id: data.id,
      productId: data.product_id,
      previousStock: data.previous_stock,
      newStock: data.new_stock,
      changeAmount: data.change_amount,
      eventType: data.event_type,
      timestamp: data.timestamp,
      userId: data.user_id,
      notes: data.notes
    };
  }
} 