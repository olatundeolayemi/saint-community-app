"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function CompleteProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    department: "",
    maritalStatus: "",
    prayerGroup: "",
    yearJoined: "",
    role: user?.role === "admin" ? "" : undefined,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile completed!",
        description: "Your profile has been successfully updated.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
            <p className="text-center text-gray-600">
              Saint Community Church Pako-Obadiah PCF - Please provide the following information to complete your
              registration
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music_team">Music Team</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="children_ministry">Children Ministry</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="display">Display</SelectItem>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="ushering_protocol_guest">Ushering/Protocol/Guest Ministry</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prayer Group</Label>
                  <Select
                    value={formData.prayerGroup}
                    onValueChange={(value) => setFormData({ ...formData, prayerGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your prayer group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday_morning">Monday Morning</SelectItem>
                      <SelectItem value="monday_evening">Monday Evening</SelectItem>
                      <SelectItem value="tuesday_morning">Tuesday Morning</SelectItem>
                      <SelectItem value="tuesday_evening">Tuesday Evening</SelectItem>
                      <SelectItem value="wednesday_morning">Wednesday Morning</SelectItem>
                      <SelectItem value="thursday_morning">Thursday Morning</SelectItem>
                      <SelectItem value="thursday_evening">Thursday Evening</SelectItem>
                      <SelectItem value="friday_morning">Friday Morning</SelectItem>
                      <SelectItem value="friday_evening">Friday Evening</SelectItem>
                      <SelectItem value="saturday_morning">Saturday Morning</SelectItem>
                      <SelectItem value="saturday_evening">Saturday Evening</SelectItem>
                      <SelectItem value="sunday_after_service">Sunday after the Church Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearJoined">Year Joined Church</Label>
                  <Input
                    id="yearJoined"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearJoined}
                    onChange={(e) => setFormData({ ...formData, yearJoined: e.target.value })}
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>

              {user?.role === "admin" && (
                <div className="space-y-2">
                  <Label htmlFor="role">Admin Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcf_pastor">PCF Pastor (Super Admin)</SelectItem>
                      <SelectItem value="cell_leader">Cell Leader</SelectItem>
                      <SelectItem value="fellowship_leader">Fellowship Leader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving Profile..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
