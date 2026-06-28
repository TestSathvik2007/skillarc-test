"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StudentList } from "@/components/students/student-list"
import { CreateStudentDialog } from "@/components/students/create-student-dialog"
import { useToast } from "@/components/ui/use-toast"
import StudentSearch from "@/modules/students/components/StudentSearch"
import StudentFilters from "@/modules/students/components/StudentFilters"
import StudentDrawer from "@/modules/students/components/StudentDrawer"
import type { StudentWithSection, CreateStudentInput, UpdateStudentInput } from "@/modules/students"

const ROWS_OPTIONS = [10, 25, 50, 100] as const

interface StudentsClientPageProps {
  initialStudents: StudentWithSection[]
  initialTotalCount: number
  sections: Array<{ id: string; name: string; semester: number; program_id: string }>
  programs: Array<{ id: string; name: string }>
  institutionId: string
}

export function StudentsClientPage({
  initialStudents,
  initialTotalCount,
  sections,
  programs,
  institutionId,
}: StudentsClientPageProps) {
  const [students, setStudents]       = useState<StudentWithSection[]>(initialStudents)
  const [totalCount, setTotalCount]   = useState(initialTotalCount)
  const [page, setPage]               = useState(1)
  const [limit, setLimit]             = useState<number>(25)

  const [search, setSearch]                   = useState("")
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  const [isOpen, setIsOpen]           = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentWithSection | null>(null)
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const { toast } = useToast()

  // ── Fetch page from server ──────────────────────────────────────────────
  const loadStudents = useCallback(async (targetPage = page, targetLimit = limit) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        institution_id: institutionId,
        page: String(targetPage),
        limit: String(targetLimit),
      })
      const response = await fetch(`/api/students?${params}`)
      if (!response.ok) throw new Error("Failed to load students")
      const data = await response.json()
      setStudents(data.students)
      setTotalCount(data.totalCount)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load students",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [institutionId, page, limit, toast])

  // Re-fetch whenever page or limit changes
  useEffect(() => {
    loadStudents(page, limit)
  }, [page, limit]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pagination helpers ──────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(totalCount / limit))
  const rangeFrom   = totalCount === 0 ? 0 : (page - 1) * limit + 1
  const rangeTo     = Math.min(page * limit, totalCount)

  function handleLimitChange(newLimit: number) {
    setLimit(newLimit)
    setPage(1)
  }

  function handlePrev() { if (page > 1) setPage((p) => p - 1) }
  function handleNext() { if (page < totalPages) setPage((p) => p + 1) }

  // ── CRUD ────────────────────────────────────────────────────────────────
  const handleCreateOrUpdate = async (
    data: CreateStudentInput | UpdateStudentInput,
    isEdit: boolean
  ) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        isEdit ? `/api/students/${selectedStudent?.id}` : "/api/students",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, institution_id: institutionId }),
        }
      )
      if (!response.ok) throw new Error(isEdit ? "Failed to update student" : "Failed to create student")
      await loadStudents(page, limit)
      setIsOpen(false)
      setSelectedStudent(null)
      toast({
        title: "Success",
        description: isEdit ? "Student updated successfully" : "Student created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Operation failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/students/${studentId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete student")
      // If we just deleted the last item on this page, go back one
      const newPage = students.length === 1 && page > 1 ? page - 1 : page
      setPage(newPage)
      await loadStudents(newPage, limit)
      toast({ title: "Success", description: "Student removed successfully" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Client-side filter (on the current page slice) ──────────────────────
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.registration_number?.toLowerCase().includes(search.toLowerCase())

    const matchesProgram  = !selectedProgram  || student.program_id  === selectedProgram
    const matchesSemester = !selectedSemester || student.semester    === Number(selectedSemester)
    const matchesSection  = !selectedSection  || student.section_id  === selectedSection

    return matchesSearch && matchesProgram && matchesSemester && matchesSection
  })

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-600 mt-1">Manage student accounts and section assignments.</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>New Student</Button>
      </div>

      <StudentSearch value={search} onChange={(v) => { setSearch(v); setPage(1) }} />

      <StudentFilters
        programs={programs}
        sections={sections}
        selectedProgram={selectedProgram}
        selectedSemester={selectedSemester}
        selectedSection={selectedSection}
        onProgramChange={(v) => { setSelectedProgram(v);  setPage(1) }}
        onSemesterChange={(v) => { setSelectedSemester(v); setPage(1) }}
        onSectionChange={(v) => { setSelectedSection(v);  setPage(1) }}
      />

      <Card className="overflow-hidden">
        <StudentList
          students={filteredStudents}
          isLoading={isLoading}
          onEdit={(student) => {
            setSelectedStudent(student)
            setDrawerOpen(true)
          }}
          onDelete={handleDelete}
          // Pagination footer props
          totalCount={totalCount}
          page={page}
          limit={limit}
          totalPages={totalPages}
          rangeFrom={rangeFrom}
          rangeTo={rangeTo}
          onPrev={handlePrev}
          onNext={handleNext}
          onLimitChange={handleLimitChange}
        />
      </Card>

      <CreateStudentDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedStudent(null)
        }}
        onSubmit={handleCreateOrUpdate}
        student={selectedStudent}
        sections={sections}
        programs={programs}
        isLoading={isLoading}
      />

      <StudentDrawer
        open={drawerOpen}
        student={selectedStudent}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}