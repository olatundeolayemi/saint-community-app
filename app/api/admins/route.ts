"use server"

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not found in environment variables")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Only fetch users who are actually registered as admins with correct roles
    const admins = await sql`
      SELECT id, full_name, admin_role
      FROM users 
      WHERE role IN ('admin', 'super_admin') 
      AND admin_role IN ('pcf_pastor', 'cell_leader', 'fellowship_leader')
      AND profile_completed = true
      ORDER BY 
        CASE 
          WHEN admin_role = 'pcf_pastor' THEN 1
          WHEN admin_role = 'cell_leader' THEN 2  
          WHEN admin_role = 'fellowship_leader' THEN 3
          ELSE 4
        END,
        full_name
    `

    return NextResponse.json({ admins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
