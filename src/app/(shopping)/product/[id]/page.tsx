'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { redirect, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/Loading'
import { ShoppingCart, X, Package } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image'
import { toast } from 'sonner'
type Product = {
  _id: string;
  product: string;
  price: string;
  images: string[];
  description: string;
  createdAt: string;
};
import { Loader2 } from 'lucide-react'
import Footer from '@/components/footer'
function Page() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [card, setCard] = useState<Product | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setCard(response.data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
 
  const handleCartClick = async (id:String) => {
    try {
      // Fetch full product data using the id
      const { data: productData } = await axios.get(`/api/product/${id}`);
  
      // Now send full product info to Add Cart backend
      await axios.post('/api/add-cart/add', {
        productId: productData._id,
        product: productData.product,
        price: productData.price,
        images: productData.images,
        description: productData.description,
      });
  
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart");
      console.error(error);
    }
  };


  if (status === "loading" ) {
    return <LoadingScreen />;
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className='bg-gradient-to-b from-gray-800 via-gray-900 to-black min-h-screen'>
      <Navbar />
      
      <div className="text-white flex justify-center items-center flex-col gap-4 mt-10 pb-2">
        <Package size={60} />
        <span className="text-4xl md:text-6xl font-bold">Product Page</span>
      </div>

      <div className="flex flex-col justify-center gap-4 items-center p-4">
        <Card className="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden bg-gray-900">
          
          {/* Carousel */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="flex">
                {card?.images.map((imgUrl, index) => (
                  <CarouselItem key={index} className="flex justify-center">
                    <div 
                      className="relative w-full h-72 sm:h-96 md:h-[500px] cursor-pointer overflow-hidden"
                      onClick={() => setExpandedImage(imgUrl)}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 text-black" />
              <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 text-black" />
            </Carousel>
          </div>

          {/* Product Info */}
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{card?.product}</h1>
            <p className="text-xl md:text-2xl text-green-500 font-semibold mb-4">{card?.price}</p>
            <p className="text-gray-300 text-sm md:text-lg">{card?.description}</p>
          </CardContent>

        </Card>
        <div className='flex '>
          <div className='px-3'>

        <Button
        onClick={() => handleCartClick(id as string)}//what this telss to typescript that hey trust me its a string 
        className="bg-blue-600 hover:bg-blue-700  items-center gap-2"
        disabled={isLoading} // optional, disables the button while loading
        >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Add Cart"
        )}
        </Button>
        </div>
        <div>

        <Button
      
      className="bg-emerald-600 hover:bg-emerald-700  items-center gap-2"
      disabled={isLoading} // optional, disables the button while loading
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Checkout"
        )}
        </Button>
        </div>
        </div>

        </div>

        {/* Expanded Image Modal */}
        {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[90%] max-w-4xl max-h-[90%]">
            <Image
              src={expandedImage}
              alt="Expanded view"
              layout="intrinsic"
              width={1000}
              height={720}
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 90vw, 800px"
            />
            <button
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg"
              onClick={() => setExpandedImage(null)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default Page;