"use client"

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from "@/components/auth-provider"

export function DebugOperations() {
  const supabase = createClientComponentClient()
  const { isAuthenticated, user } = useAuth()

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Current session:', session)
    console.log('Auth error:', error)
    console.log('Is authenticated:', isAuthenticated)
    console.log('Current user:', user)
  }

  const testRead = async () => {
    console.log('Testing read operation...')
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) {
      console.error('Read error:', error)
    } else {
      console.log('Products found:', data)
    }
  }

  const testCreate = async () => {
    console.log('Testing create operation...')
    const testProduct = {
      name: "Test Product",
      description: "Test Description",
      price: 99.99,
      stock: 10,
      sku: `TEST-${Date.now()}`,
      category: "Parts",
      material: "Test Material",
      status: "Active",
      images: {
        main: "/placeholder.svg",
        thumbnails: []
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select()

    if (error) {
      console.error('Create error:', error)
    } else {
      console.log('Created product:', data)
    }
  }

  const testUpdate = async () => {
    console.log('Testing update operation...')
    // Get first product
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (products && products.length > 0) {
      const product = products[0]
      const { data, error } = await supabase
        .from('products')
        .update({ name: `Updated Name ${Date.now()}` })
        .eq('id', product.id)
        .select()

      if (error) {
        console.error('Update error:', error)
      } else {
        console.log('Updated product:', data)
      }
    }
  }

  const testDelete = async () => {
    console.log('Testing delete operation...')
    // Get first product
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (products && products.length > 0) {
      const product = products[0]
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) {
        console.error('Delete error:', error)
      } else {
        console.log('Product deleted successfully')
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 space-x-2 bg-gray-100 p-4 rounded-lg">
      <div className="mb-2">
        Auth Status: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}
      </div>
      <Button onClick={checkAuth} variant="outline">Check Auth</Button>
      <Button onClick={testRead} variant="outline">Test Read</Button>
      <Button onClick={testCreate} variant="outline">Test Create</Button>
      <Button onClick={testUpdate} variant="outline">Test Update</Button>
      <Button onClick={testDelete} variant="outline">Test Delete</Button>
    </div>
  )
} 