import React from 'react';
import {
  GraduationCap,
  Target,
  Layers,
  Users,
  Compass,
  CheckCircle2,
  FileText,
  Workflow,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const AcademicPOMView: React.FC = () => {
  const managementFunctions = [
    {
      functionName: '1. Planning',
      icon: Target,
      color: 'border-blue-500 text-blue-700 bg-blue-50',
      badge: 'Workforce & Headcount Forecasting',
      principles: [
        'Manpower Planning: Identification of technical skill gaps and organizational capacity needs.',
        'Job Specifications & Descriptions: Pre-defining role duties, minimum experience, qualifications, and salary budgets.',
        'Recruitment Schedule & Deadlines: Establishing application closing dates and hiring SLA targets.'
      ],
      systemMapping:
        'Demonstrated in the "Job Openings" module via structured requisition creation, required skills builder, experience bands, and target headcount.'
    },
    {
      functionName: '2. Organizing',
      icon: Layers,
      color: 'border-indigo-500 text-indigo-700 bg-indigo-50',
      badge: 'Departmental Division of Labor',
      principles: [
        'Organizational Structuring: Grouping activities into specialized technical departments (Engineering, Cloud DevOps, AI, QA, UI/UX).',
        'Authority Delegation: Establishing clear reporting lines between Directors, HR Partners, and Staff Architects.',
        'Resource Allocation: Mapping position openings to departmental capacity.'
      ],
      systemMapping:
        'Demonstrated in the "Settings > Departments" and "Reports" modules where vacancies and candidates are strictly segregated by business division.'
    },
    {
      functionName: '3. Staffing',
      icon: Users,
      color: 'border-emerald-500 text-emerald-700 bg-emerald-50',
      badge: 'Core Recruitment & Selection Engine',
      principles: [
        'Sourcing & Attraction: Multi-channel pipeline gathering (LinkedIn, Campus Placements, Referrals, Career Portal).',
        'Screening & Shortlisting: Systematic matching of qualifications against job descriptions before advancing.',
        'Selection & Offer: Objective multi-round evaluations culminating in formal compensation offer letters.',
        'Onboarding & Induction: Converting hired prospects into employee records with designated mentors.'
      ],
      systemMapping:
        'Demonstrated in the "Candidates", "Candidate Screening", "Pipeline Kanban", and "Employee Onboarding" modules.'
    },
    {
      functionName: '4. Directing',
      icon: Compass,
      color: 'border-amber-500 text-amber-700 bg-amber-50',
      badge: 'Leadership & Panel Coordination',
      principles: [
        'Inter-Departmental Coordination: Facilitating seamless handoffs between HR coordinators and technical evaluators.',
        'Standardized Guidance: Providing structured 5-star evaluation rubrics to reduce interviewer subjectivity and bias.',
        'Candidate Communication: Maintaining transparent stage updates and feedback notes.'
      ],
      systemMapping:
        'Demonstrated in the "Interviews" module through assigned evaluators, scheduling details, and the 4-competency feedback rubric.'
    },
    {
      functionName: '5. Controlling',
      icon: CheckCircle2,
      color: 'border-purple-500 text-purple-700 bg-purple-50',
      badge: 'Performance Measurement & Auditing',
      principles: [
        'KPI Monitoring: Measuring Time-to-Hire, Sourcing Channel Conversion, and Offer Acceptance Ratios against corporate benchmarks.',
        'Audit Trails: Logging timestamped transitions of every candidate status change with user attribution.',
        'Corrective Action: Tracking rejection reasons to refine upstream job requirements and sourcing strategies.'
      ],
      systemMapping:
        'Demonstrated in the "Recruitment Reports" analytics dashboards and the Candidate "Audit Trail" history.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Clean Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Principles of Management Framework</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Recruitment &amp; Selection Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational mapping of the five core management functions: Planning, Organizing, Staffing, Directing, and Controlling.
          </p>
        </div>
      </div>

      {/* Project Overview & Objectives Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Project Objectives</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">System Goals</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To automate and govern end-to-end talent acquisition processes for a mid-scale IT enterprise,
            minimizing hiring cycle delays, enforcing objective competency-based selection, and generating
            verifiable audit trails.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Scope of Application</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Enterprise Scope</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Encompasses workforce requisition planning, job posting, multi-channel candidate sourcing,
            automated qualification screening assistance, interview scheduling, scoring rubrics, offer letters,
            and employee induction.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Academic Limitations</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Prototype Environment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data is securely persisted in the client-side sandbox (localStorage) for interactive demonstration.
            Automated screening metrics are explicitly labeled as decision aids requiring human HR validation.
          </p>
        </div>
      </div>

      {/* 5 Functions of Management Mapping Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Mapping of the Five Classical Functions of Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How each POM management function is directly implemented within NovaTech HR's interactive UI and data model:
          </p>
        </div>

        <div className="space-y-4">
          {managementFunctions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.functionName}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.functionName}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">
                      Management Theory &amp; Principles Applied:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside leading-relaxed">
                      {item.principles.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-1 flex items-center gap-1">
                      <Workflow className="w-3.5 h-3.5" />
                      <span>NovaTech Application Implementation:</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {item.systemMapping}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruitment & Selection Workflow Diagram */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            End-to-End Recruitment &amp; Selection Process Flow
          </h2>
          <p className="text-xs text-slate-500">
            Systematic transition through hiring gates from initial requisition to employee induction
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 text-center text-xs">
          {[
            { step: '1', title: 'Workforce Planning', sub: 'Job Requisition' },
            { step: '2', title: 'Candidate Sourcing', sub: 'Multi-Channel' },
            { step: '3', title: 'Resume Screening', sub: 'Skill Verification' },
            { step: '4', title: 'Assessment', sub: 'Aptitude & Coding' },
            { step: '5', title: 'Interview Rounds', sub: 'Technical & HR' },
            { step: '6', title: 'Hiring Decision', sub: 'Selection Audit' },
            { step: '7', title: 'Offer Package', sub: 'CTC & Letter' },
            { step: '8', title: 'Induction', sub: 'Employee ID' }
          ].map((s, idx) => (
            <div
              key={s.step}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[11px] mx-auto flex items-center justify-center">
                {s.step}
              </div>
              <div className="font-bold text-slate-900 mt-2 text-[11px] leading-tight">
                {s.title}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
