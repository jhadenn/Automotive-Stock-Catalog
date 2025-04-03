"use client" // Indicates this is a client-side component in Next.js

import { createContext, useContext, useEffect, useState } from "react" // Import React hooks and context API

// Define the possible theme values.
type Theme = "dark" | "light" | "system"

// Define the props for the ThemeProvider component.
type ThemeProviderProps = {
  children: React.ReactNode // The children to be rendered within the ThemeProvider.
  defaultTheme?: Theme // The default theme to use if no theme is stored or system preference is unavailable.
  storageKey?: string // The key used to store the theme in localStorage.
}

// Define the state and methods provided by the ThemeProvider context.
type ThemeProviderState = {
  theme: Theme // The current theme.
  setTheme: (theme: Theme) => void // Function to set the theme.
  toggleTheme: () => void // Function to toggle between dark and light themes.
}

// Define the initial state for the ThemeProvider context.
const initialState: ThemeProviderState = {
  theme: "system", // Default to system preference.
  setTheme: () => null, // Placeholder function for setTheme.
  toggleTheme: () => null, // Placeholder function for toggleTheme.
}

// Create the ThemeProvider context with the initial state.
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// ThemeProvider component: Provides theme context to its children.
export function ThemeProvider({
  children,
  defaultTheme = "system", // Default theme is system preference.
  storageKey = "automotive-theme", // Default storage key.
  ...props // Allow passing additional props to the Provider.
}: ThemeProviderProps) {
  // State to manage the current theme.
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  // useEffect hook to load the theme from localStorage on mount.
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) // Get the saved theme from localStorage.
    if (savedTheme) {
      setTheme(savedTheme as Theme) // Set the theme to the saved value.
    }
  }, [storageKey]) // Run this effect when the storageKey changes.

  // useEffect hook to apply the theme to the document's root element.
  useEffect(() => {
    const root = window.document.documentElement // Get the root element of the document.

    root.classList.remove("light", "dark") // Remove existing theme classes.

    if (theme === "system") {
      // If the theme is "system", determine the system preference.
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme) // Add the system-determined theme class.
      return // Exit the effect.
    }

    root.classList.add(theme) // Add the selected theme class.
  }, [theme]) // Run this effect when the theme changes.

  // The value to be provided by the ThemeProvider context.
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme) // Save the theme to localStorage.
      setTheme(theme) // Update the theme state.
    },
    toggleTheme: () => {
      const newTheme = theme === "dark" ? "light" : "dark" // Toggle between dark and light themes.
      localStorage.setItem(storageKey, newTheme) // Save the new theme to localStorage.
      setTheme(newTheme) // Update the theme state.
    },
  }

  // Provide the theme context to the children components.
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// useTheme hook: Consumes the ThemeProvider context.
export const useTheme = () => {
  const context = useContext(ThemeProviderContext) // Consume the ThemeProvider context.
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider") // Throw an error if used outside a ThemeProvider.
  }
  return context // Return the context value.
}