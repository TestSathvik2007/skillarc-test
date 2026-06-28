import { redirect } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { CourseProvider } from "@/modules/courses/course-context"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <CourseProvider>
      <div className="flex min-h-screen bg-[#f8f7ff] font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <main className="p-7 flex-1">
            {children}
          </main>
        </div>
      </div>
    </CourseProvider>
  )
}