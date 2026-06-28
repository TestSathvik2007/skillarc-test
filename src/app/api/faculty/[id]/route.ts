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
      .select("role, institution_id")
      .eq("id", user.id)
      .single()

    if (profile?.role !== ROLES.INSTITUTION_ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, department_id } = body

    const { data: faculty, error } = await supabase
      .from("users")
      .update({ name })
      .eq("id", id)
      .eq("role", ROLES.FACULTY)
      .select()
      .single()

    if (error) throw error

    if (department_id) {
      const { error: deptError } = await supabase.from("departments_hierarchy").upsert([
        {
          user_id: id,
          department_id,
          role: ROLES.FACULTY,
        },
      ])
      if (deptError) throw deptError
    }

    return NextResponse.json(faculty)
  } catch (error) {
    console.error("Faculty update error:", error)
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

    const { error } = await supabase.from("users").delete().eq("id", id).eq("role", ROLES.FACULTY)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Faculty delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
