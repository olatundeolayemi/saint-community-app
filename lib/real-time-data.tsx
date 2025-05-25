"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWebSocket } from "./websocket-context"
import { useAuth } from "./auth-context"
import {
  getTodaysBirthdays,
  getUpcomingEvents,
  getReportsByUserId,
  getReportsByAdminId,
  getUsersByAdminId,
  getUserStatistics,
  getAdminStatistics,
  getGlobalStatistics,
  type Birthday,
  type Event,
  type Report,
  type User,
} from "./database"

interface RealTimeData {
  birthdays: Birthday[]
  events: Event[]
  reports: Report[]
  members: User[]
  statistics: {
    totalMembers: number
    pendingReports: number
    weeklyCompletion: number
    upcomingEvents: number
    dailyReports?: number
    weeklyReports?: number
    monthlyReports?: number
  }
}

interface RealTimeContextType {
  data: RealTimeData
  updateData: (type: keyof RealTimeData, newData: any) => void
  refreshData: () => Promise<void>
  isLoading: boolean
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined)

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { subscribeToUpdates, sendMessage, isConnected } = useWebSocket()
  const [isLoading, setIsLoading] = useState(true)

  const [data, setData] = useState<RealTimeData>({
    birthdays: [],
    events: [],
    reports: [],
    members: [],
    statistics: {
      totalMembers: 0,
      pendingReports: 0,
      weeklyCompletion: 0,
      upcomingEvents: 0,
    },
  })

  // Load initial data from database
  const loadInitialData = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // Load real birthdays from database
      const birthdays = await getTodaysBirthdays()

      // Load real events from database
      const events = await getUpcomingEvents()

      // Load reports based on user role
      let reports: Report[] = []
      let members: User[] = []
      let statistics: any = {}

      if (user.role === "admin" || user.role === "super_admin") {
        reports = await getReportsByAdminId(user.id)
        members = await getUsersByAdminId(user.id)
        statistics = await getAdminStatistics(user.id)
      } else {
        reports = await getReportsByUserId(user.id)
        statistics = await getUserStatistics(user.id)
      }

      // If super admin, get global statistics
      if (user.role === "super_admin") {
        statistics = await getGlobalStatistics()
      }

      setData({
        birthdays,
        events,
        reports,
        members,
        statistics: {
          totalMembers: statistics.total_members || statistics.total_users || members.length,
          pendingReports: statistics.pending_reports || 0,
          weeklyCompletion: Math.round(((statistics.weekly_reports || 0) / 7) * 100),
          upcomingEvents: statistics.upcoming_events || events.length,
          dailyReports: statistics.daily_reports || 0,
          weeklyReports: statistics.weekly_reports || 0,
          monthlyReports: statistics.monthly_reports || 0,
        },
      })
    } catch (error) {
      console.error("Error loading initial data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time data refresh every 30 seconds
  useEffect(() => {
    if (!user || !isConnected) return

    const refreshInterval = setInterval(() => {
      loadInitialData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [user, isConnected])

  // Initialize data and subscribe to real-time updates
  useEffect(() => {
    if (!user || !isConnected) return

    loadInitialData()

    // Subscribe to WebSocket updates
    const unsubscribe = subscribeToUpdates((message) => {
      switch (message.type) {
        case "data_update":
          setData((prevData) => ({
            ...prevData,
            [message.data.type]: message.data.payload,
          }))
          break

        case "birthday_update":
          setData((prevData) => ({
            ...prevData,
            birthdays: message.data,
          }))
          // Refresh data to get latest from database
          loadInitialData()
          break

        case "event_update":
          setData((prevData) => ({
            ...prevData,
            events: message.data,
          }))
          // Refresh data to get latest from database
          loadInitialData()
          break

        case "report_update":
          setData((prevData) => ({
            ...prevData,
            reports: message.data,
          }))
          // Refresh data to get latest from database
          loadInitialData()
          break

        case "member_update":
          setData((prevData) => ({
            ...prevData,
            members: message.data,
          }))
          // Refresh data to get latest from database
          loadInitialData()
          break

        case "statistics_update":
          setData((prevData) => ({
            ...prevData,
            statistics: { ...prevData.statistics, ...message.data },
          }))
          break

        case "refresh_data":
          loadInitialData()
          break

        case "new_report_submitted":
          // Refresh all data when new report is submitted
          loadInitialData()
          break

        case "new_member_joined":
          // Refresh member data when new member joins
          loadInitialData()
          break
      }
    })

    // Request initial data sync
    sendMessage({
      type: "request_initial_data",
      data: { userId: user.id, role: user.role },
      timestamp: Date.now(),
    })

    return unsubscribe
  }, [user, isConnected, subscribeToUpdates, sendMessage])

  const updateData = (type: keyof RealTimeData, newData: any) => {
    setData((prevData) => ({
      ...prevData,
      [type]: newData,
    }))

    // Send update to server
    sendMessage({
      type: "data_update",
      data: { type, payload: newData },
      userId: user?.id,
      timestamp: Date.now(),
    })

    // Refresh data from database to ensure consistency
    setTimeout(() => {
      loadInitialData()
    }, 1000)
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  return (
    <RealTimeContext.Provider value={{ data, updateData, refreshData, isLoading }}>{children}</RealTimeContext.Provider>
  )
}

export function useRealTimeData() {
  const context = useContext(RealTimeContext)
  if (context === undefined) {
    throw new Error("useRealTimeData must be used within a RealTimeProvider")
  }
  return context
}
