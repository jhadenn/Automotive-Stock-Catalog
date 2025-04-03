"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function LowStockAlertsTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">Resolving Low Stock Alerts</h1>
          <p className="text-muted-foreground text-lg">Learn how to manage and resolve low stock alerts efficiently.</p>
        </div>
        

        <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-900/50">
          <h2 className="font-semibold text-lg mb-2">About Low Stock Alerts</h2>
          <p>Low stock alerts notify you when product inventory falls below the threshold you've set. This helps prevent stockouts and ensures you can reorder products in time to meet customer demand.</p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Access your alerts dashboard"
            description="Navigate to alerts page in the navigation bar."
          >
            <div className="space-y-4">
              <p>From the navigation bar, click on the <strong>Alerts</strong> tab.</p>
              <div className="relative h-64 border rounded-md overflow-hidden">
                <Image
                  src="/help/alerts-nav.png"
                  alt="Dashboard navigation"
                  fill
                  className="object-contain"
                  unoptimized={true}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.src = "/placeholder.svg"
                  }}
                />
              </div>
              <p>In the dashboard, locate the <strong>Inventory Alerts</strong> section, which displays products that have fallen below their threshold levels.</p>
              <div className="relative h-64 border rounded-md overflow-hidden">
                <Image
                  src="/help/low-stock-widget.png"
                  alt="Low stock alerts widget"
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
          </TutorialStep>

          {/* Step 2 */}
          <TutorialStep
            number={2}
            title="Review alert details"
            description="Click on a specific alert to see more information about the low stock item:"
          >
            <div className="space-y-4">
              <p>The alert details will show you:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Current stock level</li>
                <li>Threshold level that triggered the alert</li>
                <li>Product information</li>
                <li>Stock history</li>
              </ul>
              <div className="relative h-80 border rounded-md overflow-hidden">
                <Image
                  src="/help/alert-details.png"
                  alt="Alert details"
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
          </TutorialStep>

          {/* Step 3 */}
          <TutorialStep
            number={3}
            title="Resolve the alert"
            description="There are several ways to resolve a low stock alert:"
          >
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Option 1: Restock the product</h4>
                <p>The most common resolution is to order more inventory and update the stock level:</p>
                <ol className="list-decimal ml-6 mt-2 space-y-2">
                  <li>Click on the product to open its details</li>
                  <li>Click the <strong>Edit</strong> button</li>
                  <li>Update the <strong>Stock</strong> field with the new quantity</li>
                  <li>Click <strong>Save</strong> to update the inventory</li>
                </ol>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/alert-details.png"
                    alt="Update stock level"
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
                <h4 className="font-medium mb-2">Option 2: Adjust the threshold</h4>
                <p>If you determine that the current threshold is too high for your business needs:</p>
                <ol className="list-decimal ml-6 mt-2 space-y-2">
                  <li>Open the product details</li>
                  <li>Click the <strong>Edit</strong> button</li>
                  <li>Modify the <strong>Stock Threshold</strong> value</li>
                  <li>Click <strong>Save</strong> to update</li>
                </ol>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/adjust-threshold.png"
                    alt="Adjust stock threshold"
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

          {/* Step 4 */}
          <TutorialStep
            number={4}
            title="Verify resolution"
            description="After taking action, verify that the alert has been resolved:"
          >
            <div className="space-y-4">
              <p>Refresh your dashboard or navigate back to the alerts section. The alert should no longer appear if:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>The stock level is now above the threshold</li>
                <li>The threshold has been adjusted below the current stock level</li>
                <li>The alert has been dismissed (temporarily)</li>
              </ul>
              
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900 mt-4">
                <h4 className="font-medium text-green-700 mb-2">Best Practice</h4>
                <p>Regularly check your <strong>Inventory Analytics</strong> to identify patterns in stock depletion and adjust your reordering strategy accordingly. This proactive approach can help prevent frequent low stock situations.</p>
              </div>
            </div>
          </TutorialStep>
        </div>

        <Card className="p-6 mt-12">
          <h2 className="font-bold text-xl mb-4">Related Tutorials</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/help/inventory/thresholds" className="text-blue-600 hover:underline">
                Setting up stock thresholds
              </Link>
            </li>
            <li>
              <Link href="/help/inventory/stock-changes" className="text-blue-600 hover:underline">
                Recording stock changes
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