"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, BookMarked } from "lucide-react"

const font = "'Plus Jakarta Sans', 'DM Sans', sans-serif"

const subjectTypes = [
  { value: "THEORY",   label: "Theory",   icon: "📖", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  { value: "LAB",      label: "Lab",      icon: "🧪", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  { value: "ELECTIVE", label: "Elective", icon: "🎯", color: "#9333ea", bg: "#fdf4ff", border: "#e9d5ff" },
]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 6, letterSpacing: "0.03em", textTransform: "uppercase" }}>
      {children}
    </p>
  )
}

function StyledSelect({ value, onChange, children, disabled }: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: "100%", padding: "9px 12px", fontSize: 13, fontWeight: 500,
        border: "1px solid #e5e7eb", borderRadius: 10,
        backgroundColor: disabled ? "#f3f4f6" : "#f9fafb",
        color: disabled ? "#9ca3af" : "#111827",
        outline: "none", fontFamily: font, cursor: disabled ? "not-allowed" : "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: 32,
      }}
    >
      {children}
    </select>
  )
}

function StyledInput({ value, onChange, placeholder, type = "text" }: {
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "9px 12px", fontSize: 13, fontWeight: 500,
        border: "1px solid #e5e7eb", borderRadius: 10,
        backgroundColor: "#f9fafb", color: "#111827",
        outline: "none", fontFamily: font, boxSizing: "border-box",
      }}
      onFocus={e => (e.currentTarget.style.borderColor = "#6366f1")}
      onBlur={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
    />
  )
}

export function CreateSubjectDialog({ open, onOpenChange, onSubmit, programs, sections, faculty }: any) {
  const defaultForm = {
    name: "", code: "", semester: 1, credits: 4,
    subject_type: "THEORY", program_id: "", section_id: "", faculty_id: "",
  }
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  function set(key: string, value: any) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Filter sections by selected program AND semester
  const filteredSections = useMemo(() => {
    return (sections ?? []).filter(
      (s: any) =>
        s.program_id === formData.program_id &&
        s.semester === formData.semester
    )
  }, [formData.program_id, formData.semester, sections])

  // Reset section_id when program changes
  function handleProgramChange(program_id: string) {
    setFormData(prev => ({ ...prev, program_id, section_id: "" }))
  }

  // Reset section_id when semester changes
  function handleSemesterChange(semester: number) {
    setFormData(prev => ({ ...prev, semester, section_id: "" }))
  }

  async function handleSubmit() {
    if (!formData.name.trim() || !formData.code.trim()) return
    setLoading(true)
    await onSubmit(formData)
    setFormData(defaultForm)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg" style={{ borderRadius: 20, fontFamily: font }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookMarked size={17} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", letterSpacing: "-0.01em" }}>Create Subject</h2>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Fill in the subject details below</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid #f3f4f6",
              backgroundColor: "#f9fafb", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}
          >
            <X size={14} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "70vh", overflowY: "auto" }}>

          {/* Name + Code */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel>Subject Name</FieldLabel>
              <StyledInput value={formData.name} onChange={v => set("name", v)} placeholder="e.g. Data Structures" />
            </div>
            <div>
              <FieldLabel>Subject Code</FieldLabel>
              <StyledInput value={formData.code} onChange={v => set("code", v)} placeholder="e.g. CS301" />
            </div>
          </div>

          {/* Subject Type pill selector */}
          <div>
            <FieldLabel>Subject Type</FieldLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {subjectTypes.map(t => {
                const active = formData.subject_type === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("subject_type", t.value)}
                    style={{
                      flex: 1, padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                      border: `1.5px solid ${active ? t.border : "#e5e7eb"}`,
                      backgroundColor: active ? t.bg : "#f9fafb",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      transition: "all 0.15s", fontFamily: font,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? t.color : "#6b7280" }}>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Program */}
          <div>
            <FieldLabel>Program</FieldLabel>
            <StyledSelect value={formData.program_id} onChange={handleProgramChange}>
              <option value="">Select Program</option>
              {(programs ?? []).map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </StyledSelect>
          </div>

          {/* Semester — now above Section, resets section on change */}
          <div>
            <FieldLabel>Semester</FieldLabel>
            <StyledSelect
              value={String(formData.semester)}
              onChange={v => handleSemesterChange(Number(v))}
              disabled={!formData.program_id}
            >
              {!formData.program_id
                ? <option value="">Select a program first</option>
                : [1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))
              }
            </StyledSelect>
          </div>

          {/* Section — filtered by program AND semester */}
          <div>
            <FieldLabel>Section</FieldLabel>
            <StyledSelect
              value={formData.section_id}
              onChange={v => set("section_id", v)}
              disabled={!formData.program_id}
            >
              <option value="">
                {!formData.program_id
                  ? "Select a program first"
                  : filteredSections.length === 0
                    ? "No sections for this program & semester"
                    : "Select Section"}
              </option>
              {filteredSections.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </StyledSelect>
          </div>

          {/* Credits */}
          <div>
            <FieldLabel>Credits</FieldLabel>
            <StyledSelect value={String(formData.credits)} onChange={v => set("credits", Number(v))}>
              {[1,2,3,4,5,6].map(c => (
                <option key={c} value={c}>{c} {c === 1 ? "Credit" : "Credits"}</option>
              ))}
            </StyledSelect>
          </div>

          {/* Faculty */}
          <div>
            <FieldLabel>Faculty</FieldLabel>
            <StyledSelect value={formData.faculty_id} onChange={v => set("faculty_id", v)}>
              <option value="">Not Assigned</option>
              {(faculty ?? []).map((f: any) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </StyledSelect>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid #f3f4f6",
          display: "flex", gap: 10,
        }}>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            style={{
              flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
              color: "#374151", backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb", borderRadius: 10,
              cursor: "pointer", fontFamily: font,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.name.trim() || !formData.code.trim() || loading}
            style={{
              flex: 2, padding: "10px 0", fontSize: 13, fontWeight: 700, color: "#fff",
              background: !formData.name.trim() || !formData.code.trim()
                ? "#e5e7eb"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 10,
              cursor: !formData.name.trim() || !formData.code.trim() || loading ? "not-allowed" : "pointer",
              fontFamily: font, opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating…" : "Create Subject"}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}