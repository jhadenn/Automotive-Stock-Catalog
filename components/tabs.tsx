"use client" // Indicates this is a client-side component in Next.js

import * as React from "react" // Import the entire React library as 'React'
import * as TabsPrimitive from "@radix-ui/react-tabs" // Import the Radix UI Tabs primitive library

import { cn } from "@/lib/utils" // Import the 'cn' utility function for conditional class names

// Tabs: Root component of the Tabs component. It manages the state and behavior of the tabs.
const Tabs = TabsPrimitive.Root

// TabsList: Component that renders the list of tab triggers.
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>, // Define the ref type
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> // Define the props type
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List // Render the Radix UI Tabs.List component
    ref={ref} // Forward the ref
    className={cn( // Apply conditional class names
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className, // Allow custom class names
    )}
    {...props} // Spread the rest of the props
  />
))
TabsList.displayName = TabsPrimitive.List.displayName // Set the display name for debugging

// TabsTrigger: Component that renders a single tab trigger (button).
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>, // Define the ref type
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> // Define the props type
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger // Render the Radix UI Tabs.Trigger component
    ref={ref} // Forward the ref
    className={cn( // Apply conditional class names
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className, // Allow custom class names
    )}
    {...props} // Spread the rest of the props
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName // Set the display name for debugging

// TabsContent: Component that renders the content associated with a tab.
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>, // Define the ref type
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> // Define the props type
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content // Render the Radix UI Tabs.Content component
    ref={ref} // Forward the ref
    className={cn( // Apply conditional class names
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className, // Allow custom class names
    )}
    {...props} // Spread the rest of the props
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName // Set the display name for debugging

// Export the Tabs components for use in other parts of the application.
export { Tabs, TabsList, TabsTrigger, TabsContent }