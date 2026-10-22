import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, ApplicationStage } from '../../types';
import { CandidateDetailModal } from '../candidates/CandidateDetailModal';
import {
  GitPullRequest,
  Filter,
  ArrowRight,
  ArrowLeft,
  User,
  Clock,
  Briefcase,
  ChevronRight,
  MoveRight,
  CheckCircle,
  XCircle
} from 'lucide-react';

const KANBAN_STAGES: { stage: ApplicationStage; label: string; headerColor: string }[] = [
  { stage: 'Applied', label: '1. Applied', headerColor: 'border-slate-400 text-slate-800' },
  { stage: 'Under Review', label: '2. Under Review', headerColor: 'border-blue-500 text-blue-700' },
  { stage: 'Shortlisted', label: '3. Shortlisted', headerColor: 'border-emerald-500 text-emerald-700' },
  { stage: 'Assessment', label: '4. Assessment', headerColor: 'border-purple-500 text-purple-700' },
  { stage: 'Interview', label: '5. Interview Round', headerColor: 'border-amber-500 text-amber-700' },
  { stage: 'Selected', label: '6. Selected', headerColor: 'border-cyan-500 text-cyan-700' },
  { stage: 'Offer Sent', label: '7. Offer Sent', headerColor: 'border-indigo-500 text-indigo-700' },
  { stage: 'Hired', label: '8. Hired / Onboard', headerColor: 'border-emerald-600 text-emerald-800' }
];

export const PipelineView: React.FC = () => {
  const { candidates, jobs, updateCandidateStage } = useApp();

  const [selectedJobId, setSelectedJobId] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Quick move modal state
  const [movingCandidate, setMovingCandidate] = useState<Candidate | null>(null);
  const [targetStage, setTargetStage] = useState<ApplicationStage>('Under Review');
  const [moveNote, setMoveNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredCandidates = candidates.filter((c) => {
    return selectedJobId === 'All' || c.appliedJobId === selectedJobId;
  });

  const handleOpenMove = (candidate: Candidate, nextStage: ApplicationStage) => {
    setMovingCandidate(candidate);
    setTargetStage(nextStage);
    setMoveNote('');
    setRejectionReason('');
  };

  const handleConfirmMove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingCandidate) return;

    updateCandidateStage(
      movingCandidate.id,
      targetStage,
      moveNote || undefined,
      targetStage === 'Rejected' ? rejectionReason : undefined
    );

    setMovingCandidate(null);
  };

  const getNextStage = (current: ApplicationStage): ApplicationStage | null => {
    const sequence: ApplicationStage[] = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Assessment',
      'Interview',
      'Selected',
      'Offer Sent',
      'Hired'
    ];
    const idx = sequence.indexOf(current);
    if (idx !== -1 && idx < sequence.length - 1) {
      return sequence[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Stage-Gated Selection Matrix</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Recruitment Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize candidate distribution across hiring gates with auditable status progression.
          </p>
        </div>

        {/* Requisition Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Requisition:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Active Requisitions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container (Horizontal Scroll) */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {KANBAN_STAGES.map(({ stage, label, headerColor }) => {
            const stageCandidates = filteredCandidates.filter((c) => c.status === stage);

            return (
              <div
                key={stage}
                className="w-72 shrink-0 bg-slate-100/75 rounded-xl border border-slate-200 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className={`p-3 border-b-2 bg-white rounded-t-xl flex items-center justify-between ${headerColor}`}>
                  <span className="text-xs font-bold">{label}</span>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in Column */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
                  {stageCandidates.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No candidates in this stage
                    </div>
                  ) : (
                    stageCandidates.map((c) => {
                      const next = getNextStage(c.status);
                      return (
                        <div
                          key={c.id}
                          className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all text-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span
                              onClick={() => setSelectedCandidate(c)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                            >
                              {c.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {c.experienceYears}y
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {c.appliedJobTitle}
                          </div>

                          {/* Skills badge */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {c.skills.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium"
                              >
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 2 && (
                              <span className="text-[9px] text-slate-400">
                                +{c.skills.length - 2}
                              </span>
                            )}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 text-[10px]">
                              {c.source}
                            </span>

                            {/* Action progression buttons */}
                            <div className="flex items-center gap-1">
                              {next && (
                                <button
                                  onClick={() => handleOpenMove(c, next)}
                                  className="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Advance to ${next}`}
                                >
                                  <span>Advance</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenMove(c, 'Rejected')}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded text-[10px]"
                                title="Reject candidate"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {/* Rejected Column */}
          <div className="w-72 shrink-0 bg-rose-50/40 rounded-xl border border-rose-200 flex flex-col max-h-[75vh]">
            <div className="p-3 border-b-2 bg-white rounded-t-xl flex items-center justify-between border-rose-400 text-rose-800">
              <span className="text-xs font-bold">Rejected Pool</span>
              <span className="text-xs font-mono font-bold bg-rose-100 px-2 py-0.5 rounded text-rose-800">
                {filteredCandidates.filter((c) => c.status === 'Rejected').length}
              </span>
            </div>
            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {filteredCandidates.filter((c) => c.status === 'Rejected').map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className="bg-white p-3 rounded-lg border border-rose-100 shadow-2xs hover:border-rose-300 transition-all text-xs cursor-pointer"
                >
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.appliedJobTitle}</div>
                  {c.rejectionReason && (
                    <div className="mt-1 text-[10px] text-rose-700 bg-rose-50 p-1 rounded font-medium">
                      Reason: {c.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Move Stage Modal */}
      {movingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Advance Candidate Stage
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Moving <strong className="text-slate-800">{movingCandidate.name}</strong> from{' '}
              <strong className="text-slate-700">{movingCandidate.status}</strong> to{' '}
              <strong className="text-blue-700">{targetStage}</strong>.
            </p>

            <form onSubmit={handleConfirmMove} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transition Note / Comments
                </label>
                <input
                  type="text"
                  value={moveNote}
                  onChange={(e) => setMoveNote(e.target.value)}
                  placeholder="e.g. Cleared round with positive recommendation"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {targetStage === 'Rejected' && (
                <div>
                  <label className="block text-xs font-semibold text-rose-700 mb-1">
                    Rejection Reason (Required for Compliance) *
                  </label>
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Skill gap in React architecture / Assessment threshold not met"
                    className="w-full px-3 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMovingCandidate(null)}
                  className="px-3 py-1.5 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-xs"
                >
                  Confirm Stage Move
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate detail view */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};
