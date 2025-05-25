"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Globe, Users } from "lucide-react"
import { useRealTimeData } from "@/lib/real-time-data"
import { motion, AnimatePresence } from "framer-motion"

export function RealTimeEvents() {
  const { data, isLoading } = useRealTimeData()

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Loading Events...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filter and sort real events from database
  const upcomingEvents = data.events
    .filter((event) => new Date(event.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5)

  if (upcomingEvents.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Upcoming Events
            <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Updates</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No upcoming events scheduled</p>
            <p className="text-sm">Check back later for new events</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Events
          <div className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Live Updates</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 transition-colors rounded-r-lg p-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      {event.title}
                      {event.is_global ? (
                        <Globe className="h-4 w-4 ml-2 text-blue-600" />
                      ) : (
                        <Users className="h-4 w-4 ml-2 text-gray-600" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.event_date).toLocaleDateString()}
                      {event.is_global && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Global Event
                        </span>
                      )}
                    </div>
                    {event.creator_name && (
                      <div className="text-xs text-gray-400 mt-1">Created by: {event.creator_name}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      {Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      days
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Real-time data from database • Last synced: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
