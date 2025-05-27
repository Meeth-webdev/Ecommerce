'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface Product {
  _id: string
  product: string 
  images: string[] 
  description: string
}

const Searchbar = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        setLoading(true)
        axios
          .get(`/api/search-bar?search=${query}`)
          .then((res) => setSuggestions(res.data.products)) 
          .catch(() => setSuggestions([]))
          .finally(() => setLoading(false))
      } else {
        setSuggestions([])
      }
    }, 100)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSelect = (productId: string) => {
    const id=productId
    router.push(`/product/${id}`)
    
    setSuggestions([]) 
    setQuery('') 
  }

  return (
    <div className="relative w-full px-2 sm:px-4 md:px-6">
      <div className="w-full max-w-full sm:max-w-lg md:max-w-xl mx-auto">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          placeholder="Search products..."
          className="w-full text-white font-bold px-4 py-2 border rounded-md shadow-sm text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading && query.trim() && (
          <div className="absolute z-10 w-full sm:max-w-lg md:max-w-xl bg-white border mt-1 rounded shadow p-2 text-center ">
            Loading...
          </div>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full sm:max-w-lg md:max-w-xl bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
            {suggestions.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item._id)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base flex items-center text-black"
              >
              
                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0]} 
                    alt={item.product}
                    className="w-10 h-10 mr-2 object-cover" 
                  />
                )}
                {item.product} 
              </li>
            ))}
          </ul>
        )}

        {isFocused && query.trim() && suggestions.length === 0 && !loading && (
          <div className="absolute z-10 w-full sm:max-w-lg md:max-w-xl bg-white border mt-1 rounded shadow p-2 text-center text-sm sm:text-base">
            No results found
          </div>
        )}
      </div>
    </div>
  )
}

export default Searchbar
