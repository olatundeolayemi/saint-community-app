"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function GivingPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    monthlyGiving: "",
    otherGiving: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Giving Submitted",
      description: "Your giving record has been submitted successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-4">Giving</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monthly Giving */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Giving</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="monthlyGiving">Amount</Label>
                  <Input
                    id="monthlyGiving"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyGiving}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyGiving: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other Giving */}
            <Card>
              <CardHeader>
                <CardTitle>Other Giving</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="otherGiving">Amount</Label>
                  <Input
                    id="otherGiving"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.otherGiving}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherGiving: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description/Comments</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Church Building Fund, Special Offering, Pledge"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Giving
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
