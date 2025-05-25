"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Heart, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Admin {
  id: string
  full_name: string
  admin_role: string
}

export default function SignUpPage() {
  const [userType, setUserType] = useState<"user" | "admin">("user")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedAdmin: "",
  })
  const [availableAdmins, setAvailableAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch real registered admins from the API
  useEffect(() => {
    const fetchAdmins = async () => {
      if (userType === "user") {
        setIsLoadingAdmins(true)
        try {
          const response = await fetch("/api/admins")
          if (response.ok) {
            const data = await response.json()
            setAvailableAdmins(data.admins || [])
          } else {
            console.error("Failed to fetch admins")
            setAvailableAdmins([])
          }
        } catch (error) {
          console.error("Error fetching admins:", error)
          setAvailableAdmins([])
        } finally {
          setIsLoadingAdmins(false)
        }
      }
    }

    fetchAdmins()
  }, [userType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!formData.fullName.trim()) {
      toast({
        title: "Error",
        description: "Full name is required.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (userType === "user" && !formData.selectedAdmin) {
      toast({
        title: "Error",
        description: "Please select your fellowship leader.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          userType: userType,
          adminId: userType === "user" ? formData.selectedAdmin : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account created successfully!",
          description: "Please sign in with your new account.",
        })
        router.push("/signin")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
          <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
          <p className="text-gray-600">Join our PCF reporting system</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Select value={userType} onValueChange={(value: "user" | "admin") => setUserType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">General User</SelectItem>
                <SelectItem value="admin">Fellowship Leader/Admin (Limited to 4)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {userType === "user" && (
              <div className="space-y-2">
                <Label>Select Your Fellowship Leader *</Label>
                {isLoadingAdmins ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">Loading fellowship leaders...</p>
                  </div>
                ) : availableAdmins.length > 0 ? (
                  <Select
                    value={formData.selectedAdmin}
                    onValueChange={(value) => setFormData({ ...formData, selectedAdmin: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your fellowship leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAdmins.map((admin) => (
                        <SelectItem key={admin.id} value={admin.id}>
                          {admin.full_name} (
                          {admin.admin_role === "pcf_pastor"
                            ? "PCF Pastor"
                            : admin.admin_role === "cell_leader"
                              ? "Cell Leader"
                              : admin.admin_role === "fellowship_leader"
                                ? "Fellowship Leader"
                                : admin.admin_role}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>No fellowship leaders have registered yet.</strong>
                      <br />
                      Please wait for fellowship leaders to register first, or contact your church administrator for
                      assistance.
                    </p>
                  </div>
                )}
              </div>
            )}

            {userType === "admin" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Fellowship Leader Registration:</strong>
                  <br />
                  You are registering as a fellowship leader. Available roles: PCF Pastor (Super Admin), Cell Leader, or
                  Fellowship Leader. Only 4 total admin positions are available in Saint Community Church Pako-Obadiah
                  PCF.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || (userType === "user" && availableAdmins.length === 0)}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Navigation Links */}
          <div className="space-y-3 text-center text-sm">
            <div className="flex justify-between">
              <Link href="/signin" className="text-blue-600 hover:underline">
                Already have an account? Sign In
              </Link>
            </div>
            <Link href="/reset-password" className="text-blue-600 hover:underline block">
              Forgot Password? Reset here
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
