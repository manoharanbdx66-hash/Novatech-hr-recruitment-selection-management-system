import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Interview, InterviewRound } from '../../types';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Award,
  ChevronDown,
  Info
} from 'lucide-react';

interface InterviewAnalyticsChartsProps {
  interviews: Interview[];
}

export const InterviewAnalyticsCharts: React.FC<InterviewAnalyticsChartsProps> = ({ interviews }) => {
  const [timeRange, setTimeRange] = useState<'all' | 'recent'>('all');
  const [metricView, setMetricView] = useState<'overall' | 'competencies'>('overall');

  // Filter completed interviews with feedback
  const completedInterviews = useMemo(() => {
    return interviews.filter((i) => i.status === 'Completed' && i.feedback);
  }, [interviews]);

  // 1. Data for Average Interview Scores Over Time
  const timeSeriesData = useMemo(() => {
    // Sort interviews chronologically by date
    const sorted = [...completedInterviews].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by date or display individual evaluations chronologically
    const dateMap: Record<
      string,
      {
        date: string;
        displayDate: string;
        technicalSum: number;
        psSum: number;
        commSum: number;
        cultureSum: number;
        overallSum: number;
        count: number;
        candidates: string[];
      }
    > = {};

    sorted.forEach((item) => {
      const fb = item.feedback!;
      const d = item.date;
      const composite =
        (fb.technicalScore +
          fb.problemSolvingScore +
          fb.communicationScore +
          fb.cultureFitScore) /
        4;

      if (!dateMap[d]) {
        // Format date readable (e.g., 'Oct 02')
        const parts = d.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formatted = `${monthNames[parseInt(parts[1], 10) - 1]} ${parts[2]}`;

        dateMap[d] = {
          date: d,
          displayDate: formatted,
          technicalSum: 0,
          psSum: 0,
          commSum: 0,
          cultureSum: 0,
          overallSum: 0,
          count: 0,
          candidates: []
        };
      }

      dateMap[d].technicalSum += fb.technicalScore;
      dateMap[d].psSum += fb.problemSolvingScore;
      dateMap[d].commSum += fb.communicationScore;
      dateMap[d].cultureSum += fb.cultureFitScore;
      dateMap[d].overallSum += composite;
      dateMap[d].count += 1;
      dateMap[d].candidates.push(`${item.candidateName} (${item.roundName})`);
    });

    const result = Object.values(dateMap).map((entry) => ({
      date: entry.date,
      displayDate: entry.displayDate,
      overallScore: parseFloat((entry.overallSum / entry.count).toFixed(2)),
      technicalScore: parseFloat((entry.technicalSum / entry.count).toFixed(2)),
      problemSolving: parseFloat((entry.psSum / entry.count).toFixed(2)),
      communication: parseFloat((entry.commSum / entry.count).toFixed(2)),
      cultureFit: parseFloat((entry.cultureSum / entry.count).toFixed(2)),
      evaluationsCount: entry.count,
      candidatesList: entry.candidates.join(', ')
    }));

    return result;
  }, [completedInterviews]);

  // 2. Data for Score Distribution Across Different Interview Stages
  const stageDistributionData = useMemo(() => {
    const STAGES: InterviewRound[] = [
      'Technical Round 1',
      'Technical Round 2',
      'HR Round',
      'Managerial Round'
    ];

    return STAGES.map((stage) => {
      const stageItems = completedInterviews.filter((i) => i.roundName === stage);
      const count = stageItems.length;

      if (count === 0) {
        return {
          stage: stage.replace(' Round', ' Rnd'),
          fullName: stage,
          evaluations: 0,
          avgOverall: 0,
          avgTechnical: 0,
          avgProblemSolving: 0,
          avgCommunication: 0,
          avgCultureFit: 0,
          hireCount: 0,
          holdCount: 0,
          rejectCount: 0
        };
      }

      let techTotal = 0;
      let psTotal = 0;
      let commTotal = 0;
      let cultureTotal = 0;
      let hireCount = 0;
      let holdCount = 0;
      let rejectCount = 0;

      stageItems.forEach((item) => {
        const fb = item.feedback!;
        techTotal += fb.technicalScore;
        psTotal += fb.problemSolvingScore;
        commTotal += fb.communicationScore;
        cultureTotal += fb.cultureFitScore;

        if (fb.overallRecommendation === 'Strong Hire' || fb.overallRecommendation === 'Hire') {
          hireCount++;
        } else if (fb.overallRecommendation === 'Hold') {
          holdCount++;
        } else {
          rejectCount++;
        }
      });

      const avgTechnical = parseFloat((techTotal / count).toFixed(2));
      const avgProblemSolving = parseFloat((psTotal / count).toFixed(2));
      const avgCommunication = parseFloat((commTotal / count).toFixed(2));
      const avgCultureFit = parseFloat((cultureTotal / count).toFixed(2));
      const avgOverall = parseFloat(
        ((avgTechnical + avgProblemSolving + avgCommunication + avgCultureFit) / 4).toFixed(2)
      );

      return {
        stage: stage.replace(' Round', ' Rnd'),
        fullName: stage,
        evaluations: count,
        avgOverall,
        avgTechnical,
        avgProblemSolving,
        avgCommunication,
        avgCultureFit,
        hireCount,
        holdCount,
        rejectCount
      };
    });
  }, [completedInterviews]);

  // Key KPI summary
  const totalCompleted = completedInterviews.length;
  const grandAvgScore = useMemo(() => {
    if (totalCompleted === 0) return '0.0';
    const sum = completedInterviews.reduce((acc, i) => {
      const fb = i.feedback!;
      return (
        acc +
        (fb.technicalScore +
          fb.problemSolvingScore +
          fb.communicationScore +
          fb.cultureFitScore) /
          4
      );
    }, 0);
    return (sum / totalCompleted).toFixed(2);
  }, [completedInterviews, totalCompleted]);

  const strongHireRatio = useMemo(() => {
    if (totalCompleted === 0) return '0%';
    const hires = completedInterviews.filter(
      (i) =>
        i.feedback?.overallRecommendation === 'Strong Hire' ||
        i.feedback?.overallRecommendation === 'Hire'
    ).length;
    return `${Math.round((hires / totalCompleted) * 100)}%`;
  }, [completedInterviews, totalCompleted]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>Interview Performance Analytics</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">Recharts Visualizations</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Interview Score Trends &amp; Stage Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical evaluation ratings tracking score trajectory over time and cross-stage competency rigor.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setMetricView('overall')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                metricView === 'overall'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Composite Score
            </button>
            <button
              onClick={() => setMetricView('competencies')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                metricView === 'competencies'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Competency Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">Completed Evaluations</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{totalCompleted}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Rubric-recorded rounds</div>
        </div>

        <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200">
          <div className="text-[11px] font-medium text-blue-700">Mean Evaluation Score</div>
          <div className="text-xl font-bold text-blue-900 mt-1">
            {grandAvgScore} <span className="text-xs font-normal text-blue-500">/ 5.0</span>
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">Across all rubric criteria</div>
        </div>

        <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200">
          <div className="text-[11px] font-medium text-emerald-700">Positive Recommendation</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">{strongHireRatio}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Hire &amp; Strong Hire verdict</div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-medium text-slate-500">Benchmarked Rounds</div>
          <div className="text-xl font-bold text-slate-900 mt-1">4 Stages</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tech 1, Tech 2, HR, Managerial</div>
        </div>
      </div>

      {/* Charts Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* CHART 1: Average Interview Scores Over Time */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Average Interview Scores Over Time</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chronological rating progression (1.0 to 5.0 scale)
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Y-Axis: Rating (1-5)
            </span>
          </div>

          <div className="h-64 w-full">
            {timeSeriesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                No completed interview evaluations recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {metricView === 'overall' ? (
                  <AreaChart
                    data={timeSeriesData}
                    margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-800">
                              <div className="font-bold text-slate-200">
                                Date: {data.date} ({data.displayDate})
                              </div>
                              <div className="text-blue-400 font-semibold mt-1">
                                Avg Composite Score: {data.overallScore} / 5.0
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 max-w-xs">
                                Evaluated: {data.candidatesList}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="overallScore"
                      name="Overall Score"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorOverall)"
                      dot={{ r: 4, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                ) : (
                  <LineChart
                    data={timeSeriesData}
                    margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                              <div className="font-bold text-slate-200">{d.displayDate}</div>
                              <div className="text-blue-400">Technical: {d.technicalScore}</div>
                              <div className="text-emerald-400">Problem Solving: {d.problemSolving}</div>
                              <div className="text-purple-400">Communication: {d.communication}</div>
                              <div className="text-amber-400">Culture Fit: {d.cultureFit}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="technicalScore"
                      name="Technical"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="problemSolving"
                      name="Problem Solving"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="communication"
                      name="Communication"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cultureFit"
                      name="Culture Fit"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART 2: Score Distribution Across Different Interview Stages */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Score Distribution Across Stages</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Comparative competency scoring benchmarked by evaluation round
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              Stages 1 to 4
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageDistributionData}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1.5 border border-slate-800">
                          <div className="font-bold text-slate-100">{d.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Total Evaluated: {d.evaluations} candidates
                          </div>
                          <div className="pt-1 border-t border-slate-800 space-y-0.5">
                            <div className="text-blue-400">Technical Score: {d.avgTechnical} / 5</div>
                            <div className="text-emerald-400">Problem Solving: {d.avgProblemSolving} / 5</div>
                            <div className="text-purple-400">Communication: {d.avgCommunication} / 5</div>
                            <div className="text-amber-400">Culture Fit: {d.avgCultureFit} / 5</div>
                          </div>
                          <div className="pt-1 text-[11px] text-emerald-400 font-semibold">
                            Hiring Recommendations: {d.hireCount} Hire · {d.holdCount} Hold · {d.rejectCount} Reject
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar
                  dataKey="avgTechnical"
                  name="Technical"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgProblemSolving"
                  name="Problem Solving"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgCommunication"
                  name="Communication"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="avgCultureFit"
                  name="Culture Fit"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
