import { UserProfile } from "@/modules/users/types"

export interface Parent extends UserProfile {
  section_id: null
  semester: null
}

export interface CreateParentInput {
  name: string
  email: string
  password?: string
  institution_id: string
  organization_id?: string | null
}

export interface UpdateParentInput {
  name?: string
}
