import { UserProfile } from "@/modules/users/types"

export interface Student extends UserProfile {
  department_id: string | null
  program_id: string | null
  section_id: string | null
  semester: number | null
  phone?: string | null
  registration_number?: string | null
  admission_year?: number | null
}

export interface StudentWithSection extends Student {
  section?: {
    id: string
    name: string
    semester: number

    program?: {
      id: string
      name: string
    } | null
  } | null
}

export interface CreateStudentInput {
  name: string
  email: string
  password?: string
  section_id: string
  semester: number
  program_id?: string | null
  institution_id: string
  organization_id?: string | null
  phone?: string | null
  registration_number?: string | null
  admission_year?: number | null
}

export interface UpdateStudentInput {
  name?: string
  section_id?: string | null
  semester?: number
  program_id?: string | null
  phone?: string | null
  registration_number?: string | null
  admission_year?: number | null
}