import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, InterviewRound, InterviewMode, Interview } from '../../types';
import { X, Calendar, Clock, Video, User } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateToSchedule?: Candidate | null;
  interviewToReschedule?: Interview | null;
  defaultDate?: string | null;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidateToSchedule,
  interviewToReschedule,
  defaultDate
}) => {
  const { candidates, jobs, users, scheduleInterview, updateInterview } = useApp();

  const [candidateId, setCandidateId] = useState(candidateToSchedule?.id || candidates[0]?.id || '');
  const [interviewerId, setInterviewerId] = useState(users[2]?.id || users[0]?.id || '');
  const [roundName, setRoundName] = useState<InterviewRound>('Technical Round 1');
  const [date, setDate] = useState(() => {
    if (defaultDate) return defaultDate;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('14:30');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [mode, setMode] = useState<InterviewMode>('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/nts-interview');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate);
    }
    if (candidateToSchedule) {
      setCandidateId(candidateToSchedule.id);
    }
    if (interviewToReschedule) {
      setCandidateId(interviewToReschedule.candidateId);
      setInterviewerId(interviewToReschedule.interviewerId);
      setRoundName(interviewToReschedule.roundName);
      setDate(interviewToReschedule.date);
      setTime(interviewToReschedule.time);
      setDurationMinutes(interviewToReschedule.durationMinutes);
      setMode(interviewToReschedule.mode);
      setMeetingLink(interviewToReschedule.meetingLink || '');
    }
  }, [candidateToSchedule, interviewToReschedule, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!candidateId) newErrors.candidate = 'Candidate is required';
    if (!interviewerId) newErrors.interviewer = 'Interviewer is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCand = candidates.find((c) => c.id === candidateId);
    const selectedInterviewer = users.find((u) => u.id === interviewerId);
    const targetJob = selectedCand ? jobs.find((j) => j.id === selectedCand.appliedJobId) : null;

    if (!selectedCand || !selectedInterviewer) return;

    if (interviewToReschedule) {
      updateInterview(interviewToReschedule.id, {
        date,
        time,
        durationMinutes,
        mode,
        meetingLink,
        roundName,
        interviewerId,
        interviewerName: selectedInterviewer.name,
        status: 'Rescheduled'
      });
    } else {
      scheduleInterview({
        candidateId: selectedCand.id,
        candidateName: selectedCand.name,
        candidateEmail: selectedCand.email,
        jobId: targetJob?.id || selectedCand.appliedJobId,
        jobTitle: targetJob?.title || selectedCand.appliedJobTitle,
        interviewerId: selectedInterviewer.id,
        interviewerName: selectedInterviewer.name,
        roundName,
        date,
        time,
        durationMinutes,
        mode,
        meetingLink: mode.includes('Meet') || mode.includes('Teams') ? meetingLink : undefined
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {interviewToReschedule ? 'Reschedule Interview Round' : 'Schedule Evaluation Interview'}
            </h3>
            <p className="text-xs text-slate-500">
              Coordinate technical or HR rounds with evaluator &amp; candidate
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
          {/* Candidate selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate *
            </label>
            <select
              value={candidateId}
              disabled={!!candidateToSchedule || !!interviewToReschedule}
              onChange={(e) => setCandidateId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.appliedJobTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Round Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluation Stage / Round *
              </label>
              <select
                value={roundName}
                onChange={(e) => setRoundName(e.target.value as InterviewRound)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Technical Round 1">Technical Round 1 (Coding/Design)</option>
                <option value="Technical Round 2">Technical Round 2 (Architecture/Deep Dive)</option>
                <option value="HR Round">HR Round (Values &amp; Culture)</option>
                <option value="Managerial Round">Managerial Round (Leadership)</option>
              </select>
            </div>

            {/* Assigned Evaluator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Interviewer *
              </label>
              <select
                value={interviewerId}
                onChange={(e) => setInterviewerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time (IST) *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (Mins)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
              </select>
            </div>
          </div>

          {/* Interview Mode & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interview Medium / Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as InterviewMode)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="In-Person (Chennai HQ)">In-Person (OMR Tech Park)</option>
                <option value="Phone Screen">Phone Screen</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meeting Link / Room
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-[11px]">
            Note: Fictional calendar invites and simulated demo links are registered within the local schedule table.
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
              {interviewToReschedule ? 'Update Schedule' : 'Confirm Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
