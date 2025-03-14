import { uploadImage } from '../lib/image-utils';
import { supabase } from '../lib/supabase';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    },
  },
}));

describe('ImageUtils', () => {
  describe('uploadImage', () => {
    it('should upload an image and return the public URL', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const mockPublicUrl = 'https://example.com/test.png';
      
      // Mock the storage response
      const mockUploadResponse = { error: null };
      const mockUrlResponse = { data: { publicUrl: mockPublicUrl } };
      
      // Setup the mocks
      const mockFrom = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue(mockUploadResponse),
        getPublicUrl: jest.fn().mockReturnValue(mockUrlResponse),
      });
      
      supabase.storage.from = mockFrom;

      // Act
      const result = await uploadImage(mockFile);

      // Assert
      expect(mockFrom).toHaveBeenCalledWith('products');
      expect(mockFrom().upload).toHaveBeenCalled();
      expect(mockFrom().getPublicUrl).toHaveBeenCalled();
      expect(result).toBe(mockPublicUrl);
    });

    it('should throw an error if upload fails', async () => {
      // Arrange
      const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
      const uploadError = new Error('Upload failed');
      
      // Setup the mocks
      const mockFrom = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: uploadError }),
      });
      
      supabase.storage.from = mockFrom;

      // Act & Assert
      await expect(uploadImage(mockFile)).rejects.toThrow();
    });
  });
}); 