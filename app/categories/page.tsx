"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/lib/product-context"
import { useAuth } from "@/components/auth-provider"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductDetailModal from "@/components/product-detail-modal"
import { Button } from "@/components/ui/button"

export default function CategoriesPage() {
  // Access authentication and authorization status
  const { isAuthenticated, isAuthorized } = useAuth()
  // Access product context functions and state
  const { products, loading, error, addProduct, updateProduct, deleteProduct, loadProducts } = useProducts()
  // State for selected product, modal visibility, and editing mode
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // State for active tab
  const [activeTab, setActiveTab] = useState("all")
  // Determine if the user can edit products
  const canEdit = isAuthenticated && isAuthorized(["owner", "manager", "employee"])

  // Filter products by category
  const vehicleProducts = products.filter(p => p.category === 'Vehicles')
  const partProducts = products.filter(p => p.category === 'Parts')
  const toolProducts = products.filter(p => p.category === 'Tools')

  // Handler for viewing a product's details
  const handleViewProduct = (product: Product) => {
    loadProducts() // Refresh product list
    setSelectedProduct(product)
    setIsEditing(false) // Set to view mode
    setIsModalOpen(true) // Open the modal
  }

  // Handler for editing a product
  const handleEditProduct = (product: Product) => {
    loadProducts() // Refresh product list
    setSelectedProduct(product)
    setIsEditing(true) // Set to edit mode
    setIsModalOpen(true) // Open the modal
  }

  // Handler for adding a new product
  const handleAddProduct = () => {
    setSelectedProduct(null) // No product selected for adding
    setIsEditing(true) // Set to edit mode
    setIsModalOpen(true) // Open the modal
  }

  // Handler for saving a product (add or update)
  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        await updateProduct(product.id, product) // Update existing product
      } else {
        await addProduct(product) // Add new product
      }
      setIsModalOpen(false) // Close the modal after saving
    } catch (err) {
      console.error('Error saving product:', err)
    }
  }

  // Handler for deleting a product
  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      setIsModalOpen(false) // Close the modal after deleting
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  // Handler for viewing all products in a category
  const handleViewAll = (category: string) => {
    loadProducts() // Refresh product list
    setActiveTab(category.toLowerCase()) // Switch to the selected category tab
  }

  // Load products on component mount
  useEffect(() => {
    loadProducts()
  },)

  return (
    <div className="space-y-6 py-6">
      {/* Page title and description */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
        <p className="text-muted-foreground">Browse our inventory by category</p>
      </div>

      {/* Tabs for category selection */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* Content for "All Categories" tab */}
        <TabsContent value="all" className="space-y-8">
          <CategorySection
            title="Vehicles"
            description="Browse our selection of quality vehicles"
            products={vehicleProducts}
            onViewProduct={handleViewProduct}
            onViewAll={() => handleViewAll("vehicles")}
          />
          <CategorySection
            title="Parts"
            description="Find the right parts for your vehicle"
            products={partProducts}
            onViewProduct={handleViewProduct}
            onViewAll={() => handleViewAll("parts")}
          />
          <CategorySection
            title="Tools"
            description="Professional tools for maintenance and repair"
            products={toolProducts}
            onViewProduct={handleViewProduct}
            onViewAll={() => handleViewAll("tools")}
          />
        </TabsContent>

        {/* Content for "Vehicles" tab */}
        <TabsContent value="vehicles">
          <CategorySection
            title="Vehicles"
            description="Browse our selection of quality vehicles"
            products={vehicleProducts}
            showAll // Show all vehicles in this tab
            onViewProduct={handleViewProduct}
          />
        </TabsContent>

        {/* Content for "Parts" tab */}
        <TabsContent value="parts">
          <CategorySection
            title="Parts"
            description="Find the right parts for your vehicle"
            products={partProducts}
            showAll // Show all parts in this tab
            onViewProduct={handleViewProduct}
          />
        </TabsContent>

        {/* Content for "Tools" tab */}
        <TabsContent value="tools">
          <CategorySection
            title="Tools"
            description="Professional tools for maintenance and repair"
            products={toolProducts}
            showAll // Show all tools in this tab
            onViewProduct={handleViewProduct}
          />
        </TabsContent>
      </Tabs>

      {/* Product Detail Modal */}
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

// Interface for CategorySection component props
interface CategorySectionProps {
  title: string
  description: string
  products: Product
  showAll?: boolean
  onViewProduct: (product: Product) => void
  onViewAll?: () => void
}

// CategorySection component to display products in a category
function CategorySection({
  title,
  description,
  products,
  showAll = false,
  onViewProduct,
  onViewAll,
}: CategorySectionProps) {
  // Only show first 3 products unless showAll is true
  const displayProducts = showAll ? products : products.slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Category title, description, and "View all" button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {!showAll && products.length > 3 && onViewAll && (
          <Button onClick={onViewAll} variant="outline">
            View all {products.length} products
          </Button>
        )}
      </div>

      {/* Grid to display products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {/* Product image */}
            <div className="aspect-video relative">
              <Image
                src={product.images.main || "/placeholder.svg?height=300&width=600"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Product stock and price */}
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.stock} available</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            {/* "View Details" button */}
            <div className="p-4 border-t">
              <Button onClick={() => onViewProduct(product)} variant="link" className="p-0 h-auto font-semibold">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}