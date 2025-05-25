"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WeeklyReportPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    outreach: {
      preached: 0,
      saved: 0,
      filled: 0,
    },
    followUp: 0,
    visitation: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Report Submitted",
      description: "Your weekly report has been submitted successfully.",
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
            <h1 className="text-2xl font-bold ml-4">Weekly Report</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Outreach */}
            <Card>
              <CardHeader>
                <CardTitle>Outreach</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="preached">Number Preached To</Label>
                    <Input
                      id="preached"
                      type="number"
                      min="0"
                      value={formData.outreach.preached}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: { ...formData.outreach, preached: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="saved">Number Saved</Label>
                    <Input
                      id="saved"
                      type="number"
                      min="0"
                      value={formData.outreach.saved}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: { ...formData.outreach, saved: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="filled">Number Filled</Label>
                    <Input
                      id="filled"
                      type="number"
                      min="0"
                      value={formData.outreach.filled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: { ...formData.outreach, filled: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle>Follow-up</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="followUp">Number Followed Up</Label>
                  <Input
                    id="followUp"
                    type="number"
                    min="0"
                    value={formData.followUp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        followUp: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visitation */}
            <Card>
              <CardHeader>
                <CardTitle>Visitation</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="visitation">Number of Disciples Visited</Label>
                  <Input
                    id="visitation"
                    type="number"
                    min="0"
                    value={formData.visitation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visitation: Number.parseInt(e.target.value) || 0,
                      })
                    }
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
                Submit Weekly Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
