import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, JobOffer } from '../../types';
import { X, IndianRupee, Calendar, FileText } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateToOffer?: Candidate | null;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  candidateToOffer
}) => {
  const { candidates, jobs, createOffer, currentUser } = useApp();

  const [candidateId, setCandidateId] = useState(
    candidateToOffer?.id || candidates.find((c) => c.status === 'Selected')?.id || candidates[0]?.id || ''
  );
  const [designation, setDesignation] = useState('');
  const [ctcAnnualLakhs, setCtcAnnualLakhs] = useState(16.5);
  const [joiningDate, setJoiningDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Standard probation of 3 months applies. Sign-on bonus included.');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCandidate = candidates.find((c) => c.id === candidateId);
  const targetJob = selectedCandidate
    ? jobs.find((j) => j.id === selectedCandidate.appliedJobId)
    : null;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const newErrors: Record<string, string> = {};
    if (!designation.trim() && !targetJob?.title) {
      newErrors.designation = 'Designation is required';
    }
    if (ctcAnnualLakhs <= 0) {
      newErrors.ctc = 'Valid CTC is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createOffer({
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      candidateEmail: selectedCandidate.email,
      jobId: targetJob?.id || selectedCandidate.appliedJobId,
      jobTitle: targetJob?.title || selectedCandidate.appliedJobTitle,
      department: targetJob?.department || 'Software Engineering',
      offeredDesignation: designation.trim() || targetJob?.title || 'Engineer',
      ctcAnnualLakhs,
      joiningDate,
      approvedBy: `${currentUser.name} (${currentUser.title})`,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Draft Employment Offer Letter
            </h3>
            <p className="text-xs text-slate-500">
              NovaTech Solutions Pvt. Ltd. Formal Selection &amp; Compensation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Candidate select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selected Candidate *
            </label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — Stage: {c.status} ({c.appliedJobTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Offered Official Designation *
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder={targetJob?.title || 'e.g. Senior Software Engineer'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            {errors.designation && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.designation}</p>
            )}
          </div>

          {/* CTC & Joining Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Fixed CTC (₹ Lakhs) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.25"
                  min="3"
                  max="100"
                  value={ctcAnnualLakhs}
                  onChange={(e) => setCtcAnnualLakhs(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              {errors.ctc && <p className="text-[11px] text-rose-600 mt-1">{errors.ctc}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Joining Date *
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Offer Package Notes &amp; Clauses
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Summary Preview */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Offer Package Preview</div>
            <div>Monthly Gross Approx: ₹{((ctcAnnualLakhs * 100000) / 12).toFixed(0)} / month</div>
            <div>Office: Chennai OMR Cyber Gateway · Standard 5-day week</div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Generate Offer Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
