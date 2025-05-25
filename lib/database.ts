import { neon } from "@neondatabase/serverless"

// Create a function to get the SQL client instead of creating it immediately
function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(process.env.DATABASE_URL)
}

export async function testConnection() {
  try {
    const sql = getSql()
    const result = await sql`SELECT 1 as test`
    console.log("Database connection successful:", result)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export interface User {
  id: string
  email: string
  password_hash: string
  full_name?: string
  phone?: string
  gender?: "male" | "female"
  date_of_birth?: string
  department?: string
  marital_status?: "single" | "married" | "divorced" | "widowed"
  prayer_group?: string
  year_joined?: number
  role: "user" | "admin" | "super_admin"
  admin_id?: string
  admin_role?: string
  profile_completed: boolean
  created_at: string
  updated_at: string
  last_active: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  is_global: boolean
  created_by: string
  banner_url?: string
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  user_id: string
  report_type: "daily" | "weekly" | "monthly"
  status: "pending" | "seen" | "reviewed"
  report_data: any
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
}

export interface Birthday {
  id: string
  user_id: string
  name: string
  birth_date: string
  age?: number
  created_at: string
}

export interface DailyReport {
  id: string
  report_id: string
  prayer_chain_from?: string
  prayer_chain_to?: string
  study_group_status?: string
  study_group_title?: string
  study_group_file_url?: string
  prayer_group_days?: string[]
  prayer_group_not_prayed: boolean
  prayer_group_reason?: string
  created_at: string
}

export interface DiscipleshipEntry {
  id: string
  daily_report_id: string
  name: string
  timeline?: string
  subject?: string
  has_bible: boolean
  did_write: boolean
  discussed_attendance: boolean
  created_at: string
}

export interface EvangelismEntry {
  id: string
  daily_report_id: string
  name: string
  address?: string
  phone?: string
  status?: "saved_and_filled" | "saved_only" | "not_yet_saved_and_filled"
  created_at: string
}

export interface HealingEntry {
  id: string
  daily_report_id: string
  name: string
  testimony?: string
  created_at: string
}

export interface WeeklyReport {
  id: string
  report_id: string
  outreach_preached: number
  outreach_saved: number
  outreach_filled: number
  follow_up_count: number
  visitation_count: number
  created_at: string
}

export interface GivingRecord {
  id: string
  user_id: string
  monthly_giving?: number
  other_giving?: number
  description?: string
  giving_month: string
  created_at: string
}

export interface Notification {
  id: string
  user_id?: string
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  created_at: string
}

// User operations
export async function createUser(userData: Partial<User>): Promise<User> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, phone, gender, date_of_birth, 
                      department, marital_status, prayer_group, year_joined, role, 
                      admin_id, admin_role, profile_completed)
    VALUES (${userData.email}, ${userData.password_hash}, ${userData.full_name}, 
            ${userData.phone}, ${userData.gender}, ${userData.date_of_birth},
            ${userData.department}, ${userData.marital_status}, ${userData.prayer_group},
            ${userData.year_joined}, ${userData.role}, ${userData.admin_id},
            ${userData.admin_role}, ${userData.profile_completed || false})
    RETURNING *
  `
  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return (result[0] as User) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return (result[0] as User) || null
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  const sql = getSql()
  const result = await sql`
    UPDATE users 
    SET full_name = ${userData.full_name}, 
        phone = ${userData.phone},
        gender = ${userData.gender},
        date_of_birth = ${userData.date_of_birth},
        department = ${userData.department},
        marital_status = ${userData.marital_status},
        prayer_group = ${userData.prayer_group},
        year_joined = ${userData.year_joined},
        admin_role = ${userData.admin_role},
        profile_completed = ${userData.profile_completed},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as User
}

export async function updateUserLastActive(id: string): Promise<void> {
  const sql = getSql()
  await sql`
    UPDATE users SET last_active = NOW() WHERE id = ${id}
  `
}

export async function getUsersByAdminId(adminId: string): Promise<User[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM users WHERE admin_id = ${adminId} ORDER BY created_at DESC
  `
  return result as User[]
}

export async function getAllAdmins(): Promise<User[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM users WHERE role IN ('admin', 'super_admin') ORDER BY created_at ASC
  `
  return result as User[]
}

// Event operations
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO events (title, description, event_date, is_global, created_by, banner_url)
    VALUES (${eventData.title}, ${eventData.description}, ${eventData.event_date},
            ${eventData.is_global}, ${eventData.created_by}, ${eventData.banner_url})
    RETURNING *
  `
  return result[0] as Event
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const sql = getSql()
  const result = await sql`
    SELECT e.*, u.full_name as creator_name
    FROM events e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.event_date >= CURRENT_DATE
    ORDER BY e.event_date ASC
    LIMIT 10
  `
  return result as Event[]
}

export async function getEventsByCreator(creatorId: string): Promise<Event[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM events WHERE created_by = ${creatorId} ORDER BY event_date DESC
  `
  return result as Event[]
}

// Birthday operations
export async function createBirthday(birthdayData: Partial<Birthday>): Promise<Birthday> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO birthdays (user_id, name, birth_date, age)
    VALUES (${birthdayData.user_id}, ${birthdayData.name}, 
            ${birthdayData.birth_date}, ${birthdayData.age})
    RETURNING *
  `
  return result[0] as Birthday
}

export async function getTodaysBirthdays(): Promise<Birthday[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM birthdays 
    WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
    ORDER BY name
  `
  return result as Birthday[]
}

export async function getUpcomingBirthdays(days = 7): Promise<Birthday[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM birthdays 
    WHERE birth_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
    ORDER BY birth_date
  `
  return result as Birthday[]
}

// Report operations
export async function createReport(reportData: Partial<Report>): Promise<Report> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO reports (user_id, report_type, status, report_data)
    VALUES (${reportData.user_id}, ${reportData.report_type}, 
            ${reportData.status || "pending"}, ${JSON.stringify(reportData.report_data)})
    RETURNING *
  `
  return result[0] as Report
}

export async function getReportsByUserId(userId: string): Promise<Report[]> {
  const sql = getSql()
  const result = await sql`
    SELECT r.*, u.full_name as user_name
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ${userId}
    ORDER BY r.submitted_at DESC
  `
  return result as Report[]
}

export async function getReportsByAdminId(adminId: string): Promise<Report[]> {
  const sql = getSql()
  const result = await sql`
    SELECT r.*, u.full_name as user_name
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE u.admin_id = ${adminId}
    ORDER BY r.submitted_at DESC
  `
  return result as Report[]
}

export async function getPendingReports(): Promise<Report[]> {
  const sql = getSql()
  const result = await sql`
    SELECT r.*, u.full_name as user_name
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.status = 'pending'
    ORDER BY r.submitted_at ASC
  `
  return result as Report[]
}

export async function updateReportStatus(reportId: string, status: string, reviewedBy?: string): Promise<Report> {
  const sql = getSql()
  const result = await sql`
    UPDATE reports 
    SET status = ${status}, 
        reviewed_at = ${status !== "pending" ? "NOW()" : null},
        reviewed_by = ${reviewedBy}
    WHERE id = ${reportId}
    RETURNING *
  `
  return result[0] as Report
}

// Daily report operations
export async function createDailyReport(dailyReportData: Partial<DailyReport>): Promise<DailyReport> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO daily_reports (report_id, prayer_chain_from, prayer_chain_to,
                              study_group_status, study_group_title, study_group_file_url,
                              prayer_group_days, prayer_group_not_prayed, prayer_group_reason)
    VALUES (${dailyReportData.report_id}, ${dailyReportData.prayer_chain_from},
            ${dailyReportData.prayer_chain_to}, ${dailyReportData.study_group_status},
            ${dailyReportData.study_group_title}, ${dailyReportData.study_group_file_url},
            ${dailyReportData.prayer_group_days}, ${dailyReportData.prayer_group_not_prayed},
            ${dailyReportData.prayer_group_reason})
    RETURNING *
  `
  return result[0] as DailyReport
}

export async function createDiscipleshipEntry(entryData: Partial<DiscipleshipEntry>): Promise<DiscipleshipEntry> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO discipleship_entries (daily_report_id, name, timeline, subject,
                                     has_bible, did_write, discussed_attendance)
    VALUES (${entryData.daily_report_id}, ${entryData.name}, ${entryData.timeline},
            ${entryData.subject}, ${entryData.has_bible}, ${entryData.did_write},
            ${entryData.discussed_attendance})
    RETURNING *
  `
  return result[0] as DiscipleshipEntry
}

export async function createEvangelismEntry(entryData: Partial<EvangelismEntry>): Promise<EvangelismEntry> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO evangelism_entries (daily_report_id, name, address, phone, status)
    VALUES (${entryData.daily_report_id}, ${entryData.name}, ${entryData.address},
            ${entryData.phone}, ${entryData.status})
    RETURNING *
  `
  return result[0] as EvangelismEntry
}

export async function createHealingEntry(entryData: Partial<HealingEntry>): Promise<HealingEntry> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO healing_entries (daily_report_id, name, testimony)
    VALUES (${entryData.daily_report_id}, ${entryData.name}, ${entryData.testimony})
    RETURNING *
  `
  return result[0] as HealingEntry
}

// Weekly report operations
export async function createWeeklyReport(weeklyReportData: Partial<WeeklyReport>): Promise<WeeklyReport> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO weekly_reports (report_id, outreach_preached, outreach_saved,
                               outreach_filled, follow_up_count, visitation_count)
    VALUES (${weeklyReportData.report_id}, ${weeklyReportData.outreach_preached},
            ${weeklyReportData.outreach_saved}, ${weeklyReportData.outreach_filled},
            ${weeklyReportData.follow_up_count}, ${weeklyReportData.visitation_count})
    RETURNING *
  `
  return result[0] as WeeklyReport
}

// Giving operations
export async function createGivingRecord(givingData: Partial<GivingRecord>): Promise<GivingRecord> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO giving_records (user_id, monthly_giving, other_giving, description, giving_month)
    VALUES (${givingData.user_id}, ${givingData.monthly_giving}, ${givingData.other_giving},
            ${givingData.description}, ${givingData.giving_month})
    RETURNING *
  `
  return result[0] as GivingRecord
}

export async function getGivingRecordsByUserId(userId: string): Promise<GivingRecord[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM giving_records WHERE user_id = ${userId} ORDER BY giving_month DESC
  `
  return result as GivingRecord[]
}

// Notification operations
export async function createNotification(notificationData: Partial<Notification>): Promise<Notification> {
  const sql = getSql()
  const result = await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (${notificationData.user_id}, ${notificationData.type}, 
            ${notificationData.title}, ${notificationData.message},
            ${JSON.stringify(notificationData.data)})
    RETURNING *
  `
  return result[0] as Notification
}

export async function getNotificationsByUserId(userId: string): Promise<Notification[]> {
  const sql = getSql()
  const result = await sql`
    SELECT * FROM notifications WHERE user_id = ${userId} OR user_id IS NULL
    ORDER BY created_at DESC LIMIT 50
  `
  return result as Notification[]
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const sql = getSql()
  await sql`
    UPDATE notifications SET read = true WHERE id = ${notificationId}
  `
}

// Statistics operations
export async function getUserStatistics(userId: string): Promise<any> {
  const sql = getSql()
  const result = await sql`
    SELECT 
      COUNT(CASE WHEN report_type = 'daily' THEN 1 END) as daily_reports,
      COUNT(CASE WHEN report_type = 'weekly' THEN 1 END) as weekly_reports,
      COUNT(CASE WHEN report_type = 'monthly' THEN 1 END) as monthly_reports,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reports,
      COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed_reports
    FROM reports 
    WHERE user_id = ${userId}
  `
  return result[0]
}

export async function getAdminStatistics(adminId: string): Promise<any> {
  const sql = getSql()
  const result = await sql`
    SELECT 
      COUNT(DISTINCT u.id) as total_members,
      COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_reports,
      COUNT(CASE WHEN r.report_type = 'daily' AND r.submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_daily_reports,
      COUNT(CASE WHEN e.event_date >= CURRENT_DATE THEN 1 END) as upcoming_events
    FROM users u
    LEFT JOIN reports r ON u.id = r.user_id
    LEFT JOIN events e ON e.created_by = ${adminId}
    WHERE u.admin_id = ${adminId}
  `
  return result[0]
}

export async function getGlobalStatistics(): Promise<any> {
  const sql = getSql()
  const result = await sql`
    SELECT 
      COUNT(DISTINCT u.id) as total_users,
      COUNT(DISTINCT CASE WHEN u.role IN ('admin', 'super_admin') THEN u.id END) as total_admins,
      COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_reports,
      COUNT(CASE WHEN r.submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_reports,
      COUNT(CASE WHEN e.event_date >= CURRENT_DATE THEN 1 END) as upcoming_events
    FROM users u
    LEFT JOIN reports r ON u.id = r.user_id
    LEFT JOIN events e ON e.is_global = true
  `
  return result[0]
}

// Session management for real-time features
export async function saveUserSession(userId: string, sessionData: any): Promise<void> {
  const sql = getSql()
  await sql`
    INSERT INTO user_sessions (user_id, session_data)
    VALUES (${userId}, ${JSON.stringify(sessionData)})
    ON CONFLICT (user_id) 
    DO UPDATE SET session_data = ${JSON.stringify(sessionData)}, last_updated = NOW()
  `
}

export async function getUserSession(userId: string): Promise<any> {
  const sql = getSql()
  const result = await sql`
    SELECT session_data FROM user_sessions 
    WHERE user_id = ${userId} AND expires_at > NOW()
  `
  return result[0]?.session_data || null
}

export async function clearExpiredSessions(): Promise<void> {
  const sql = getSql()
  await sql`
    DELETE FROM user_sessions WHERE expires_at <= NOW()
  `
}
