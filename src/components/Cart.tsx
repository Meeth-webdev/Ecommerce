'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'

function Cart() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleClick = () => {
    console.log("🛒 Add to cart clicked")
    console.log("🧠 Session data at click:", session)
    console.log("⏳ Session status at click:", status)

    // You can even protect the route here
    if (!session) {
      console.log("🔒 User not authenticated, redirecting to sign in")
    }

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