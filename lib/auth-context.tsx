"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getUserById, updateUserLastActive } from "./database"

interface User {
  id: string
  email: string
  full_name?: string
  role: "user" | "admin" | "super_admin"
  admin_id?: string
  profile_completed: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token and validate
    const token = localStorage.getItem("auth_token")
    const userId = localStorage.getItem("user_id")

    if (token && userId) {
      // Validate token and get fresh user data
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        setIsLoading(false)
        return
      }

      const userData = await getUserById(userId)
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          admin_id: userData.admin_id,
          profile_completed: userData.profile_completed,
        })

        // Update last active timestamp
        await updateUserLastActive(userId)
      } else {
        // User not found, clear local storage
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_id")
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_id")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // In a real implementation, you would call your authentication API
      // For now, we'll use a mock login that checks the database
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const { user: userData, token } = await response.json()

      setUser(userData)
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_id", userData.id)

      // Update last active
      await updateUserLastActive(userData.id)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
