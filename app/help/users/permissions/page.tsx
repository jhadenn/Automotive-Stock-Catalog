"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"


export default function UserPermissionsTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">Understanding user permissions</h1>
          <p className="text-muted-foreground text-lg">Learn what you can do with your account</p>
        </div>

    
        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Create new products, edit existing products, delete products"
            description="Easy inventory management for your business"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Navigate to the <strong>Products</strong> page from the main navigation menu.</h4>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/products-navbar.png"
                    alt="Navigate to Products page"
                    fill
                    className="object-contain"
                  />
                </div>
                <p>From here you have access to the <strong>create, edit and delete </strong>product actions that non-admin users do not have. These actions are also available while viewing product details across both the products and categories page.</p>
                <div className="relative h-96 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/main-products-page.png"
                    alt="Navigate to Products page"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-96 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/detail-permissions.png"
                    alt="Navigate to Products page"
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
            title="Access to restock alerts"
            description="Navigate to the alerts page to view and manage your restock alerts"
          >
            <p>From the main navigation menu, navigate to the <strong>Alerts</strong> page.</p>
            <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/alerts-nav.png"
                alt="Add Product button"
                fill
                className="object-contain"
              />
            </div>
            <p>From here you have access to the <strong>restock alerts</strong> that non-admin users do not have.</p>
            <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/low-stock-widget.png"
                alt="Add Product button"
                fill
                className="object-contain"
              />
            </div>

          </TutorialStep>

          {/* Step 3 */}
          <TutorialStep
            number={3}
            title="Access to product history and analytics"
            description="Navigate to product details to view the product history and analytics"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">When viewing product details, you will have access to product history and analytics.</h4>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/history-analytics.png"
                alt="Add Product button"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
              <Image
                src="/help/analytics-only.png"
                alt="Add Product button"
                fill
                className="object-contain"
              />
            </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">From here you will be able to:</h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>View entire stock history of selected product</li>
                  <li>Edit stock level of selected product</li>
                  <li>See various analytics related to the selected product</li>
                </ul>
              </div>

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
    <div className="border-l-4 border-red-500 pl-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <div className="ml-2">{children}</div>
    </div>
  )
} 