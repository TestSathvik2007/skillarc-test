import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import StudentPage from "./student-dashboard-client"
import { ROLES } from "@/constants/roles"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, institution_id, name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== ROLES.STUDENT) redirect("/dashboard")

  const { data: institution } = await supabase
    .from("institutions")
    .select("id, name")
    .eq("id", profile.institution_id)
    .single()

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, code, faculty_id, users(name)")
    .eq("institution_id", profile.institution_id)

  const formattedSubjects = (subjects ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    facultyName: s.users?.name ?? "Unassigned",
  }))

  return (
    <StudentPage
      student={{ name: profile.name ?? user.email ?? "Student", email: user.email ?? "", institution: institution?.name ?? "Institution" }}
      subjects={formattedSubjects}
    />
  )
}