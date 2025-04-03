"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function ThresholdsTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">Setting Up Stock Thresholds</h1>
          <p className="text-muted-foreground text-lg">Learn how to manage the stock thresholds for your products.</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-lg border border-amber-200 dark:border-amber-900/50">
          <h2 className="font-semibold text-lg mb-2">What are stock thresholds?</h2>
          <p>Stock thresholds are customizable limits that trigger alerts when your inventory reaches or falls below a certain level. They help you:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Avoid running out of popular products</li>
            <li>Maintain optimal inventory levels</li>
            <li>Make data-driven restocking decisions</li>
            <li>Reduce emergency orders and associated costs</li>
          </ul>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Access your alerts dashboard"
            description="Navigate to the dashboard to view all current alerts:"
          >
            <div className="space-y-4">
              <p>From the main navigation menu, click on <strong>Dashboard</strong>.</p>
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
              <p>In the dashboard, locate the <strong>Low Stock Alerts</strong> section, which displays products that have fallen below their threshold levels.</p>
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
            title="View the alert details"
            description="Click on a specific alert and click on the threshold button to setup a threshold"
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
            title="Setup a threshold"
            description="Change the threshold to the desired level"
          >
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                
                <p>After clicking on the threshold button, you will be able to setup a threshold for the product. This pop up will display:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>The current stock level</li>
                  <li>An editable threshold field</li>
                  <li>A button to update the <strong>threshold</strong> field with the new quantity</li>
                </ul>
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/adjust-threshold.png"
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
                <h4 className="font-medium mb-2">Finally, click <strong>Save Threshold</strong> to update the threshold</h4>
                
                <div className="relative h-64 mt-4 border rounded-md overflow-hidden">
                  <Image
                    src="/help/save-threshold.png"
                    alt="Save threshold"
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