"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Plus, Filter, Search, Trash2 } from "lucide-react"
import ProductDetailModal from "@/components/product-detail-modal"
import { mockProducts, type Product } from "@/lib/data"
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

export default function ProductList() {
  const { isAuthenticated, isAuthorized } = useAuth()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = isAuthenticated && isAuthorized(["owner", "manager", "employee"])

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setCurrentProduct(product)
    setIsEditing(false)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (product: Product) => {
    if (currentProduct) {
      // Update existing product
      const updatedProducts = products.map((p) => (p.id === product.id ? product : p))
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
    } else {
      // Add new product
      const newProduct = { ...product, id: Date.now().toString() }
      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
    }
    setIsModalOpen(false)
  }

  const confirmDelete = (id: string) => {
    setProductToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteProduct = () => {
    if (productToDelete) {
      const updatedProducts = products.filter((p) => p.id !== productToDelete)
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
      setDeleteConfirmOpen(false)
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Product List</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => applyFilter("price-high-low")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("price-low-high")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("stock-high-low")}>Stock: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => applyFilter("stock-low-high")}>Stock: Low to High</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {canEdit && (
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          )}
        </div>
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
                        src={product.image || "/placeholder.svg?height=64&width=64"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md cursor-pointer"
                        onClick={() => handleViewProduct(product)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => handleViewProduct(product)}
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
                    <div>${product.price.toFixed(2)} USD</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                        disabled={!canEdit}
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(product.id)}
                        disabled={!canEdit}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
          onDelete={(id) => confirmDelete(id)}
          isEditing={isEditing}
          canEdit={canEdit}
        />
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

