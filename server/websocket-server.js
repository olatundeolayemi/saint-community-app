const WebSocket = require("ws")
const http = require("http")
const { neon } = require("@neondatabase/serverless")

// Create HTTP server
const server = http.createServer()
const wss = new WebSocket.Server({ server })

// Store connected clients
const clients = new Map()
const adminClients = new Map()
const userSessions = new Map()

// Database connection
const sql = neon(process.env.DATABASE_URL || "postgresql://localhost:5432/saint_community")

// Real-time data fetching functions
async function fetchRealTimeData() {
  try {
    // Fetch real birthdays
    const birthdays = await sql`
      SELECT b.*, u.full_name as name
      FROM birthdays b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE EXTRACT(MONTH FROM b.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(DAY FROM b.birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
      ORDER BY b.name
    `

    // Fetch real events
    const events = await sql`
      SELECT e.*, u.full_name as creator_name
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      WHERE e.event_date >= CURRENT_DATE
      ORDER BY e.event_date ASC
      LIMIT 10
    `

    // Fetch real reports
    const reports = await sql`
      SELECT r.*, u.full_name as user_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.submitted_at DESC
      LIMIT 50
    `

    // Fetch real members
    const members = await sql`
      SELECT id, full_name, email, role, admin_id, profile_completed, last_active
      FROM users
      WHERE role = 'user'
      ORDER BY last_active DESC
    `

    // Fetch real statistics
    const statistics = await sql`
      SELECT 
        COUNT(DISTINCT CASE WHEN role = 'user' THEN id END) as total_members,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN r.submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_reports,
        COUNT(CASE WHEN e.event_date >= CURRENT_DATE THEN 1 END) as upcoming_events
      FROM users u
      LEFT JOIN reports r ON u.id = r.user_id
      LEFT JOIN events e ON e.is_global = true
    `

    return {
      birthdays,
      events,
      reports,
      members,
      statistics: statistics[0] || {
        total_members: 0,
        pending_reports: 0,
        weekly_reports: 0,
        upcoming_events: 0,
      },
    }
  } catch (error) {
    console.error("Error fetching real-time data:", error)
    return {
      birthdays: [],
      events: [],
      reports: [],
      members: [],
      statistics: {
        total_members: 0,
        pending_reports: 0,
        weekly_reports: 0,
        upcoming_events: 0,
      },
    }
  }
}

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const userId = url.searchParams.get("userId")
  const role = url.searchParams.get("role")

  console.log(`New connection: ${userId} (${role})`)

  // Store client connection
  clients.set(userId, { ws, role, userId })

  if (role === "admin" || role === "super_admin") {
    adminClients.set(userId, { ws, role, userId })
  }

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message)
      await handleMessage(data, userId, role)
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  })

  ws.on("close", () => {
    console.log(`Connection closed: ${userId}`)
    clients.delete(userId)
    adminClients.delete(userId)
    userSessions.delete(userId)
  })

  // Send initial real data
  fetchRealTimeData().then((realData) => {
    ws.send(
      JSON.stringify({
        type: "initial_data",
        data: realData,
        timestamp: Date.now(),
      }),
    )
  })
})

async function handleMessage(data, userId, role) {
  switch (data.type) {
    case "auth":
      await handleAuth(data, userId, role)
      break

    case "daily_report_submitted":
      await handleDailyReportSubmission(data, userId)
      break

    case "field_update":
      await handleFieldUpdate(data, userId)
      break

    case "auto_save_daily_report":
      await handleAutoSave(data, userId)
      break

    case "new_event":
      await handleNewEvent(data, userId, role)
      break

    case "birthday_update":
      await handleBirthdayUpdate(data)
      break

    case "member_joined":
      await handleMemberJoined(data, userId)
      break

    case "request_initial_data":
      await sendInitialData(userId)
      break

    default:
      console.log("Unknown message type:", data.type)
  }
}

async function handleAuth(data, userId, role) {
  console.log(`User authenticated: ${userId} (${role})`)

  // Update user's last active timestamp
  try {
    await sql`
      UPDATE users SET last_active = NOW() WHERE id = ${userId}
    `
  } catch (error) {
    console.error("Error updating last active:", error)
  }

  // Send welcome message
  const client = clients.get(userId)
  if (client) {
    client.ws.send(
      JSON.stringify({
        type: "auth_success",
        data: { message: "Connected to real-time services" },
        timestamp: Date.now(),
      }),
    )
  }
}

async function handleDailyReportSubmission(data, userId) {
  try {
    // Insert real report into database
    const reportResult = await sql`
      INSERT INTO reports (user_id, report_type, status, report_data)
      VALUES (${userId}, 'daily', 'pending', ${JSON.stringify(data.data.reportData)})
      RETURNING id
    `

    const reportId = reportResult[0].id

    // Insert daily report details
    await sql`
      INSERT INTO daily_reports (
        report_id, prayer_chain_from, prayer_chain_to,
        study_group_status, study_group_title, study_group_file_url,
        prayer_group_days, prayer_group_not_prayed, prayer_group_reason
      )
      VALUES (
        ${reportId}, 
        ${data.data.reportData.prayerChain?.fromTime || null},
        ${data.data.reportData.prayerChain?.toTime || null},
        ${data.data.reportData.studyGroup?.status || null},
        ${data.data.reportData.studyGroup?.title || null},
        ${data.data.reportData.studyGroup?.fileUrl || null},
        ${data.data.reportData.prayerGroup?.days || []},
        ${data.data.reportData.prayerGroup?.notPrayed || false},
        ${data.data.reportData.prayerGroup?.reason || null}
      )
      RETURNING id
    `

    // Notify all admins about new report
    adminClients.forEach((client) => {
      client.ws.send(
        JSON.stringify({
          type: "report_submitted",
          data: {
            userName: data.data.userName,
            reportType: "daily",
            userId: userId,
            reportId: reportId,
          },
          timestamp: Date.now(),
        }),
      )
    })

    // Broadcast updated data to all clients
    const updatedData = await fetchRealTimeData()
    broadcastToAll({
      type: "new_report_submitted",
      data: updatedData,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error handling daily report submission:", error)
  }
}

async function handleFieldUpdate(data, userId) {
  // Store field update in user session
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {})
  }

  const session = userSessions.get(userId)
  session[data.data.field] = data.data.value

  // Save to database session table
  try {
    await sql`
      INSERT INTO user_sessions (user_id, session_data)
      VALUES (${userId}, ${JSON.stringify(session)})
      ON CONFLICT (user_id) 
      DO UPDATE SET session_data = ${JSON.stringify(session)}, last_updated = NOW()
    `
  } catch (error) {
    console.error("Error saving session data:", error)
  }

  // Broadcast field updates to admins for real-time monitoring
  adminClients.forEach((client) => {
    client.ws.send(
      JSON.stringify({
        type: "user_field_update",
        data: {
          userId: userId,
          field: data.data.field,
          value: data.data.value,
        },
        timestamp: Date.now(),
      }),
    )
  })
}

async function handleAutoSave(data, userId) {
  // Store auto-saved data in database
  try {
    await sql`
      INSERT INTO user_sessions (user_id, session_data)
      VALUES (${userId}, ${JSON.stringify(data.data)})
      ON CONFLICT (user_id) 
      DO UPDATE SET session_data = ${JSON.stringify(data.data)}, last_updated = NOW()
    `

    console.log(`Auto-saved data for user ${userId}`)
  } catch (error) {
    console.error("Error auto-saving data:", error)
  }
}

async function handleNewEvent(data, userId, role) {
  try {
    // Insert real event into database
    const eventResult = await sql`
      INSERT INTO events (title, description, event_date, is_global, created_by, banner_url)
      VALUES (
        ${data.data.title},
        ${data.data.description},
        ${data.data.date},
        ${role === "super_admin"},
        ${userId},
        ${data.data.banner || null}
      )
      RETURNING *
    `

    const newEvent = eventResult[0]

    // Create notification
    await sql`
      INSERT INTO notifications (type, title, message, data)
      VALUES (
        'new_event',
        'New Event Created',
        ${`${data.data.title} has been scheduled for ${data.data.date}`},
        ${JSON.stringify({ eventId: newEvent.id, isGlobal: newEvent.is_global })}
      )
    `

    // Broadcast event based on scope
    const updatedData = await fetchRealTimeData()
    broadcastToAll({
      type: "new_event",
      data: newEvent,
      timestamp: Date.now(),
    })

    broadcastToAll({
      type: "event_update",
      data: updatedData.events,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error handling new event:", error)
  }
}

async function handleBirthdayUpdate(data) {
  try {
    // Update birthdays in database
    for (const birthday of data.data) {
      await sql`
        INSERT INTO birthdays (user_id, name, birth_date, age)
        VALUES (${birthday.userId}, ${birthday.name}, ${birthday.date}, ${birthday.age})
        ON CONFLICT (user_id) 
        DO UPDATE SET name = ${birthday.name}, birth_date = ${birthday.date}, age = ${birthday.age}
      `
    }

    // Fetch updated birthdays
    const updatedData = await fetchRealTimeData()

    // Broadcast birthday updates
    broadcastToAll({
      type: "birthday_update",
      data: updatedData.birthdays,
      timestamp: Date.now(),
    })

    // Send birthday notifications for today's birthdays
    updatedData.birthdays.forEach((birthday) => {
      broadcastToAll({
        type: "birthday_notification",
        data: birthday,
        timestamp: Date.now(),
      })
    })
  } catch (error) {
    console.error("Error handling birthday update:", error)
  }
}

async function handleMemberJoined(data, userId) {
  try {
    // Update user profile completion
    await sql`
      UPDATE users 
      SET profile_completed = true, last_active = NOW()
      WHERE id = ${userId}
    `

    // Create notification for admin
    await sql`
      INSERT INTO notifications (type, title, message, data)
      VALUES (
        'member_joined',
        'New Member Joined',
        ${`${data.data.name} has completed their profile`},
        ${JSON.stringify({ userId: userId, adminId: data.data.adminId })}
      )
    `

    // Notify the assigned admin
    const adminClient = clients.get(data.data.adminId)
    if (adminClient) {
      adminClient.ws.send(
        JSON.stringify({
          type: "member_joined",
          data: {
            name: data.data.name,
            adminId: data.data.adminId,
          },
          timestamp: Date.now(),
        }),
      )
    }

    // Broadcast updated data
    const updatedData = await fetchRealTimeData()
    broadcastToAll({
      type: "new_member_joined",
      data: updatedData,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error handling member joined:", error)
  }
}

async function sendInitialData(userId) {
  try {
    const realData = await fetchRealTimeData()
    const client = clients.get(userId)
    if (client) {
      client.ws.send(
        JSON.stringify({
          type: "initial_data",
          data: realData,
          timestamp: Date.now(),
        }),
      )
    }
  } catch (error) {
    console.error("Error sending initial data:", error)
  }
}

function broadcastToAll(message) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message))
    }
  })
}

function broadcastToAdmins(message) {
  adminClients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message))
    }
  })
}

// Periodic real-time updates from database
setInterval(async () => {
  try {
    const realData = await fetchRealTimeData()

    // Broadcast updated statistics
    broadcastToAll({
      type: "statistics_update",
      data: realData.statistics,
      timestamp: Date.now(),
    })

    // Check for new data and broadcast if changed
    broadcastToAll({
      type: "refresh_data",
      data: realData,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error in periodic update:", error)
  }
}, 30000) // Every 30 seconds

// Start server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Real-time WebSocket server running on port ${PORT}`)
  console.log("Connected to database:", process.env.DATABASE_URL ? "✓" : "✗")
})

module.exports = { server, wss }
