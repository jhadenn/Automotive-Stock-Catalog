require('dotenv').config({ path: './.env' })
const { createClient } = require('@supabase/supabase-js')
const { mockProducts } = require('../lib/data')
const { v4: uuidv4 } = require('uuid') // First run: npm install uuid

// Debug: Print environment variables (don't include this in production!)
console.log('Environment variables check:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Present' : '✗ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Present' : '✗ Missing')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log('Starting database seed...')
  
  try {
    // First, delete all existing products
    console.log('Clearing existing products...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .not('id', 'is', null)
    
    if (deleteError) {
      console.error('Error clearing products:', deleteError)
      return
    }
    
    console.log('Successfully cleared existing products')

    // Prepare products for insertion with manually generated UUIDs
    const productsToInsert = mockProducts.map((product, index) => ({
      ...product,
      id: uuidv4(), // Manually generate UUID
      sku: `${product.sku}-${Date.now()}-${index}`,
      images: {
        main: product.images.main || "/placeholder.svg",
        thumbnails: product.images.thumbnails || []
      }
    }))

    // Insert all products at once
    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select()

    if (error) {
      console.error('Error inserting products:', error)
    } else {
      console.log(`Successfully inserted ${data.length} products`)
      console.log('First product as example:', data[0])
    }
  } catch (err) {
    console.error('Seed error:', err)
  }
  
  console.log('Seed completed')
}

seedDatabase() 