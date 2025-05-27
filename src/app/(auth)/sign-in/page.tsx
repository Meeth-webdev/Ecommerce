'use client';
import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/SignInSchema';
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input"; // Ensure correct input import
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from 'next/image';
import { motion } from 'framer-motion'
import Spinner from '@/components/spinner';
function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsLoading(true); // ✅ Show loader before sign-in
  
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
  
    setIsLoading(false); // ✅ Hide loader after response
  
    if (result?.error) {
      toast.error("Login failed", {
        description: "Incorrect username or password",
      });
      return; // ✅ Stop here on failure
    }
  
    if (result?.url) {
      router.replace("/"); // ✅ Redirect on success only
    }
  };

  return (
    <div className="flex min-h-screen">
    <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center">
     
      <div className="text-center px-10">
        <h2 className="text-4xl font-bold mb-4">Welcome to our Store</h2>
        <p className="text-lg">Discover amazing products and deals!</p>
       
      </div>
    </div>
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            E-commerce Website
          </h1>
          <p className="mb-4">Sign in and start shopping!</p>
         
        </div>
  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email/username"
                      {...field}
                      aria-label="Email or Username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      aria-label="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isLoading}
  aria-label="Sign in to your account"
  className="flex items-center justify-center gap-2"> {isLoading && <Spinner />}
  {isLoading ? "Signing in..." : "Sign in"}</Button>
            <div className=" ">
          <p>
             
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-l">
              Forgot Password?
            </Link>
          </p>
          </div>
          </form>
        </Form>
  
        <div className="text-center mt-4">
          <p>
            You can register to our e-commerce website by just signing up —{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
          <div className="relative w-full h-40 overflow-hidden bg-white">
  {/* Animated Man */}
  <motion.div
    className="absolute bottom-0" // Position man at the bottom
    animate={{
      x: [0, 280, 0], // move from left to right and back
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
  >
    <Image
      src="/website/man.jpg"
      alt="Man"
      width={100}
      height={100}
    />
  </motion.div>

  {/* Store - Positioned on the right bottom corner */}
  <div className="absolute bottom-0 right-0">
    <Image
      src="/website/store.jpg"
      alt="Shop"
      width={100}
      height={100}
    />
  </div>
</div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Page;
