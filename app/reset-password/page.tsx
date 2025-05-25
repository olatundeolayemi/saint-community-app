"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Heart } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center p-8">
            <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              {"We've sent a password reset link to"} <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {"Didn't receive the email? Check your spam folder or try again."}
            </p>
            <div className="space-y-3">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try Again
              </Button>
              <Link href="/signin" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Sign In</Button>
              </Link>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full">
                  Create New Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">Saint Community Church Pako-Obadiah</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Reset Password</CardTitle>
          <p className="text-gray-600">{"Enter your email to receive a reset link"}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="space-y-3 text-center text-sm">
            <div className="flex justify-between">
              <Link href="/signin" className="text-blue-600 hover:underline">
                Remember your password? Sign In
              </Link>
            </div>
            <Link href="/signup" className="text-blue-600 hover:underline block">
              {"Don't have an account? Sign Up"}
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
