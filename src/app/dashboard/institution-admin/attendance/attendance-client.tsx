"use client"

import { useState } from "react"
import AttendanceFilters from "@/modules/attendance/components/AttendanceFilters"
import AttendanceTable from "@/modules/attendance/components/AttendanceTable"

interface Props {
  institutionId: string
  programs: any[]
  sections: any[]
  subjects: any[]
  students: any[]
}

export default function AttendanceClient({
  institutionId,
  programs,
  sections,
  subjects,
  students,
}: Props) {
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [attendance, setAttendance] = useState<Record<string, string>>({})

  const filteredStudents = students.filter(
    (student: any) =>
      !selectedSection ||
      student.section_id === selectedSection
  )

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Attendance Center
        </h1>

        <p className="text-gray-500 mt-2">
          Mark attendance, review class statistics and manage daily sessions.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Left Panel */}

        <div className="col-span-3">
          <AttendanceFilters
            programs={programs}
            sections={sections}
            subjects={subjects}

            selectedProgram={selectedProgram}
            selectedSemester={selectedSemester}
            selectedSection={selectedSection}
            selectedSubject={selectedSubject}
            selectedPeriod={selectedPeriod}
            selectedDate={selectedDate}

            setSelectedProgram={setSelectedProgram}
            setSelectedSemester={setSelectedSemester}
            setSelectedSection={setSelectedSection}
            setSelectedSubject={setSelectedSubject}
            setSelectedPeriod={setSelectedPeriod}
            setSelectedDate={setSelectedDate}
          />
        </div>

        {/* Center */}

        <div className="col-span-6">
          <AttendanceTable
            students={filteredStudents}
            attendance={attendance}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Right */}

        <div className="col-span-3">

          <div className="rounded-3xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Summary
            </h2>

          </div>

        </div>

      </div>

    </div>
  )
}