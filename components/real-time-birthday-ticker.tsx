"use client"

import { Card } from "@/components/ui/card"
import { Cake } from "lucide-react"
import { motion } from "framer-motion"
import { useRealTimeData } from "@/lib/real-time-data"
import { useEffect, useState } from "react"

export function RealTimeBirthdayTicker() {
  const { data, isLoading } = useRealTimeData()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll through birthdays
  useEffect(() => {
    if (data.birthdays.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % data.birthdays.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [data.birthdays.length])

  if (isLoading) {
    return (
      <Card className="mb-8 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Cake className="h-5 w-5 text-pink-600 mr-2" />
            <h3 className="text-lg font-semibold text-pink-800">🎉 Loading Birthdays...</h3>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-pink-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (data.birthdays.length === 0) return null

  // Filter for today's birthdays from real database data
  const todaysBirthdays = data.birthdays.filter((birthday) => {
    const today = new Date()
    const birthDate = new Date(birthday.birth_date)
    return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()
  })

  if (todaysBirthdays.length === 0) return null

  return (
    <Card className="mb-8 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Cake className="h-5 w-5 text-pink-600 mr-2" />
          </motion.div>
          <h3 className="text-lg font-semibold text-pink-800">🎉 Today's Birthdays</h3>
          <div className="ml-auto bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs">Live</div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-pink-700"
          >
            🎂 <strong>{todaysBirthdays[currentIndex]?.name}</strong> is celebrating{" "}
            {todaysBirthdays[currentIndex]?.age || "their"} birthday today!
          </motion.div>
        </div>
        {todaysBirthdays.length > 1 && (
          <div className="flex justify-center mt-2 space-x-1">
            {todaysBirthdays.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-pink-600" : "bg-pink-300"}`}
              />
            ))}
          </div>
        )}
        <div className="mt-2 text-xs text-pink-600">
          Data synced from database • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </Card>
  )
}
