"use client"

import { TimetableSelector } from "@/components/timetable/timetable-selector"

interface Program {
  id: string
  name: string
}

interface Section {
  id: string
  name: string
  semester: number
  program_id: string
}

interface Props {
  programs: Program[]
  sections: Section[]
}

export function TimetableClientPage({
  programs,
  sections,
}: Props) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Timetable
        </h1>

        <p className="text-muted-foreground mt-1">
          Select a Program, Semester and Section to build a timetable.
        </p>
      </div>

      <TimetableSelector
        programs={programs}
        sections={sections}
      />
    </div>
  )
}