import type { UserProfile } from "@/modules/users/types"

export interface Faculty extends UserProfile {
  id: string
  name: string
  email: string
  role: string
}

export interface FacultyWithStats extends Faculty {
  assignedSubjects?: number
  assignedSections?: number
}

export interface CreateFacultyInput {
  name: string
  email: string
  department_id?: string
  institution_id: string
  organization_id?: string
}

export interface UpdateFacultyInput {
  name?: string
  email?: string
  department_id?: string
}
