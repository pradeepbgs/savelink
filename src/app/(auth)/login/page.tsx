'use client'

import React, {useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { signinSchema } from '@/schema/signinSchema'
import { signIn } from 'next-auth/react'
import axios, { AxiosError } from 'axios'


function Signpage() {
  const [isSubmitting, setIsSubmitting]= useState(false)
  const {toast} = useToast()
  const router = useRouter()
  
  // zod implementation
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })


  const onSubmit = async (data:z.infer<typeof signinSchema>) => {
    setIsSubmitting(true)

      try {
        const result = await axios.post('/api/login',data)
        if (result?.data.success == true) {
          toast({
            title: "Success",
            description: result.data.message,
          })
          router.push('/');
        } else {
          toast({
            title: "Error",
            description: result.data.message,
          })
        }
      } catch (error) {
        console.log("error in signin user")
      const axiosError = error as AxiosError<any>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'An error occurred',
        variant: 'destructive',
      })
      }finally{
        setIsSubmitting(false)
      }
    
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Welcom to saveLink
          </h1>
          <p className="mb-4">Sign in to continue saving your links</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
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
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
              />
            <Button className='w-full' type="submit">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
              </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signpage