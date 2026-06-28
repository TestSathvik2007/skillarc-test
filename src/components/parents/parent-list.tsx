"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Parent } from "@/modules/parents"
import { Trash2, Edit2, UserPlus } from "lucide-react"

interface ParentListProps {
  parents: Parent[]
  isLoading?: boolean
  onEdit?: (parent: Parent) => void
  onDelete?: (parentId: string) => void
}

export function ParentList({
  parents,
  isLoading = false,
  onEdit,
  onDelete,
}: ParentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!parents || parents.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No parents found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {parents.map((parent) => (
        <Card key={parent.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{parent.name}</h3>
              <p className="text-sm text-gray-600">{parent.email}</p>
            </div>
            <Badge variant="outline">Parent</Badge>
          </div>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <p>Institution ID: {parent.institution_id ?? "Not set"}</p>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(parent)}
              className="flex-1"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(parent.id)}
              className="text-red-600 hover:text-red-700 flex-1"
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
