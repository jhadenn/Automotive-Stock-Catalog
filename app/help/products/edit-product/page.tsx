"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function EditProductTutorial() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])
  
  // Show nothing while checking authentication
  if (loading || !isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/help" className="flex items-center">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Help Center
        </Link>
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">How to Edit an Existing Product</h1>
          <p className="text-muted-foreground text-lg">Learn how to edit existing products on your automotive stock catalog.</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Before you begin</h2>
          <p>Make sure you have proper permissions to edit products. You need to be logged in as:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>An administrator</li>
            <li>A manager</li>
            <li>An employee with edit permissions</li>
          </ul>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Find the product you want to edit"
            description="There are two ways to find the product you want to edit:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Using the Products page</h4>
                <p>Navigate to the <strong>Products</strong> page from the main navigation menu. Here you can see all products in a list view.</p>
              </div>
              <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/products-navbar.png"
                    alt="Navigate to Products page"
                    fill
                    className="object-contain"
                  />
                </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 2: Using the Categories page</h4>
                <p>Navigate to the <strong>Categories</strong> page and find the product under its respective category.</p>
              </div>
              <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/categories-navbar.png"
                    alt="Navigate to Categories page"
                    fill
                    className="object-contain"
                  />
                </div>
            </div>
          </TutorialStep>

          {/* Step 2 */}
          <TutorialStep
            number={2}
            title="Open the product edit mode"
            description="There are two ways to access the edit mode:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">From the product list:</h4>
                <p>Click the edit icon (pencil symbol) next to the product you want to modify.</p>
                <div className="relative h-24 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/actions-edit-button.png"
                    alt="Edit icon in product list"
                    fill
                    className="object-contain"
                    unoptimized={true}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">From the product details modal:</h4>
                <p>Click on a product to view details, then click the "Edit Product" button at the bottom.</p>
                <div className="relative h-20 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/categories-edit-button.png"
                    alt="Edit Product button"
                    fill
                    className="object-contain"
                    unoptimized={true}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </div>
            </div>
          </TutorialStep>

          {/* Step 3 */}
          <TutorialStep
            number={3}
            title="Make your changes"
            description="Update the product information as needed:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Editable fields:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Product Name:</strong> Change the product's display name</li>
                  <li><strong>Description:</strong> Update product details and specifications</li>
                  <li><strong>Price:</strong> Modify the price (must be a positive number)</li>
                  <li><strong>Stock:</strong> Adjust the current inventory level</li>
                  <li><strong>Category:</strong> Reassign to a different category</li>
                  <li><strong>Material:</strong> Update the material information</li>
                  <li><strong>SKU:</strong> Edit the Stock Keeping Unit identifier</li>
                  <li><strong>Status:</strong> Change between Active, Inactive, or Out of Stock</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Images:</h4>
                <p>You can also update the product images by clicking on the image placeholders and uploading new images.</p>
              </div>
            </div>
            <div className="relative h-96 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/edit-product-modal.png"
                alt="Edit product form"
                fill
                className="object-contain"
                unoptimized={true}
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.src = "/placeholder.svg"
                }}
              />
            </div>
          </TutorialStep>

          {/* Step 4 */}
          <TutorialStep
            number={4}
            title="Save your changes"
            description="After making your edits, save the product:"
          >
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Click "Save Changes"</h4>
              <p>The button is located at the bottom of the edit form. If there are any validation errors, they will be highlighted, and you'll need to fix them before saving.</p>
            </div>
            <div className="relative h-20 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/save-product-button.png"
                alt="Save Changes button"
                fill
                className="object-contain"
                unoptimized={true}
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.src = "/placeholder.svg"
                }}
              />
            </div>
            <div className="mt-6 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Success!</h4>
              <p>Upon successful update, you'll see a confirmation message, and the product listing will reflect your changes immediately.</p>
            </div>
          </TutorialStep>
        </div>

        <Card className="p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Related Tutorials</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/help/products/add-product" className="text-blue-600 hover:underline">
                How to add a new product
              </Link>
            </li>
            <li>
              <Link href="/help/products/delete-product" className="text-blue-600 hover:underline">
                How to delete a product
              </Link>
            </li>
            <li>
              <Link href="/help/inventory/thresholds" className="text-blue-600 hover:underline">
                Setting up stock thresholds
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

// Helper component for tutorial steps
function TutorialStep({ 
  number, 
  title, 
  description, 
  children 
}: { 
  number: number
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="border-l-4 border-blue-500 pl-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <div className="ml-2">{children}</div>
    </div>
  )
} 