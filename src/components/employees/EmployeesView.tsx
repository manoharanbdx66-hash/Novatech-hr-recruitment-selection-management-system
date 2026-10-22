import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, OnboardingStatus } from '../../types';
import {
  UserCheck2,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Laptop,
  GraduationCap,
  Sparkles,
  Download
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, updateEmployeeOnboarding, departments, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const getStatusBadge = (status: OnboardingStatus) => {
    switch (status) {
      case 'Document Verification':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Asset Allocation':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Orientation & Welcome':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Active & Completed':
        return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold';
    }
  };

  const getProgressPercentage = (status: OnboardingStatus) => {
    switch (status) {
      case 'Document Verification':
        return 25;
      case 'Asset Allocation':
        return 50;
      case 'Orientation & Welcome':
        return 75;
      case 'Active & Completed':
        return 100;
    }
  };

  const exportEmployeeCSV = () => {
    const headers = ['Employee ID', 'Name', 'Official Email', 'Department', 'Designation', 'Joining Date', 'Onboarding Status', 'Reporting Manager'];
    const rows = filteredEmployees.map((e) => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      `"${e.department}"`,
      `"${e.designation}"`,
      e.joiningDate,
      `"${e.onboardingStatus}"`,
      `"${e.reportingManager}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NovaTech_Employees_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredEmployees.length} employee records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Principles of Management · Staffing Conversion</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Employee Onboarding &amp; Induction Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transition candidates into formal organizational roles with assigned Employee IDs and induction tracking.
          </p>
        </div>

        <button
          onClick={exportEmployeeCSV}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Employee Roster</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee ID, name, designation..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-mono">
            {filteredEmployees.length} employees
          </span>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200">
            <UserCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-700">No employee records match</div>
            <p className="text-xs text-slate-500 mt-1">
              Hired candidates converted from the Selection &amp; Offers page appear here.
            </p>
          </div>
        ) : (
          filteredEmployees.map((emp) => {
            const progress = getProgressPercentage(emp.onboardingStatus);
            return (
              <div
                key={emp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all text-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {emp.employeeId}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(
                        emp.onboardingStatus
                      )}`}
                    >
                      {emp.onboardingStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">{emp.name}</h3>
                  <div className="text-xs text-slate-600 font-medium">{emp.designation}</div>
                  <div className="text-[11px] text-slate-400">{emp.department}</div>

                  {/* Details box */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-slate-600 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joined: {emp.joiningDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.workLocation}</span>
                    </div>
                  </div>

                  {/* Onboarding progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500 font-medium">Onboarding Milestone</span>
                      <span className="font-bold text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestone quick update controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Update Phase:</span>
                  <select
                    value={emp.onboardingStatus}
                    onChange={(e) =>
                      updateEmployeeOnboarding(emp.id, e.target.value as OnboardingStatus)
                    }
                    className="text-[11px] px-2 py-1 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="Document Verification">1. Docs Verification</option>
                    <option value="Asset Allocation">2. Asset Assigned</option>
                    <option value="Orientation & Welcome">3. Orientation</option>
                    <option value="Active & Completed">4. Active &amp; Completed</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
