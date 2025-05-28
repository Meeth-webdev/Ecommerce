'use client'
import { Button } from '@/components/ui/button'
import { FormControl,FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verificationSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { toast } from "sonner"
import * as  z from 'zod'

function VerifyAccount() {
    const router=useRouter()
    const params=useParams<{username:string}>()
     const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
      defaultValues:{
        code:""
      }
      })

      const onSubmit=async(data:z.infer<typeof verifySchema>)=>{
        try {
          const response= await axios.post(`/api/verify`,{
            username:params.username, //params se username extract karliya
            code:data.code 

           })
          if(!response){
            toast.error("The verification code was not valid")
          }
          toast("Success",{
            description:response.data.message
           })
           router.replace('/')
        } catch (error) {
            const axiosEror=error as AxiosError<ApiResponse>;
                  const errorMessage=axiosEror.response?.data.message 
                  toast("Signup failed",{
                    description:errorMessage,
                    
                  })
                }
        }

      
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md '>
        <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
         Verify Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email </p>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

            
        </div>
      
    </div>
  )
}

export default VerifyAccount