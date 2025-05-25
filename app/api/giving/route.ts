import { type NextRequest, NextResponse } from "next/server"
import { createGivingRecord } from "@/lib/database"
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

    const givingData = await request.json()

    // Create giving record
    const givingRecord = await createGivingRecord({
      user_id: decoded.userId,
      monthly_giving: givingData.monthlyGiving ? Number.parseFloat(givingData.monthlyGiving) : null,
      other_giving: givingData.otherGiving ? Number.parseFloat(givingData.otherGiving) : null,
      description: givingData.description,
      giving_month: givingData.givingMonth || new Date().toISOString().slice(0, 7) + "-01",
    })

    return NextResponse.json({
      success: true,
      givingId: givingRecord.id,
      message: "Giving record submitted successfully",
    })
  } catch (error) {
    console.error("Giving submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
