import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Settings,
  Building2,
  Users,
  Shield,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  Database
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    companySettings,
    updateCompanySettings,
    departments,
    resetAllData,
    currentUser,
    users
  } = useApp();

  const [name, setName] = useState(companySettings.name);
  const [legalName, setLegalName] = useState(companySettings.legalName);
  const [address, setAddress] = useState(companySettings.address);
  const [hrEmail, setHrEmail] = useState(companySettings.hrEmail);
  const [phone, setPhone] = useState(companySettings.phone);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings({
      ...companySettings,
      name,
      legalName,
      address,
      hrEmail,
      phone
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Organizational Configuration</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            System Settings &amp; Governance Controls
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Company profile, role access matrix, recruitment stages, and data retention policies.
          </p>
        </div>

        <button
          onClick={() => setIsResetModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Demo Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Profile Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Corporate Entity Profile
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Brand Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Legal Entity Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Talent Acquisition Contact Email
                </label>
                <input
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporate Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Headquarters &amp; Registered Office Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* Department Directory List */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Configured Business Departments ({departments.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{dept.name}</div>
                    <div className="text-[11px] text-slate-500">Head: {dept.head}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {dept.openingsCount} Openings
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Role Matrix & Privacy Notice */}
        <div className="space-y-6">
          {/* Role Permissions Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-900">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
                <span className="font-bold text-amber-900 block">Admin (VP / Director)</span>
                <span className="text-slate-600">
                  Full permissions: approve offers, configure system settings, delete records, view all analytics.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50">
                <span className="font-bold text-blue-900 block">HR Manager (Recruitment Lead)</span>
                <span className="text-slate-600">
                  Post jobs, screen candidates, manage pipeline stages, schedule interviews, generate offer packages.
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/50">
                <span className="font-bold text-purple-900 block">Technical Interviewer</span>
                <span className="text-slate-600">
                  View assigned rounds, evaluate candidates, submit competency rating rubrics.
                </span>
              </div>
            </div>
          </div>

          {/* Data Privacy & Retention Policy */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Data Privacy &amp; Retention Notice</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              In accordance with Indian Digital Personal Data Protection (DPDP) Act guidelines, candidate records are retained for active recruitment cycles with secure local sandboxing.
            </p>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside pt-1">
              <li>No sensitive financial or biometric data collected.</li>
              <li>Candidate email uniqueness enforced to prevent duplicates.</li>
              <li>Data can be cleared or reset anytime.</li>
            </ul>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset Entire Demo Dataset"
        description="Are you sure you want to reset all jobs, candidates, interviews, and offers to their original default demo state? Any custom additions will be reverted."
        confirmLabel="Reset to Initial Data"
        isDestructive={true}
        onConfirm={() => {
          resetAllData();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
