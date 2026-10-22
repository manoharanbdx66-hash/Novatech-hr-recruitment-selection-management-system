import React, { useState, useMemo } from 'react';
import { Interview } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  Plus,
  Move,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface InterviewCalendarProps {
  interviews: Interview[];
  onSelectInterview: (interview: Interview) => void;
  onScheduleForDate: (dateStr: string) => void;
}

export const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
  interviews,
  onSelectInterview,
  onScheduleForDate
}) => {
  const { updateInterview, showToast } = useApp();

  // Current view mode: 'month' | 'week'
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Navigation state: current viewing date anchor
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 15)); // October 2026 anchor

  // Drag and drop state
  const [draggedInterviewId, setDraggedInterviewId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate forward/back
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 15)); // Reset to demo anchor
  };

  // Group interviews by YYYY-MM-DD
  const interviewsByDate = useMemo(() => {
    const map: Record<string, Interview[]> = {};
    interviews.forEach((item) => {
      if (!map[item.date]) {
        map[item.date] = [];
      }
      map[item.date].push(item);
    });
    // Sort each day's interviews by time
    Object.keys(map).forEach((dateKey) => {
      map[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    });
    return map;
  }, [interviews]);

  // Generate Month Grid Days
  const monthGridDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Previous month padding days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      // Format YYYY-MM-DD manually to prevent timezone offset shifts
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === 15 && month === 9 && year === 2026;
      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday
      });
    }

    // Next month padding days to fill 35 or 42 cells
    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  }, [year, month]);

  // Generate Week Days (Sunday to Saturday around currentDate)
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay();
    const sunday = new Date(curr);
    sunday.setDate(curr.getDate() - dayOfWeek);

    const days: {
      dateStr: string;
      dayNumber: number;
      dayName: string;
      isToday: boolean;
    }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dayNum = d.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: dayNum,
        dayName: weekDayNames[i],
        isToday: dayNum === 15 && d.getMonth() === 9 && y === 2026
      });
    }

    return days;
  }, [currentDate]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, interviewId: string) => {
    setDraggedInterviewId(interviewId);
    e.dataTransfer.setData('text/plain', interviewId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== targetDateStr) {
      setDragOverDate(targetDateStr);
    }
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);

    const interviewId = draggedInterviewId || e.dataTransfer.getData('text/plain');
    if (!interviewId) return;

    const interview = interviews.find((i) => i.id === interviewId);
    if (!interview) return;

    if (interview.date === targetDateStr) {
      setDraggedInterviewId(null);
      return;
    }

    // Execute reschedule
    updateInterview(interview.id, {
      date: targetDateStr,
      status: interview.status === 'Completed' ? 'Completed' : 'Rescheduled'
    });

    showToast(
      `Rescheduled ${interview.roundName} for ${interview.candidateName} to ${targetDateStr}.`,
      'info'
    );

    setDraggedInterviewId(null);
  };

  const getRoundBadgeStyle = (roundName: string, status: string) => {
    if (status === 'Completed') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (status === 'Cancelled') {
      return 'bg-rose-50 text-rose-700 border-rose-200 line-through opacity-60';
    }
    switch (roundName) {
      case 'Technical Round 1':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400';
      case 'Technical Round 2':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400';
      case 'HR Round':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400';
      case 'Managerial Round':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
      {/* Calendar Header with Navigation & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{monthNames[month]} {year}</span>
              {viewMode === 'week' && (
                <span className="text-xs font-normal text-slate-500 font-mono">
                  (Week of {weekDays[0].dayNumber} {monthNames[month].slice(0, 3)} - {weekDays[6].dayNumber} {monthNames[month].slice(0, 3)})
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              Drag and drop interview slot cards to reschedule to new calendar dates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation Controls */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Guidance Banner */}
      <div className="px-3.5 py-2 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Interactive Drag-and-Drop:</strong> Click &amp; drag any scheduled interview card to another day to instantly reschedule.
          </span>
        </div>
        <span className="text-[11px] text-blue-700 font-medium hidden md:inline">
          Click any day to book a new slot
        </span>
      </div>

      {/* 1. MONTH VIEW GRID */}
      {viewMode === 'month' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center text-xs font-bold text-slate-700">
            {weekDayNames.map((day) => (
              <div key={day} className="py-2.5">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white">
            {monthGridDays.map((cell) => {
              const dayInterviews = interviewsByDate[cell.dateStr] || [];
              const isDragTarget = dragOverDate === cell.dateStr;

              return (
                <div
                  key={cell.dateStr}
                  onDragOver={(e) => handleDragOver(e, cell.dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cell.dateStr)}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors relative group ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/50 text-slate-400'
                      : 'bg-white text-slate-800'
                  } ${isDragTarget ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  {/* Date Number Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        cell.isToday
                          ? 'bg-blue-600 text-white font-extrabold shadow-2xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    <button
                      onClick={() => onScheduleForDate(cell.dateStr)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 rounded transition-opacity"
                      title={`Schedule interview on ${cell.dateStr}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scheduled Interview Chips */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[100px] scrollbar-thin">
                    {dayInterviews.map((item) => {
                      const isBeingDragged = draggedInterviewId === item.id;
                      return (
                        <div
                          key={item.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onClick={() => onSelectInterview(item)}
                          className={`p-1.5 rounded border text-[11px] leading-tight cursor-grab active:cursor-grabbing transition-all select-none shadow-2xs ${getRoundBadgeStyle(
                            item.roundName,
                            item.status
                          )} ${isBeingDragged ? 'opacity-40 scale-95' : 'hover:shadow-xs'}`}
                          title={`Click to view evaluation · Drag to reschedule (${item.candidateName} - ${item.roundName} at ${item.time})`}
                        >
                          <div className="flex items-center justify-between gap-1 font-bold truncate">
                            <span className="truncate">{item.candidateName}</span>
                            <span className="text-[10px] font-mono shrink-0 font-normal">
                              {item.time}
                            </span>
                          </div>
                          <div className="text-[10px] truncate opacity-90 font-medium">
                            {item.roundName}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEK VIEW GRID */}
      {viewMode === 'week' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          {/* Week Day Columns */}
          <div className="grid grid-cols-7 divide-x divide-slate-200 bg-white">
            {weekDays.map((col) => {
              const dayInterviews = interviewsByDate[col.dateStr] || [];
              const isDragTarget = dragOverDate === col.dateStr;

              return (
                <div
                  key={col.dateStr}
                  onDragOver={(e) => handleDragOver(e, col.dateStr)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.dateStr)}
                  className={`min-h-[320px] flex flex-col transition-colors ${
                    isDragTarget ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : 'bg-white'
                  }`}
                >
                  {/* Column Day Header */}
                  <div
                    className={`p-3 text-center border-b border-slate-200 ${
                      col.isToday ? 'bg-blue-50' : 'bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {col.dayName}
                    </div>
                    <div
                      className={`text-base font-extrabold mt-0.5 inline-block w-7 h-7 leading-7 rounded-full ${
                        col.isToday ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-900'
                      }`}
                    >
                      {col.dayNumber}
                    </div>
                    <div className="mt-1">
                      <button
                        onClick={() => onScheduleForDate(col.dateStr)}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-0.5 mx-auto"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Items Column */}
                  <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                    {dayInterviews.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center text-[11px] text-slate-400 italic py-8">
                        No slots scheduled
                      </div>
                    ) : (
                      dayInterviews.map((item) => {
                        const isBeingDragged = draggedInterviewId === item.id;
                        return (
                          <div
                            key={item.id}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onClick={() => onSelectInterview(item)}
                            className={`p-2 rounded-lg border text-xs cursor-grab active:cursor-grabbing transition-all shadow-2xs ${getRoundBadgeStyle(
                              item.roundName,
                              item.status
                            )} ${isBeingDragged ? 'opacity-40 scale-95' : 'hover:shadow-xs'}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold truncate text-slate-900">
                                {item.candidateName}
                              </span>
                              <span className="font-mono text-[10px] font-semibold">
                                {item.time}
                              </span>
                            </div>

                            <div className="text-[11px] font-medium text-blue-800 truncate">
                              {item.roundName}
                            </div>

                            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-600">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.interviewerName}</span>
                            </div>

                            {item.mode && (
                              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                                <Video className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{item.mode}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
