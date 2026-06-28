"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, GraduationCap, Clock, Award, Calendar, CheckCircle2, ChevronRight, Activity } from "lucide-react"

const font = "'Plus Jakarta Sans', 'DM Sans', sans-serif"

interface Subject {
  id: string
  name: string
  code: string
  facultyName: string
}

export default function StudentPage({
  student,
  subjects,
}: {
  student: { name: string; email: string; institution: string }
  subjects: Subject[]
}) {
  const router = useRouter()

  // High-fidelity mock metrics & visual timetable schedule
  const [stats] = useState({
    attendanceRate: 96,
    completedAssignments: 14,
    pendingTasks: 2,
    todaySchedule: [
      { period: "P1", time: "09:00 - 10:00", code: "DAA", name: "Design & Analysis of Algorithms", room: "Room 402", instructor: "Dr. Grace Hopper" },
      { period: "P2", time: "10:15 - 11:15", code: "DCN", name: "Data Communication & Networking", room: "Room 402", instructor: "Dr. Grace Hopper" },
      { period: "P3", time: "11:30 - 12:30", code: "WT", name: "Web Technologies", room: "Lab 3B", instructor: "Prof. Richard Feynman" },
      { period: "P4", time: "14:00 - 15:00", code: "TOC", name: "Theory of Computation", room: "Room 101", instructor: "Dr. Alan Turing" },
    ]
  })

  return (
    <div style={{ fontFamily: font, maxWidth: 960, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: "#fff", borderRadius: 16, padding: "20px 24px",
        border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em" }}>
              Student Hub
            </h1>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
              {student.institution} &nbsp;·&nbsp; Welcome, <strong>{student.name}</strong> 👋
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/timetable-builder")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10, border: "none",
            backgroundColor: "#4f46e5", color: "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font,
          }}
        >
          <Calendar size={13} /> View Timetable Grid
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "My Attendance Rate", value: `${stats.attendanceRate}%`, accent: "#d1fae5", text: "#065f46", icon: <Activity size={17} color="#065f46" /> },
          { label: "Tasks Completed", value: stats.completedAssignments, accent: "#dbeafe", text: "#1d4ed8", icon: <CheckCircle2 size={17} color="#1d4ed8" /> },
          { label: "Total Subjects Enrolled", value: subjects.length, accent: "#ede9fe", text: "#6d28d9", icon: <BookOpen size={17} color="#6d28d9" /> },
        ].map(s => (
          <div key={s.label} style={{
            backgroundColor: "#fff", borderRadius: 14, padding: "16px 20px",
            border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, backgroundColor: s.accent,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: s.text, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule and Enrolled Subjects Split Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        
        {/* Left Column: Today's Visual Schedule */}
        <div style={{
          backgroundColor: "#fff", borderRadius: 16, padding: 24,
          border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Today's Classes Schedule</h2>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>A high-fidelity layout representing class period slots today</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stats.todaySchedule.map((c, idx) => (
              <div key={c.period} style={{
                border: "1px solid #f3f4f6", borderRadius: 14, padding: 14,
                display: "flex", gap: 14, alignItems: "center",
                backgroundColor: "#fafafa",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "linear-gradient(135deg, #e0e7ff, #bfdbfe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#4f46e5", flexShrink: 0,
                }}>
                  {c.period}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{c.code} - {c.name}</h3>
                    <span style={{ fontSize: 10, color: "#9ca3af", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Clock size={11} /> {c.time}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>
                      Instructor: <strong>{c.instructor}</strong>
                    </p>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      backgroundColor: "#e0f2fe", color: "#0369a1",
                    }}>{c.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Enrolled Courses */}
        <div style={{
          backgroundColor: "#fff", borderRadius: 16, padding: 24,
          border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>My Enrolled Courses</h2>
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Core curricular subjects assigned in this term</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "360px", overflowY: "auto", paddingRight: 4 }}>
            {subjects.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 0",
                border: "1.5px dashed #e5e7eb", borderRadius: 12,
              }}>
                <p style={{ fontSize: 13, color: "#9ca3af" }}>No assigned courses yet</p>
                <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 4 }}>Check with department head.</p>
              </div>
            ) : (
              subjects.map(su => (
                <div key={su.id} style={{
                  border: "1px solid #f3f4f6", borderRadius: 12, padding: "10px 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "#fff",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, backgroundColor: "#ede9fe",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13,
                    }}>
                      📘
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{su.name}</p>
                      <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{su.code} &nbsp;·&nbsp; {su.facultyName}</p>
                    </div>
                  </div>
                  <ChevronRight size={13} color="#d1d5db" />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}