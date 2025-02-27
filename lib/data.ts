export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  sku: string
  category: "Vehicles" | "Parts" | "Tools" | string
  material: string
  status: string
  images: {
    main: string
    thumbnails: string[]
  }
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "2025 Mazda CX-5 SUV",
    description: "Spacious family SUV with excellent fuel economy and modern features",
    price: 32500.0,
    stock: 12,
    sku: "VEH-SUV-2023",
    category: "Vehicles",
    material: "Mixed",
    status: "Active",
    images: {
      main: "/images/2025-mazda-cx5.png",
      thumbnails: ["/images/2025-mazda-cx5.png", "/images/2025-mazda-cx5.png"],
    },
  },
  {
    id: "2",
    name: "2022 BMW M3 Competition",
    description: "Premium sedan with leather interior and advanced safety features",
    price: 45999.99,
    stock: 8,
    sku: "VEH-SED-2022",
    category: "Vehicles",
    material: "Mixed",
    status: "Active",
    images: {
      main: "/images/luxury-sedan-main.jpg",
      thumbnails: ["/images/luxury-sedan-thumb1.jpg", "/images/luxury-sedan-thumb2.jpg"],
    },
  },
  {
    id: "3",
    name: "2023 Tesla Model Y",
    description: "Fully electric vehicle with 300 mile range and fast charging capability",
    price: 38750.0,
    stock: 15,
    sku: "VEH-ELE-2023",
    category: "Vehicles",
    material: "Mixed",
    status: "Active",
    images: {
      main: "/images/electric-hatchback-main.jpg",
      thumbnails: ["/images/electric-hatchback-thumb1.jpg", "/images/electric-hatchback-thumb2.jpg"],
    },
  },

  // Parts
  {
    id: "4",
    name: "High Performance Brake Kit",
    description: "Complete brake system upgrade for improved stopping power",
    price: 899.99,
    stock: 45,
    sku: "PRT-BRK-0123",
    category: "Parts",
    material: "Metal/Ceramic",
    status: "Active",
    images: {
      main: "/images/brake-kit-main.jpg",
      thumbnails: ["/images/brake-kit-thumb1.jpg", "/images/brake-kit-thumb2.jpg"],
    },
  },
  {
    id: "5",
    name: "Air Filter System",
    description: "Premium air filtration system for improved engine performance",
    price: 129.95,
    stock: 120,
    sku: "PRT-FLT-4567",
    category: "Parts",
    material: "Synthetic",
    status: "Active",
    images: {
      main: "/images/air-filter-main.jpg",
      thumbnails: ["/images/air-filter-thumb1.jpg", "/images/air-filter-thumb2.jpg"],
    },
  },
  {
    id: "6",
    name: "LED Headlight Set",
    description: "Bright, energy-efficient LED headlight replacement kit",
    price: 249.99,
    stock: 78,
    sku: "PRT-LGT-7890",
    category: "Parts",
    material: "LED/Plastic",
    status: "Active",
    images: {
      main: "/images/led-headlights-main.jpg",
      thumbnails: ["/images/led-headlights-thumb1.jpg", "/images/led-headlights-thumb2.jpg"],
    },
  },
  {
    id: "7",
    name: "Suspension Upgrade Kit",
    description: "Complete suspension system for improved handling and comfort",
    price: 1299.99,
    stock: 22,
    sku: "PRT-SUS-1122",
    category: "Parts",
    material: "Metal/Alloy",
    status: "Active",
    images: {
      main: "/images/suspension-kit-main.jpg",
      thumbnails: ["/images/suspension-kit-thumb1.jpg", "/images/suspension-kit-thumb2.jpg"],
    },
  },

  // Tools
  {
    id: "8",
    name: "Professional Diagnostic Scanner",
    description: "Advanced OBD-II scanner with comprehensive vehicle diagnostics",
    price: 599.99,
    stock: 35,
    sku: "TLS-SCN-3344",
    category: "Tools",
    material: "Plastic/Electronic",
    status: "Active",
    images: {
      main: "/images/diagnostic-scanner-main.jpg",
      thumbnails: ["/images/diagnostic-scanner-thumb1.jpg", "/images/diagnostic-scanner-thumb2.jpg"],
    },
  },
  {
    id: "9",
    name: "Hydraulic Floor Jack",
    description: "Heavy-duty 3-ton hydraulic floor jack for vehicle maintenance",
    price: 189.95,
    stock: 42,
    sku: "TLS-JCK-5566",
    category: "Tools",
    material: "Steel",
    status: "Active",
    images: {
      main: "/images/floor-jack-main.jpg",
      thumbnails: ["/images/floor-jack-thumb1.jpg", "/images/floor-jack-thumb2.jpg"],
    },
  },
  {
    id: "10",
    name: "Torque Wrench Set",
    description: "Precision torque wrench set with various socket sizes",
    price: 149.99,
    stock: 68,
    sku: "TLS-WRN-7788",
    category: "Tools",
    material: "Chrome Vanadium",
    status: "Active",
    images: {
      main: "/images/torque-wrench-main.jpg",
      thumbnails: ["/images/torque-wrench-thumb1.jpg", "/images/torque-wrench-thumb2.jpg"],
    },
  },
]

