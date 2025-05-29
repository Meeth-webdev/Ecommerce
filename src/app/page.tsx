'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import { toast } from 'sonner'
import { Card, CardContent } from "@/components/ui/card"
import { useEffect,useState } from 'react'
import { Button } from '@/components/ui/button'
import TypingText from '@/components/typingtext'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'
import LoadingScreen from '@/components/Loading'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ShuffleDeck from '@/components/ShuffleCard'
import { motion } from 'framer-motion'
import Footer from '@/components/footer'

function Page() {
  type Product = {
    _id: string;
    product: string;        
    price: string;
    images: string[];
    description: string;
    createdAt: string;
  };

  const router=useRouter();
  const[loading,setLoading]=useState(true)
  const[cardItems,setCardItems]=useState<Product[]>([])


  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }  



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/random-products-card");
        const data = await res.json();
        console.log("✅ API response:", data);
  
        if (Array.isArray(data)) {
          setCardItems(data);
        } else {
          console.error("❌ API did not return an array:", data);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchProducts();
  }, []);


  
  const handleClick = (product: Product) => {
    const id =product._id;
    router.push(`/product/${id}`)
  };
 
 
  const handleCartClick = async (product: Product) => {
    try {
      const response = await axios.post("/api/add-cart/add", {
        productId: product._id,
        images: product.images,
        price: product.price,
        product: product.product, 
        description:product.description
      });
  
      if (response.data.success) {
        toast.success(response.data.message || "Product added to cart!");
      } else {
        toast.warning(response.data.message || "Product already exists.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.warning(error.response.data.message || "This item is already in your cart.");
      } else if (error.response && error.response.status === 401) {
        toast.error("Please sign in to add items to your cart.");
      } else {
        toast.error("Something went wrong while adding to cart.");
      }
    }
  };
  const { data: session, status } = useSession();

 
  if (status === "loading" ) {
   return <LoadingScreen/>
  }

  
  if (!session) {
    redirect("/sign-in"); 
  }



  return (
    
      
    <div className='bg-gradient-to-b from-gray-800 via-gray-900 to-black'>
    <div className=''>
      <Navbar />
      <ShuffleDeck/>
      <TypingText />
      {loading ? (
  <p className="text-white text-center col-span-full">Loading products...</p>
) : cardItems.length > 0 ? (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pt-3"
    variants={containerVariants}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
  >
    {cardItems.map((product, index) => (
      <motion.div key={index} variants={cardVariants}>
        <Card className="bg-gray-900 text-white shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardContent className="flex flex-col items-center justify-center p-4">
            <img
              src={product.images[0]}
              alt={product.product}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
            />
            <p className="text-center text-sm mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {product.product}
            </p>
            <p className="text-center text-sm mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {product.price}
            </p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => handleClick(product)} className="bg-emerald-500 hover:bg-emerald-600">Buy Now</Button>
              <Button onClick={() => handleCartClick(product)} className="bg-blue-600 hover:bg-blue-700">Add Cart</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
) : (
  <p className="text-white text-center col-span-full">No products available</p>
)}

<Footer/>
    </div>
  </div>
  )
}

export default Page
