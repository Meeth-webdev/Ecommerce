'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { redirect } from "next/navigation"
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/Loading'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Trash2, X } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '@/components/ui/button'
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

  const [card, setCard] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const cartItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };
  
  
 
  const totalPrice = card.reduce((sum, product) => {
    const cleanPriceString = product.price.replace('$', '');
    const priceNumber = Number(cleanPriceString);
    if (!isNaN(priceNumber)) {
      return sum + priceNumber;
    }
    return sum;
  }, 0);


  const getProducts = async () => {
    const res = await axios.post('/api/add-cart/Info');
    const data = res.data;

    if (data.success && Array.isArray(data.products)) {
      setCard(data.products);
    } else {
      console.error("❌ No products returned:", data);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  console.log(card)
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/add-cart/delete/${id}`);
      if (res.data.success) {
        setCard((prev) => prev.filter((item) => item._id !== id));
        toast.success("Product removed from cart");
      } else {
        toast.error("Failed to remove product");
      }
    } catch (err) {
      toast.error("An error occurred");
      console.error(err);
    }
  };

  if (status === "loading" ) {
    return <LoadingScreen/>
   }
 
   
   if (!session) {
     redirect("/sign-in"); 
   }

  return (
    <div  className='bg-gradient-to-b from-gray-800 via-gray-900 to-black min-h-screen'>
      <Navbar />
        <div className="text-white flex justify-center items-center gap-4 mt-10 pb-2">
        <ShoppingCart size={80} />
        <span className="text-6xl font-bold">Add-cart</span>
       </div>

        {card.length > 0 ? (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4"
        variants={cartItemVariants}
        >
          {card.map((product, index) => (
            <div key={index} className="bg-gray-900 rounded-2xl shadow-xl p-4 text-white flex flex-col items-center max-w-sm mx-auto">
              <h2 className="text-lg font-semibold mb-2 text-center">{product.product}</h2>
              <motion.div className="w-full relative"
              variants={cartItemVariants}
              >
                <Carousel className="w-full max-h-40">
                  <CarouselContent>
                    {product.images.map((imgSrc, imgIndex) => (
                      <CarouselItem key={imgIndex}>
                        <div
                          className="relative w-full h-32 cursor-pointer"
                          onClick={() => setExpandedImage(imgSrc)}
                        >
                          <img
                            src={imgSrc}
                            alt={`${product.product}-${imgIndex}`}
                            className="w-full h-full object-contain rounded-md"
                          />
                        </div>
                        <div className="text-emerald-400 font-extrabold flex justify-center items-center">
                          {product.price}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </motion.div>

              <button
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center justify-center"
                onClick={() => handleDelete(product._id)}
              >
                <Trash2 className="mr-2" size={18} />
                Delete
              </button>
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-white text-center mt-8">No products in your cart yet.</p>
      )}

      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-screen-md max-h-screen">
            <img src={expandedImage} alt="Expanded" className="w-full h-auto object-contain rounded-lg" />
            <button
              className="absolute top-2 right-2 bg-white text-black p-1 rounded-full"
              onClick={() => setExpandedImage(null)}
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {card.length > 0 && (
        <div className="text-center mt-8">
          <p className="flex items-center justify-center gap-2 text-lg sm:text-xl font-bold bg-black px-6 py-3 rounded-full shadow-lg text-white mb-4 hover:scale-105 transition-transform duration-300">
            <ShoppingCart size={22} />
            Proceed to Checkout
          </p>

          <div className="flex flex-col items-center mt-2 mb-10">
            <p className="text-2xl font-semibold text-white">Total Amount:</p>
            <span className="text-3xl font-bold text-emerald-400 mt-1">${totalPrice.toFixed(2)}</span>
            <Button className='bg-emerald-400 flex justify-center items-center'>
            Checkout 
            </Button>
          </div>
        </div>
      )}
      
    </div>
    
  );
}

export default Page;
