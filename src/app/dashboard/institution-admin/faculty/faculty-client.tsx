"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FacultyList } from "@/components/faculty/faculty-list"
import { CreateFacultyDialog } from "@/components/faculty/create-faculty-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { FacultyWithStats, CreateFacultyInput, UpdateFacultyInput } from "@/modules/faculty/types/faculty.types"

interface FacultyClientPageProps {
  initialFaculty: FacultyWithStats[]
  departments: Array<{ id: string; name: string }>
  institutionId: string
}

export function FacultyClientPage({
  initialFaculty,
  departments,
  institutionId,
}: FacultyClientPageProps) {
  const [faculty, setFaculty] = useState<FacultyWithStats[]>(initialFaculty)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyWithStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const loadFaculty = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/faculty?institution_id=${institutionId}`)
      if (!response.ok) throw new Error("Failed to load faculty")
      const data = await response.json()
      setFaculty(data)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load faculty",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrUpdate = async (
    data: CreateFacultyInput | UpdateFacultyInput,
    isEdit: boolean
  ) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        isEdit ? `/api/faculty/${selectedFaculty?.id}` : "/api/faculty",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isEdit
              ? data
              : {
                  ...data,
                  institution_id: institutionId,
                }
          ),
        }
      )

      if (!response.ok) throw new Error(isEdit ? "Failed to update faculty" : "Failed to create faculty")

      await loadFaculty()
      setIsOpen(false)
      setSelectedFaculty(null)
      toast({
        title: "Success",
        description: isEdit ? "Faculty updated successfully" : "Faculty created successfully",
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

  const handleDelete = async (facultyId: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/faculty/${facultyId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete faculty")
      await loadFaculty()
      toast({
        title: "Success",
        description: "Faculty removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete faculty",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faculty</h1>
          <p className="text-gray-600 mt-1">Manage faculty accounts and department assignments.</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          Add Faculty
        </Button>
      </div>

      <Card className="p-6">
        <FacultyList
          faculty={faculty}
          isLoading={isLoading}
          onEdit={(faculty) => {
            setSelectedFaculty(faculty)
            setIsOpen(true)
          }}
          onDelete={handleDelete}
        />
      </Card>

      <CreateFacultyDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedFaculty(null)
        }}
        onSubmit={handleCreateOrUpdate}
        faculty={selectedFaculty}
        departments={departments}
        isLoading={isLoading}
      />
    </div>
  )
}
