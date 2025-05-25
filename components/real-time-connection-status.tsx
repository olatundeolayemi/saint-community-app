"use client"

import { useWebSocket } from "@/lib/websocket-context"
import { Wifi, WifiOff } from "lucide-react"
import { motion } from "framer-motion"

export function RealTimeConnectionStatus() {
  const { isConnected } = useWebSocket()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
        isConnected
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {isConnected ? (
        <>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
            <Wifi className="h-4 w-4" />
          </motion.div>
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Reconnecting...</span>
        </>
      )}
    </motion.div>
  )
}
