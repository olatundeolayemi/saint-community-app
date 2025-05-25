"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { RealTimeUserDashboard } from "@/components/real-time-user-dashboard"
import { RealTimeAdminDashboard } from "@/components/real-time-admin-dashboard"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Connecting to real-time services...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Redirect to profile completion if needed
  if (!user.profileCompleted) {
    router.push("/profile/complete")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === "user" ? <RealTimeUserDashboard user={user} /> : <RealTimeAdminDashboard user={user} />}
    </div>
  )
}
