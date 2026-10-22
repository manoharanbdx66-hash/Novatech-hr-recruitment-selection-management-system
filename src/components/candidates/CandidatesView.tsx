import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, ApplicationStage } from '../../types';
import { CandidateFormModal } from './CandidateFormModal';
import { CandidateDetailModal } from './CandidateDetailModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  Mail,
  Phone,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface CandidatesViewProps {
  onScheduleInterview?: (candidate: Candidate) => void;
  selectedCandidateForView?: Candidate | null;
  onClearSelectedCandidate?: () => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  onScheduleInterview,
  selectedCandidateForView,
  onClearSelectedCandidate
}) => {
  const { candidates, jobs, deleteCandidate, currentUser, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedStageFilter, setSelectedStageFilter] = useState('All');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCandidateDetail, setActiveCandidateDetail] = useState<Candidate | null>(
    selectedCandidateForView || null
  );
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const canManage = currentUser.role === 'admin' || currentUser.role === 'hr_manager';

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedJobTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesJob = selectedJobFilter === 'All' || c.appliedJobId === selectedJobFilter;
    const matchesStage = selectedStageFilter === 'All' || c.status === selectedStageFilter;
    const matchesSource = selectedSourceFilter === 'All' || c.source === selectedSourceFilter;

    return matchesSearch && matchesJob && matchesStage && matchesSource;
  });

  const exportCSV = () => {
    const headers = [
      'Candidate ID',
      'Name',
      'Email',
      'Phone',
      'Qualification',
      'Experience (Yrs)',
      'Skills',
      'Applied Job',
      'Stage',
      'Source',
      'Applied Date'
    ];
    const rows = filteredCandidates.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.qualification}"`,
      c.experienceYears,
      `"${c.skills.join('; ')}"`,
      `"${c.appliedJobTitle}"`,
      c.status,
      c.source,
      c.applicationDate
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `NovaTech_Candidates_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredCandidates.length} candidate records to CSV.`);
  };

  const getStageBadge = (stage: ApplicationStage) => {
    switch (stage) {
      case 'Applied':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'Under Review':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Shortlisted':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Assessment':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Interview':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Selected':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'Offer Sent':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Hired':
        return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold';
      case 'Rejected':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Withdrawn':
        return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Candidate Roster &amp; Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of all applicants across departments, requisitions, and sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, email, skill..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Job Filter */}
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Assessment">Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Offer Sent">Offer Sent</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Employee Referral">Employee Referral</option>
            <option value="Campus Placement">Campus Placement</option>
            <option value="Career Portal">Career Portal</option>
            <option value="Job Board">Job Board</option>
            <option value="Direct">Direct</option>
          </select>

          <span className="text-xs text-slate-400 font-mono pl-1">
            {filteredCandidates.length} found
          </span>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate &amp; Contact</th>
                <th className="py-3 px-4">Applied Job</th>
                <th className="py-3 px-4">Experience &amp; Edu</th>
                <th className="py-3 px-4">Core Skills</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No candidate records found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                      <div className="text-[11px] text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-[200px]">
                      <div className="truncate">{c.appliedJobTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Applied {c.applicationDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold">{c.experienceYears} Yrs Exp</div>
                      <div className="text-[11px] text-slate-500 max-w-[150px] truncate">
                        {c.qualification}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {c.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{c.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.source}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${getStageBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveCandidateDetail(c)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        >
                          View Profile
                        </button>
                        {canManage && (
                          <button
                            onClick={() => setCandidateToDelete(c)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete candidate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CandidateFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <CandidateDetailModal
        candidate={activeCandidateDetail}
        isOpen={!!activeCandidateDetail}
        onClose={() => {
          setActiveCandidateDetail(null);
          onClearSelectedCandidate?.();
        }}
        onScheduleInterview={onScheduleInterview}
      />

      <ConfirmationModal
        isOpen={!!candidateToDelete}
        title="Remove Candidate"
        description={`Are you sure you want to delete ${candidateToDelete?.name}? All associated screening and application audits will be permanently removed.`}
        confirmLabel="Remove Candidate"
        isDestructive={true}
        onConfirm={() => {
          if (candidateToDelete) {
            deleteCandidate(candidateToDelete.id);
            setCandidateToDelete(null);
          }
        }}
        onCancel={() => setCandidateToDelete(null)}
      />
    </div>
  );
};
