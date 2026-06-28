import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import InstitutionAdminDashboardClient from "./institution-admin-dashboard-client"
import { ROLES } from "@/constants/roles"

export default async function InstitutionAdminPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, institution_id, organization_id")
    .eq("id", user.id)
    .single()

  if (profile?.role !== ROLES.INSTITUTION_ADMIN) redirect("/auth/login")

  const { data: institution } = await supabase
    .from("institutions")
    .select("id, name, domain")
    .eq("id", profile.institution_id)
    .single()

  const { count: facultyCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("institution_id", profile.institution_id)
    .eq("role", ROLES.FACULTY)

  const { count: studentCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("institution_id", profile.institution_id)
    .eq("role", ROLES.STUDENT)

  const { count: courseCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true })
    .eq("institution_id", profile.institution_id)

  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, email, role, created_at")
    .eq("institution_id", profile.institution_id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <InstitutionAdminDashboardClient
      institution={institution}
      stats={{
        faculty: facultyCount ?? 0,
        students: studentCount ?? 0,
        courses: courseCount ?? 0,
      }}
      recentUsers={recentUsers ?? []}
    />
  )
}