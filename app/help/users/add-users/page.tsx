"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export default function AddUserTutorial() {
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
          <h1 className="text-3xl font-bold mb-4">How to add a new user</h1>
        </div>

  

        <div className="space-y-12">
          {/* Step 1 */}
          <TutorialStep
            number={1}
            title="Please contact your system administrator to add a new user"
            description="Email support@stockflow.co.uk to request a new user to be added"
          >
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">You will recieve an email with an email and password to login. Save this information and keep it safe.</h4>
                <p>Navigate to the <strong>Products</strong> page from the main navigation menu.</p>
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
              <Link href="/help/users/permissions" className="text-blue-600 hover:underline">
                Understanding permission levels
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