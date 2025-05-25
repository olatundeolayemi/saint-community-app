"use server"

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not found in environment variables")
      return NextResponse.json({ error: "Database configuration error" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Find user by email
    const users = await sql`
      SELECT id, email, password_hash, full_name, role, profile_completed, admin_role
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profile_completed,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        profileCompleted: user.profile_completed,
        adminRole: user.admin_role,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
