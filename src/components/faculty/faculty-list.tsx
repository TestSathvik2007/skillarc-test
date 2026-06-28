"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { FacultyWithStats } from "@/modules/faculty/types/faculty.types"
import { Trash2, Edit2, BookOpen, Users } from "lucide-react"

interface FacultyListProps {
  faculty: FacultyWithStats[]
  isLoading?: boolean
  onEdit?: (faculty: FacultyWithStats) => void
  onDelete?: (facultyId: string) => void
}

export function FacultyList({
  faculty,
  isLoading = false,
  onEdit,
  onDelete,
}: FacultyListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!faculty || faculty.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No faculty found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="h-4 w-4" />
                Subjects
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-4 w-4" />
                Sections
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faculty.map((f) => (
            <TableRow key={f.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{f.name}</TableCell>
              <TableCell className="text-gray-600">{f.email}</TableCell>
              <TableCell className="text-gray-600">
                {f.department?.name || "Not Assigned"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{f.assignedSubjects || 0}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{f.assignedSections || 0}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(f)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(f.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}