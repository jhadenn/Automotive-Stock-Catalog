"use client"

import React, { useState, useEffect } from "react"
import { AlertTriangle, AlertCircle, CheckCircle2, Settings } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { RestockingService, RestockingAlert } from "@/lib/restocking-service"
import { Product } from "@/lib/types"
import { productsService } from "@/lib/products-service"

interface RestockingAlertsProps {
  defaultThreshold?: number
  generateAlertsOverride?: () => Promise<any>
}

export function RestockingAlerts({ defaultThreshold = 5, generateAlertsOverride }: RestockingAlertsProps) {
  const { isAuthenticated } = useAuth()
  const [alerts, setAlerts] = useState<RestockingAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [globalThreshold, setGlobalThreshold] = useState(defaultThreshold)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [productSpecificThresholds, setProductSpecificThresholds] = useState<Record<string, number>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productThreshold, setProductThreshold] = useState<number>(5)
  
  // Fetch active alerts and products and automatically check inventory
  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchData = async () => {
      setLoading(true)
      try {
        const restockingService = new RestockingService()
        
        // Get all products
        const productsData = await productsService.getAll()
        setProducts(productsData)
        
        // Gather all product-specific thresholds
        const thresholds: Record<string, number> = {}
        for (const product of productsData) {
          const threshold = await restockingService.getProductThreshold(product.id)
          if (threshold !== null) {
            thresholds[product.id] = threshold
          }
        }
        setProductSpecificThresholds(thresholds)
        
        // Automatically generate alerts for products below threshold
        await generateAlertsInternal(productsData, thresholds)
        
      } catch (error) {
        console.error("Error fetching alerts:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isAuthenticated])
  
  // Internal function to generate alerts that can be reused
  const generateAlertsInternal = async (productsList = products, thresholds = productSpecificThresholds) => {
    if (!isAuthenticated) return
    
    try {
      const restockingService = new RestockingService()
      
      // Process each product with its specific threshold or the global one
      const newAlerts: RestockingAlert[] = []
      
      for (const product of productsList) {
        const threshold = thresholds[product.id] || globalThreshold
        if (product.stock < threshold) {
          const productAlerts = await restockingService.generateRestockingAlerts(threshold)
          newAlerts.push(...productAlerts)
        }
      }
      
      // Get updated alerts list
      const alertsData = await restockingService.getActiveAlerts()
      setAlerts(alertsData)
      
      return alertsData
    } catch (error) {
      console.error("Error generating alerts:", error)
      throw error
    }
  }
  
  // The public generate alerts function now uses the internal one
  const generateAlerts = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      // Use the override for testing if provided
      if (generateAlertsOverride) {
        const alertsData = await generateAlertsOverride();
        setAlerts(alertsData || []);
        return;
      }
      
      await generateAlertsInternal()
    } catch (error) {
      console.error("Error generating alerts:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Mark an alert as resolved
  const resolveAlert = async (alertId: string) => {
    if (!isAuthenticated) return
    
    try {
      const restockingService = new RestockingService()
      await restockingService.markAlertResolved(alertId)
      
      // Update alerts list
      setAlerts(alerts.filter(alert => alert.id !== alertId))
    } catch (error) {
      console.error("Error resolving alert:", error)
    }
  }
  
  // Set threshold for a specific product
  const setThresholdForProduct = async () => {
    if (!selectedProduct || !isAuthenticated) return
    
    try {
      const restockingService = new RestockingService()
      await restockingService.setProductThreshold(selectedProduct.id, productThreshold)
      
      // Update local state
      setProductSpecificThresholds({
        ...productSpecificThresholds,
        [selectedProduct.id]: productThreshold
      })
      
      setIsSettingsOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error setting product threshold:", error)
    }
  }
  
  const openThresholdSettings = (product: Product) => {
    setSelectedProduct(product)
    // Use existing threshold if available, otherwise default
    setProductThreshold(productSpecificThresholds[product.id] || globalThreshold)
    setIsSettingsOpen(true)
  }
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restocking Alerts</CardTitle>
          <CardDescription>You must be logged in to view and manage restocking alerts.</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Restocking Alerts
            </CardTitle>
            <CardDescription>Monitor products that need restocking.</CardDescription>
          </div>
          <Button onClick={generateAlerts} disabled={loading}>
            Check Inventory
          </Button>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center py-4 text-muted-foreground">Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <p>All products are adequately stocked.</p>
              <p className="text-sm">Default alert threshold: {globalThreshold} units</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between border p-4 rounded-md"
                >
                  <div>
                    <div className="font-medium">{alert.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      Current Stock: <span className="font-medium text-red-500">{alert.currentStock}</span> 
                      {` (below threshold of ${alert.threshold})`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const product = products.find(p => p.id === alert.productId)
                        if (product) {
                          openThresholdSettings(product)
                        }
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Threshold
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => alert.id && resolveAlert(alert.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Set product-specific thresholds by clicking on a product and adjusting its settings.
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Threshold for {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Set a custom alert threshold for this product. When stock falls below this number, an alert will be generated.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input
                id="current-stock"
                value={selectedProduct?.stock || 0}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="threshold">Alert Threshold</Label>
              <Input
                id="threshold"
                type="number"
                min="1"
                value={productThreshold}
                onChange={(e) => setProductThreshold(parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-muted-foreground">
                Alert will trigger when stock falls below this number.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={setThresholdForProduct}>
              Save Threshold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 