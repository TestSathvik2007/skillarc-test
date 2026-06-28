"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Loading...")

  useEffect(() => {
    async function handleAuth() {
      try {
        setStatus("Verifying invite link...")

        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error("❌ Callback session error:", error)
          setStatus("Error processing invite link")
          setTimeout(() => router.replace("/auth/login"), 2000)
          return
        }

        if (!session) {
          console.warn("⚠️ No session created from invite callback")
          setStatus("Setting up your account...")
          router.replace("/auth/set-password")
          return
        }

        console.log("✅ Invite callback session created for:", session.user?.email)
        setStatus("Redirecting...")
        router.replace("/auth/set-password")
      } catch (err) {
        console.error("❌ Auth callback error:", err)
        setStatus("An error occurred")
        setTimeout(() => router.replace("/auth/login"), 2000)
      }
    }
    
    handleAuth()
  }, [router])

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9fafb",
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
    }}>
      <div style={{
        textAlign: "center",
        padding: "24px",
      }}>
        <div style={{
          marginBottom: "16px",
          fontSize: "32px",
        }}>
          ⏳
        </div>
        <p style={{
          fontSize: "14px",
          color: "#6b7280",
          margin: "0",
        }}>
          {status}
        </p>
      </div>
    </div>
  )
}