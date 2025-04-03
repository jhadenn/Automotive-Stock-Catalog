import * as React from "react" // Import the entire React library as 'React'

import { cn } from "@/lib/utils" // Import the 'cn' utility function for conditional class names

// Define the props interface for the Textarea component, extending React's textarea attributes.
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Textarea: A custom textarea component using React.forwardRef for ref forwarding.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn( // Apply conditional class names using the 'cn' utility
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className, // Allow custom class names to be passed in
      )}
      ref={ref} // Forward the ref to the underlying textarea element
      {...props} // Spread all other props onto the textarea element
    />
  )
})
Textarea.displayName = "Textarea" // Set the display name for debugging purposes

// Export the Textarea component for use in other parts of the application.
export { Textarea }