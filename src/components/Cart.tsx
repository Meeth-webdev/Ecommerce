'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'

function Cart() {
  const router = useRouter()
  
  const handleClick = () => {
    router.push("/add-cart")
  }
  
  return (
    <div>
      <Button onClick={handleClick} variant="outline" aria-label="Go to cart">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to cart
      </Button>
    </div>
  )
}

export default Cart