"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

interface WebSocketMessage {
  type: string
  data: any
  userId?: string
  adminId?: string
  timestamp: number
}

interface WebSocketContextType {
  socket: WebSocket | null
  isConnected: boolean
  sendMessage: (message: WebSocketMessage) => void
  subscribeToUpdates: (callback: (message: WebSocketMessage) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const subscribersRef = useRef<Set<(message: WebSocketMessage) => void>>(new Set())

  const connect = () => {
    if (!user) return

    try {
      // In production, use wss:// and your actual WebSocket server
      const ws = new WebSocket(`ws://localhost:8080?userId=${user.id}&role=${user.role}`)

      ws.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
        setSocket(ws)

        // Send authentication message
        ws.send(
          JSON.stringify({
            type: "auth",
            data: { userId: user.id, role: user.role },
            timestamp: Date.now(),
          }),
        )
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          // Notify all subscribers
          subscribersRef.current.forEach((callback) => callback(message))

          // Handle global notifications
          handleGlobalNotifications(message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
        setIsConnected(false)
        setSocket(null)

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        toast({
          title: "Connection Error",
          description: "Lost connection to server. Attempting to reconnect...",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
    }
  }

  const handleGlobalNotifications = (message: WebSocketMessage) => {
    switch (message.type) {
      case "birthday_notification":
        toast({
          title: "🎉 Birthday Alert!",
          description: `${message.data.name} is celebrating their birthday today!`,
        })
        break

      case "new_event":
        toast({
          title: "📅 New Event",
          description: `New event: ${message.data.title} on ${new Date(message.data.date).toLocaleDateString()}`,
        })
        break

      case "report_submitted":
        if (user?.role === "admin" || user?.role === "super_admin") {
          toast({
            title: "📊 New Report",
            description: `${message.data.userName} submitted a ${message.data.reportType} report`,
          })
        }
        break

      case "member_joined":
        if (user?.role === "admin" && message.data.adminId === user.id) {
          toast({
            title: "👥 New Member",
            description: `${message.data.name} joined your fellowship`,
          })
        }
        break
    }
  }

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message))
    }
  }

  const subscribeToUpdates = (callback: (message: WebSocketMessage) => void) => {
    subscribersRef.current.add(callback)
    return () => {
      subscribersRef.current.delete(callback)
    }
  }

  useEffect(() => {
    if (user) {
      connect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [user])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, subscribeToUpdates }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
