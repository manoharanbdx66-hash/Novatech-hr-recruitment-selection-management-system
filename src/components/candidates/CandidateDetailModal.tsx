import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, ApplicationStage } from '../../types';
import {
  X,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  ExternalLink,
  History,
  CheckCircle,
  ArrowRight,
  UserCheck,
  XCircle,
  Clock
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleInterview?: (candidate: Candidate) => void;
}

const STAGES: ApplicationStage[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected',
  'Offer Sent',
  'Hired',
  'Rejected',
  'Withdrawn'
];

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onScheduleInterview
}) => {
  const { audits, updateCandidateStage, currentUser } = useApp();

  const [newStage, setNewStage] = useState<ApplicationStage | ''>('');
  const [stageNote, setStageNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showStageUpdater, setShowStageUpdater] = useState(false);

  if (!isOpen || !candidate) return null;

  const candidateAudits = audits.filter((a) => a.candidateId === candidate.id);

  const handleStageChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStage) return;

    updateCandidateStage(
      candidate.id,
      newStage as ApplicationStage,
      stageNote || undefined,
      rejectionReason || undefined
    );
    setShowStageUpdater(false);
    setNewStage('');
    setStageNote('');
    setRejectionReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>{candidate.id}</span>
              <span>·</span>
              <span>Source: {candidate.source}</span>
              <span>·</span>
              <span className="text-slate-500 font-mono">Applied {candidate.applicationDate}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Candidate for: <span className="font-bold text-slate-800">{candidate.appliedJobTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">
              {candidate.status}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{candidate.qualification}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {candidate.experienceYears} Yrs Experience
                {candidate.currentCompany ? ` · ${candidate.currentCompany}` : ''}
              </span>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Verified Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded bg-white text-slate-800 font-semibold border border-slate-200 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Resume &amp; Professional Summary</span>
              <span className="text-[11px] text-slate-400 font-mono font-normal">
                {candidate.resumeFileName}
              </span>
            </h3>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-sans">
              <p>{candidate.resumeSummary}</p>
              {candidate.notes && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-slate-500 italic">
                  Internal HR Note: {candidate.notes}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stage Progression Box */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">Pipeline Progression Control</span>
                <p className="text-[11px] text-slate-500">
                  Current Stage: <strong className="text-blue-700">{candidate.status}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStageUpdater(!showStageUpdater)}
                className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showStageUpdater ? 'Cancel Update' : 'Change Stage'}
              </button>
            </div>

            {showStageUpdater && (
              <form onSubmit={handleStageChangeSubmit} className="mt-4 pt-3 border-t border-blue-200/60 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Stage *
                    </label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      required
                    >
                      <option value="">Select target stage...</option>
                      {STAGES.map((s) => (
                        <option key={s} value={s} disabled={s === candidate.status}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Action Note
                    </label>
                    <input
                      type="text"
                      value={stageNote}
                      onChange={(e) => setStageNote(e.target.value)}
                      placeholder="e.g. Cleared technical round with high remarks"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {newStage === 'Rejected' && (
                  <div>
                    <label className="block text-xs font-semibold text-rose-700 mb-1">
                      Rejection Reason (Required for Audit Trail)
                    </label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Technology skill gap / salary expectation mismatch"
                      className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg bg-white"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 text-xs shadow-xs"
                  >
                    Confirm &amp; Record Audit Log
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Audit History Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Application Stage Audit Trail</span>
            </h3>

            {candidateAudits.length === 0 ? (
              <div className="text-slate-400 text-xs italic">
                No recorded stage transitions yet.
              </div>
            ) : (
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
                {candidateAudits.map((audit) => (
                  <div key={audit.id} className="relative group">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <span>{audit.fromStage}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-700">{audit.toStage}</span>
                        <span className="text-slate-400 font-mono text-[11px] font-normal">
                          · {audit.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        By {audit.changedBy}
                      </div>
                      {audit.note && (
                        <div className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded">
                          Note: {audit.note}
                        </div>
                      )}
                      {audit.reason && (
                        <div className="text-[11px] text-rose-600 mt-1 bg-rose-50 p-1.5 rounded">
                          Reason: {audit.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {onScheduleInterview && candidate.status !== 'Hired' && candidate.status !== 'Rejected' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleInterview(candidate);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Interview Round</span>
              </button>
            )}
          </div>
          <button
            type="button"
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
