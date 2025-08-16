"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Image src="/images/amart-logo.png" alt="Amart Consult" width={120} height={40} className="h-10 w-auto" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-slate-900">Password Reset Sent</h1>
            </div>
          </header>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Check Your Email</h2>
                <p className="text-slate-600 mb-6">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
                <Link href="/admin/login">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-enhanced">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image src="/images/amart-logo.png" alt="Amart Consult" width={120} height={40} className="h-10 w-auto" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-slate-900">Reset Admin Password</h1>
          </div>
        </header>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center text-slate-900">Reset Password</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your email address and we'll send you reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@amartconsult.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 focus-visible:ring-enhanced"
                  required
                  aria-describedby="email-help"
                />
                <p id="email-help" className="sr-only">
                  Enter the email address associated with your admin account
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium focus-visible:ring-enhanced"
                disabled={isLoading}
                aria-describedby={isLoading ? "loading-status" : undefined}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
              {isLoading && (
                <p id="loading-status" className="sr-only">
                  Sending password reset instructions
                </p>
              )}
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium focus-visible:ring-enhanced rounded-md px-2 py-1"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
