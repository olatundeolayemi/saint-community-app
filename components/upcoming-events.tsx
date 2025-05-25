"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export function UpcomingEvents() {
  // Mock events data - in real app, fetch from API
  const upcomingEvents = [
    {
      id: 1,
      title: "Monthly Fellowship Meeting",
      date: "2025-01-30",
      description: "Join us for our monthly fellowship and prayer meeting",
      isGlobal: true,
    },
    {
      id: 2,
      title: "Youth Bible Study",
      date: "2025-02-05",
      description: "Special youth-focused Bible study session",
      isGlobal: false,
    },
  ]

  if (upcomingEvents.length === 0) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                    {event.isGlobal && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Global Event
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
