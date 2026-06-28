"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Subject, Faculty, Slot } from "../types/timetable.types"
import { timetableService } from "../services/timetableService"

interface TimetableContextType {
  loading: boolean
  subjects: Subject[]
  faculty: Faculty[]
  slots: Slot[]
  assignSubject: (
    day: string,
    period: string,
    subject: Subject | undefined
  ) => void
}

interface TimetableProviderProps {
  children: React.ReactNode
  semester?: string | null
  sectionId?: string | null
}

const TimetableContext = createContext<TimetableContextType | null>(null)

export function TimetableProvider({
  children,
  semester,
  sectionId,
}: TimetableProviderProps) {
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        if (!semester || !sectionId) {
          setSubjects([])
          setFaculty([])
          setSlots([])
          return
        }

        const institutionId =
          await timetableService.getCurrentInstitutionId()

        const [subjectsData, facultyData, slotsData] =
          await Promise.all([
            timetableService.getSubjects(
              institutionId,
              Number(semester)
            ),
            timetableService.getFaculty(institutionId),
            timetableService.getSlots(
              institutionId,
              sectionId,
              Number(semester)
            ),
          ])

        setSubjects(subjectsData)
        setFaculty(facultyData)
        setSlots(slotsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [semester, sectionId])

  function assignSubject(
    day: string,
    period: string,
    subject: Subject | undefined
  ) {
    setSlots((prev) =>
      subject
        ? [
            ...prev.filter(
              (s) => !(s.day === day && s.period === period)
            ),
            {
              day,
              period,
              subject,
            },
          ]
        : prev.filter(
            (s) => !(s.day === day && s.period === period)
          )
    )
  }

  return (
    <TimetableContext.Provider
      value={{
        loading,
        subjects,
        faculty,
        slots,
        assignSubject,
      }}
    >
      {children}
    </TimetableContext.Provider>
  )
}

export function useTimetable() {
  const ctx = useContext(TimetableContext)

  if (!ctx) {
    throw new Error(
      "useTimetable must be used inside TimetableProvider"
    )
  }

  return ctx
}