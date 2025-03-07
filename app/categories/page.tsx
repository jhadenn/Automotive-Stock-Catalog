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
  const { isAuthenticated, isAuthorized } = useAuth()
  const { products, loading, error, addProduct, updateProduct, deleteProduct, loadProducts } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const canEdit = isAuthenticated && isAuthorized(["owner", "manager", "employee"])

  // Filter products by category
  const vehicleProducts = products.filter(p => p.category === 'Vehicles')
  const partProducts = products.filter(p => p.category === 'Parts')
  const toolProducts = products.filter(p => p.category === 'Tools')

  const handleViewProduct = (product: Product) => {
    loadProducts()
    setSelectedProduct(product)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    loadProducts()
    setSelectedProduct(product)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        await updateProduct(product.id, product)
      } else {
        await addProduct(product)
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving product:', err)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  const handleViewAll = (category: string) => {
    loadProducts()
    setActiveTab(category.toLowerCase())
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
        <p className="text-muted-foreground">Browse our inventory by category</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

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

        <TabsContent value="vehicles">
          <CategorySection
            title="Vehicles"
            description="Browse our selection of quality vehicles"
            products={vehicleProducts}
            showAll
            onViewProduct={handleViewProduct}
          />
        </TabsContent>

        <TabsContent value="parts">
          <CategorySection
            title="Parts"
            description="Find the right parts for your vehicle"
            products={partProducts}
            showAll
            onViewProduct={handleViewProduct}
          />
        </TabsContent>

        <TabsContent value="tools">
          <CategorySection
            title="Tools"
            description="Professional tools for maintenance and repair"
            products={toolProducts}
            showAll
            onViewProduct={handleViewProduct}
          />
        </TabsContent>
      </Tabs>

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

interface CategorySectionProps {
  title: string
  description: string
  products: Product[]
  showAll?: boolean
  onViewProduct: (product: Product) => void
  onViewAll?: () => void
}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
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

