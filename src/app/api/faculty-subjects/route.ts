import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { ROLES } from "@/constants/roles"

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()

  // Step 3 — Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  // Step 4 — Authorization
  const { data: profile } = await supabase
    .from("users")
    .select("role, institution_id")
    .eq("id", user.id)
    .single()

  if (profile?.role !== ROLES.INSTITUTION_ADMIN) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  // Step 5 — Read and validate the request
  const body = await request.json()

  const {
    facultyId,
    subjectIds,
  } = body

  if (
    !facultyId ||
    !Array.isArray(subjectIds)
  ) {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      {
        status: 400,
      }
    )
  }

  // Step 6 — Verify the faculty belongs to the same institution
  const { data: faculty } = await supabase
    .from("users")
    .select("institution_id")
    .eq("id", facultyId)
    .single()

  if (!faculty) {
    return NextResponse.json(
      { error: "Faculty not found" },
      { status: 404 }
    )
  }

  if (faculty.institution_id !== profile.institution_id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  // Step 7 — Verify every subject belongs to the same institution
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id")
    .eq("institution_id", profile.institution_id)
    .in("id", subjectIds)

  if ((subjects ?? []).length !== subjectIds.length) {
    return NextResponse.json(
      {
        error: "One or more subjects are invalid",
      },
      {
        status: 400,
      }
    )
  }

  // Step 8 — Replace assignments in the database

  // Delete existing assignments
  const { error: deleteError } = await supabase
    .from("faculty_subjects")
    .delete()
    .eq("institution_id", profile.institution_id)
    .eq("faculty_id", facultyId)

  if (deleteError) {
    throw deleteError
  }

  // Insert new assignments
  if (subjectIds.length > 0) {
    const rows = subjectIds.map((subjectId: string) => ({
      institution_id: profile.institution_id,
      faculty_id: facultyId,
      subject_id: subjectId,
    }))

    const { error: insertError } = await supabase
      .from("faculty_subjects")
      .insert(rows)

    if (insertError) {
      throw insertError
    }
  }

  return NextResponse.json({
    success: true,
  })
}