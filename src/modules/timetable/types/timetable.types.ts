export interface Subject {
  id: string
  code: string
  name: string
  semester: number
  section_id: string | null
  faculty_id: string
  faculty_name?: string
  institution_id: string
  program_id?: string
}

export interface Faculty {
  id: string
  name: string
  email: string
  role: string
  used?: number
  total?: number
}

export interface Section {
  id: string
  name: string
  semester: number
  program_id?: string
  institution_id?: string
}

export interface TimeTableSlot {
  id?: string
  day: string
  period: string
  subject?: Subject
  section_id: string | null
  subject_id: string | null
  created_at?: string
  updated_at?: string
}

export interface Slot {
  day: string
  period: string
  subject?: Subject
  section?: Section
}