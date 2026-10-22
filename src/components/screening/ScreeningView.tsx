import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, Job, ScreeningRecord } from '../../types';
import {
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const ScreeningView: React.FC = () => {
  const { candidates, jobs, screenings, submitScreening, currentUser } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates.find((c) => c.status === 'Applied' || c.status === 'Under Review')?.id || candidates[0]?.id || ''
  );
  const [recommendation, setRecommendation] = useState<'Shortlist' | 'Hold' | 'Reject'>('Shortlist');
  const [reviewerNotes, setReviewerNotes] = useState('');

  const currentCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const targetJob = currentCandidate
    ? jobs.find((j) => j.id === currentCandidate.appliedJobId)
    : null;

  // Screening computation logic
  const calculateScreeningMatch = (candidate?: Candidate, job?: Job | null) => {
    if (!candidate || !job) {
      return {
        score: 0,
        matchedSkills: [],
        missingSkills: [],
        experienceMatch: false,
        qualificationMatch: false
      };
    }

    const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    const matchedSkills = job.requiredSkills.filter((s) =>
      candidateSkillsLower.includes(s.toLowerCase())
    );
    const missingSkills = job.requiredSkills.filter(
      (s) => !candidateSkillsLower.includes(s.toLowerCase())
    );

    const skillsScore =
      job.requiredSkills.length > 0
        ? (matchedSkills.length / job.requiredSkills.length) * 60
        : 60;

    const experienceMatch = candidate.experienceYears >= job.experienceMin;
    const expScore = experienceMatch ? 25 : Math.max(5, (candidate.experienceYears / (job.experienceMin || 1)) * 25);

    const qualificationMatch =
      candidate.qualification.toLowerCase().includes('b.e') ||
      candidate.qualification.toLowerCase().includes('b.tech') ||
      candidate.qualification.toLowerCase().includes('m.tech') ||
      candidate.qualification.toLowerCase().includes('b.des');
    const qualScore = qualificationMatch ? 15 : 8;

    const totalScore = Math.min(100, Math.round(skillsScore + expScore + qualScore));

    return {
      score: totalScore,
      matchedSkills,
      missingSkills,
      experienceMatch,
      qualificationMatch
    };
  };

  const screeningAnalysis = calculateScreeningMatch(currentCandidate, targetJob);
  const existingRecord = screenings.find((s) => s.candidateId === selectedCandidateId);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate || !targetJob) return;

    submitScreening({
      candidateId: currentCandidate.id,
      candidateName: currentCandidate.name,
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      matchScore: screeningAnalysis.score,
      experienceMatch: screeningAnalysis.experienceMatch,
      qualificationMatch: screeningAnalysis.qualificationMatch,
      matchedSkills: screeningAnalysis.matchedSkills,
      missingSkills: screeningAnalysis.missingSkills,
      recommendation,
      reviewerNotes: reviewerNotes || `Evaluated by ${currentUser.name}. Score: ${screeningAnalysis.score}%. Recommendation: ${recommendation}.`
    });

    setReviewerNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Principles of Management · Staffing Phase</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Candidate Screening &amp; Requirement Verification
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Systematic preliminary qualification scoring against job descriptions and required competencies.
          </p>
        </div>

        {/* Ethical AI / Non-binding Notice */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Screening Aid:</strong> Algorithmic scores are non-binding. Mandatory human HR review required before selection or rejection.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidates Awaiting Screening */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Candidates for Review</h2>
            <span className="text-xs font-mono text-slate-400">{candidates.length} total</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[600px] flex-1">
            {candidates.map((c) => {
              const isSelected = c.id === selectedCandidateId;
              const hasScreening = screenings.some((s) => s.candidateId === c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.name}</span>
                    {hasScreening ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                        Evaluated
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {c.appliedJobTitle}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{c.experienceYears} yrs exp</span>
                    <span className="font-mono text-blue-600 font-medium">{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Screening Analysis & Decision Form */}
        <div className="lg:col-span-2 space-y-6">
          {currentCandidate && targetJob ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Profile Bar */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-semibold text-blue-600">
                    Application ID: {currentCandidate.id} · Applied on {currentCandidate.applicationDate}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {currentCandidate.name}
                  </h2>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Target Requisition:{' '}
                    <strong className="text-slate-800">{targetJob.title}</strong> ({targetJob.department})
                  </div>
                </div>

                {/* Calculated Score Aid Pill */}
                <div className="text-center bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[120px]">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Screening Match
                  </div>
                  <div className="text-3xl font-extrabold text-blue-600">
                    {screeningAnalysis.score}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Automated Aid</div>
                </div>
              </div>

              {/* Requirement Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Experience Check */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Experience Criteria</span>
                    {screeningAnalysis.experienceMatch ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Met
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Below Min
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600">
                    Required: {targetJob.experienceMin} - {targetJob.experienceMax} Yrs · Candidate has:{' '}
                    <strong>{currentCandidate.experienceYears} Yrs</strong>
                  </div>
                </div>

                {/* Qualification Check */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Educational Degree</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <div className="text-slate-600 truncate" title={currentCandidate.qualification}>
                    Candidate Degree: <strong>{currentCandidate.qualification}</strong>
                  </div>
                </div>
              </div>

              {/* Skills Overlap */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Skill Match Matrix Against Job Specification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Matched */}
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/30">
                    <div className="font-semibold text-emerald-900 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched Required Skills ({screeningAnalysis.matchedSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {screeningAnalysis.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Missing / Not Listed ({screeningAnalysis.missingSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {screeningAnalysis.missingSkills.length === 0 ? (
                        <span className="text-slate-500 italic">None - Complete match!</span>
                      ) : (
                        screeningAnalysis.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Summary */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <span className="font-semibold text-slate-800 block mb-1">
                  Candidate Profile Summary:
                </span>
                <p className="leading-relaxed">{currentCandidate.resumeSummary}</p>
              </div>

              {/* HR Screening Decision Form */}
              <form
                onSubmit={handleSubmitEvaluation}
                className="pt-4 border-t border-slate-200 space-y-4"
              >
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>HR Screening Recommendation &amp; Audit Recording</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      recommendation === 'Shortlist'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommendation"
                      value="Shortlist"
                      checked={recommendation === 'Shortlist'}
                      onChange={() => setRecommendation('Shortlist')}
                      className="sr-only"
                    />
                    <span>Shortlist for Assessment</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </label>

                  <label
                    className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      recommendation === 'Hold'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommendation"
                      value="Hold"
                      checked={recommendation === 'Hold'}
                      onChange={() => setRecommendation('Hold')}
                      className="sr-only"
                    />
                    <span>Hold / Talent Pool</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </label>

                  <label
                    className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      recommendation === 'Reject'
                        ? 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommendation"
                      value="Reject"
                      checked={recommendation === 'Reject'}
                      onChange={() => setRecommendation('Reject')}
                      className="sr-only"
                    />
                    <span>Reject at Screening</span>
                    <XCircle className="w-4 h-4 text-rose-600" />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reviewer Justification &amp; Notes *
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="Document qualitative rationale, verified portfolio highlights, or reasons for screening decision..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Screening Decision
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a candidate from the left panel to review screening criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
