export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category: 'Vehicles' | 'Parts' | 'Tools'
  material: string
  status: 'Active' | 'Inactive'
  images: {
    main: string
    thumbnails: string[]
  }
  created_at?: string
  updated_at?: string
} 