import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants/roles"
import AttendanceClient from "./attendance-client"

export default async function AttendancePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, institution_id")
    .eq("id", user.id)
    .single()

  if (profile?.role !== ROLES.INSTITUTION_ADMIN) {
    redirect("/dashboard")
  }

  const institutionId = profile.institution_id

  const { data: programs = [] } = await supabase
    .from("programs")
    .select("id,name")
    .eq("institution_id", institutionId)
    .order("name")

  const { data: sections = [] } = await supabase
    .from("sections")
    .select("id,name,semester,program_id")
    .eq("institution_id", institutionId)
    .order("semester")

  const { data: subjects = [] } = await supabase
    .from("subjects")
    .select("id,name,code,semester")
    .eq("institution_id", institutionId)
    .order("semester")

  const {
    data: students,
    error: studentsError,
  } = await supabase
    .from("students")
    .select("*")
    .eq("institution_id", institutionId)

  console.log("Students Error:", studentsError)
  console.log("Students Data:", students)

  return (
    <AttendanceClient
      institutionId={institutionId}
      programs={programs ?? []}
      sections={sections ?? []}
      subjects={subjects ?? []}
      students={students ?? []}
    />
  )
}