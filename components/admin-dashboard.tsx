"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, BarChart3, Calendar, Settings, LogOut, Church } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { BirthdayTicker } from "./birthday-ticker"
import { UpcomingEvents } from "./upcoming-events"

interface AdminDashboardProps {
  user: {
    id: string
    email: string
    fullName?: string
    role: string
  }
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { logout } = useAuth()

  const adminItems = [
    {
      title: "My Members",
      description: "View and manage members assigned to you",
      icon: Users,
      href: "/admin/members",
      color: "bg-blue-500",
    },
    {
      title: "Reports Review",
      description: "Review daily, weekly, and monthly reports",
      icon: FileText,
      href: "/admin/reports",
      color: "bg-green-500",
    },
    {
      title: "Statistics",
      description: "View comprehensive statistics and analytics",
      icon: BarChart3,
      href: "/admin/statistics",
      color: "bg-purple-500",
    },
    {
      title: "Study Group",
      description: "Manage study group submissions and downloads",
      icon: FileText,
      href: "/admin/study-group",
      color: "bg-orange-500",
    },
    {
      title: "Events",
      description: "Create and manage fellowship events",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-pink-500",
    },
    {
      title: "Settings",
      description: "Manage your admin settings and preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Church className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Saint Community Church Pako-Obadiah PCF</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Sir/Ma {user.fullName || user.email}!</h2>
          <p className="text-gray-600">
            Manage your fellowship members, review reports, and track community progress from your admin dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Birthday Ticker */}
      <BirthdayTicker />

      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* Admin Navigation Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
