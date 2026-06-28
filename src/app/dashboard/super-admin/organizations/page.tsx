// app/dashboard/super-admin/organizations/page.tsx

import { createSupabaseServerClient } from "@/lib/supabase-server"
import OrganizationsClient from "./organizations-client"
import { createOrganization, deleteOrganization, editOrganization } from "../actions"

export default async function OrganizationsPage() {
  const supabase = await createSupabaseServerClient()

  // Query 1: orgs with institution counts
  const { data: organizationsRaw, error: orgError } = await supabase
    .from("organizations")
    .select(`
      id,
      name,
      created_at,
      institutions(count)
    `)
    .order("created_at", { ascending: false })

  if (orgError) console.error("Org fetch error:", orgError.message, orgError.details, orgError.hint)

  // Query 2: admin counts per org — adjust table + column names to match yours
  const { data: adminCounts, error: adminError } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("role", "org_admin")

  if (adminError) console.error("Admin count error:", adminError.message, adminError.details, adminError.hint)

  console.log("organizationsRaw:", JSON.stringify(organizationsRaw, null, 2))
  console.log("adminCounts:", JSON.stringify(adminCounts, null, 2))

  // Build a map: org_id → admin count
  const adminCountMap: Record<string, number> = {}
  for (const row of adminCounts ?? []) {
    if (row.organization_id) {
      adminCountMap[row.organization_id] = (adminCountMap[row.organization_id] ?? 0) + 1
    }
  }

  const organizations =
    organizationsRaw?.map((org: any) => ({
      id: org.id,
      name: org.name,
      created_at: org.created_at,
      institution_count: org.institutions?.[0]?.count ?? 0,
      admin_count: adminCountMap[org.id] ?? 0,
    })) ?? []

  return (
    <OrganizationsClient
      organizations={organizations}
      onCreateOrg={createOrganization}
      onDeleteOrg={deleteOrganization}
      onEditOrg={editOrganization}
    />
  )
}