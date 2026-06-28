"use client"

import { useRouter } from "next/navigation"

const font = "'Plus Jakarta Sans', 'DM Sans', sans-serif"

export default function Home() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f5f7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background decorative blobs */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100,
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,58,95,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 960,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}>

        {/* Top nav bar */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 72,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 17 }}>📅</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
              SkillArc
            </span>
          </div>

          {/* Nav actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => router.push("/auth/login")}
              style={{
                padding: "8px 18px", fontSize: 12, fontWeight: 600,
                color: "#374151", backgroundColor: "transparent",
                border: "1px solid #e5e7eb", borderRadius: 10,
                cursor: "pointer", fontFamily: font,
              }}
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/signup")}
              style={{
                padding: "8px 18px", fontSize: 12, fontWeight: 700,
                color: "#ffffff", backgroundColor: "#1d4ed8",
                border: "none", borderRadius: 10,
                cursor: "pointer", fontFamily: font,
              }}
            >
              Get started
            </button>
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", maxWidth: 640 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 999, padding: "5px 14px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#1d4ed8", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#1d4ed8", letterSpacing: "0.04em" }}>
              Now live — Academic LMS Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 900, color: "#111827",
            lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20,
          }}>
            Academic Operations,{" "}
            <span style={{
              background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Simplified.
            </span>
          </h1>

          <p style={{
            fontSize: 16, color: "#6b7280", lineHeight: 1.75,
            marginBottom: 36, maxWidth: 480, margin: "0 auto 36px",
          }}>
            Manage timetables, faculty workloads, and student schedules —
            all in one beautifully simple platform.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/signup")}
              style={{
                padding: "13px 28px", fontSize: 14, fontWeight: 700,
                color: "#ffffff", backgroundColor: "#1d4ed8",
                border: "none", borderRadius: 12,
                cursor: "pointer", fontFamily: font,
                boxShadow: "0 4px 14px rgba(29,78,216,0.35)",
              }}
            >
              Start for free →
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              style={{
                padding: "13px 28px", fontSize: 14, fontWeight: 600,
                color: "#374151", backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb", borderRadius: 12,
                cursor: "pointer", fontFamily: font,
              }}
            >
              Sign in to dashboard
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          width: "100%",
          marginTop: 72,
        }}>
          {[
            {
              icon: "🗓️",
              title: "Timetable Builder",
              desc: "Drag-and-drop schedule builder with conflict detection and live preview.",
              accent: "#dbeafe",
              accentText: "#1d4ed8",
            },
            {
              icon: "👨‍🏫",
              title: "Faculty Management",
              desc: "Track workloads, assign subjects, and manage faculty availability effortlessly.",
              accent: "#ede9fe",
              accentText: "#6d28d9",
            },
            {
              icon: "🎓",
              title: "Student Schedules",
              desc: "Auto-generate student timetables and share them instantly across batches.",
              accent: "#fef3c7",
              accentText: "#b45309",
            },
          ].map((card) => (
            <div key={card.title} style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #f3f4f6",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                backgroundColor: card.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14, fontSize: 18,
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 48 }}>
          Built for institutions · Trusted by educators · Powered by SkillArc
        </p>

      </div>
    </div>
  )
}