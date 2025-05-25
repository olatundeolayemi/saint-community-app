"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Calendar, FileText, Activity, Database } from "lucide-react"
import Link from "next/link"
import { useRealTimeData } from "@/lib/real-time-data"
import { motion } from "framer-motion"

export default function RealTimeStatisticsPage() {
  const { data, isLoading, refreshData } = useRealTimeData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold ml-4">Loading Real-Time Statistics...</h1>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate real statistics from database data
  const stats = {
    daily: {
      submitted: data.reports.filter((r) => r.report_type === "daily").length,
      total: 30, // Last 30 days
      percentage: Math.round((data.reports.filter((r) => r.report_type === "daily").length / 30) * 100),
    },
    weekly: {
      submitted: data.reports.filter((r) => r.report_type === "weekly").length,
      total: 4, // Last 4 weeks
      percentage: Math.round((data.reports.filter((r) => r.report_type === "weekly").length / 4) * 100),
    },
    monthly: {
      submitted: data.reports.filter((r) => r.report_type === "monthly").length,
      total: 1, // Current month
      percentage: data.reports.filter((r) => r.report_type === "monthly").length > 0 ? 100 : 0,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold ml-4 flex items-center">
                Real-Time Statistics
                <Activity className="h-6 w-6 ml-2 text-green-500" />
              </h1>
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Real-time Data Indicator */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-800 font-medium">Live Data from Database</span>
                </div>
                <div className="text-sm text-green-600">Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.daily.percentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.daily.submitted} of {stats.daily.total} days submitted
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(stats.daily.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Real-time from database</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.weekly.percentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.weekly.submitted} of {stats.weekly.total} weeks submitted
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(stats.weekly.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Real-time from database</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Reports</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.monthly.percentage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.monthly.submitted} of {stats.monthly.total} months submitted
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(stats.monthly.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Real-time from database</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Recent Activity
                  <div className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Live</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.reports.slice(0, 5).map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{report.report_type} Report</span>
                      <span
                        className={`text-sm ${
                          report.status === "pending"
                            ? "text-orange-600"
                            : report.status === "seen"
                              ? "text-blue-600"
                              : "text-green-600"
                        }`}
                      >
                        {report.status}
                      </span>
                    </motion.div>
                  ))}
                  {data.reports.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No reports submitted yet</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Progress Summary
                  <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Real-Time</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Completion</span>
                      <span>{data.statistics.weeklyCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${data.statistics.weeklyCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Reports Submitted</span>
                      <span>{data.reports.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((data.reports.length / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pending Reviews</span>
                      <span>{data.statistics.pendingReports}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((data.statistics.pendingReports / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Database Connection Status */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2 text-green-500" />
                  Connected to Database
                </div>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  Real-time Sync Active
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Updates
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
