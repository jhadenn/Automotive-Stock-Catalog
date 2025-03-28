import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Product } from '@/lib/types'


/**
 * Service for managing products in the Supabase database.
 */
export const productsService = {
    /**
   * Retrieves all products from the database.
   * @returns {Promise<Product[]>} A promise resolving to an array of products.
   * @throws {Error} If fetching fails.
   */
  async getAll(): Promise<Product[]> {
    const supabase = createClientComponentClient()
    console.log('Fetching products...')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return data || []
  },

    /**
   * Retrieves products by category.
   * @param {string} category - The category to filter products by.
   * @returns {Promise<Product[]>} A promise resolving to an array of products.
   * @throws {Error} If fetching fails.
   */
  async getByCategory(category: string): Promise<Product[]> {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

    /**
   * Retrieves a single product by its ID.
   * @param {string} id - The product ID.
   * @returns {Promise<Product | null>} A promise resolving to a product or null if not found.
   * @throws {Error} If fetching fails.
   */
  async getById(id: string): Promise<Product | null> {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      throw error
    }

    return data
  },

    /**
   * Creates a new product in the database.
   * @param {Omit<Product, 'id'>} productData - The product data excluding the ID.
   * @returns {Promise<Product>} A promise resolving to the created product.
   * @throws {Error} If creation fails.
   */
  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const supabase = createClientComponentClient()
    console.log('Creating product:', productData)

    // Create a product without the id field (let Supabase generate it)
    const productToCreate = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      sku: productData.sku || `SKU-${Date.now()}`,
      category: productData.category,
      material: productData.material,
      status: productData.status,
      images: {
        main: productData.images?.main || "/placeholder.svg",
        thumbnails: productData.images?.thumbnails || []
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productToCreate])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return data
  },

    /**
   * Updates an existing product in the database.
   * @param {string} id - The ID of the product to update.
   * @param {Partial<Product>} updates - The updated product fields.
   * @returns {Promise<Product>} A promise resolving to the updated product.
   * @throws {Error} If updating fails.
   */
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const supabase = createClientComponentClient()
    console.log('Updating product:', { id, updates })

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return data
  },

    /**
   * Deletes a product from the database.
   * @param {string} id - The ID of the product to delete.
   * @returns {Promise<void>} A promise that resolves when the product is deleted.
   * @throws {Error} If deletion fails.
   */
  async delete(id: string): Promise<void> {
    const supabase = createClientComponentClient()
    console.log('Attempting to delete product with ID:', id)

    // Log the authentication status first
    const { data: authData } = await supabase.auth.getSession()
    console.log('Auth status when deleting:', authData.session ? 'Logged in' : 'Not logged in')

    // Make sure we're passing a valid UUID for deletion
    if (!id || id.length < 10) {
      console.error('Invalid product ID for deletion:', id)
      throw new Error('Invalid product ID')
    }

    // Force explicit typing here to avoid SQL injection
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id.toString())

    if (error) {
      console.error('Supabase error deleting product:', error)
      throw error
    }
    
    console.log('Product deleted successfully')
  }
} 