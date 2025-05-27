'use client'

import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { resetPassword } from '@/schemas/resetPasswordSchema'
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


 function ResetPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof resetPassword>>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      password: '',
     
    }
  })
  const onSubmit=async (data:z.infer<typeof resetPassword>)=>{
    setIsLoading(true)
    try {
        const email = localStorage.getItem("resetEmail");
      const response= await axios.patch("/api/resetPassword/update",{
        newPassword:data.password,
        email:email
        })
        if(!response){
            toast.error("Error in setting the password")
        }
        if (response?.data?.success) {
            toast("The password was successfully reset");
            localStorage.removeItem("resetEmail");
            router.replace("/");
          }
    } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          const errorMessage = axiosError.response?.data.message || 'Something went wrong'
          toast.error('Failed to reset password', {
            description: errorMessage
          })
        }finally{
            setIsLoading(false)
        }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Reset Password
          </h1>
          <p className="mb-4">Enter Your new Password.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your new password" {...field} />
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

export default ResetPassword