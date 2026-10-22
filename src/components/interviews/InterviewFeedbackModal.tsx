import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Interview, InterviewFeedback } from '../../types';
import { X, Star, CheckCircle, AlertTriangle } from 'lucide-react';

interface InterviewFeedbackModalProps {
  interview: Interview | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewFeedbackModal: React.FC<InterviewFeedbackModalProps> = ({
  interview,
  isOpen,
  onClose
}) => {
  const { submitInterviewFeedback, currentUser } = useApp();

  const [techScore, setTechScore] = useState(4);
  const [psScore, setPsScore] = useState(4);
  const [commScore, setCommScore] = useState(4);
  const [cultureScore, setCultureScore] = useState(5);
  const [overallRec, setOverallRec] = useState<
    'Strong Hire' | 'Hire' | 'Hold' | 'Strong Reject'
  >('Hire');
  const [notes, setNotes] = useState('');
  const [strengthsInput, setStrengthsInput] = useState('');
  const [strengths, setStrengths] = useState<string[]>([
    'Strong foundational understanding',
    'Clear communication during live coding'
  ]);
  const [improvementsInput, setImprovementsInput] = useState('');
  const [improvements, setImprovements] = useState<string[]>([
    'Can gain deeper exposure to distributed database sharding'
  ]);

  if (!isOpen || !interview) return null;

  const handleAddStrength = () => {
    if (strengthsInput.trim()) {
      setStrengths([...strengths, strengthsInput.trim()]);
      setStrengthsInput('');
    }
  };

  const handleAddImprovement = () => {
    if (improvementsInput.trim()) {
      setImprovements([...improvements, improvementsInput.trim()]);
      setImprovementsInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitInterviewFeedback(interview.id, {
      technicalScore: techScore,
      problemSolvingScore: psScore,
      communicationScore: commScore,
      cultureFitScore: cultureScore,
      overallRecommendation: overallRec,
      notes: notes || 'Detailed evaluation completed according to standardized company rubrics.',
      strengths,
      areasOfImprovement: improvements
    });

    onClose();
  };

  const renderStarPicker = (
    label: string,
    value: number,
    setter: (val: number) => void
  ) => {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
        <span className="text-xs font-semibold text-slate-800">{label}</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setter(star)}
              className={`p-1 rounded transition-colors ${
                star <= value ? 'text-amber-500' : 'text-slate-300'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          ))}
          <span className="text-xs font-mono font-bold text-slate-700 ml-1.5 w-6 text-right">
            {value}/5
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-blue-600">
              Evaluation Rubric · {interview.roundName}
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Interview Feedback: {interview.candidateName}
            </h3>
            <p className="text-xs text-slate-500">
              Role: {interview.jobTitle} · Evaluator: {currentUser.name}
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
          {/* Competency Scoring Rubrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Core Competency Ratings (1 to 5 Scale)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {renderStarPicker('Technical Domain Knowledge', techScore, setTechScore)}
              {renderStarPicker('Problem Solving & Analytical Ability', psScore, setPsScore)}
              {renderStarPicker('Communication & Articulation', commScore, setCommScore)}
              {renderStarPicker('Cultural Alignment & Teamwork', cultureScore, setCultureScore)}
            </div>
          </div>

          {/* Overall Hiring Recommendation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. Overall Hiring Recommendation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 'Strong Hire', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                { val: 'Hire', color: 'border-blue-500 bg-blue-50 text-blue-900' },
                { val: 'Hold', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                { val: 'Strong Reject', color: 'border-rose-500 bg-rose-50 text-rose-900' }
              ].map(({ val, color }) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setOverallRec(val as any)}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                    overallRec === val ? `${color} ring-2 ring-current` : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Key Strengths */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Demonstrated Strengths
            </label>
            <div className="flex gap-2 mb-1.5">
              <input
                type="text"
                value={strengthsInput}
                onChange={(e) => setStrengthsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStrength();
                  }
                }}
                placeholder="Add positive observation..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddStrength}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {strengths.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Areas of Improvement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Areas of Improvement / Gaps
            </label>
            <div className="flex gap-2 mb-1.5">
              <input
                type="text"
                value={improvementsInput}
                onChange={(e) => setImprovementsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImprovement();
                  }
                }}
                placeholder="Add constructive observation..."
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddImprovement}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {improvements.map((imp, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px]"
                >
                  ⚠ {imp}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluator Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Comprehensive Evaluator Notes &amp; Synthesis *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detailed synthesis of technical code challenge, system design solution, communication depth, and hiring rationale..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
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
              Submit Official Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
