import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar, NavItem } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { JobsView } from './components/jobs/JobsView';
import { JobFormModal } from './components/jobs/JobFormModal';
import { CandidatesView } from './components/candidates/CandidatesView';
import { CandidateFormModal } from './components/candidates/CandidateFormModal';
import { CandidateDetailModal } from './components/candidates/CandidateDetailModal';
import { PipelineView } from './components/pipeline/PipelineView';
import { ScreeningView } from './components/screening/ScreeningView';
import { InterviewsView } from './components/interviews/InterviewsView';
import { ScheduleInterviewModal } from './components/interviews/ScheduleInterviewModal';
import { OffersView } from './components/offers/OffersView';
import { EmployeesView } from './components/employees/EmployeesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AcademicPOMView } from './components/academic/AcademicPOMView';
import { Candidate } from './types';
import { Menu } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global modals triggered from dashboard or header quick-actions
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [candidateToSchedule, setCandidateToSchedule] = useState<Candidate | null>(null);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);

  const handleOpenScheduleForCandidate = (candidate: Candidate) => {
    setCandidateToSchedule(candidate);
    setIsInterviewModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCreateJob={() => setIsJobModalOpen(true)}
            onOpenAddCandidate={() => setIsCandidateModalOpen(true)}
            onOpenScheduleInterview={() => {
              setCandidateToSchedule(null);
              setIsInterviewModalOpen(true);
            }}
          />
        );
      case 'jobs':
        return (
          <JobsView
            onSelectCandidate={(cand) => setViewCandidate(cand)}
          />
        );
      case 'candidates':
        return (
          <CandidatesView
            onScheduleInterview={handleOpenScheduleForCandidate}
            selectedCandidateForView={viewCandidate}
            onClearSelectedCandidate={() => setViewCandidate(null)}
          />
        );
      case 'applications':
        return <PipelineView />;
      case 'screening':
        return <ScreeningView />;
      case 'interviews':
        return <InterviewsView />;
      case 'selection':
        return <OffersView />;
      case 'employees':
        return <EmployeesView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'academic-pom':
        return <AcademicPOMView />;
      default:
        return <DashboardView
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenCreateJob={() => setIsJobModalOpen(true)}
          onOpenAddCandidate={() => setIsCandidateModalOpen(true)}
          onOpenScheduleInterview={() => {
            setCandidateToSchedule(null);
            setIsInterviewModalOpen(true);
          }}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Body Layout (Offset for Sidebar on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Mobile menu bar */}
        <div className="lg:hidden bg-slate-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 flex items-center gap-2 text-xs font-semibold"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>
          <div className="font-extrabold text-xs tracking-tight">
            NOVATECH <span className="text-blue-400">HR</span>
          </div>
        </div>

        {/* Header bar */}
        <Header
          activeTab={activeTab}
          onOpenPOM={() => setActiveTab('academic-pom')}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Quick Action Modals */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
      />

      <CandidateFormModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />

      <ScheduleInterviewModal
        isOpen={isInterviewModalOpen}
        candidateToSchedule={candidateToSchedule}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setCandidateToSchedule(null);
        }}
      />

      <CandidateDetailModal
        candidate={viewCandidate}
        isOpen={!!viewCandidate}
        onClose={() => setViewCandidate(null)}
        onScheduleInterview={handleOpenScheduleForCandidate}
      />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
