"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function AddProductTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">How to Add a New Product</h1>
          <p className="text-muted-foreground text-lg">Learn how to add new products to your automotive stock catalog.</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Before you begin</h2>
          <p>Make sure you have the following information ready:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Product name and description</li>
            <li>Category (Vehicles, Parts, or Tools)</li>
            <li>Price information</li>
            <li>Initial stock quantity</li>
            <li>Product images (optional but recommended)</li>
          </ul>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Navigate to the appropriate section"
            description="There are two ways to add a new product to your catalog:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Using the Products page</h4>
                <p>Navigate to the <strong>Products</strong> page from the main navigation menu.</p>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/products-navbar.png"
                    alt="Navigate to Products page"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 2: Using the Categories page</h4>
                <p>Navigate to the <strong>Categories</strong> page from the main navigation menu.</p>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/categories-navbar.png"
                    alt="Navigate to Categories page"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </TutorialStep>

          {/* Step 2 */}
          <TutorialStep
            number={2}
            title="Click the 'Add Product' button"
            description="Look for the 'Add Product' button at the top right of the page."
          >
            <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/add-product-button.png"
                alt="Add Product button"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: You need to have the appropriate permissions (Owner, Manager, or Employee) to add products.
              If you don't see this button, contact your system administrator.
            </p>
          </TutorialStep>

          {/* Step 3 */}
          <TutorialStep
            number={3}
            title="Fill in the product details"
            description="The product details modal will appear. Fill in all the required fields:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Basic Information</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Name:</strong> Enter a descriptive name for your product</li>
                  <li><strong>Description:</strong> Provide detailed information about the product</li>
                  <li><strong>Category:</strong> Select from Vehicles, Parts, or Tools</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Pricing and Stock</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>Price:</strong> Enter the product's price</li>
                  <li><strong>Stock:</strong> Set the initial quantity available</li>
                  <li><strong>Stock Threshold:</strong> (Optional) Set a minimum stock level for low stock alerts</li>
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Images</h4>
                <p>Click the image placeholder to upload a main product image. You can add additional images in the secondary images section.</p>
              </div>

              <div className="relative h-96 mt-4 border rounded-md overflow-hidden">
                <Image
                  src="/help/product-details-form.png"
                  alt="Product details form"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </TutorialStep>

          {/* Step 4 */}
          <TutorialStep
            number={4}
            title="Save the product"
            description="After filling in all the required details, click the 'Save' button at the bottom of the form."
          >
            <div className="relative h-20 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/save-product-button.png"
                alt="Save product button"
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-6 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Success!</h4>
              <p>If all the information is valid, your product will be saved to the catalog and you'll see a success message. The product will now appear in your product listings and relevant category pages.</p>
            </div>
          </TutorialStep>
        </div>

        <Card className="p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Related Tutorials</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/help/products/edit-product" className="text-blue-600 hover:underline">
                How to edit an existing product
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