"use client" // Indicates this is a client-side component in Next.js

import { Moon, Sun } from "lucide-react" // Import Moon and Sun icons from lucide-react library
import { useTheme } from "@/components/theme-provider" // Import the useTheme hook from the theme-provider component
import { Button } from "@/components/ui/button" // Import the Button component from the custom UI library

// ThemeToggle component: Provides a button to toggle between dark and light themes.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme() // Consume the theme context using the useTheme hook

  return (
    <Button 
      variant="ghost" // Apply the "ghost" variant to the button for a transparent background
      size="icon" // Apply the "icon" size to the button for a square icon button
      onClick={toggleTheme} // Call the toggleTheme function when the button is clicked
      className="w-9 h-9" // Set the width and height of the button to 9 units
      aria-label="Toggle theme" // Provide an aria-label for accessibility
    >
      {theme === "dark" ? ( // Check if the current theme is dark
        <Sun className="h-5 w-5 text-yellow-300" /> // Render the Sun icon with a yellow color for dark theme
      ) : (
        <Moon className="h-5 w-5" /> // Render the Moon icon for light theme or system theme
      )}
    </Button>
  )
}