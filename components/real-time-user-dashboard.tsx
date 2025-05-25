"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, BarChart3, BookOpen, Gift, User, LogOut, Church, Activity } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRealTimeData } from "@/lib/real-time-data"
import { RealTimeBirthdayTicker } from "./real-time-birthday-ticker"
import { RealTimeEvents } from "./real-time-events"
import { RealTimeConnectionStatus } from "./real-time-connection-status"
import { motion } from "framer-motion"

interface UserDashboardProps {
  user: {
    id: string
    email: string
    fullName?: string
    role: string
  }
}

export function RealTimeUserDashboard({ user }: UserDashboardProps) {
  const { logout } = useAuth()
  const { data, isLoading } = useRealTimeData()

  const navigationItems = [
    {
      title: "Daily Report",
      description: "Submit your daily activities and prayer reports",
      icon: FileText,
      href: "/reports/daily",
      color: "bg-blue-500",
      count: data.statistics.pendingReports,
    },
    {
      title: "Weekly Report",
      description: "Submit weekly outreach and visitation reports",
      icon: Calendar,
      href: "/reports/weekly",
      color: "bg-green-500",
      count: null,
    },
    {
      title: "Monthly Report",
      description: "View and submit monthly attendance reports",
      icon: BarChart3,
      href: "/reports/monthly",
      color: "bg-purple-500",
      count: null,
    },
    {
      title: "Study Group",
      description: "Upload study materials and track progress",
      icon: BookOpen,
      href: "/study-group",
      color: "bg-orange-500",
      count: null,
    },
    {
      title: "Giving",
      description: "Submit monthly giving and other contributions",
      icon: Gift,
      href: "/giving",
      color: "bg-pink-500",
      count: null,
    },
    {
      title: "Statistics",
      description: "View your reporting statistics and progress",
      icon: BarChart3,
      href: "/statistics",
      color: "bg-indigo-500",
      count: `${data.statistics.weeklyCompletion}%`,
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading real-time data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RealTimeConnectionStatus />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Church className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Saint Community Church Pako-Obadiah</h1>
            <p className="text-gray-600 flex items-center">
              PCF Real-Time Reporting System
              <Activity className="h-4 w-4 ml-2 text-green-500" />
            </p>
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
            Ready to submit your reports and track your spiritual journey? All updates are synchronized in real-time.
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live Updates Active
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              {data.statistics.totalMembers} Members Online
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Birthday Ticker */}
      <RealTimeBirthdayTicker />

      {/* Real-time Upcoming Events */}
      <RealTimeEvents />

      {/* Navigation Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={item.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full group hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    {item.count && (
                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.count}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
            <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm">Daily report submitted successfully</span>
              </div>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm">Weekly statistics updated</span>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm">New event notification received</span>
              </div>
              <span className="text-xs text-gray-500">3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
