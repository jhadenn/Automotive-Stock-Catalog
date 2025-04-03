"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
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

  // Filter articles based on search query
  const filterArticles = (articles: HelpArticle[]) => {
    if (!searchQuery) return articles
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
          <div className="max-w-lg mx-auto relative">
            <input 
              type="text"
              placeholder="Search help articles..."
              className="w-full px-4 py-2 border border-input rounded-md bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Common Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Product Management */}
          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Product Management</h3>
            <p className="text-muted-foreground mb-4">
              Learn how to add, edit, and manage your product catalog
            </p>
            
            <ul className="space-y-2">
              {filterArticles(productManagementArticles).slice(0, 3).map((article, index) => (
                <li key={index}>
                  <Link href={article.link} className="text-primary hover:underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Inventory Management */}
          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
            <p className="text-muted-foreground mb-4">
              Monitor stock levels and handle alerts effectively
            </p>
            
            <ul className="space-y-2">
              {filterArticles(inventoryManagementArticles).slice(0, 3).map((article, index) => (
                <li key={index}>
                  <Link href={article.link} className="text-primary hover:underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* User Management */}
          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground mb-4">
              Manage user roles and permissions in the system
            </p>
            
            <ul className="space-y-2">
              {filterArticles(userManagementArticles).slice(0, 3).map((article, index) => (
                <li key={index}>
                  <Link href={article.link} className="text-primary hover:underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground mb-8">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {filterArticles(faqArticles).slice(0, 5).map((faq, index) => (
              <div key={index} className="border-b border-border pb-4">
                <h3 className="font-medium mb-2">{faq.title}</h3>
                <p className="text-muted-foreground">{faq.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact support */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-6">Our support team is ready to assist you with any questions</p>
          <Button asChild>
            <Link href="https://www.linkedin.com/in/jhaden-goy-11b787331/">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper components
function CategoryCard({ icon, title, description, link }: { 
  icon: string, 
  title: string, 
  description: string,
  link: string
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative w-16 h-16">
          <Image src={icon} alt={title} fill className="object-contain" />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

function TopicCard({ title, description, articles, link }: { 
  title: string, 
  description: string, 
  articles: HelpArticle[],
  link: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {articles.slice(0, 3).map((article, index) => (
            <li key={index}>
              <Link href={article.link} className="text-blue-600 hover:underline">
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Types
interface HelpArticle {
  title: string
  description: string
  link: string
}

// Sample articles for each category
const productManagementArticles: HelpArticle[] = [
  {
    title: "How to add a new product",
    description: "Step-by-step guide to adding new products to your catalog",
    link: "/help/products/add-product"
  },
  {
    title: "Editing product details",
    description: "Learn how to update product information and attributes",
    link: "/help/products/edit-product"
  },
  {
    title: "Removing products from your catalog",
    description: "Safely delete products without affecting historical data",
    link: "/help/products/delete-product"
  },
  {
    title: "Managing product categories",
    description: "Organize your products into logical categories",
    link: "/help/products/categories"
  },
  {
    title: "Working with product images",
    description: "Add and manage product images for better presentation",
    link: "/help/products/images"
  }
]

const inventoryManagementArticles: HelpArticle[] = [
  {
    title: "Resolving low stock alerts",
    description: "How to effectively handle low stock situations",
    link: "/help/inventory/low-stock-alerts"
  },
  {
    title: "Setting stock thresholds",
    description: "Configure when to receive alerts about low stock",
    link: "/help/inventory/thresholds"
  },
  {
    title: "Understanding stock analytics",
    description: "Interpret stock movement patterns and data",
    link: "/help/inventory/analytics"
  },
]



const userManagementArticles: HelpArticle[] = [
  {
    title: "Adding new team members",
    description: "Invite and onboard new users to the system",
    link: "/help/users/add-users"
  },
  {
    title: "Understanding permission levels",
    description: "Learn what each role can access and modify",
    link: "/help/users/permissions"
  }
]


const faqArticles: HelpArticle[] = [
  {
    title: "How do I recover a deleted product?",
    description: "You cannot recover a deleted product. Please be sure to backup your data before deleting a product.",
    link: "/help/faq#recover-product"
  },
  {
    title: "Can I export my inventory data?",
    description: "Yes, you can export your data in CSV or Excel format by contacting support.",
    link: "/help/faq#export-data"
  },
  {
    title: "How do I change my password?",
    description: "Contact support to change your password.",
    link: "/help/faq#change-password"
  },
  {
    title: "What happens when a product reaches zero stock?",
    description: "Products at zero stock will be flagged on your dashboard and in inventory reports.",
    link: "/help/faq#zero-stock"
  },
  {
    title: "How often is the dashboard data refreshed?",
    description: "Dashboard data is updated in real-time when changes are made to your inventory.",
    link: "/help/faq#data-refresh"
  },
  {
    title: "Can I customize the low stock threshold for each product?",
    description: "Yes, you can set individual thresholds for each product in the product details page.",
    link: "/help/faq#custom-thresholds"
  }
] 