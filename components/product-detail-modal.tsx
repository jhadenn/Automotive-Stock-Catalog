"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { ProductHistory } from "@/components/product-history"
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void | Promise<void>;
  onDelete: (id: string) => void
  isEditing: boolean
  canEdit: boolean
  loading?: boolean
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isEditing: initialIsEditing,
  canEdit,
  loading = false
}: ProductDetailModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: `SKU-${Date.now()}`,
    category: 'Parts',
    material: '',
    status: 'Active',
    images: {
      main: '/placeholder.svg',
      thumbnails: [],
    },
  })
  const [isEditing, setIsEditing] = useState(initialIsEditing)
  const [validationErrors, setValidationErrors] = useState<{price?: string, stock?: string}>({})
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  
  // Create separate refs for main image and each thumbnail
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const thumbnail1InputRef = useRef<HTMLInputElement>(null)
  const thumbnail2InputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      // Reset form for new product
      setFormData({
        id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        sku: `SKU-${Date.now()}`,
        category: 'Parts',
        material: '',
        status: 'Active',
        images: {
          main: '/placeholder.svg',
          thumbnails: [],
        },
      })
    }
    setIsEditing(initialIsEditing)
    setValidationErrors({})
  }, [product, initialIsEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Validate price and stock values
    if (name === 'price' || name === 'stock') {
      const numValue = parseFloat(value)
      
      if (numValue < 0) {
        setValidationErrors(prev => ({
          ...prev, 
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative`
        }))
      } else {
        setValidationErrors(prev => {
          const newErrors = {...prev}
          delete newErrors[name as keyof typeof validationErrors]
          return newErrors
        })
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }))
  }

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          main: event.target?.result as string
        }
      }))
    }
    reader.readAsDataURL(file)
  }

  // Handle thumbnail uploads individually
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setFormData(prev => {
        // Create a copy of the current thumbnails
        const thumbnails = [...(prev.images.thumbnails || [])]
        
        // Update or add the thumbnail at the specified index
        thumbnails[index] = event.target?.result as string
        
        return {
          ...prev,
          images: {
            ...prev.images,
            thumbnails
          }
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      console.error('Validation errors:', validationErrors)
      return // Don't submit if there are validation errors
    }
    
    // Additional validation before submission
    if (formData.price < 0) {
      setValidationErrors(prev => ({...prev, price: 'Price cannot be negative'}))
      return
    }
    
    if (formData.stock < 0) {
      setValidationErrors(prev => ({...prev, stock: 'Stock cannot be negative'}))
      return
    }
    
    console.log('Submitting form with data:', formData)
    
    try {
      // If creating a new product, omit the id field
      if (!product) {
        const { id, ...productWithoutId } = formData
        await onSave(productWithoutId as any)
      } else {
        await onSave(formData)
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  const handleDelete = () => {
    if (product && product.id) {
      console.log('Deleting product:', product.id)
      onDelete(product.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background rounded-lg">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{isEditing ? 'Edit' : ''} {formData.name || 'New Product'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={isEditing ? "edit" : "details"} className="w-full">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            {product && <TabsTrigger value="history">Stock History</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="details" className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <p>Loading...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <DialogHeader className="mb-4">
                    <div className="flex flex-col space-y-1">
                      <DialogTitle className="text-xl font-bold">
                        {formData.name}
                      </DialogTitle>
                      {!isEditing && (
                        <p className="text-green-600 font-medium">${formData.price.toFixed(2)} CAD</p>
                      )}
                    </div>
                  </DialogHeader>

                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product images section */}
                      <div className="md:col-span-2">
                        <Label className="text-sm text-muted-foreground">Product Images</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {/* Main image */}
                          <div className="col-span-1">
                            <Label htmlFor="mainImage" className="block text-xs mb-1">Main Image</Label>
                            <div className="relative h-24 bg-muted rounded-md overflow-hidden">
                              {formData.images.main && (
                                <Image 
                                  src={formData.images.main} 
                                  alt="Main product image" 
                                  fill 
                                  className="object-cover"
                                />
                              )}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute bottom-1 right-1 h-8 w-8 p-0"
                                onClick={() => mainImageInputRef.current?.click()}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </Button>
                              <input
                                ref={mainImageInputRef}
                                type="file"
                                id="mainImage"
                                className="hidden"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                              />
                            </div>
                          </div>
                          
                          {/* Thumbnails - individual upload for each */}
                          <div className="col-span-2">
                            <Label className="block text-xs mb-1">Thumbnails</Label>
                            <div className="flex space-x-2">
                              {/* Thumbnail 1 */}
                              <div className="relative h-24 w-24 bg-muted rounded-md overflow-hidden">
                                {formData.images.thumbnails && formData.images.thumbnails[0] && (
                                  <Image 
                                    src={formData.images.thumbnails[0]} 
                                    alt="Thumbnail 1" 
                                    fill 
                                    className="object-cover"
                                  />
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="absolute bottom-1 right-1 h-8 w-8 p-0"
                                  onClick={() => thumbnail1InputRef.current?.click()}
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                                <input
                                  ref={thumbnail1InputRef}
                                  type="file"
                                  id="thumbnail1"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleThumbnailUpload(e, 0)}
                                />
                              </div>
                              
                              {/* Thumbnail 2 */}
                              <div className="relative h-24 w-24 bg-muted rounded-md overflow-hidden">
                                {formData.images.thumbnails && formData.images.thumbnails[1] && (
                                  <Image 
                                    src={formData.images.thumbnails[1]} 
                                    alt="Thumbnail 2" 
                                    fill 
                                    className="object-cover"
                                  />
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="absolute bottom-1 right-1 h-8 w-8 p-0"
                                  onClick={() => thumbnail2InputRef.current?.click()}
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                                <input
                                  ref={thumbnail2InputRef}
                                  type="file"
                                  id="thumbnail2"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleThumbnailUpload(e, 1)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Name & Description */}
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />
                      </div>
                      
                      {/* Price & Stock */}
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          className={validationErrors.price ? "border-red-500" : ""}
                        />
                        {validationErrors.price && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.price}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock}
                          onChange={handleChange}
                          required
                          className={validationErrors.stock ? "border-red-500" : ""}
                        />
                        {validationErrors.stock && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.stock}</p>
                        )}
                      </div>
                      
                      {/* Category & Material */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Vehicles">Vehicles</option>
                          <option value="Parts">Parts</option>
                          <option value="Tools">Tools</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Input
                          id="material"
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                        />
                      </div>
                      
                      {/* SKU & Status */}
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {/* Product image gallery */}
                        <div className="rounded-md overflow-hidden mb-4">
                          <Image
                            src={formData.images.main || "/placeholder.svg"}
                            alt={formData.name}
                            width={400}
                            height={300}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        
                        {/* Thumbnails gallery */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="overflow-hidden rounded-md">
                            <Image
                              src={formData.images.main || "/placeholder.svg"}
                              alt={`${formData.name} thumbnail 1`}
                              width={100}
                              height={100}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                          {formData.images.thumbnails?.map((thumb, idx) => (
                            <div key={idx} className="overflow-hidden rounded-md">
                              <Image
                                src={thumb || "/placeholder.svg"}
                                alt={`${formData.name} thumbnail ${idx + 2}`}
                                width={100}
                                height={100}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold">Description</h3>
                          <p className="mt-2">{formData.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm text-muted-foreground">SKU</h4>
                            <p className="font-medium">{formData.sku}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-muted-foreground">Stock</h4>
                            <p className="font-medium">{formData.stock} units</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-muted-foreground">Category</h4>
                            <p className="font-medium">{formData.category}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-muted-foreground">Material</h4>
                            <p className="font-medium">{formData.material || "Not specified"}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm text-muted-foreground">Status</h4>
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${
                                formData.status === "Active" ? "bg-green-500" : 
                                formData.status === "Inactive" ? "bg-gray-500" : "bg-red-500"
                              } mr-2`}></div>
                              <span>{formData.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between p-4 border-t bg-muted">
                  {product && product.id && canEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteAlert(true)}
                      className="border-destructive text-destructive hover:bg-destructive/10 bg-background"
                    >
                      Delete Product
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    {isEditing && canEdit && (
                      <Button type="submit" disabled={Object.keys(validationErrors).length > 0}>
                        Save Changes
                      </Button>
                    )}
                    {!isEditing && canEdit && (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Product
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            {product && <ProductHistory product={product} />}
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}

