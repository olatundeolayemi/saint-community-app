import { type NextRequest, NextResponse } from "next/server"
import {
  createReport,
  createDailyReport,
  createDiscipleshipEntry,
  createEvangelismEntry,
  createHealingEntry,
  createNotification,
} from "@/lib/database"
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

    // Create main report record in database
    const report = await createReport({
      user_id: decoded.userId,
      report_type: "daily",
      status: "pending",
      report_data: reportData,
    })

    // Create detailed daily report in database
    const dailyReport = await createDailyReport({
      report_id: report.id,
      prayer_chain_from: reportData.prayerChain?.fromTime,
      prayer_chain_to: reportData.prayerChain?.toTime,
      study_group_status: reportData.studyGroup?.status,
      study_group_title: reportData.studyGroup?.title,
      study_group_file_url: reportData.studyGroup?.fileUrl,
      prayer_group_days: reportData.prayerGroup?.days,
      prayer_group_not_prayed: reportData.prayerGroup?.notPrayed || false,
      prayer_group_reason: reportData.prayerGroup?.reason,
    })

    // Create discipleship entries in database
    if (reportData.discipleship && reportData.discipleship.length > 0) {
      for (const entry of reportData.discipleship) {
        await createDiscipleshipEntry({
          daily_report_id: dailyReport.id,
          name: entry.name,
          timeline: entry.timeline,
          subject: entry.subject,
          has_bible: entry.hasBible,
          did_write: entry.didWrite,
          discussed_attendance: entry.discussedAttendance,
        })
      }
    }

    // Create evangelism entries in database
    if (reportData.evangelism && reportData.evangelism.length > 0) {
      for (const entry of reportData.evangelism) {
        await createEvangelismEntry({
          daily_report_id: dailyReport.id,
          name: entry.name,
          address: entry.address,
          phone: entry.phone,
          status: entry.status,
        })
      }
    }

    // Create healing entries in database
    if (reportData.healing && reportData.healing.length > 0) {
      for (const entry of reportData.healing) {
        await createHealingEntry({
          daily_report_id: dailyReport.id,
          name: entry.name,
          testimony: entry.comment,
        })
      }
    }

    // Create notification for admin in database
    await createNotification({
      type: "report_submitted",
      title: "New Daily Report",
      message: `A new daily report has been submitted`,
      data: { reportId: report.id, userId: decoded.userId, reportType: "daily" },
    })

    return NextResponse.json({
      success: true,
      reportId: report.id,
      message: "Daily report submitted successfully to database",
    })
  } catch (error) {
    console.error("Daily report submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user's daily reports from database
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { getReportsByUserId } = await import("@/lib/database")
    const reports = await getReportsByUserId(decoded.userId)

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching daily reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
