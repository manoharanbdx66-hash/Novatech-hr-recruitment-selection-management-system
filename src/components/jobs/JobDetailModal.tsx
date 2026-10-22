import React from 'react';
import { useApp } from '../../context/AppContext';
import { Job, Candidate } from '../../types';
import {
  X,
  Briefcase,
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
  Edit2
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: Job) => void;
  onSelectCandidate?: (candidate: Candidate) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onSelectCandidate
}) => {
  const { candidates, currentUser } = useApp();

  if (!isOpen || !job) return null;

  const jobCandidates = candidates.filter((c) => c.appliedJobId === job.id);
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'hr_manager';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>{job.id}</span>
              <span>·</span>
              <span>{job.department}</span>
              <span>·</span>
              <span className="text-slate-500 font-mono">{job.employmentType}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {job.experienceMin} - {job.experienceMax} Yrs Exp
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                ₹{job.salaryMinLakhs} - ₹{job.salaryMaxLakhs} LPA
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Closes {job.closingDate}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(job);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Role Overview
            </h3>
            <p className="leading-relaxed text-slate-600 bg-slate-50/60 p-3.5 rounded-lg border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Required Skills &amp; Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Key Responsibilities
              </h3>
              <ul className="space-y-1.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualification */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Minimum Educational Qualification
            </h3>
            <p className="text-slate-600">{job.qualification}</p>
          </div>

          {/* Applicants for this Job */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Associated Applicants ({jobCandidates.length})</span>
              </h3>
            </div>

            {jobCandidates.length === 0 ? (
              <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                No applicants registered for this job opening yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Candidate</th>
                      <th className="py-2.5 px-3">Experience</th>
                      <th className="py-2.5 px-3">Stage</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobCandidates.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {c.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {c.experienceYears} yrs
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-700">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{c.source}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectCandidate?.(c);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
