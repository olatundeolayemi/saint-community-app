import { type NextRequest, NextResponse } from "next/server"
import { createReport, createWeeklyReport, createNotification } from "@/lib/database"
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

    const reportData = await request.json()

    // Create main report record
    const report = await createReport({
      user_id: decoded.userId,
      report_type: "weekly",
      status: "pending",
      report_data: reportData,
    })

    // Create detailed weekly report
    await createWeeklyReport({
      report_id: report.id,
      outreach_preached: reportData.outreach?.preached || 0,
      outreach_saved: reportData.outreach?.saved || 0,
      outreach_filled: reportData.outreach?.filled || 0,
      follow_up_count: reportData.followUp || 0,
      visitation_count: reportData.visitation || 0,
    })

    // Create notification for admin
    await createNotification({
      type: "report_submitted",
      title: "New Weekly Report",
      message: `A new weekly report has been submitted`,
      data: { reportId: report.id, userId: decoded.userId, reportType: "weekly" },
    })

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: "Weekly report submitted successfully",
    })
  } catch (error) {
    console.error("Weekly report submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
