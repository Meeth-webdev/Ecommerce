'use client'

import React, { useState, useEffect } from 'react'
import Cart from './Cart'
import Searchbar from './Searchbar'
import { Dancing_Script } from 'next/font/google'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Filter from './filter'
const dancingScript = Dancing_Script({
  weight: ['600'],
  subsets: ['latin'],
})

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <nav className="bg-black text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Animated Logo */}
        <Link
          href="/"
          className={`text-3xl font-semibold transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          } ${dancingScript.className}`}
        >
          E-comm Website
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Searchbar />
          <Cart />
        <Filter/>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4 pb-4">
          <Searchbar />
          <Cart />
          <Filter/>
        </div>
      )}
    </nav>
  )
}

export default Navbar
