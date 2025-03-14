import { productsService } from '../lib/products-service';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('ProductsService', () => {
  // Mock data
  const mockProducts = [
    { id: '1', name: 'Test Product 1', price: 100, stock: 10 },
    { id: '2', name: 'Test Product 2', price: 200, stock: 20 },
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

  describe('getAll', () => {
    it('should return all products', async () => {
      // Arrange
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockResolvedValue({ data: mockProducts, error: null });

      // Act
      const result = await productsService.getAll();

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockProducts);
    });

    it('should throw an error when the request fails', async () => {
      // Arrange
      const error = new Error('Failed to fetch products');
      mockSupabase.order.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(productsService.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      // Arrange
      const product = mockProducts[0];
      mockSupabase.single.mockResolvedValue({ data: product, error: null });

      // Act
      const result = await productsService.getById('1');

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual(product);
    });
  });

  // Add tests for the other methods: getByCategory, create, update, delete
});
