"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import type { Product } from "@/lib/data"
import Image from "next/image"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  onDelete: (id: string) => void
  isEditing: boolean
  canEdit: boolean
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isEditing,
  canEdit,
}: ProductDetailModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    category: "Parts",
    material: "",
    status: "Active",
    images: {
      main: "/placeholder.svg?height=300&width=300",
      thumbnails: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    },
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        price: 0,
        stock: 0,
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        category: "Parts",
        material: "",
        status: "Active",
        images: {
          main: "/placeholder.svg?height=300&width=300",
          thumbnails: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
        },
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const mainFile = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          setFormData((prev) => ({
            ...prev,
            images: {
              ...prev.images,
              main: result,
              thumbnails: [
                ...prev.images.thumbnails,
                ...(files.length > 1
                  ? Array.from(files)
                      .slice(1, 3)
                      .map((file) => URL.createObjectURL(file))
                  : []),
              ].slice(0, 2),
            },
          }))
        }
      }
      reader.readAsDataURL(mainFile)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleDelete = () => {
    if (product && product.id) {
      onDelete(product.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <div className="text-green-600 font-medium">${formData.price.toFixed(2)} USD</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Image
                        src={formData.images.main || "/placeholder.svg"}
                        alt={formData.name}
                        width={300}
                        height={200}
                        className="object-cover rounded-md w-full h-auto"
                      />
                    </div>
                    {formData.images.thumbnails.map((thumb, index) => (
                      <div key={index} className="col-span-1">
                        <Image
                          src={thumb || "/placeholder.svg"}
                          alt={`${formData.name} thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">SKU</Label>
                    <div className="font-medium">{formData.sku}</div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="stock" className="text-sm text-muted-foreground">
                      Stock
                    </Label>
                    {isEditing ? (
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        className="h-8"
                      />
                    ) : (
                      <div className="font-medium">{formData.stock} Ready</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="price" className="text-sm text-muted-foreground">
                      Price
                    </Label>
                    {isEditing ? (
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="h-8"
                      />
                    ) : (
                      <div className="font-medium">${formData.price.toFixed(2)}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="material" className="text-sm text-muted-foreground">
                      Material
                    </Label>
                    {isEditing ? (
                      <Input
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="h-8"
                      />
                    ) : (
                      <div className="font-medium">{formData.material}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-sm text-muted-foreground">
                      Category
                    </Label>
                    {isEditing ? (
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Vehicles">Vehicles</option>
                        <option value="Parts">Parts</option>
                        <option value="Tools">Tools</option>
                      </select>
                    ) : (
                      <div className="font-medium">{formData.category}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-sm text-muted-foreground">
                      Status
                    </Label>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>{formData.status}</span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm text-muted-foreground">
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="description" className="text-sm text-muted-foreground">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="images" className="text-sm text-muted-foreground">
                        Product Images
                      </Label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {formData.images.thumbnails.length + 1} / 3 images
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {(isEditing || canEdit) && (
            <DialogFooter className="flex justify-between p-4 border-t bg-gray-50">
              {product && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  Delete Product
                </Button>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {isEditing && <Button type="submit">Save Changes</Button>}
                {!isEditing && canEdit && (
                  <Button
                    type="button"
                    onClick={() => {
                      setFormData(product!)
                      onSave(product!)
                    }}
                  >
                    Edit Product
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

