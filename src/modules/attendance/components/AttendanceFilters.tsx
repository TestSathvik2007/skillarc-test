interface Props {
  programs: any[]
  sections: any[]
  subjects: any[]

  selectedProgram: string
  selectedSemester: string
  selectedSection: string
  selectedSubject: string
  selectedPeriod: string
  selectedDate: string

  setSelectedProgram: (v: string) => void
  setSelectedSemester: (v: string) => void
  setSelectedSection: (v: string) => void
  setSelectedSubject: (v: string) => void
  setSelectedPeriod: (v: string) => void
  setSelectedDate: (v: string) => void
}

export default function AttendanceFilters({
  programs,
  sections,
  subjects,

  selectedProgram,
  selectedSemester,
  selectedSection,
  selectedSubject,
  selectedPeriod,
  selectedDate,

  setSelectedProgram,
  setSelectedSemester,
  setSelectedSection,
  setSelectedSubject,
  setSelectedPeriod,
  setSelectedDate,
}: Props) {
  const filteredSections = sections.filter((s: any) => {
    if (!selectedSemester) return false

    return (
      String(s.semester) === selectedSemester &&
      (!selectedProgram || s.program_id === selectedProgram)
    )
  })

  const filteredSubjects = subjects.filter((s: any) => {
    if (!selectedSemester) return false

    return String(s.semester) === selectedSemester
  })

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Filters
      </h2>

      <div className="space-y-4 mt-6">

        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Program</option>

          {programs.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Semester</option>

          {[1,2,3,4,5,6,7,8].map((sem)=>(
            <option key={sem}>
              {sem}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e)=>setSelectedSection(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Section</option>

          {filteredSections.map((s:any)=>(
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e)=>setSelectedSubject(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Subject</option>

          {filteredSubjects.map((s:any)=>(
            <option key={s.id} value={s.id}>
              {s.code} • {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPeriod}
          onChange={(e)=>setSelectedPeriod(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="">Period</option>

          {[1,2,3,4,5,6,7,8].map((p)=>(
            <option key={p}>
              Period {p}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e)=>setSelectedDate(e.target.value)}
          className="w-full rounded-xl border p-3"
        />

      </div>

    </div>
  )
}