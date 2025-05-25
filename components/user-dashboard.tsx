"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, BarChart3, BookOpen, Gift, User, LogOut, Church } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { BirthdayTicker } from "./birthday-ticker"
import { UpcomingEvents } from "./upcoming-events"

interface UserDashboardProps {
  user: {
    id: string
    email: string
    fullName?: string
    role: string
  }
}

export function UserDashboard({ user }: UserDashboardProps) {
  const { logout } = useAuth()

  const navigationItems = [
    {
      title: "Daily Report",
      description: "Submit your daily activities and prayer reports",
      icon: FileText,
      href: "/reports/daily",
      color: "bg-blue-500",
    },
    {
      title: "Weekly Report",
      description: "Submit weekly outreach and visitation reports",
      icon: Calendar,
      href: "/reports/weekly",
      color: "bg-green-500",
    },
    {
      title: "Monthly Report",
      description: "View and submit monthly attendance reports",
      icon: BarChart3,
      href: "/reports/monthly",
      color: "bg-purple-500",
    },
    {
      title: "Study Group",
      description: "Upload study materials and track progress",
      icon: BookOpen,
      href: "/study-group",
      color: "bg-orange-500",
    },
    {
      title: "Giving",
      description: "Submit monthly giving and other contributions",
      icon: Gift,
      href: "/giving",
      color: "bg-pink-500",
    },
    {
      title: "Statistics",
      description: "View your reporting statistics and progress",
      icon: BarChart3,
      href: "/statistics",
      color: "bg-indigo-500",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Church className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Saint Community Church Pako-Obadiah</h1>
            <p className="text-gray-600">PCF Reporting System</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome, {user.fullName || user.email}!</h2>
          <p className="text-gray-600">
            Ready to submit your reports and track your spiritual journey? Choose an option below to get started.
          </p>
        </CardContent>
      </Card>

      {/* Birthday Ticker */}
      <BirthdayTicker />

      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* Navigation Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item) => (
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
