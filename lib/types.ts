/**
 * Represents a product in the automotive stock catalog.
 * This interface defines the structure of product objects used throughout the application.
 */
export interface Product {
  /** Unique identifier for the product */
  id: string
  /** Name of the product */
  name: string
  /** Detailed description of the product */
  description: string
  /** Price of the product in CAD */
  price: number
  /** Current quantity in stock */
  stock: number
  /** Stock Keeping Unit - unique product identifier code */
  sku: string
  /** Product category - must be one of the predefined types */
  category: "Parts" | "Tools" | "Vehicles"
  /** Material the product is made from */
  material: string
  /** Current status of the product (e.g., "Active", "Discontinued") */
  status: string;
  /** 
   * Product images
   */
  images: {
    /** Main product image URL */
    main: string
    /** Additional product image URLs */
    thumbnails: string[]
  }
  /** Timestamp when the product was created */
  created_at?: string
  /** Timestamp when the product was last updated */
  updated_at?: string
} 