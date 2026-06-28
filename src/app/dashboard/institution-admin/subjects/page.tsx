import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ROLES } from "@/constants/roles"
import { SubjectsClientPage } from "./subjects-client"

export default async function SubjectsPage() {
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

  const { data: subjects = [] } = await supabase
    .from("subjects")
    .select(`
      *,
      faculty:faculty_id(id,name,email),
      section:section_id(id,name),
      program:program_id(id,name)
    `)
    .eq("institution_id", institutionId)

  const { data: programs = [] } = await supabase
    .from("programs")
    .select("id,name")
    .eq("institution_id", institutionId)

  const { data: sections = [] } = await supabase
    .from("sections")
    .select("id,name,semester,program_id")  // ← added semester + program_id
    .eq("institution_id", institutionId)

  const { data: faculty = [] } = await supabase
    .from("users")
    .select("id,name,email")
    .eq("institution_id", institutionId)
    .eq("role", ROLES.FACULTY)

  return (
    <SubjectsClientPage
      initialSubjects={subjects}
      programs={programs}
      sections={sections}
      faculty={faculty}
      institutionId={institutionId}
    />
  )
}