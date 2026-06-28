import { createSupabaseServerClient } from "@/lib/supabase-server"
import { createSupabaseAdminClient } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"
import { ROLES } from "@/constants/roles"

const STUDENT_SELECT = `
  *,
  section:section_id(
    id,
    name,
    semester,
    program:program_id(
      id,
      name
    )
  )
`

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const institutionId = searchParams.get("institution_id")
    const page   = Math.max(1, Number(searchParams.get("page")  ?? 1))
    const limit  = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)))
    const from   = (page - 1) * limit
    const to     = from + limit - 1

    let query = supabase
      .from("users")
      .select(STUDENT_SELECT, { count: "exact" })
      .eq("role", ROLES.STUDENT)

    if (institutionId) query = query.eq("institution_id", institutionId)

    const { data, error, count } = await query
      .order("name")
      .range(from, to)

    if (error) throw error

    return NextResponse.json({ students: data, totalCount: count ?? 0, page, limit })
  } catch (error) {
    console.error("Student fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const supabaseAdmin = createSupabaseAdminClient()

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
    const { name, email, password, section_id, semester, program_id, institution_id } = body

    if (!name || !email || !section_id || !semester || !institution_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (institution_id !== profile.institution_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: password || Math.random().toString(36).slice(-12),
        email_confirm: true,
      })

    if (authError) throw authError

    const { data: student, error } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          role: ROLES.STUDENT,
          institution_id,
          section_id,
          semester,
          program_id: program_id || null,
        },
      ])
      .select(STUDENT_SELECT)
      .single()

    if (error) throw error

    return NextResponse.json(student)
  } catch (error) {
    console.error("Student creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}