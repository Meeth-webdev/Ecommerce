'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/SignupSchema"
import axios, { AxiosError } from 'axios'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { ApiResponse } from "@/types/ApiResponse"
import Image from 'next/image'
import { motion } from 'framer-motion'
import Spinner from '@/components/spinner'

function Page() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounce = useDebounceCallback(setUsername, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username.trim()) return

      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {
        const response = await axios.get(`/api/check-username-unique?username=${encodeURIComponent(username)}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? "Error checking the username")
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast("Success!", { description: response.data.message })
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast("Signup failed", { description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <p className="mb-4">Sign Up and start shopping!</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounce(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <p className={`text-sm ${usernameMessage === 'Username is not taken' ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || isCheckingUsername || usernameMessage === 'Username is already taken'}
                aria-label="Sign up to your account"
                className="flex items-center justify-center gap-2"
              >
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>

            <div className="relative w-full h-40 overflow-hidden bg-white">
              <motion.div
                className="absolute bottom-0"
                animate={{ x: [0, 280, 0] }}
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
  )
}

export default Page