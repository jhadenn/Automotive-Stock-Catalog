export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category: "Parts" | "Tools" | "Vehicles"
  material: string
  status: string;
  images: {
    main: string
    thumbnails: string[]
  }
  created_at?: string
  updated_at?: string
} 