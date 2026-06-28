# SkillArc Database Schema Documentation

## Current Hierarchy (Post-Phase 1)

```
Organization
  ↓
Institution
  ↓
Department
  ↓
Program
  ↓
Academic Year
  ↓
Semester
  ↓
Section
  ↓
Students
```

## Tables

### organizations
- `id` (uuid, PK)
- `name` (text)
- `domain` (text, nullable)
- `created_at` (timestamp)

### institutions
- `id` (uuid, PK)
- `name` (text)
- `domain` (text, nullable)
- `organization_id` (uuid, FK → organizations)
- `created_at` (timestamp)

### departments
- `id` (uuid, PK)
- `name` (text)
- `institution_id` (uuid, FK → institutions)
- `created_at` (timestamp)

### programs
- `id` (uuid, PK)
- `name` (text)
- `code` (text)
- `department_id` (uuid, FK → departments)
- `created_at` (timestamp)

### sections (NEW - Phase 1)
- `id` (uuid, PK)
- `name` (text) - e.g., "Section A", "Section B"
- `semester` (integer) - e.g., 1, 2, 3, 4...
- `program_id` (uuid, FK → programs)
- `institution_id` (uuid, FK → institutions)
- `faculty_advisor_id` (uuid, FK → users) - nullable
- `created_at` (timestamp)
- `updated_at` (timestamp)

### users
- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `role` (text) - super_admin, org_admin, institution_admin, hod, program_head, faculty, student, parent, timetable_manager
- `organization_id` (uuid, FK → organizations) - nullable
- `institution_id` (uuid, FK → institutions) - nullable
- `section_id` (uuid, FK → sections) - nullable, NEW - Phase 1
- `semester` (integer) - nullable, NEW - Phase 1
- `created_at` (timestamp)

### departments_hierarchy
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `department_id` (uuid, FK → departments)
- `role` (text) - hod, faculty
- `created_at` (timestamp)

### programs_hierarchy
- `id` (uuid, PK)
- `user_id` (uuid, FK → users)
- `program_id` (uuid, FK → programs)
- `role` (text) - program_head, faculty
- `created_at` (timestamp)

### subjects
- `id` (uuid, PK)
- `name` (text)
- `code` (text)
- `faculty_id` (uuid, FK → users) - nullable
- `section_id` (uuid, FK → sections) - nullable, NEW - Phase 1
- `program_id` (uuid, FK → programs) - nullable, NEW - Phase 1
- `institution_id` (uuid, FK → institutions)
- `created_at` (timestamp)

### timetable_slots
- `id` (uuid, PK)
- `day` (text) - Monday, Tuesday, etc.
- `period` (integer) - 1, 2, 3, etc.
- `subject_id` (uuid, FK → subjects) - nullable
- `section_id` (uuid, FK → sections) - NEW - Phase 1, replaces text-based section
- `created_at` (timestamp)

### parent_student_relations (NEW - Phase 1)
- `id` (uuid, PK)
- `parent_id` (uuid, FK → users)
- `student_id` (uuid, FK → users)
- `relationship` (text) - e.g., "Father", "Mother", "Guardian"
- `created_at` (timestamp)

## User Roles & Permissions

### Super Admin
- Manages organizations
- Manages organization admins
- Platform settings & analytics
- Can view all institutions

### Organization Admin
- Can only manage their organization's institutions
- Cannot view other organizations
- Can create/delete institutions within organization

### Institution Admin
- Manages departments
- Manages programs
- Manages sections
- Manages faculty
- Manages students
- Manages parents
- Manages subjects
- Faculty allocation
- Timetable management
- **Cannot**: Manage organizations, other institutions, or system settings

### HOD (Head of Department)
- Manages faculty in their department
- Manages subjects in their department
- Faculty allocation
- Department reports
- **Limited to**: Their department only

### Program Head
- Manages sections in their program
- Manages students in their program
- Academic progress tracking
- **Limited to**: Their program only

### Faculty
- Can view their assigned subjects
- Can view their section(s)
- Can submit grades (Phase 5)
- Can mark attendance (Phase 5)
- **Limited to**: Their assigned sections and subjects

### Student
- Can view their section & courses
- Can view timetable
- Can view grades (Phase 5)
- Can view attendance (Phase 5)
- **Limited to**: Their section only

### Parent
- Can view their children's progress
- Can view timetable
- Can view attendance (Phase 5)
- Can receive notifications
- **Limited to**: Their assigned student(s)

### Timetable Manager
- Manages timetables across institution
- Optimizes schedules
- Manages conflicts
- **Limited to**: Their institution

## Development Phases

### Phase 1: Foundation (COMPLETE)
- Organizations
- Institutions
- Departments
- Programs
- **Sections** ✅
- Faculty advisor assignment ✅

### Phase 2: Users
- Faculty management
- Student management
- Parent management
- Parent-student relations

### Phase 3: Academics
- Subjects
- Faculty allocation
- Subject-section assignment

### Phase 4: Timetable
- Timetable builder with sections
- Automatic conflict detection
- Faculty workload optimization

### Phase 5: Operations
- Attendance tracking
- Marks/Grades management
- Reports
- Notifications
- Dashboard analytics

## Key Design Decisions

1. **Sections as First-Class Entity**: Instead of storing section as text, sections are now proper database entities with their own table. This enables:
   - Faculty advisors per section
   - Better timetable management
   - Accurate student grouping
   - Easy section-level queries

2. **Hierarchy Specificity**: Users have `section_id` and `semester` directly on the users table for quick queries without joins.

3. **Parent System**: Parents are users with their own role. Relationships are stored in `parent_student_relations` to support 1-to-many and many-to-many scenarios.

4. **Faculty Allocation**: Faculty can be allocated to multiple sections through subject assignments.

5. **Role-Based Access**: Each role has specific permissions defined in constants and enforced in API routes.

## Migration Notes

When migrating existing data:
1. Create sections for each program-semester combination
2. Assign students to sections based on batch/year
3. Create parent users and set up relationships
4. Allocate existing subjects to sections
5. Update timetable slots with section references

## Future Enhancements

- Academic years table (for multi-year support)
- Attendance table
- Grades/Marks table
- Course prerequisites
- Elective management
- Class transfers
- Assessment templates
- Notification preferences
