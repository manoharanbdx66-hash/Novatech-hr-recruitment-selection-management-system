# Implementation Plan: Full Functional Audit & Enterprise Enhancement for NovaTech HR

This plan establishes a comprehensive upgrade of the **NovaTech HR Recruitment & Selection Management System**, ensuring that every module operates on authentic persistent storage, strictly distinguishes demo records from real enterprise records, enforces role-based access control (RBAC), and delivers robust validation and reporting.

---

## 1. System Architecture & Persistent Storage Strategy

### A. Data Schema & Demo vs. Real Data Isolation
- Add an explicit `isDemo?: boolean` flag across all primary entities (`Job`, `Candidate`, `Interview`, `JobOffer`, `Employee`, `ApplicationAudit`, `ScreeningRecord`).
- Implement an interactive **Data Mode Switcher** in the header and settings:
  - **All Data Mode:** Displays all records with clear `Demo` visual indicators on sample items.
  - **Live Operational Mode:** Hides demo records to present only real company data.
  - **Demo Purge / Reset:** Dedicated action to clear demo records without affecting user-created real data, alongside full system reset.
- Upgrade `AppContext.tsx` with:
  - Auto-saving to `localStorage` under `novatech_hr_master_store_v2`.
  - JSON Backup Export (download entire database snapshot) and Backup Restore (import and validate JSON file).
  - Robust error boundary and schema migration safeguards.

---

## 2. Authentication & Role-Based Access Control (RBAC)

### A. Authentication & Session Management
- Add a dedicated **Login & Session Management Modal**:
  - Quick-switch demo accounts (Priya Sharma - HR Lead, Karthik Sundaram - VP Eng/Admin, Ananya Raman - Technical Evaluator) with PIN authentication simulation (`1234`).
  - Custom user sign-in option for new recruiter accounts.
  - Full Logout flow returning the application to an authenticated gate or guest preview state.
- Enforce granular role permissions:
  - **Admin:** Requisition approval, user settings, deletion of records, full analytics.
  - **HR Manager:** Requisition creation, candidate intake, pipeline stage advancement, offer drafting, and employee onboarding.
  - **Interviewer:** Restricted to viewing assigned interview schedules and submitting structured evaluation rubrics.
  - Visually disable or guard restricted action buttons with informative tooltips and permission warnings.

---

## 3. Module-by-Module Functional Enhancements

### A. Executive Dashboard
- Ensure all KPI cards (Active Openings, Total Applicants, Shortlisted Pool, Scheduled Interviews, Offers/Hired) reactively calculate from filtered active storage.
- Add active time-range filtering (`All Time`, `Last 30 Days`, `Last 90 Days`) that filters candidate intake and interview velocity.
- Connect recent applications table and upcoming interview widgets to direct action handlers.

### B. Job Requisitions (Openings)
- Comprehensive form validation: non-empty title, department, min $\le$ max experience, min $\le$ max salary, at least one skill, valid closing date.
- Status management (`Published`, `Draft`, `Closed`, `Archived`) with automatic position headcount decrement when offers are accepted and converted to employees.
- Real-time applicant counters linking directly to filtered candidate lists for that requisition.

### C. Candidate Management & Screening
- Prevent duplicate candidate registration using normalized email address validation.
- Enhanced input sanitization for phone numbers and URLs (LinkedIn, Portfolio).
- Detailed candidate profile modal with interactive stage transition history, audit notes, and resume credentials view.
- Screening module: verify automated match scoring formula ($0\text{--}100\%$) against job specifications, maintaining mandatory human HR approval before candidate shortlisting or rejection.

### D. Pipeline Kanban Workflow
- Fluid card progression across all 8 stages (`Applied` $\rightarrow$ `Under Review` $\rightarrow$ `Shortlisted` $\rightarrow$ `Assessment` $\rightarrow$ `Interview` $\rightarrow$ `Selected` $\rightarrow$ `Offer Sent` $\rightarrow$ `Hired`, plus `Rejected Pool`).
- Prompt modals capturing mandatory audit comments and compliance rejection reasons on terminal transitions.
- Every stage move instantly writes to the application audit log.

### E. Interview Management & Interactive Calendar
- Dual presentation: **Calendar Grid** (interactive Month and Week views with HTML5 drag-and-drop rescheduling) and **Card List** (filterable by scheduled vs completed).
- Clicking any day slot opens `ScheduleInterviewModal` pre-populated with that date.
- 4-competency 5-star rubric form (Technical Knowledge, Problem Solving, Communication, Culture Fit) with mandatory justification notes and hiring verdict (`Strong Hire`, `Hire`, `Hold`, `Strong Reject`).
- Embedded Recharts score trends over time and cross-stage competency comparison.

### F. Selection Decisions, Offers & Onboarding
- Offer lifecycle tracking: `Draft` $\rightarrow$ `Approved` $\rightarrow$ `Sent` $\rightarrow$ `Accepted` $\rightarrow$ `Declined`.
- Formal branded offer letterhead view with CTC calculation, probation terms, and printable layout.
- One-click **"Convert to Employee"** flow that generates official Employee IDs (`NTS-2026-xxx`), initial onboarding status, and adds them to the Employee Directory.
- Onboarding milestone checklist: `Document Verification`, `Asset Allocation`, `Orientation & Welcome`, and `Active & Completed`.

### G. Analytics & Export Suite
- Real-time computed charts:
  - Candidate sourcing channel efficiency.
  - Selection outcome breakdown.
  - Average Time-to-Hire calculation.
  - Departmental hiring target fulfillment.
- Multi-module CSV exports:
  - Candidates Export (full demographic and status details).
  - Interview Log Export (rounds, scores, recommendations).
  - Employee Directory Export.
  - Complete Audit Trail Export.

---

## 4. Verification & Testing Checklist

- [ ] Verify TypeScript compilation with `tsc --noEmit` and build with `vite build`.
- [ ] Test candidate intake with duplicate email and ensure validation error appears.
- [ ] Test Kanban card drag-and-drop and stage advancement dialog.
- [ ] Test Calendar drag-and-drop rescheduling to a new date and check toast confirmation.
- [ ] Test Offer generation, acceptance, and conversion to employee record.
- [ ] Test role switcher and verify restricted actions for Interviewer role.
- [ ] Verify CSV downloads for Candidates, Employees, and Reports.
- [ ] Verify Demo vs. Real data toggling and reset functionality.
