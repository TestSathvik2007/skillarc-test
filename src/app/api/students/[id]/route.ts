import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"
import { ROLES } from "@/constants/roles"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== ROLES.INSTITUTION_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, section_id, semester, program_id } = body

    const { data: student, error } = await supabase
      .from("users")
      .update({
        name,
        section_id,
        semester,
        program_id: program_id || null,
      })
      .eq("id", id)
      .eq("role", ROLES.STUDENT)
      .select("*, section:section_id(id, name, semester, program_id)")
      .single()

    if (error) throw error

    return NextResponse.json(student)
  } catch (error) {
    console.error("Student update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== ROLES.INSTITUTION_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .eq("role", ROLES.STUDENT)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Student delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
