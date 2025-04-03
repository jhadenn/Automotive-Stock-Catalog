"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function DeleteProductTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">How to Delete an Existing Product</h1>
          <p className="text-muted-foreground text-lg">Learn how to delete products on your automotive stock catalog.</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Before you begin</h2>
          <p>Important things to note:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>This action <strong>cannot be undone</strong></li>
            <li>Historical data may be affected</li>
            <li>Make sure you have the proper permissions</li>
            <li>Consider marking as Inactive instead of deleting</li>
          </ul>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Find the product you want to delete"
            description="There are two ways to find the product:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Using the Products page</h4>
                <p>Navigate to the <strong>Products</strong> page from the main navigation menu.</p>
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
            title="Access the delete option"
            description="There are two ways to delete a product:"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Using the delete icon</h4>
                <p>In the product list, click on the <strong>Trash</strong> icon under the Actions column.</p>
                <div className="relative h-24 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/actions-edit-button.png"
                    alt="Delete icon in product list"
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
                <h4 className="font-medium mb-2">Option 2: From product details</h4>
                <p>Open the product details modal, then click the <strong>Delete Product</strong> button.</p>
                <div className="relative h-24 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/categories-delete-button.png"
                    alt="Delete Product button"
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
            title="Confirm deletion"
            description="A confirmation dialog will appear to prevent accidental deletions."
          >
            <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/confirm-delete-alert.png"
                alt="Delete confirmation dialog"
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
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Important!</h4>
              <p>Read the warning message carefully. Once a product is deleted, it cannot be recovered unless you have a separate backup of your database.</p>
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
              <Link href="/help/products/add-product" className="text-blue-600 hover:underline">
                How to add a new product
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