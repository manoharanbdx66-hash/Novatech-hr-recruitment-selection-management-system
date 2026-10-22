import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Shield,
  UserCheck,
  ChevronDown,
  Building2,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';

interface HeaderProps {
  onOpenPOM: () => void;
  onSearchGlobal?: (query: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPOM, activeTab }) => {
  const { currentUser, users, setCurrentUser, companySettings } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin (Director)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'hr_manager':
        return { label: 'HR Manager', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'interviewer':
        return { label: 'Technical Evaluator', color: 'text-purple-700 bg-purple-50 border-purple-200' };
      default:
        return { label: role, color: 'text-slate-600 bg-slate-100 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Demo notice bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            {companySettings.name}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 hidden sm:inline">
            Interactive Enterprise Recruitment System
          </span>
          <span className="text-slate-500 hidden md:inline">·</span>
          <span className="text-emerald-400 font-mono text-[11px] hidden md:inline">
            Local Browser Persistence Active
          </span>
        </div>
        <button
          onClick={onOpenPOM}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-amber-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-[11px] font-medium"
          title="Click to view POM Academic Project Mapping"
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          <span>Principles of Management</span>
        </button>
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        {/* Current page title & context */}
        <div className="flex items-center gap-3">
          <div className="capitalize font-bold text-lg text-slate-900">
            {activeTab.replace('-', ' ')}
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Talent Acquisition & Employee Selection Workflow
          </span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenPOM}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>Academic Alignment</span>
          </button>

          {/* User & Role Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-3 p-1.5 pr-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 text-left cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {currentUser.title}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Demo Role
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Select a persona to test role-aware permissions:
                  </div>
                </div>

                <div className="space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    const uRole = getRoleBadge(u.role);
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {u.name}
                            </span>
                            {isSelected && (
                              <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {u.title}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] px-1.5 py-0.2 rounded border font-medium ${uRole.color}`}
                          >
                            {uRole.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-3 text-[11px] text-slate-500">
                  Current Session: <span className="font-semibold text-slate-800">{roleInfo.label}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
