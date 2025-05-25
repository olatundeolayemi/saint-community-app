"use server"

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, adminId } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not found in environment variables")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert new user
    const newUsers = await sql`
      INSERT INTO users (email, password_hash, full_name, role, admin_id, profile_completed)
      VALUES (${email}, ${hashedPassword}, ${fullName}, 'user', ${adminId || null}, false)
      RETURNING id, email, full_name, role, profile_completed
    `

    const newUser = newUsers[0]

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role,
        profileCompleted: newUser.profile_completed,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
