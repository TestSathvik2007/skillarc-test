"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProgramWithDepartment } from "@/modules/programs"
import { Trash2, Edit2 } from "lucide-react"

interface ProgramListProps {
  programs: ProgramWithDepartment[]
  isLoading?: boolean
  onEdit?: (program: ProgramWithDepartment) => void
  onDelete?: (programId: string) => void
}

export function ProgramList({
  programs,
  isLoading = false,
  onEdit,
  onDelete,
}: ProgramListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!programs?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No programs found. Create one to get started.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Card
          key={program.id}
          className="p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">
                {program.name}
              </h3>

              <p className="text-sm text-gray-600">
                {program.department?.name ?? "No Department"}
              </p>
            </div>

            <Badge variant="outline">
              Program
            </Badge>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit?.(program)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600"
              onClick={() => onDelete?.(program.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}