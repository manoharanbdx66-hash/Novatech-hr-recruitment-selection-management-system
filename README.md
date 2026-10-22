# NovaTech HR — Recruitment & Selection Management System

**Organization:** NovaTech Solutions Pvt. Ltd. (Chennai, India)  
**Academic Affiliation:** Anna University · Regulation 2021 · B.Tech Information Technology (Final Year)  
**Subject:** Principles of Management (POM)  

---

## 1. Project Overview

NovaTech HR is an enterprise-grade **Recruitment and Selection Management System** engineered to demonstrate the five classical functions of management (**Planning**, **Organizing**, **Staffing**, **Directing**, and **Controlling**) within a modern IT company context.

The system replaces manual recruitment spreadsheets with an auditable, stage-gated candidate selection pipeline, structured scoring rubrics, formal offer generation, and employee onboarding.

---

## 2. Core Functional Modules

1. **Executive Dashboard:** Live metrics, conversion funnel, upcoming interview schedules, recent application feed, and quick actions.
2. **Job Openings (Requisitions):** Complete CRUD for job postings with required skills, experience ranges, salary budgets (CTC in LPA), qualifications, and department allocation.
3. **Candidate Management:** Applicant roster, duplicate email prevention, resume summary previews, contact info, and stage tracking.
4. **Recruitment Pipeline (Kanban):** 8-stage visual workflow (`Applied` → `Under Review` → `Shortlisted` → `Assessment` → `Interview` → `Selected` → `Offer Sent` → `Hired` + `Rejected`) with full transition audit logs.
5. **Screening & Scoring Matrix:** Automated skill and qualification matching against job specifications with clearly labeled non-binding decision aids and required HR human reviews.
6. **Interview Operations:** Multi-round interview coordination (`Technical Round 1 & 2`, `HR Round`, `Managerial Round`) with 4-competency 5-star scoring rubrics (Domain Knowledge, Problem Solving, Communication, Culture Fit).
7. **Selection Decisions & Offers:** Formal employment offer letter generator, approval trail, acceptance tracking, and printable letterhead view.
8. **Employee Onboarding:** Automatic conversion of accepted candidates into company employee records with generated Employee IDs (`NTS-2026-xxx`) and onboarding milestone progress tracking.
9. **Recruitment Reports & Analytics:** Sourcing channel efficiency, time-to-hire calculation, department requisition fulfillment, and one-click CSV report export.
10. **POM Academic Alignment:** Dedicated mapping of the 5 management functions to system components for academic evaluation.

---

## 3. Principles of Management (POM) Mapping

| Management Function | Academic Principle | NovaTech System Implementation |
| :--- | :--- | :--- |
| **Planning** | Manpower forecasting & requirement specification | Requisition creation, experience bands, headcount planning, job descriptions |
| **Organizing** | Departmentation & role specialization | Department directory, role-based access control (RBAC), vacancy allocation |
| **Staffing** | Multi-channel recruitment & selection pipeline | 8-stage Kanban pipeline, resume screening, candidate sourcing, induction |
| **Directing** | Panel coordination & standardized guidance | Evaluator assignment, structured 5-star rubrics, interview feedback records |
| **Controlling** | Performance monitoring & corrective action | Time-to-Hire KPI, source efficiency charts, rejection logs, and audit trails |

---

## 4. Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons
- **Architecture:** Component-driven, React Context state management
- **Persistence:** Local browser sandbox (`localStorage`) with sample demo data reset
- **Bundler & Dev Server:** Vite 6 / 8

---

## 5. Local Installation & Development

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Steps
1. Clone or extract the project repository:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

5. Build for Production:
   ```bash
   npm run build
   ```

---

## 6. Deployment Guide

### Option A: Vercel / Netlify (Static SPA)
1. Push the code to a Git repository (GitHub/GitLab).
2. Import the repository in Vercel or Netlify.
3. Configure build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy with zero configuration.

### Option B: Google Cloud Run / Docker
1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```
2. Build and deploy to Google Cloud Run:
   ```bash
   gcloud run deploy novatech-hr --source . --platform managed --allow-unauthenticated
   ```

---

## 7. Demo Accounts & Personas

The system includes pre-configured demo personas to test role-based permissions:
1. **Priya Sharma** (`priya.sharma@novatech.in`) — Lead HR Manager
2. **Karthik Sundaram** (`karthik.s@novatech.in`) — Admin / VP of Engineering
3. **Ananya Raman** (`ananya.raman@novatech.in`) — Technical Interviewer / Principal Architect

Switch accounts anytime using the user profile menu in the top-right corner of the application.
To restore the original demo records, visit **Settings** and click **Reset Sample Demo Data**.
