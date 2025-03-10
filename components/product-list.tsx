"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Filter, Search } from "lucide-react"
import ProductDetailModal from "@/components/product-detail-modal"
import { type Product } from "@/lib/data"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react"

interface ProductListProps {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onAdd: () => void
  canEdit?: boolean
}

export default function ProductList({
  products,
  onView,
  onEdit,
  onDelete,
  onAdd,
  canEdit = false
}: ProductListProps) {
  const { isAuthenticated, isAuthorized } = useAuth()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{id: string, name: string} | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (product: Product) => {
    if (currentProduct) {
      // Update existing product
      const updatedProducts = products.map((p) => (p.id === product.id ? product : p))
      onEdit(product)
      setFilteredProducts(updatedProducts)
    } else {
      // Add new product
      const newProduct = { ...product, id: Date.now().toString() }
      const updatedProducts = [...products, newProduct]
      onEdit(product)
      setFilteredProducts(updatedProducts)
    }
    setIsModalOpen(false)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete({
      id: product.id,
      name: product.name
    })
  }

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id)
      setProductToDelete(null)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term),
        ),
      )
    }
  }

  const applyFilter = (filterType: string) => {
    let sorted: Product[] = [...filteredProducts]

    switch (filterType) {
      case "price-high-low":
        sorted = sorted.sort((a, b) => b.price - a.price)
        break
      case "price-low-high":
        sorted = sorted.sort((a, b) => a.price - b.price)
        break
      case "stock-high-low":
        sorted = sorted.sort((a, b) => b.stock - a.stock)
        break
      case "stock-low-high":
        sorted = sorted.sort((a, b) => a.stock - b.stock)
        break
      default:
        // No sorting
        break
    }

    setFilteredProducts(sorted)
  }

  console.log('ProductList rendering with products:', products.length)
  
  const handleView = (product: Product) => {
    console.log('View button clicked in ProductList for:', product.name)
    onView(product)
  }
  
  const handleEdit = (product: Product) => {
    console.log('Edit button clicked in ProductList for:', product.name)
    onEdit(product)
  }
  
  const handleDelete = (id: string) => {
    console.log('Delete button clicked in ProductList for ID:', id)
    onDelete(id)
  }

  const handleAdd = () => {
    console.log('Add button clicked in ProductList')
    onAdd()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Product"
              className="rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => applyFilter("price-high-low")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("price-low-high")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("stock-high-low")}>Stock: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("stock-low-high")}>Stock: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         
        </div>
        
        {canEdit && (
          <Button 
            onClick={handleAdd}
            className="ml-auto"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            New Product
          </Button>
        )}
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Product Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="h-16 w-16 relative">
                      <Image
                        src={product.images.main || "/placeholder.svg?height=64&width=64"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md cursor-pointer"
                        onClick={() => handleView(product)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleView(product)}
                    >
                      {product.name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{product.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{product.stock}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>${product.price.toFixed(2)} CAD</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(product)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailModal
          product={currentProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          onDelete={(id) => handleDeleteClick(products.find(p => p.id === id) as Product)}
          isEditing={isEditing}
          canEdit={canEdit}
        />
      )}

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete 
              "{productToDelete?.name}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

