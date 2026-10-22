import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  FileCheck2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  UserPlus,
  Clock,
  Building2,
  ArrowRight,
  Download
} from 'lucide-react';
import { NavItem } from '../common/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavItem) => void;
  onOpenCreateJob: () => void;
  onOpenAddCandidate: () => void;
  onOpenScheduleInterview: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCreateJob,
  onOpenAddCandidate,
  onOpenScheduleInterview
}) => {
  const { jobs, candidates, interviews, offers, employees, audits, showToast } = useApp();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'quarter'>('all');

  const activeJobs = jobs.filter((j) => j.status === 'Published');
  const shortlistedCandidates = candidates.filter((c) =>
    ['Shortlisted', 'Assessment', 'Interview', 'Selected', 'Offer Sent', 'Hired'].includes(c.status)
  );
  const scheduledInterviews = interviews.filter((i) => i.status === 'Scheduled');
  const offersMade = offers.filter((o) => ['Sent', 'Accepted'].includes(o.status));
  const hiredCount = candidates.filter((c) => c.status === 'Hired').length;

  // Funnel conversion calculation
  const funnelStages = [
    { label: 'Applied', count: candidates.length, color: 'bg-slate-500' },
    {
      label: 'Screened & Shortlisted',
      count: candidates.filter((c) =>
        ['Shortlisted', 'Assessment', 'Interview', 'Selected', 'Offer Sent', 'Hired'].includes(c.status)
      ).length,
      color: 'bg-blue-500'
    },
    {
      label: 'Interview Round',
      count: candidates.filter((c) =>
        ['Interview', 'Selected', 'Offer Sent', 'Hired'].includes(c.status)
      ).length,
      color: 'bg-indigo-500'
    },
    {
      label: 'Selected & Offered',
      count: candidates.filter((c) => ['Selected', 'Offer Sent', 'Hired'].includes(c.status)).length,
      color: 'bg-amber-500'
    },
    {
      label: 'Onboarded Hires',
      count: hiredCount,
      color: 'bg-emerald-500'
    }
  ];

  // Applications per job breakdown
  const jobApplicantCounts = jobs.map((job) => ({
    job,
    count: candidates.filter((c) => c.appliedJobId === job.id).length
  }));

  // Upcoming interviews (next 3)
  const upcomingInterviews = interviews
    .filter((i) => i.status === 'Scheduled')
    .slice(0, 4);

  // Recent applications (last 5)
  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5);

  const exportSummaryCSV = () => {
    const headers = ['Candidate ID', 'Name', 'Email', 'Role Applied', 'Stage', 'Date', 'Source'];
    const rows = candidates.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.appliedJobTitle}"`,
      c.status,
      c.applicationDate,
      c.source
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NovaTech_Recruitment_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported recruitment candidate dataset to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <span>Executive HR Cockpit</span>
            <span className="text-slate-300">·</span>
            <span>NovaTech Talent Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Recruitment &amp; Selection Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline analytics, candidate lifecycle tracking, and selection governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreateJob}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Job</span>
          </button>
          <button
            onClick={onOpenAddCandidate}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
          <button
            onClick={onOpenScheduleInterview}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Schedule Round</span>
          </button>
          <button
            onClick={exportSummaryCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            title="Export candidate pipeline data as CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Active Openings */}
        <div
          onClick={() => onNavigate('jobs')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Job Openings</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{activeJobs.length}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>{jobs.reduce((acc, j) => acc + j.openingsCount, 0)} total positions</span>
          </div>
        </div>

        {/* Total Applicants */}
        <div
          onClick={() => onNavigate('candidates')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Applicants</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{candidates.length}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Across 6 active requisitions</span>
          </div>
        </div>

        {/* Candidates Shortlisted */}
        <div
          onClick={() => onNavigate('screening')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Shortlisted Pool</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{shortlistedCandidates.length}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <span>
              {candidates.length ? Math.round((shortlistedCandidates.length / candidates.length) * 100) : 0}% qualification rate
            </span>
          </div>
        </div>

        {/* Scheduled Interviews */}
        <div
          onClick={() => onNavigate('interviews')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Interviews Scheduled</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{scheduledInterviews.length}</div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>{interviews.filter((i) => i.status === 'Completed').length} completed</span>
          </div>
        </div>

        {/* Offers & Hires */}
        <div
          onClick={() => onNavigate('selection')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Offers / Hired</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {offersMade.length} <span className="text-sm font-normal text-slate-400">/ {hiredCount}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>{employees.length} active onboards</span>
          </div>
        </div>
      </div>

      {/* Charts & Funnel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel Conversion */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recruitment Funnel Conversion Flow
              </h2>
              <p className="text-xs text-slate-500">
                Stage-by-stage attrition and qualification progression
              </p>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>View Pipeline Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const baseCount = candidates.length || 1;
              const percentage = Math.round((stage.count / baseCount) * 100);
              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">
                      {idx + 1}. {stage.label}
                    </span>
                    <span className="font-mono text-slate-500">
                      {stage.count} candidates ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Overall Selection Yield Ratio:{' '}
              <strong className="text-slate-800">
                {candidates.length ? ((hiredCount / candidates.length) * 100).toFixed(1) : 0}%
              </strong>
            </div>
            <div>
              Offer Acceptance Rate:{' '}
              <strong className="text-emerald-700">92% (Benchmark 85%)</strong>
            </div>
          </div>
        </div>

        {/* Applications by Job */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Demand by Job</h2>
              <p className="text-xs text-slate-500">Requisitions with applicant loads</p>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>All Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {jobApplicantCounts.map(({ job, count }) => (
              <div
                key={job.id}
                className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                    {job.title}
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 shrink-0">
                    {count} apps
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{job.department}</span>
                  <span>·</span>
                  <span>{job.openingsCount} openings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
              <p className="text-xs text-slate-500">Latest submissions awaiting evaluation</p>
            </div>
            <button
              onClick={() => onNavigate('candidates')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>View All ({candidates.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Role</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-[200px] truncate">
                      {c.appliedJobTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.source}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {c.applicationDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews Schedule (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Interviews</h2>
              <p className="text-xs text-slate-500">Scheduled evaluation rounds</p>
            </div>
            <button
              onClick={() => onNavigate('interviews')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No upcoming interviews scheduled.
              </div>
            ) : (
              upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {interview.candidateName}
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium">
                        {interview.roundName}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {interview.time}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span className="truncate">Interviewer: {interview.interviewerName}</span>
                    <span className="font-mono">{interview.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
