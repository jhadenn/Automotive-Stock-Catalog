"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/lib/types"
import Image from "next/image"

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSave, onDelete }: ProductEditModalProps) {
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
      thumbnails: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    },
  })

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
          main :"/placeholder.svg?height=300&width=300",
          thumbnails: ["/placeholder.svg?height=300&width=300","/placeholder.svg?height=300&width=300"],
        } 
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
          <DialogTitle className="text-xl font-bold">{formData.name}</DialogTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
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
                        src={formData.images.main}
                        alt={formData.name}
                        width={300}
                        height={200}
                        className="object-cover rounded-md w-full h-auto"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement
                          img.src = "/images/placeholder-main.jpg"
                        }}
                        priority
                      />
                    </div>
                    <div className="col-span-1">
                      <Image
                        src={formData.images.main || "/placeholder.svg?height=100&width=100"}
                        alt={formData.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-md w-full h-auto"
                      />
                    </div>
                    <div className="col-span-1">
                      <Image
                        src={formData.images.thumbnails[0] || "/placeholder.svg?height=100&width=100"}
                        alt={formData.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-md w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="sku" className="text-sm text-muted-foreground">
                      SKU
                    </Label>
                    <div className="font-medium">{formData.sku}</div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="stock" className="text-sm text-muted-foreground">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="price" className="text-sm text-muted-foreground">
                      Price
                    </Label>
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
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="material" className="text-sm text-muted-foreground">
                      Material
                    </Label>
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category" className="text-sm text-muted-foreground">
                      Category
                    </Label>
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

                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">
                    Product Name
                  </Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="h-8" />
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
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between p-4 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Delete Product
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

