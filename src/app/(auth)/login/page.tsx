'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2, Bookmark } from 'lucide-react'
import { signinSchema } from '@/schema/signinSchema'
import axios, { AxiosError } from 'axios'

function Signpage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: '', password: '' }
  })

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await axios.post('/api/login', data)
      if (result?.data.success) {
        toast({ title: "Welcome back!", description: result.data.message })
        router.push('/')
      } else {
        toast({ title: "Error", description: result.data.message })
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-slate-950 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 mb-5 shadow-lg shadow-violet-500/30">
            <Bookmark className="w-6 h-6 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your SaveLink account</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Email or Username</FormLabel>
                    <Input
                      {...field}
                      className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-slate-700 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
                    />
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-slate-700 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
                    />
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 active:scale-[0.98] mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </Form>

          <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
            <p className="text-slate-600 text-sm">
              No account?{' '}
              <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signpage
