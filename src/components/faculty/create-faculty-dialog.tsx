"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Faculty, CreateFacultyInput, UpdateFacultyInput } from "@/modules/faculty/types/faculty.types"

interface CreateFacultyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateFacultyInput | UpdateFacultyInput, isEdit: boolean) => Promise<void>
  faculty?: Faculty | null
  departments?: Array<{ id: string; name: string }>
  isLoading?: boolean
}

export function CreateFacultyDialog({
  open,
  onOpenChange,
  onSubmit,
  faculty,
  departments = [],
  isLoading = false,
}: CreateFacultyDialogProps) {
  const [formData, setFormData] = useState({
    name: faculty?.name || "",
    email: faculty?.email || "",
    department_id: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    setFormData({
      name: faculty?.name || "",
      email: faculty?.email || "",
      department_id: "",
    })
  }, [faculty])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.email && !formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    try {
      await onSubmit(formData, !!faculty)
      onOpenChange(false)
      setFormData({ name: "", email: "", department_id: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{faculty ? "Edit Faculty" : "Create Faculty"}</DialogTitle>
          <DialogDescription>
            {faculty
              ? "Update faculty member details"
              : "Create a new faculty member account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Dr. John Smith"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={!!faculty}
            />
            {faculty && (
              <p className="text-xs text-gray-500">
                Email cannot be changed after creation
              </p>
            )}
          </div>

          {departments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={formData.department_id}
                onChange={(e) =>
                  setFormData({ ...formData, department_id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : faculty ? "Update Faculty" : "Create Faculty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
