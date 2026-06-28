"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Department {
  id: string
  name: string
}

interface Props {
  initialDepartments: Department[]
  institutionId: string
}

export function DepartmentsClientPage({
  initialDepartments,
  institutionId,
}: Props) {
  const [departments, setDepartments] = useState(initialDepartments)
  const [name, setName] = useState("")

  const loadDepartments = async () => {
    const res = await fetch(
      `/api/departments?institution_id=${institutionId}`
    )

    const data = await res.json()
    setDepartments(data)
  }

  const createDepartment = async () => {
    if (!name.trim()) return

    const res = await fetch("/api/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        institution_id: institutionId,
      }),
    })

    if (res.ok) {
      setName("")
      loadDepartments()
    }
  }

  const deleteDepartment = async (id: string) => {
    if (!confirm("Delete department?")) return

    await fetch(`/api/departments/${id}`, {
      method: "DELETE",
    })

    loadDepartments()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Departments
          </h1>

          <p className="text-gray-600">
            Manage institution departments
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department Name"
          className="w-full border rounded px-3 py-2"
        />

        <Button onClick={createDepartment}>
          Create Department
        </Button>
      </Card>

      <Card className="p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Department</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.name}</td>

                <td>
                  <Button
                    variant="destructive"
                    onClick={() => deleteDepartment(dept.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}