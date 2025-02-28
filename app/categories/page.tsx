"use client"

import { useState } from "react"
import { mockProducts, type Product } from "@/lib/data"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductDetailModal from "@/components/product-detail-modal"
import { useAuth } from "@/components/auth-provider"

export default function CategoriesPage() {
  const { isAuthenticated, isAuthorized } = useAuth()
  const [products] = useState<Product[]>(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const canEdit = isAuthenticated && isAuthorized(["owner", "manager", "employee"])

  // Group products by category
  const vehicleProducts = products.filter((p) => p.category === "Vehicles")
  const partProducts = products.filter((p) => p.category === "Parts")
  const toolProducts = products.filter((p) => p.category === "Tools")

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (product: Product) => {
    // Handle save logic here
    setIsModalOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    // Handle delete logic here
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Product Categories</h1>
        <p className="text-muted-foreground">Browse our inventory by category</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
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
          />
          <CategorySection
            title="Parts"
            description="Find the right parts for your vehicle"
            products={partProducts}
            onViewProduct={handleViewProduct}
          />
          <CategorySection
            title="Tools"
            description="Professional tools for maintenance and repair"
            products={toolProducts}
            onViewProduct={handleViewProduct}
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

      {isModalOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
          isEditing={false}
          canEdit={canEdit}
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
}

function CategorySection({ title, description, products, showAll = false, onViewProduct }: CategorySectionProps) {
  // Only show first 3 products unless showAll is true
  const displayProducts = showAll ? products : products.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {!showAll && products.length > 3 && (
          <button
            onClick={() => (document.querySelector(`[data-value="${title.toLowerCase()}"]`) as HTMLElement)?.click()}
            className="text-sm font-medium text-primary hover:underline"
          >
            View all {products.length} products
          </button>
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
              <button
                onClick={() => onViewProduct(product)}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Details
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

