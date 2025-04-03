"use client"

import { useState, useEffect } from "react"
import { BarChart, LineChart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { AnalyticsService, StockEvent } from "@/lib/analytics-service"
import type { ProductHistory } from "@/lib/analytics-service"
import type { Product } from "@/lib/types"

interface ProductHistoryProps {
  product: Product;
}

export function ProductHistory({ product }: ProductHistoryProps) {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<ProductHistory | null>(null)
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const analyticsService = new AnalyticsService()
        const productHistory = await analyticsService.getProductAnalytics(product.id)
        setHistory(productHistory)
      } catch (error) {
        console.error("Error fetching product history:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [product.id])
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const getEventTypeLabel = (eventType: StockEvent['eventType']) => {
    const labels = {
      'update': 'Updated',
      'restock': 'Restocked',
      'sale': 'Sale',
      'adjustment': 'Adjusted'
    }
    return labels[eventType] || eventType
  }
  
  const getEventTypeColor = (eventType: StockEvent['eventType']) => {
    const colors = {
      'update': 'text-blue-500',
      'restock': 'text-green-500',
      'sale': 'text-amber-500',
      'adjustment': 'text-purple-500'
    }
    return colors[eventType] || 'text-gray-500'
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product History</CardTitle>
          <CardDescription>Loading stock history...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }
  
  if (!history || history.events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product History</CardTitle>
          <CardDescription>No stock history available for this product.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6 text-muted-foreground">
          <p>No stock changes have been recorded yet.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock History & Analytics</CardTitle>
        <CardDescription>Track inventory changes and performance metrics for this product.</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="history">
        <TabsList className="mx-6">
          <TabsTrigger value="history" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Stock History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="p-0">
          <CardContent className="p-6">
            <div className="space-y-4">
              {history.events.map((event, index) => (
                <div 
                  key={event.id || index}
                  className="flex justify-between items-start border-b pb-3 dark:border-gray-700"
                >
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      <span className={getEventTypeColor(event.eventType)}>
                        {getEventTypeLabel(event.eventType)}
                      </span>
                      {event.changeAmount > 0 && (
                        <span className="text-green-500">+{event.changeAmount}</span>
                      )}
                      {event.changeAmount < 0 && (
                        <span className="text-red-500">{event.changeAmount}</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </div>
                    {event.notes && <div className="text-sm mt-1">{event.notes}</div>}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">New Stock: {event.newStock}</div>
                    <div className="text-sm text-muted-foreground">
                      Previous: {event.previousStock}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="analytics" className="p-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Average Stock Level</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {history.statistics.averageStockLevel.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Restock Frequency</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {history.statistics.restockFrequency > 0 
                      ? `${history.statistics.restockFrequency.toFixed(1)} days` 
                      : 'N/A'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {history.statistics.stockTurnover.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium">Days Out of Stock</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {history.statistics.daysOutOfStock.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 