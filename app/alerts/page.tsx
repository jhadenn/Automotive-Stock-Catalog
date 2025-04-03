import { Metadata } from "next"
import { RestockingAlerts } from "@/components/restocking-alerts"

export const metadata: Metadata = {
  title: "Inventory Alerts | Auto Inventory",
  description: "Monitor and manage low stock alerts for automotive inventory",
}

export default function AlertsPage() {
  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory Alerts</h1>
        <p className="text-muted-foreground">
          Monitor low stock products and set custom threshold levels.
        </p>
      </div>

      <RestockingAlerts defaultThreshold={5} />
    </div>
  )
} 