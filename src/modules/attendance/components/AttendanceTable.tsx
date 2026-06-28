interface Props {
  students: any[]
  attendance: Record<string, string>
  onStatusChange: (studentId: string, status: string) => void
}

const STATUS = [
  {
    value: "Present",
    color: "bg-green-500",
  },
  {
    value: "Absent",
    color: "bg-red-500",
  },
  {
    value: "Late",
    color: "bg-yellow-500",
  },
]

export default function AttendanceTable({
  students,
  attendance,
  onStatusChange,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">

      <div className="px-6 py-5 border-b">

        <h2 className="text-lg font-semibold">
          Students
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {students.length} Students
        </p>

      </div>

      <div className="divide-y">

        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div>

              <h3 className="font-medium">
                {student.name}
              </h3>

              <p className="text-sm text-gray-500">
                {student.usn}
              </p>

            </div>

            <div className="flex gap-2">

              {STATUS.map((s) => (
                <button
                  key={s.value}
                  onClick={() =>
                    onStatusChange(student.id, s.value)
                  }
                  className={`px-4 py-2 rounded-xl text-sm transition

                  ${
                    attendance[student.id] === s.value
                      ? `${s.color} text-white`
                      : "border"
                  }`}
                >
                  {s.value}
                </button>
              ))}

            </div>

          </div>
        ))}

        {students.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            Select Program, Semester and Section.
          </div>
        )}

      </div>

    </div>
  )
}