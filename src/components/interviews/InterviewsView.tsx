import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Interview, Candidate } from '../../types';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import { InterviewFeedbackModal } from './InterviewFeedbackModal';
import { InterviewAnalyticsCharts } from './InterviewAnalyticsCharts';
import { InterviewCalendar } from './InterviewCalendar';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Calendar,
  Clock,
  Video,
  User,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit2,
  FileText,
  RotateCcw,
  BarChart2,
  Eye,
  EyeOff,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';

export const InterviewsView: React.FC = () => {
  const { interviews, cancelInterview, currentUser } = useApp();

  const [viewLayout, setViewLayout] = useState<'calendar' | 'cards'>('calendar');
  const [activeTab, setActiveTab] = useState<'scheduled' | 'completed' | 'all'>('scheduled');
  const [showCharts, setShowCharts] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDefaultDate, setScheduleDefaultDate] = useState<string | null>(null);
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null);
  const [interviewToReschedule, setInterviewToReschedule] = useState<Interview | null>(null);
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(null);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);

  const filteredInterviews = interviews.filter((i) => {
    if (activeTab === 'scheduled') return i.status === 'Scheduled' || i.status === 'Rescheduled';
    if (activeTab === 'completed') return i.status === 'Completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Rescheduled':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const handleSelectInterviewFromCalendar = (interview: Interview) => {
    if (interview.status !== 'Completed' && interview.status !== 'Cancelled') {
      setFeedbackInterview(interview);
    } else if (interview.feedback) {
      setFeedbackInterview(interview);
    }
  };

  const handleScheduleForDate = (dateStr: string) => {
    setScheduleDefaultDate(dateStr);
    setInterviewToReschedule(null);
    setIsScheduleOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Interview Operations &amp; Evaluation Governance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Interview Schedules &amp; Evaluation Rubrics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate multi-stage rounds, track panel evaluations, visualize calendar slots, and reschedule dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Calendar vs Cards Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setViewLayout('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewLayout === 'calendar'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              <span>Calendar Grid</span>
            </button>
            <button
              onClick={() => setViewLayout('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewLayout === 'cards'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>Card List</span>
            </button>
          </div>

          <button
            onClick={() => setShowCharts(!showCharts)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{showCharts ? 'Hide Analytics' : 'Score Analytics'}</span>
          </button>

          <button
            onClick={() => {
              setScheduleDefaultDate(null);
              setInterviewToReschedule(null);
              setIsScheduleOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Interview</span>
          </button>
        </div>
      </div>

      {/* Recharts Analytics Visualization Component (Collapsible) */}
      {showCharts && (
        <div className="transition-all animate-fade-in">
          <InterviewAnalyticsCharts interviews={interviews} />
        </div>
      )}

      {/* Main View Layout Switch: Calendar or Cards */}
      {viewLayout === 'calendar' ? (
        <div className="animate-fade-in">
          <InterviewCalendar
            interviews={interviews}
            onSelectInterview={handleSelectInterviewFromCalendar}
            onScheduleForDate={handleScheduleForDate}
          />
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'scheduled'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming / Scheduled (
                {interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled').length}
                )
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed Evaluations (
                {interviews.filter((i) => i.status === 'Completed').length}
                )
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({interviews.length})
              </button>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              Showing {filteredInterviews.length} rounds
            </div>
          </div>


      {/* Interviews Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInterviews.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-700">No interviews found</div>
            <p className="text-xs text-slate-500 mt-1">
              There are no rounds recorded in the selected view filter.
            </p>
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded border text-[11px] ${getStatusBadge(
                      interview.status
                    )}`}
                  >
                    {interview.status}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{interview.id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {interview.candidateName}
                  </h3>
                  <span className="font-semibold text-blue-600 text-[11px]">
                    {interview.roundName}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  Requisition: {interview.jobTitle}
                </div>

                {/* Details box */}
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{interview.date}</strong> at {interview.time} IST
                    </span>
                    <span className="text-slate-400 font-mono">
                      ({interview.durationMinutes} mins)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Interviewer: <strong>{interview.interviewerName}</strong></span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span>{interview.mode}</span>
                    </span>
                    {interview.meetingLink && (
                      <span className="text-blue-600 font-mono text-[10px] truncate max-w-[150px]">
                        {interview.meetingLink}
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback preview if completed */}
                {interview.feedback && (
                  <div className="mt-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Recommendation: {interview.feedback.overallRecommendation}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {interview.feedback.submittedAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
                      <div>Tech Score: <strong>{interview.feedback.technicalScore}/5</strong></div>
                      <div>Problem Solving: <strong>{interview.feedback.problemSolvingScore}/5</strong></div>
                      <div>Communication: <strong>{interview.feedback.communicationScore}/5</strong></div>
                      <div>Culture Fit: <strong>{interview.feedback.cultureFitScore}/5</strong></div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-emerald-100">
                      "{interview.feedback.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {interview.status !== 'Completed' && interview.status !== 'Cancelled' ? (
                    <button
                      onClick={() => setFeedbackInterview(interview)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Record Evaluation Rubric</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Evaluation finalized
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {interview.status !== 'Completed' && interview.status !== 'Cancelled' && (
                    <>
                      <button
                        onClick={() => {
                          setInterviewToReschedule(interview);
                          setIsScheduleOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
                        title="Reschedule Interview"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInterviewToCancel(interview)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Cancel Interview"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )}

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={isScheduleOpen}
        defaultDate={scheduleDefaultDate}
        onClose={() => {
          setIsScheduleOpen(false);
          setInterviewToReschedule(null);
          setScheduleDefaultDate(null);
        }}
        interviewToReschedule={interviewToReschedule}
      />

      <InterviewFeedbackModal
        interview={feedbackInterview}
        isOpen={!!feedbackInterview}
        onClose={() => setFeedbackInterview(null)}
      />

      <ConfirmationModal
        isOpen={!!interviewToCancel}
        title="Cancel Interview Round"
        description={`Are you sure you want to cancel the interview for ${interviewToCancel?.candidateName}?`}
        confirmLabel="Cancel Interview"
        isDestructive={true}
        onConfirm={() => {
          if (interviewToCancel) {
            cancelInterview(interviewToCancel.id);
            setInterviewToCancel(null);
          }
        }}
        onCancel={() => setInterviewToCancel(null)}
      />
    </div>
  );
};
