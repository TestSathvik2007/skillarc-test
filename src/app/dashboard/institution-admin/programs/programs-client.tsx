"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

import { ProgramList } from "@/components/programs/program-list"
import { CreateProgramDialog } from "@/components/programs/create-program-dialog"

import type {
  Program,
  ProgramWithDepartment,
  CreateProgramInput,
} from "@/modules/programs"

interface ProgramsClientPageProps {
  initialPrograms: ProgramWithDepartment[]
  departments: Array<{
    id: string
    name: string
  }>
  institutionId: string
  organizationId: string
}

export function ProgramsClientPage({
  initialPrograms,
  departments,
  institutionId,
  organizationId,
}: ProgramsClientPageProps) {
  const [programs, setPrograms] =
    useState<ProgramWithDepartment[]>(initialPrograms)

  const [isOpen, setIsOpen] = useState(false)

  const [selectedProgram, setSelectedProgram] =
    useState<Program | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const loadPrograms = async () => {
    try {
      const response = await fetch(
        `/api/programs?institution_id=${institutionId}`
      )

      if (!response.ok) {
        throw new Error("Failed to load programs")
      }

      const data = await response.json()

      setPrograms(data)
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load programs",
        variant: "destructive",
      })
    }
  }

  const handleCreateProgram = async (
    data: CreateProgramInput
  ) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          institution_id: institutionId,
          organization_id: organizationId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create program")
      }

      await loadPrograms()

      setIsOpen(false)

      toast({
        title: "Success",
        description:
          "Program created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create program",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProgram = async (
    data: CreateProgramInput
  ) => {
    if (!selectedProgram) return

    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/programs/${selectedProgram.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update program")
      }

      await loadPrograms()

      setIsOpen(false)

      setSelectedProgram(null)

      toast({
        title: "Success",
        description:
          "Program updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update program",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProgram = async (
    programId: string
  ) => {
    if (
      !confirm(
        "Are you sure you want to delete this program?"
      )
    )
      return

    try {
      const response = await fetch(
        `/api/programs/${programId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete")
      }

      await loadPrograms()

      toast({
        title: "Success",
        description:
          "Program deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Delete failed",
        variant: "destructive",
      })
    }
  }

  const handleOpenDialog = (
    program?: ProgramWithDepartment
  ) => {
    if (program) {
      setSelectedProgram(program)
    } else {
      setSelectedProgram(null)
    }

    setIsOpen(true)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Programs
          </h1>

          <p className="text-gray-600 mt-1">
            Manage academic programs
          </p>
        </div>

        <Button
          onClick={() => handleOpenDialog()}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      <Card className="p-6">
        <ProgramList
          programs={programs}
          isLoading={isLoading}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteProgram}
        />
      </Card>

      <CreateProgramDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={
          selectedProgram
            ? handleEditProgram
            : handleCreateProgram
        }
        program={selectedProgram}
        departments={departments}
        isLoading={isLoading}
      />
    </div>
  )
}