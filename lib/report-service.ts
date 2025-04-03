import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Product } from '@/lib/types';
import { AnalyticsService, StockEvent } from './analytics-service';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface CategorySummary {
  count: number;
  totalStock: number;
  outOfStockCount: number;
  lowStockCount: number;
}

export interface StockReport {
  reportDate: string;
  dateRange: DateRange;
  summary: {
    totalProducts: number;
    outOfStockCount: number;
    lowStockCount: number;
    averageStockLevel: number;
    totalStockChangeEvents: number;
  };
  products: Product[];
  categories: Record<string, CategorySummary>;
  stockEvents: any[]; // Stock events during the period
}

export class ReportService {
  /**
   * Generates a stock report for the specified date range
   * @param dateRange Optional date range for the report. If not provided, defaults to the last 30 days
   * @returns A report object with stock data
   */
  static async generateStockReport(dateRange?: Partial<DateRange>): Promise<StockReport> {
    const supabase = createClientComponentClient();
    
    // Set up date range with defaults if not provided
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const reportDateRange: DateRange = {
      startDate: dateRange?.startDate || thirtyDaysAgo.toISOString().split('T')[0],
      endDate: dateRange?.endDate || now.toISOString().split('T')[0]
    };
    
    try {
      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;
      
      // Fetch stock events in the date range
      const { data: stockEvents, error: eventsError } = await supabase
        .from('stock_events')
        .select('*')
        .gte('timestamp', reportDateRange.startDate)
        .lte('timestamp', reportDateRange.endDate)
        .order('timestamp', { ascending: false });
      
      if (eventsError) throw eventsError;
      
      // Calculate summary statistics
      const outOfStockCount = products.filter(p => p.stock === 0).length;
      const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 5).length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const averageStockLevel = products.length > 0 ? totalStock / products.length : 0;
      
      // Calculate category statistics
      const categories: Record<string, CategorySummary> = {};
      
      for (const product of products) {
        if (!categories[product.category]) {
          categories[product.category] = {
            count: 0,
            totalStock: 0,
            outOfStockCount: 0,
            lowStockCount: 0
          };
        }
        
        categories[product.category].count++;
        categories[product.category].totalStock += product.stock;
        
        if (product.stock === 0) {
          categories[product.category].outOfStockCount++;
        } else if (product.stock < 5) {
          categories[product.category].lowStockCount++;
        }
      }
      
      // Generate and return the report
      return {
        reportDate: new Date().toISOString(),
        dateRange: reportDateRange,
        summary: {
          totalProducts: products.length,
          outOfStockCount,
          lowStockCount,
          averageStockLevel,
          totalStockChangeEvents: stockEvents.length
        },
        products,
        categories,
        stockEvents
      };
    } catch (error) {
      console.error('Error generating stock report:', error);
      throw error;
    }
  }
  
  /**
   * Generates a low stock report
   * @param threshold The stock threshold below which products are considered low stock
   * @returns A report focused on low stock items
   */
  static async generateLowStockReport(threshold: number = 5): Promise<Partial<StockReport>> {
    const supabase = createClientComponentClient();
    
    try {
      // Fetch low stock products
      const { data: lowStockProducts, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', threshold)
        .order('stock', { ascending: true });
      
      if (error) throw error;
      
      // Calculate category statistics for low stock items
      const categories: Record<string, CategorySummary> = {};
      
      for (const product of lowStockProducts) {
        if (!categories[product.category]) {
          categories[product.category] = {
            count: 0,
            totalStock: 0,
            outOfStockCount: 0,
            lowStockCount: 0
          };
        }
        
        categories[product.category].count++;
        categories[product.category].totalStock += product.stock;
        
        if (product.stock === 0) {
          categories[product.category].outOfStockCount++;
        } else {
          categories[product.category].lowStockCount++;
        }
      }
      
      // Generate and return the low stock report
      return {
        reportDate: new Date().toISOString(),
        summary: {
          totalProducts: lowStockProducts.length,
          outOfStockCount: lowStockProducts.filter(p => p.stock === 0).length,
          lowStockCount: lowStockProducts.filter(p => p.stock > 0).length,
          averageStockLevel: lowStockProducts.reduce((sum, p) => sum + p.stock, 0) / 
            (lowStockProducts.length || 1),
          totalStockChangeEvents: 0
        },
        products: lowStockProducts,
        categories,
      };
    } catch (error) {
      console.error('Error generating low stock report:', error);
      throw error;
    }
  }
} 