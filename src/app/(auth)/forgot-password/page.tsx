'use client'

import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'
import {Email} from '@/schemas/resetEmailSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { Form } from '@/components/ui/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/spinner'



 function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof Email>>({
    resolver: zodResolver(Email),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      const email = form.getValues('email')
  
      // Store the email in localStorage
      localStorage.setItem("resetEmail", email)
  
      const response = await axios.post('/api/resetPassword/send-code', {
        email: email
      })
      console.log("Server response:", response);
  
      if (!response) {
        toast.error('Code was not sent. Please try again later.')
        return
      }
  
      toast.success('The code was sent to your email.')
      router.replace('/verify-reset')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || 'Something went wrong'
      toast.error('Failed to send code', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Account
          </h1>
          <p className="mb-4">Enter the email to which the code will be sent.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              aria-label="Email for the code to be sent"
              className="flex items-center justify-center gap-2 w-full"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Sending code...' : 'Send code'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
    
    export default Page