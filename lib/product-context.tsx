"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { productsService } from './products-service'
import type { Product } from './types'

type ProductContextType = {
  products: Product[]
  loading: boolean
  error: string | null
  loadProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true)
      await productsService.create(product)
      await loadProducts()
    } catch (err) {
      console.error('Error adding product:', err)
      setError('Failed to add product')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true)
      await productsService.update(id, updates)
      await loadProducts()
    } catch (err) {
      console.error('Error updating product:', err)
      setError('Failed to update product')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true)
      await productsService.delete(id)
      await loadProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
} 