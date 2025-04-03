import { RestockingService } from '../lib/restocking-service';
import { Product } from '../lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('Automated Restocking Alerts', () => {
  // Mock data
  const mockProducts: Product[] = [
    { 
      id: '1', 
      name: 'Low Stock Item', 
      description: 'This item needs restocking',
      price: 100, 
      stock: 2, // Below threshold
      sku: 'SKU001',
      category: 'Parts',
      material: 'Metal',
      status: 'Active',
      images: {
        main: '/placeholder.svg',
        thumbnails: []
      }
    },
    { 
      id: '2', 
      name: 'Adequate Stock Item', 
      description: 'This item has enough stock',
      price: 200, 
      stock: 15, // Above threshold
      sku: 'SKU002',
      category: 'Tools',
      material: 'Plastic',
      status: 'Active',
      images: {
        main: '/placeholder.svg',
        thumbnails: []
      }
    },
  ];
  
  // Mock Supabase responses
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('checkLowStockItems', () => {
    it('should identify products below the stock threshold', async () => {
      // Arrange
      const service = new RestockingService();
      const threshold = 5;
      mockSupabase.order.mockResolvedValue({ data: mockProducts, error: null });

      // Act
      const lowStockItems = await service.checkLowStockItems(threshold);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(lowStockItems).toHaveLength(1);
      expect(lowStockItems[0].id).toBe('1');
      expect(lowStockItems[0].name).toBe('Low Stock Item');
    });

    it('should return an empty array if no products are below threshold', async () => {
      // Arrange
      const service = new RestockingService();
      const threshold = 1; // Set threshold lower than any product's stock
      mockSupabase.order.mockResolvedValue({ data: mockProducts, error: null });

      // Act
      const lowStockItems = await service.checkLowStockItems(threshold);

      // Assert
      expect(lowStockItems).toHaveLength(0);
    });

    it('should throw an error when the database request fails', async () => {
      // Arrange
      const service = new RestockingService();
      const threshold = 5;
      const error = new Error('Database connection failed');
      mockSupabase.order.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(service.checkLowStockItems(threshold)).rejects.toThrow();
    });
  });

  describe('generateRestockingAlerts', () => {
    it('should create alert entries for products below threshold', async () => {
      // Arrange
      const service = new RestockingService();
      const threshold = 5;
      mockSupabase.order.mockResolvedValue({ data: mockProducts, error: null });
      mockSupabase.insert.mockResolvedValue({ data: { id: 'alert-1' }, error: null });

      // Act
      const alerts = await service.generateRestockingAlerts(threshold);

      // Assert
      expect(alerts).toHaveLength(1);
      expect(alerts[0].productId).toBe('1');
      expect(alerts[0].currentStock).toBe(2);
      expect(alerts[0].threshold).toBe(5);
      expect(mockSupabase.from).toHaveBeenCalledWith('restocking_alerts');
      expect(mockSupabase.insert).toHaveBeenCalled();
    });
  });

  describe('getActiveAlerts', () => {
    it('should return all active restocking alerts', async () => {
      // Arrange
      const service = new RestockingService();
      const mockAlerts = [
        { id: 'alert-1', productId: '1', productName: 'Low Stock Item', currentStock: 2, threshold: 5, createdAt: new Date().toISOString(), status: 'active' }
      ];
      mockSupabase.select.mockResolvedValue({ data: mockAlerts, error: null });

      // Act
      const activeAlerts = await service.getActiveAlerts();

      // Assert
      expect(activeAlerts).toHaveLength(1);
      expect(activeAlerts[0].productId).toBe('1');
      expect(activeAlerts[0].status).toBe('active');
      expect(mockSupabase.from).toHaveBeenCalledWith('restocking_alerts');
    });
  });

  describe('markAlertResolved', () => {
    it('should update an alert status to resolved', async () => {
      // Arrange
      const service = new RestockingService();
      const alertId = 'alert-1';
      mockSupabase.update.mockResolvedValue({ data: { id: alertId, status: 'resolved' }, error: null });

      // Act
      const result = await service.markAlertResolved(alertId);

      // Assert
      expect(result.id).toBe(alertId);
      expect(result.status).toBe('resolved');
      expect(mockSupabase.from).toHaveBeenCalledWith('restocking_alerts');
      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'resolved' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', alertId);
    });
  });
}); 