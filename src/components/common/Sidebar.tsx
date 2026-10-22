import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitPullRequest,
  Filter,
  Calendar,
  FileCheck2,
  UserCheck2,
  BarChart3,
  Settings,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export type NavItem =
  | 'dashboard'
  | 'jobs'
  | 'candidates'
  | 'applications'
  | 'screening'
  | 'interviews'
  | 'selection'
  | 'employees'
  | 'reports'
  | 'settings'
  | 'academic-pom';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen
}) => {
  const { jobs, candidates, interviews, offers, currentUser } = useApp();

  const activeJobsCount = jobs.filter((j) => j.status === 'Published').length;
  const pendingInterviewsCount = interviews.filter((i) => i.status === 'Scheduled').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'Draft' || o.status === 'Approved').length;

  const navItems = [
    {
      id: 'dashboard' as NavItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'jobs' as NavItem,
      label: 'Job Openings',
      icon: Briefcase,
      badge: activeJobsCount ? `${activeJobsCount} Active` : null
    },
    {
      id: 'candidates' as NavItem,
      label: 'Candidates',
      icon: Users,
      badge: `${candidates.length}`
    },
    {
      id: 'applications' as NavItem,
      label: 'Applications Pipeline',
      icon: GitPullRequest,
      badge: null
    },
    {
      id: 'screening' as NavItem,
      label: 'Candidate Screening',
      icon: Filter,
      badge: null
    },
    {
      id: 'interviews' as NavItem,
      label: 'Interviews',
      icon: Calendar,
      badge: pendingInterviewsCount ? `${pendingInterviewsCount}` : null
    },
    {
      id: 'selection' as NavItem,
      label: 'Selection & Offers',
      icon: FileCheck2,
      badge: pendingOffersCount ? `${pendingOffersCount}` : null
    },
    {
      id: 'employees' as NavItem,
      label: 'Employee Onboarding',
      icon: UserCheck2,
      badge: null
    },
    {
      id: 'reports' as NavItem,
      label: 'Recruitment Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings' as NavItem,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id: NavItem) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Geometric NovaTech Logo */}
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold tracking-tight">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <div>
              <div className="text-white font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <span>NOVATECH</span>
                <span className="text-blue-400 font-medium">HR</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Solutions Pvt. Ltd.
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Recruitment Suite
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isActive
                        ? 'bg-blue-700/60 text-blue-100'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Management Principles section */}
          <div className="pt-5 px-3 pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Management Framework
          </div>

          <button
            onClick={() => handleSelect('academic-pom')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
              activeTab === 'academic-pom'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 shrink-0 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold text-xs leading-tight">POM Alignment</div>
                <div className="text-[10px] text-slate-400">5 Functions of Management</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-200">Session Role</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-[11px] text-slate-400 truncate font-mono">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-blue-400 mt-0.5 uppercase tracking-wide font-medium">
              {currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
