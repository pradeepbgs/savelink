'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Loader2, Bookmark } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { signupValidation } from '@/schema/signupSchema'

function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: { username: '', email: '', password: '' }
  })

  const onSubmit = async (data: z.infer<typeof signupValidation>) => {
    setIsSubmitting(true)
    try {
      const result = await axios.post('/api/register', data)
      if (result?.data.success === true) {
        toast({ title: "Account created!", description: result.data.message })
        router.replace('/login')
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 mb-5 shadow-lg shadow-violet-500/30">
            <Bookmark className="w-6 h-6 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-500 text-sm">Start saving and organizing your links</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-slate-700 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-slate-700 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="bg-white/[0.05] border-white/[0.09] text-white placeholder:text-slate-700 focus-visible:ring-violet-500/40 focus-visible:border-violet-500/40 rounded-xl"
                      />
                    </FormControl>
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
                  'Create Account'
                )}
              </button>
            </form>
          </Form>

          <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
