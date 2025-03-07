"use client"

import { useState, useEffect } from "react"
import ProductList from "@/components/product-list"
import ProductDetailModal from "@/components/product-detail-modal"
import { useAuth } from "@/components/auth-provider"
import { productsService } from "@/lib/products-service"
import type { Product } from "@/lib/types"

export default function AllProductsPage() {
  const { isAuthenticated, isAuthorized } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const canEdit = isAuthenticated && isAuthorized(["owner", "manager", "employee"])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Event handlers with console logs for debugging
  const handleViewProduct = (product: Product) => {
    console.log("View button clicked, product:", product)
    setSelectedProduct(product)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    console.log("Edit button clicked, product:", product)
    setSelectedProduct(product)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleAddProduct = () => {
    console.log("Add new product button clicked")
    setSelectedProduct(null)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (product: Product | Omit<Product, 'id'>) => {
    try {
      setLoading(true)
      console.log("Saving product:", product)
      
      if ('id' in product && product.id) {
        await productsService.update(product.id, product)
      } else {
        await productsService.create(product as Omit<Product, 'id'>)
      }
      
      await loadProducts()
      setIsModalOpen(false)
      setIsEditing(false)
    } catch (err) {
      console.error('Error saving product:', err)
      setError('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true)
      console.log("Deleting product:", id)
      
      await productsService.delete(id)
      await loadProducts()
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">All Product List</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">No products found</div>
      ) : (
        <ProductList 
          products={products}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onAdd={handleAddProduct}
          canEdit={canEdit}
        />
      )}
      
      {isModalOpen && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setIsEditing(false)
          }}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          isEditing={isEditing}
          canEdit={canEdit}
          loading={loading}
        />
      )}
    </div>
  )
}

