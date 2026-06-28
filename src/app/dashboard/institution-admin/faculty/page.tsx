import { createSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { FacultyClientPage } from "./faculty-client"
import { ROLES } from "@/constants/roles"

export default async function FacultyPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (userProfile?.role !== ROLES.INSTITUTION_ADMIN) {
    redirect("/dashboard")
  }

  const institutionId = userProfile.institution_id

  // Fetch faculty with department name joined
  const { data: faculty = [] } = await supabase
    .from("users")
    .select(`
      *,
      department:department_id(
        id,
        name
      )
    `)
    .eq("institution_id", institutionId)
    .eq("role", ROLES.FACULTY)
    .order("name")

  // Fetch subject assignments to count per faculty
  const { data: subjects = [] } = await supabase
    .from("subjects")
    .select("id, faculty_id")
    .eq("institution_id", institutionId)

  // Fetch section advisor assignments to count per faculty
  const { data: sections = [] } = await supabase
    .from("sections")
    .select("id, faculty_advisor_id")
    .eq("institution_id", institutionId)

  // Build stats per faculty member
  const facultyWithStats = faculty.map((f) => ({
    ...f,
    assignedSubjects: subjects.filter((s) => s.faculty_id === f.id).length,
    assignedSections: sections.filter((s) => s.faculty_advisor_id === f.id).length,
  }))

  // Fetch departments for create/edit dialog
  const { data: departments = [] } = await supabase
    .from("departments")
    .select("id, name")
    .eq("institution_id", institutionId)
    .order("name")

  return (
    <FacultyClientPage
      initialFaculty={facultyWithStats}
      departments={departments || []}
      institutionId={institutionId}
    />
  )
}