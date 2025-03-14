import { productsService } from '../lib/products-service';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

describe('ProductsService', () => {
  // Mock data
  const mockProducts = [
    { id: '1', name: 'Test Product 1', price: 100, stock: 10, category: 'Parts' },
    { id: '2', name: 'Test Product 2', price: 200, stock: 20, category: 'Vehicles' },
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
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } } }),
    },
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
    
    it('should throw an error when the product is not found', async () => {
      // Arrange
      const error = new Error('Product not found');
      mockSupabase.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(productsService.getById('999')).rejects.toThrow();
    });
  });

  // Add test for getByCategory
  describe('getByCategory', () => {
    it('should return products filtered by category', async () => {
      // Arrange
      const categoryProducts = [mockProducts[0]]; // Products with category 'Parts'
      mockSupabase.order.mockResolvedValue({ data: categoryProducts, error: null });

      // Act
      const result = await productsService.getByCategory('Parts');

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('category', 'Parts');
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(categoryProducts);
    });

    it('should throw an error when the category fetch fails', async () => {
      // Arrange
      const error = new Error('Failed to fetch category products');
      mockSupabase.order.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(productsService.getByCategory('NonExistentCategory')).rejects.toThrow();
    });
  });

  // Add test for create
  describe('create', () => {
    it('should create a new product', async () => {
      // Arrange
      const newProduct = {
        name: 'New Product',
        description: 'A brand new product',
        price: 150,
        stock: 15,
        category: 'Tools',
        material: 'Steel',
        status: 'Active',
        images: {
          main: '/test-image.jpg',
          thumbnails: ['/thumbnail1.jpg']
        },
        sku: 'TEST-SKU-123'
      };
      
      const createdProduct = { id: '3', ...newProduct };
      mockSupabase.single.mockResolvedValue({ data: createdProduct, error: null });

      // Act
      const result = await productsService.create(newProduct);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.insert).toHaveBeenCalledWith([{
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        sku: newProduct.sku,
        category: newProduct.category,
        material: newProduct.material,
        status: newProduct.status,
        images: newProduct.images
      }]);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(createdProduct);
    });

    it('should throw an error when product creation fails', async () => {
      // Arrange
      const newProduct = {
        name: 'New Product',
        description: 'A brand new product',
        price: 150,
        stock: 15,
        category: 'Tools',
        sku: 'TEST-SKU-123',
        material: 'Steel',
        status: 'Active',
        images: {
          main: '/test-image.jpg',
          thumbnails: []
        }
      };
      
      const error = new Error('Failed to create product');
      mockSupabase.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(productsService.create(newProduct)).rejects.toThrow();
    });

    it('should generate a SKU if not provided', async () => {
      // Arrange
      const newProductWithoutSku = {
        name: 'New Product No SKU',
        description: 'A brand new product without SKU',
        price: 150,
        stock: 15,
        category: 'Tools',
        material: 'Steel',
        status: 'Active',
        images: {
          main: '/test-image.jpg',
          thumbnails: []
        }
      };
      
      const createdProduct = { id: '4', ...newProductWithoutSku, sku: 'SKU-12345' };
      mockSupabase.single.mockResolvedValue({ data: createdProduct, error: null });
      
      // Mock Date.now() to return a consistent value for testing
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => 12345);

      // Act
      const result = await productsService.create(newProductWithoutSku);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        0: expect.objectContaining({
          sku: 'SKU-12345'
        })
      }));
      
      // Restore original Date.now
      Date.now = originalDateNow;
    });
  });

  // Add test for update
  describe('update', () => {
    it('should update an existing product', async () => {
      // Arrange
      const productId = '1';
      const updates = { 
        name: 'Updated Product Name',
        price: 120
      };
      
      const updatedProduct = { ...mockProducts[0], ...updates };
      mockSupabase.single.mockResolvedValue({ data: updatedProduct, error: null });

      // Act
      const result = await productsService.update(productId, updates);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', productId);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error when product update fails', async () => {
      // Arrange
      const productId = '999'; // Non-existent ID
      const updates = { name: 'Updated Product' };
      
      const error = new Error('Failed to update product');
      mockSupabase.single.mockResolvedValue({ data: null, error });

      // Act & Assert
      await expect(productsService.update(productId, updates)).rejects.toThrow();
    });
  });

  // Add test for delete
  describe('delete', () => {
    it('should delete a product', async () => {
      // Arrange
      const productId = '1234567890'; // Use a 10-character ID to pass validation
      mockSupabase.delete.mockReturnThis();
      mockSupabase.eq.mockResolvedValue({ error: null });

      // Act
      await productsService.delete(productId);

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('products');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', productId.toString());
    });

    it('should throw an error when product deletion fails', async () => {
      // Arrange
      const productId = '1';
      const error = new Error('Failed to delete product');
      mockSupabase.eq.mockResolvedValue({ error });

      // Act & Assert
      await expect(productsService.delete(productId)).rejects.toThrow();
    });

    it('should throw an error when product ID is invalid', async () => {
      // Arrange
      const invalidProductId = '123'; // Too short (less than 10 chars)

      // Act & Assert
      await expect(productsService.delete(invalidProductId)).rejects.toThrow('Invalid product ID');
    });

    it('should log authentication status when deleting', async () => {
      // Arrange
      const productId = '1234567890'; // Valid length
      mockSupabase.eq.mockResolvedValue({ error: null });
      
      // Setup auth mock
      const consoleSpy = jest.spyOn(console, 'log');

      // Act
      await productsService.delete(productId);

      // Assert
      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Auth status when deleting:', 'Logged in');
      
      // Clean up
      consoleSpy.mockRestore();
    });
  });
});
