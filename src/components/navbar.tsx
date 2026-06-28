"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("name, role")
          .eq("id", user.id)
          .single()
        if (data) {
          setProfile({
            name: data.name ?? user.email?.split("@")[0] ?? "User",
            role: data.role ?? "User",
          })
        } else {
          setProfile({
            name: user.email?.split("@")[0] ?? "User",
            role: "User",
          })
        }
      }
    }
    getProfile()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function handleLogout() {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const notifications = [
    { id: 1, text: "New assignment submitted by Alex R.", time: "2m ago", unread: true },
    { id: 2, text: "Course 'DAA' timetable updated.", time: "1h ago", unread: true },
    { id: 3, text: "3 students enrolled in WT batch.", time: "3h ago", unread: false },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700&display=swap');

        .navbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          border: 1px solid #ede9fe;
          border-radius: 10px;
          padding: 7px 14px;
          transition: all 0.18s;
        }
        .navbar-search:focus-within {
          border-color: #a78bfa;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.12);
        }
        .navbar-search input {
          border: none; outline: none; background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #374151; width: 200px;
        }
        .navbar-search input::placeholder { color: #c4b5fd; }

        .icon-btn {
          position: relative;
          width: 38px; height: 38px;
          background: #fff;
          border: 1px solid #ede9fe;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .icon-btn:hover { background: #f0efff; border-color: #c4b5fd; }
        .icon-btn.active { background: #f0efff; border-color: #a78bfa; }

        .pulse-dot {
          width: 7px; height: 7px;
          background: #ec4899;
          border-radius: 50%;
          position: absolute; top: 7px; right: 7px;
          border: 1.5px solid #fff;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border: 1px solid #ede9fe;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(79,70,229,0.12);
          z-index: 100;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          font-size: 13px; font-weight: 500;
          color: #374151;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.12s;
          white-space: nowrap;
          border: none; background: transparent; width: 100%; text-align: left;
        }
        .dropdown-item:hover { background: #f5f3ff; color: #4f46e5; }
        .dropdown-item.danger:hover { background: #fff1f2; color: #ef4444; }

        .avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px;
          background: #fff;
          border: 1px solid #ede9fe;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .avatar-btn:hover { background: #f5f3ff; border-color: #c4b5fd; }
        .avatar-btn.open { background: #f5f3ff; border-color: #a78bfa; }
      `}</style>

      <header style={{
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #ede9fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0, zIndex: 10,
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Left — page title */}
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 17,
            color: "#1e1b4b", letterSpacing: "-0.3px", lineHeight: 1.2,
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 11, color: "#a78bfa", marginTop: 1 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Search */}
          <div className="navbar-search">
            <Search size={13} color="#c4b5fd" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything…"
            />
          </div>

          {/* Notifications */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <div
              className={`icon-btn${notifOpen ? " active" : ""}`}
              onClick={() => { setNotifOpen(p => !p); setDropdownOpen(false) }}
            >
              <Bell size={15} color="#6b7280" />
              <span className="pulse-dot" />
            </div>

            {notifOpen && (
              <div className="dropdown" style={{ width: 300 }}>
                <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #f3f0ff" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1e1b4b" }}>Notifications</p>
                </div>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: "10px 16px",
                    display: "flex", gap: 10, alignItems: "flex-start",
                    borderBottom: "1px solid #faf5ff",
                    background: n.unread ? "#fdfbff" : "#fff",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f5f3ff")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "#fdfbff" : "#fff")}
                  >
                    {n.unread && (
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", flexShrink: 0, marginTop: 4 }} />
                    )}
                    <div style={{ flex: 1, paddingLeft: n.unread ? 0 : 13 }}>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.45 }}>{n.text}</p>
                      <p style={{ fontSize: 11, color: "#a78bfa", marginTop: 2 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "8px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#a78bfa", cursor: "pointer", fontWeight: 600 }}>
                    View all notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Avatar + dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <div
              className={`avatar-btn${dropdownOpen ? " open" : ""}`}
              onClick={() => { setDropdownOpen(p => !p); setNotifOpen(false) }}
            >
              <div style={{
                width: 30, height: 30,
                background: "linear-gradient(135deg, #4f46e5, #a78bfa)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 700,
              }}>
                {profile ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "U"}
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#1e1b4b", lineHeight: 1.2 }}>{profile ? profile.name : "Loading..."}</p>
                <p style={{ fontSize: 10, color: "#a78bfa", textTransform: "capitalize" }}>{profile ? profile.role.replace(/_/g, " ") : "Loading..."}</p>
              </div>
              <ChevronDown
                size={13} color="#9ca3af"
                style={{ transition: "transform 0.15s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </div>

            {dropdownOpen && (
              <div className="dropdown" style={{ width: 180 }}>
                <button className="dropdown-item" onClick={() => { router.push("/dashboard/settings"); setDropdownOpen(false) }}>
                  <User size={14} color="#a78bfa" />
                  My Profile
                </button>
                <button className="dropdown-item" onClick={() => { router.push("/dashboard/settings"); setDropdownOpen(false) }}>
                  <Settings size={14} color="#a78bfa" />
                  Settings
                </button>
                <div style={{ height: 1, background: "#f3f0ff", margin: "4px 0" }} />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={14} color="#f87171" />
                  Log out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  )
}