"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, BarChart3, Calendar, Settings, LogOut, Church, Activity, Bell } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRealTimeData } from "@/lib/real-time-data"
import { RealTimeBirthdayTicker } from "./real-time-birthday-ticker"
import { RealTimeEvents } from "./real-time-events"
import { RealTimeConnectionStatus } from "./real-time-connection-status"
import { motion, AnimatePresence } from "framer-motion"

interface AdminDashboardProps {
  user: {
    id: string
    email: string
    fullName?: string
    role: string
  }
}

export function RealTimeAdminDashboard({ user }: AdminDashboardProps) {
  const { logout } = useAuth()
  const { data, isLoading } = useRealTimeData()

  const adminItems = [
    {
      title: "My Members",
      description: "View and manage members assigned to you",
      icon: Users,
      href: "/admin/members",
      color: "bg-blue-500",
      count: data.statistics.totalMembers,
    },
    {
      title: "Reports Review",
      description: "Review daily, weekly, and monthly reports",
      icon: FileText,
      href: "/admin/reports",
      color: "bg-green-500",
      count: data.statistics.pendingReports,
    },
    {
      title: "Statistics",
      description: "View comprehensive statistics and analytics",
      icon: BarChart3,
      href: "/admin/statistics",
      color: "bg-purple-500",
      count: `${data.statistics.weeklyCompletion}%`,
    },
    {
      title: "Study Group",
      description: "Manage study group submissions and downloads",
      icon: FileText,
      href: "/admin/study-group",
      color: "bg-orange-500",
      count: null,
    },
    {
      title: "Events",
      description: "Create and manage fellowship events",
      icon: Calendar,
      href: "/admin/events",
      color: "bg-pink-500",
      count: data.statistics.upcomingEvents,
    },
    {
      title: "Settings",
      description: "Manage your admin settings and preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
      count: null,
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading real-time admin data...</p>
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
            <h1 className="text-2xl font-bold text-gray-800">Real-Time Admin Dashboard</h1>
            <p className="text-gray-600 flex items-center">
              Saint Community Church Pako-Obadiah PCF
              <Activity className="h-4 w-4 ml-2 text-green-500" />
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {data.statistics.pendingReports > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {data.statistics.pendingReports}
              </div>
            )}
          </Button>
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
            Manage your fellowship members, review reports, and track community progress with real-time updates.
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Real-Time Sync Active
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              {data.members.length} Members Under Your Care
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <motion.p
                    className="text-2xl font-bold"
                    key={data.statistics.totalMembers}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {data.statistics.totalMembers}
                  </motion.p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reports</p>
                  <motion.p
                    className="text-2xl font-bold"
                    key={data.statistics.pendingReports}
                    initial={{ scale: 1.2, color: "#ef4444" }}
                    animate={{ scale: 1, color: "#000000" }}
                  >
                    {data.statistics.pendingReports}
                  </motion.p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <motion.p
                    className="text-2xl font-bold"
                    key={data.statistics.weeklyCompletion}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {data.statistics.weeklyCompletion}%
                  </motion.p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Events</p>
                  <motion.p
                    className="text-2xl font-bold"
                    key={data.statistics.upcomingEvents}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {data.statistics.upcomingEvents}
                  </motion.p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Birthday Ticker */}
      <RealTimeBirthdayTicker />

      {/* Real-time Upcoming Events */}
      <RealTimeEvents />

      {/* Admin Navigation Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminItems.map((item, index) => (
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
                      <motion.div
                        className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
                        key={item.count}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {item.count}
                      </motion.div>
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

      {/* Real-time Member Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Live Member Activity
            <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Real-Time</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            <div className="space-y-3">
              {data.reports.slice(0, 5).map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium">{report.userName}</span>
                    <span className="text-sm text-gray-600 ml-2">submitted {report.type} report</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "seen"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(report.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
