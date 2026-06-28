import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ROLES } from "@/constants/roles"
import { DASHBOARD_ROUTES } from "@/constants/routes"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, institution_id, organization_id")
    .eq("id", user.id)
    .maybeSingle()

  const role = profile?.role

  const roleRedirects: Record<string, string> = {
    [ROLES.SUPER_ADMIN]:       DASHBOARD_ROUTES.SUPER_ADMIN,
    [ROLES.ORG_ADMIN]:         DASHBOARD_ROUTES.ORG_ADMIN,
    [ROLES.INSTITUTION_ADMIN]: DASHBOARD_ROUTES.INSTITUTION_ADMIN,
    [ROLES.HOD]:               DASHBOARD_ROUTES.HOD,
    [ROLES.PROGRAM_HEAD]:      DASHBOARD_ROUTES.PROGRAM_HEAD,
    [ROLES.FACULTY]:           DASHBOARD_ROUTES.FACULTY,
    [ROLES.STUDENT]:           DASHBOARD_ROUTES.STUDENT,
    [ROLES.PARENT]:            DASHBOARD_ROUTES.PARENT,
  }

  const destination = role ? roleRedirects[role] : null

  if (!destination) {
    return (
      <pre style={{ padding: "1rem", whiteSpace: "pre-wrap" }}>
        {JSON.stringify({ userId: user.id, userEmail: user.email, profile, role }, null, 2)}
      </pre>
    )
  }

  redirect(destination)
}