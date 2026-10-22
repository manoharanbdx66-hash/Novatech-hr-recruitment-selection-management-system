import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobOffer, OfferStatus } from '../../types';
import { OfferModal } from './OfferModal';
import {
  FileCheck2,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck2,
  Building2,
  IndianRupee,
  Calendar,
  Eye,
  X,
  Printer
} from 'lucide-react';

export const OffersView: React.FC = () => {
  const {
    offers,
    updateOfferStatus,
    convertOfferToEmployee,
    currentUser,
    companySettings
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewOffer, setPreviewOffer] = useState<JobOffer | null>(null);

  const canApprove = currentUser.role === 'admin' || currentUser.role === 'hr_manager';

  const getStatusBadge = (status: OfferStatus) => {
    switch (status) {
      case 'Draft':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      case 'Approved':
        return 'text-blue-700 bg-blue-50 border-blue-200 font-semibold';
      case 'Sent':
        return 'text-amber-700 bg-amber-50 border-amber-200 font-semibold';
      case 'Accepted':
        return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold';
      case 'Declined':
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Selection &amp; Compensation Governance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Selection Decisions &amp; Employment Offers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit approvals, dispatch formal letters, track acceptances, and onboard verified hires.
          </p>
        </div>

        {canApprove && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Offer Package</span>
          </button>
        )}
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate &amp; Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Offered CTC</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Offer Status</th>
                <th className="py-3 px-4">Approval Trail</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No employment offers created yet.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{offer.candidateName}</div>
                      <div className="text-[11px] text-blue-600 font-medium">
                        {offer.offeredDesignation}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {offer.candidateEmail}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{offer.department}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{offer.ctcAnnualLakhs} LPA
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{offer.joiningDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] px-2 py-0.5 rounded border ${getStatusBadge(
                          offer.status
                        )}`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500 max-w-[180px]">
                      {offer.approvedBy ? (
                        <div className="truncate">Approved by {offer.approvedBy}</div>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending Approval</span>
                      )}
                      {offer.sentDate && (
                        <div className="text-[10px] text-slate-400">Sent on {offer.sentDate}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Letter preview */}
                        <button
                          onClick={() => setPreviewOffer(offer)}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-medium"
                          title="View Offer Letter Preview"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          <span>Letter</span>
                        </button>

                        {/* Status progression actions */}
                        {offer.status === 'Draft' && canApprove && (
                          <button
                            onClick={() => updateOfferStatus(offer.id, 'Approved')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold"
                          >
                            Approve
                          </button>
                        )}

                        {offer.status === 'Approved' && (
                          <button
                            onClick={() => updateOfferStatus(offer.id, 'Sent')}
                            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send</span>
                          </button>
                        )}

                        {offer.status === 'Sent' && (
                          <>
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'Declined')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-xs font-semibold"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {offer.status === 'Accepted' && (
                          <button
                            onClick={() => convertOfferToEmployee(offer.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <UserCheck2 className="w-3 h-3" />
                            <span>Convert to Employee</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <OfferModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Formal Letter Preview Modal */}
      {previewOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-6 border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm">Formal Employment Offer Letter</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-slate-300 hover:text-white rounded"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewOffer(null)}
                  className="p-1.5 text-slate-300 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-5 text-slate-800 text-xs leading-relaxed font-sans bg-white print:p-0">
              {/* Company Letterhead */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {companySettings.name}
                  </h2>
                  <p className="text-[11px] text-slate-500">{companySettings.legalName}</p>
                  <p className="text-[11px] text-slate-500">{companySettings.address}</p>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <div>Ref: {previewOffer.id}</div>
                  <div>Date: {new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              {/* Recipient */}
              <div>
                <p className="font-bold text-slate-900">To,</p>
                <p className="font-bold text-slate-800">{previewOffer.candidateName}</p>
                <p className="text-slate-600">{previewOffer.candidateEmail}</p>
              </div>

              {/* Salutation & Body */}
              <div className="space-y-3">
                <p>Dear {previewOffer.candidateName},</p>
                <p>
                  On behalf of <strong>{companySettings.name}</strong>, we are delighted to extend
                  this formal offer of employment for the position of{' '}
                  <strong className="text-blue-700">{previewOffer.offeredDesignation}</strong> in our{' '}
                  <strong>{previewOffer.department}</strong>.
                </p>
                <p>
                  Following your evaluation and technical interview assessments, our hiring committee
                  was deeply impressed by your experience and competencies.
                </p>

                {/* Key Terms Table */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Key Offer Particulars:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      Designation: <strong>{previewOffer.offeredDesignation}</strong>
                    </div>
                    <div>
                      Department: <strong>{previewOffer.department}</strong>
                    </div>
                    <div>
                      Total Annual CTC: <strong>₹{previewOffer.ctcAnnualLakhs} Lakhs per Annum</strong>
                    </div>
                    <div>
                      Target Joining Date: <strong>{previewOffer.joiningDate}</strong>
                    </div>
                    <div>
                      Location: <strong>Chennai OMR Cyber Gateway (Hybrid)</strong>
                    </div>
                    <div>
                      Probation Period: <strong>90 Days</strong>
                    </div>
                  </div>
                </div>

                <p>{previewOffer.notes}</p>
                <p>
                  We look forward to welcoming you to the NovaTech Solutions team and building the future
                  of enterprise platforms together.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-serif italic text-base text-slate-700">Karthik Sundaram</div>
                  <div className="font-bold text-xs text-slate-900">Karthik Sundaram</div>
                  <div className="text-[11px] text-slate-500">
                    VP of Engineering &amp; Operations, NovaTech Solutions
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-6"></div>
                  <div className="font-bold text-xs text-slate-900">Candidate Acceptance Signature</div>
                  <div className="text-[11px] text-slate-500">
                    Status: <strong className="text-blue-700">{previewOffer.status}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
