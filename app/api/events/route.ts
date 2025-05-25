import { type NextRequest, NextResponse } from "next/server"
import { createEvent, createNotification } from "@/lib/database"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    // Check if user is admin or super_admin
    if (!["admin", "super_admin"].includes(decoded.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const eventData = await request.json()

    // Create event
    const event = await createEvent({
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.eventDate,
      is_global: decoded.role === "super_admin" ? eventData.isGlobal : false,
      created_by: decoded.userId,
      banner_url: eventData.bannerUrl,
    })

    // Create notification for all users (or specific fellowship if not global)
    await createNotification({
      type: "new_event",
      title: "New Event Created",
      message: `${eventData.title} has been scheduled for ${eventData.eventDate}`,
      data: { eventId: event.id, isGlobal: event.is_global },
    })

    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: "Event created successfully",
    })
  } catch (error) {
    console.error("Event creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getUpcomingEvents } = await import("@/lib/database")
    const events = await getUpcomingEvents()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
