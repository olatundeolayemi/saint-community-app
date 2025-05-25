"use client"

import { Card } from "@/components/ui/card"
import { Cake } from "lucide-react"
import { motion } from "framer-motion"

export function BirthdayTicker() {
  // Mock birthday data - in real app, fetch from API
  const todaysBirthdays = [
    { name: "John Doe", age: 25 },
    { name: "Mary Smith", age: 30 },
    { name: "James Wilson", age: 45 },
  ]

  if (todaysBirthdays.length === 0) return null

  return (
    <Card className="mb-8 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Cake className="h-5 w-5 text-pink-600 mr-2" />
          <h3 className="text-lg font-semibold text-pink-800">🎉 Today's Birthdays</h3>
        </div>
        <div className="overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{ x: [0, -100] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {todaysBirthdays.map((person, index) => (
              <div key={index} className="flex-shrink-0 text-pink-700">
                🎂 <strong>{person.name}</strong> is celebrating {person.age} years today!
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Card>
  )
}
