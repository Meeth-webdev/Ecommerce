'use client'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import Spinner from '@/components/spinner'

function VerifyReset(){

    const router=useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const params=useParams()
    const form=useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues:{
            code:""
        }
    })

    const onSubmit=async (data:z.infer<typeof verifySchema>)=>{
        setIsLoading(true)
        try {
            const response= await axios.post("api/resetPassword/verify-code",{
                code:data.code
            })
            if(!response){
              toast.error("The verification code was not valid")
            }
            toast("Success",{
              description:response.data.message
             })
             localStorage.setItem("resetVerified", "true");
            router.push("/reset-password");
            
          } catch (error) {
              const axiosEror=error as AxiosError<ApiResponse>;
                    const errorMessage=axiosEror.response?.data.message 
                    toast("Signup failed",{
                      description:errorMessage,
                      
                    })
                  }finally{
                    setIsLoading(false)
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
       
       <Button
              type="submit"
              disabled={isLoading}
              aria-label="Email for the code to be sent"
              className="flex items-center justify-center gap-2 w-full"
            >
              {isLoading && <Spinner />}
              {isLoading ? 'Verifying Code...' : 'Verify Code'}
            </Button>
      </form>
    </Form>

            
        </div>
      
    </div>
  )




}




export default VerifyReset
