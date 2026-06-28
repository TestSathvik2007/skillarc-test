import { supabase } from "@/lib/supabase"
import { ROLES } from "@/constants/roles"

export const timetableService = {
  async getCurrentInstitutionId() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error("User not authenticated")
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("institution_id")
      .eq("id", user.id)
      .single()

    if (error) throw error

    console.log("Current User:", user)
    console.log("Profile:", profile)
    console.log("Institution ID:", profile.institution_id)

    return profile.institution_id
  },

  async getSubjects(
    institutionId: string,
    semester?: number
  ) {
    const { data, error } = await supabase
      .from("subjects")
      .select(`
        id,
        name,
        code,
        semester,
        institution_id,
        faculty_id,
        users(name)
      `)
      .eq("institution_id", institutionId)
      .eq("semester", semester)

    if (error) throw error

    console.log("Subjects:", data)
    console.log("Semester:", semester)
    console.log("Institution:", institutionId)

    return (data ?? []).map((s: any) => ({
      ...s,
      faculty_name: s.users?.name ?? "Unassigned",
    }))
  },

  async getFaculty(institutionId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,email,role")
      .eq("institution_id", institutionId)
      .eq("role", ROLES.FACULTY)

    if (error) throw error

    return data ?? []
  },

  async getSlots(
    institutionId: string,
    sectionId: string,
    semester: number
  ) {
    const { data, error } = await supabase
      .from("timetable_slots")
      .select(`
        day,
        period,
        subject_id,
        subjects(
          id,
          name,
          code,
          semester,
          institution_id,
          faculty_id
        )
      `)
      .eq("institution_id", institutionId)
      .eq("section_id", sectionId)
      .eq("semester", semester)

    if (error) throw error

    return (data ?? []).map((s: any) => ({
      day: s.day,
      period: `P${s.period}`,
      subject: s.subjects,
    }))
  },

  async saveSlot({
    institutionId,
    sectionId,
    semester,
    day,
    period,
    subjectId,
    facultyId,
  }: {
    institutionId: string
    sectionId: string
    semester: number
    day: string
    period: number
    subjectId: string
    facultyId?: string | null
  }) {
    const { error } = await supabase
      .from("timetable_slots")
      .upsert(
        {
          institution_id: institutionId,
          section_id: sectionId,
          semester,
          day,
          period,
          subject_id: subjectId,
          faculty_id: facultyId ?? null,
        },
        {
          onConflict: "institution_id,section_id,semester,day,period",
        }
      )

    if (error) throw error
  },
}