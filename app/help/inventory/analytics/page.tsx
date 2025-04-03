"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function UnderstandingAnalyticsTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">Understanding Analytics</h1>
          <p className="text-muted-foreground text-lg">Learn how to use and understand the analytics to understand your inventory.</p>
        </div>


        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Navigate to the product you want to view the history of"
            description="There are two ways to access the product history:"
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
            title="View product details"
            description="Look for the view details button on the product you want to view the history of."
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Using the Products page</h4>
                <p>Click on the <strong>Eye</strong> button under actions on the product you want to edit.</p>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/actions-edit-button.png"
                    alt="Navigate to Products page"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 2: Using the Categories page</h4>
                <p>Click on <strong>View Details </strong> button.</p>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/view-details-button.png"
                    alt="Navigate to Categories page"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </TutorialStep>

          {/* Step 3 */}
          <TutorialStep
            number={3}
            title="Product history and analytics"
            description="After clicking on the view details button, click on the stock history tab and you will be able to view the product history and analytics"
          >
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                
                <p>The product history and analytics section will display the following information:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>A full history of sales or restocks</li>
                  <li>A buttons to <strong>restock, sell or adjust</strong> stock levels</li>
                </ul>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/history-analytics.png"
                    alt="Update stock level"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Clicking on the analytics tab will show: </h4>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Average stock level</li>
                  <li>Stock Turnover</li>
                  <li>Restock frequency</li>
                  <li>Days out of stock</li>
                </ul>
                
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/analytics-only.png"
                    alt="Save threshold"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </TutorialStep>

          
        </div>

        <Card className="p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Related Tutorials</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/help/inventory/low-stock-alerts" className="text-blue-600 hover:underline">
              Resolving low stock alerts
              </Link>
            </li>
            <li>
              <Link href="/help/dashboard/metrics" className="text-blue-600 hover:underline">
                Understanding inventory metrics
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
    <div className="border-l-4 border-amber-500 pl-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {number}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <div className="ml-2">{children}</div>
    </div>
  )
} 