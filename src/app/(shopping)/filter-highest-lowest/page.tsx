'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { FilterIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import LoadingScreen from '@/components/Loading';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Repeat } from 'lucide-react';
import Footer from '@/components/footer';
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
  const [loading, setLoading] = useState(true); // Added loading state
  const { data: session, status } = useSession();
  const router = useRouter();

  const getProducts = async () => {
    try {
      const response = await axios.post("/api/price-filter/highest-lowest");
      setCard(response.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      toast.error("Couldn't filter with price");
      console.error(error);
      setLoading(false); // Set loading to false even if an error occurs
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleCartClick = async (product: Product) => {
    try {
      const response = await axios.post("/api/add-cart/add", {
        productId: product._id,
        images: product.images,
        price: product.price,
        product: product.product,
        description: product.description,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Product added to cart!");
      } else {
        toast.warning(response.data.message || "Product already exists.");
      }
    } catch (error:any) {
      if (error.response && error.response.status === 409) {
        toast.warning(error.response.data.message || "This item is already in your cart.");
      } else if (error.response && error.response.status === 401) {
        toast.error("Please sign in to add items to your cart.");
      } else {
        toast.error("Something went wrong while adding to cart.");
      }
    }
  };

  const handleClick = (product: Product) => {
    const id = product._id;
    router.push(`/product/${id}`);
  };

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className='bg-gradient-to-b from-gray-800 via-gray-900 to-black min-h-screen'>
      <Navbar />
      <div className="text-white flex justify-center items-center gap-8 mt-10 pb-2">
  
      <div className="flex items-center gap-4">
        <FilterIcon size={80} />
          <span className="text-6xl font-bold">Filter-Page</span>
        </div>

 
        <div className="flex items-center gap-2">
        <Repeat size={50} />
        <Link href="/filter-lowest-highest" className="text-3xl font-bold hover:underline">
         Lowest-Highest
            </Link>
            </div>
              </div>

      {/* Loading State */}
      {loading ? (
        <div>Loading Products </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pt-3">
          {card && card.length > 0 ? (
            card.map((product, index) => (
              <div key={index}>
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
                      <Button onClick={() => handleClick(product)} className="bg-emerald-500 hover:bg-emerald-600">
                        Buy Now
                      </Button>
                      <Button onClick={() => handleCartClick(product)} className="bg-blue-600 hover:bg-blue-700">
                        Add Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-full">No products available</p>
          )}
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default Page
