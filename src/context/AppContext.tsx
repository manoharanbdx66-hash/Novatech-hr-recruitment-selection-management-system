import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Job,
  Candidate,
  ApplicationStage,
  ApplicationAudit,
  ScreeningRecord,
  Interview,
  InterviewFeedback,
  JobOffer,
  OfferStatus,
  Employee,
  DepartmentInfo,
  CompanySettings,
  OnboardingStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_AUDITS,
  INITIAL_SCREENINGS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFERS,
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_COMPANY_SETTINGS
} from '../data/initialData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  jobs: Job[];
  candidates: Candidate[];
  audits: ApplicationAudit[];
  screenings: ScreeningRecord[];
  interviews: Interview[];
  offers: JobOffer[];
  employees: Employee[];
  departments: DepartmentInfo[];
  companySettings: CompanySettings;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  // Job Actions
  createJob: (job: Omit<Job, 'id' | 'createdAt'>) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  // Candidate Actions
  addCandidate: (candidate: Omit<Candidate, 'id' | 'applicationDate' | 'status'>) => { success: boolean; candidate?: Candidate; error?: string };
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  updateCandidateStage: (candidateId: string, newStage: ApplicationStage, note?: string, reason?: string) => void;
  
  // Screening Actions
  submitScreening: (record: Omit<ScreeningRecord, 'id' | 'reviewedAt' | 'reviewedBy'>) => void;
  
  // Interview Actions
  scheduleInterview: (interview: Omit<Interview, 'id' | 'status'>) => Interview;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  cancelInterview: (id: string) => void;
  submitInterviewFeedback: (interviewId: string, feedback: Omit<InterviewFeedback, 'submittedAt' | 'submittedBy'>) => void;
  
  // Offer Actions
  createOffer: (offer: Omit<JobOffer, 'id' | 'status'>) => JobOffer;
  updateOfferStatus: (offerId: string, newStatus: OfferStatus, notes?: string) => void;
  
  // Employee Actions
  convertOfferToEmployee: (offerId: string, mentorName?: string, workLocation?: string) => Employee | null;
  updateEmployeeOnboarding: (employeeId: string, status: OnboardingStatus) => void;
  
  // System Actions
  updateCompanySettings: (settings: CompanySettings) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'novatech_recruitment_system_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    return INITIAL_USERS[0]; // Priya Sharma (HR Lead) by default
  });

  const [toast, setToast] = useState<ToastState | null>(null);

  // Initialize data with localStorage or fallback to defaults
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          jobs: parsed.jobs || INITIAL_JOBS,
          candidates: parsed.candidates || INITIAL_CANDIDATES,
          audits: parsed.audits || INITIAL_AUDITS,
          screenings: parsed.screenings || INITIAL_SCREENINGS,
          interviews: parsed.interviews || INITIAL_INTERVIEWS,
          offers: parsed.offers || INITIAL_OFFERS,
          employees: parsed.employees || INITIAL_EMPLOYEES,
          departments: parsed.departments || INITIAL_DEPARTMENTS,
          companySettings: parsed.companySettings || INITIAL_COMPANY_SETTINGS
        };
      }
    } catch {
      // Fallback on error
    }
    return {
      jobs: INITIAL_JOBS,
      candidates: INITIAL_CANDIDATES,
      audits: INITIAL_AUDITS,
      screenings: INITIAL_SCREENINGS,
      interviews: INITIAL_INTERVIEWS,
      offers: INITIAL_OFFERS,
      employees: INITIAL_EMPLOYEES,
      departments: INITIAL_DEPARTMENTS,
      companySettings: INITIAL_COMPANY_SETTINGS
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    showToast(`Switched active user profile to ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  // Job Actions
  const createJob = (jobInput: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newId = `JOB-2026-${String(data.jobs.length + 1).padStart(2, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newJob: Job = {
      ...jobInput,
      id: newId,
      createdAt: today
    };

    setData((prev: typeof data) => ({
      ...prev,
      jobs: [newJob, ...prev.jobs]
    }));

    showToast(`Job requisition "${newJob.title}" created successfully.`);
    return newJob;
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setData((prev: typeof data) => ({
      ...prev,
      jobs: prev.jobs.map((j: Job) => (j.id === id ? { ...j, ...updates } : j))
    }));
    showToast('Job posting updated successfully.');
  };

  const deleteJob = (id: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      jobs: prev.jobs.filter((j: Job) => j.id !== id)
    }));
    showToast('Job listing removed.');
  };

  // Candidate Actions
  const addCandidate = (candidateInput: Omit<Candidate, 'id' | 'applicationDate' | 'status'>) => {
    // Check duplicate email
    const exists = data.candidates.some(
      (c: Candidate) => c.email.toLowerCase() === candidateInput.email.toLowerCase()
    );
    if (exists) {
      showToast(`A candidate with email ${candidateInput.email} already exists.`, 'error');
      return { success: false, error: 'A candidate with this email address already exists.' };
    }

    const newId = `CAN-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];
    const newCandidate: Candidate = {
      ...candidateInput,
      id: newId,
      applicationDate: today,
      status: 'Applied'
    };

    const newAudit: ApplicationAudit = {
      id: `aud-${Date.now()}`,
      candidateId: newId,
      candidateName: newCandidate.name,
      fromStage: 'Applied',
      toStage: 'Applied',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      changedBy: `${currentUser.name} (${currentUser.title})`,
      note: `Application submitted via ${newCandidate.source}`
    };

    setData((prev: typeof data) => ({
      ...prev,
      candidates: [newCandidate, ...prev.candidates],
      audits: [newAudit, ...prev.audits]
    }));

    showToast(`Candidate "${newCandidate.name}" registered successfully.`);
    return { success: true, candidate: newCandidate };
  };

  const updateCandidate = (id: string, updates: Partial<Candidate>) => {
    setData((prev: typeof data) => ({
      ...prev,
      candidates: prev.candidates.map((c: Candidate) => (c.id === id ? { ...c, ...updates } : c))
    }));
    showToast('Candidate profile updated.');
  };

  const deleteCandidate = (id: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      candidates: prev.candidates.filter((c: Candidate) => c.id !== id),
      audits: prev.audits.filter((a: ApplicationAudit) => a.candidateId !== id)
    }));
    showToast('Candidate record removed.');
  };

  const updateCandidateStage = (
    candidateId: string,
    newStage: ApplicationStage,
    note?: string,
    reason?: string
  ) => {
    const candidate = data.candidates.find((c: Candidate) => c.id === candidateId);
    if (!candidate) return;

    const fromStage = candidate.status;
    if (fromStage === newStage) return;

    const newAudit: ApplicationAudit = {
      id: `aud-${Date.now()}`,
      candidateId,
      candidateName: candidate.name,
      fromStage,
      toStage: newStage,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      changedBy: `${currentUser.name} (${currentUser.title})`,
      reason: reason || undefined,
      note: note || undefined
    };

    setData((prev: typeof data) => ({
      ...prev,
      candidates: prev.candidates.map((c: Candidate) =>
        c.id === candidateId
          ? {
              ...c,
              status: newStage,
              rejectionReason: newStage === 'Rejected' ? reason || c.rejectionReason : c.rejectionReason,
              notes: note ? `${note}${c.notes ? ' | ' + c.notes : ''}` : c.notes
            }
          : c
      ),
      audits: [newAudit, ...prev.audits]
    }));

    showToast(`Stage updated for ${candidate.name}: ${fromStage} → ${newStage}`);
  };

  // Screening Actions
  const submitScreening = (recordInput: Omit<ScreeningRecord, 'id' | 'reviewedAt' | 'reviewedBy'>) => {
    const newId = `SCR-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    const newScreening: ScreeningRecord = {
      ...recordInput,
      id: newId,
      reviewedAt: today,
      reviewedBy: currentUser.name
    };

    setData((prev: typeof data) => {
      // replace if existing or add new
      const filtered = prev.screenings.filter((s: ScreeningRecord) => s.candidateId !== recordInput.candidateId);
      return {
        ...prev,
        screenings: [newScreening, ...filtered]
      };
    });

    // Optionally advance stage if recommended
    if (recordInput.recommendation === 'Shortlist') {
      updateCandidateStage(recordInput.candidateId, 'Shortlisted', `Automated & HR screening passed with fit score ${recordInput.matchScore}%`);
    } else if (recordInput.recommendation === 'Reject') {
      updateCandidateStage(recordInput.candidateId, 'Rejected', 'Screening criteria not met', recordInput.reviewerNotes);
    }

    showToast(`Screening evaluation recorded for ${recordInput.candidateName}. Score: ${recordInput.matchScore}%`);
  };

  // Interview Actions
  const scheduleInterview = (interviewInput: Omit<Interview, 'id' | 'status'>): Interview => {
    const newId = `INT-${Date.now().toString().slice(-4)}`;
    const newInterview: Interview = {
      ...interviewInput,
      id: newId,
      status: 'Scheduled'
    };

    setData((prev: typeof data) => ({
      ...prev,
      interviews: [newInterview, ...prev.interviews]
    }));

    // Update candidate stage to Interview if not already
    const candidate = data.candidates.find((c: Candidate) => c.id === interviewInput.candidateId);
    if (candidate && candidate.status !== 'Interview') {
      updateCandidateStage(
        candidate.id,
        'Interview',
        `Scheduled ${interviewInput.roundName} with ${interviewInput.interviewerName} on ${interviewInput.date}`
      );
    }

    showToast(`Interview scheduled with ${interviewInput.candidateName} for ${interviewInput.date}.`);
    return newInterview;
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setData((prev: typeof data) => ({
      ...prev,
      interviews: prev.interviews.map((i: Interview) => (i.id === id ? { ...i, ...updates } : i))
    }));
    showToast('Interview details updated.');
  };

  const cancelInterview = (id: string) => {
    setData((prev: typeof data) => ({
      ...prev,
      interviews: prev.interviews.map((i: Interview) =>
        i.id === id ? { ...i, status: 'Cancelled' } : i
      )
    }));
    showToast('Interview status marked as Cancelled.', 'info');
  };

  const submitInterviewFeedback = (
    interviewId: string,
    feedbackInput: Omit<InterviewFeedback, 'submittedAt' | 'submittedBy'>
  ) => {
    const todayTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const completedFeedback: InterviewFeedback = {
      ...feedbackInput,
      submittedAt: todayTime,
      submittedBy: currentUser.name
    };

    let candId = '';
    setData((prev: typeof data) => {
      const target = prev.interviews.find((i: Interview) => i.id === interviewId);
      if (target) candId = target.candidateId;

      return {
        ...prev,
        interviews: prev.interviews.map((i: Interview) =>
          i.id === interviewId
            ? { ...i, status: 'Completed', feedback: completedFeedback }
            : i
        )
      };
    });

    if (candId && (feedbackInput.overallRecommendation === 'Strong Hire' || feedbackInput.overallRecommendation === 'Hire')) {
      updateCandidateStage(
        candId,
        'Selected',
        `Interview cleared. Evaluator recommendation: ${feedbackInput.overallRecommendation}`
      );
    }

    showToast('Interview rubric and evaluation submitted successfully.');
  };

  // Offer Actions
  const createOffer = (offerInput: Omit<JobOffer, 'id' | 'status'>): JobOffer => {
    const newId = `OFR-${Date.now().toString().slice(-4)}`;
    const newOffer: JobOffer = {
      ...offerInput,
      id: newId,
      status: 'Draft'
    };

    setData((prev: typeof data) => ({
      ...prev,
      offers: [newOffer, ...prev.offers]
    }));

    showToast(`Employment offer draft generated for ${offerInput.candidateName}.`);
    return newOffer;
  };

  const updateOfferStatus = (offerId: string, newStatus: OfferStatus, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    let candidateId = '';

    setData((prev: typeof data) => {
      const offer = prev.offers.find((o: JobOffer) => o.id === offerId);
      if (offer) candidateId = offer.candidateId;

      return {
        ...prev,
        offers: prev.offers.map((o: JobOffer) => {
          if (o.id !== offerId) return o;
          return {
            ...o,
            status: newStatus,
            approvedBy: newStatus === 'Approved' ? `${currentUser.name} (${currentUser.title})` : o.approvedBy,
            sentDate: newStatus === 'Sent' ? today : o.sentDate,
            responseDate: newStatus === 'Accepted' || newStatus === 'Declined' ? today : o.responseDate,
            notes: notes ? `${notes}${o.notes ? ' | ' + o.notes : ''}` : o.notes
          };
        })
      };
    });

    // Sync candidate stage
    if (candidateId) {
      if (newStatus === 'Sent') {
        updateCandidateStage(candidateId, 'Offer Sent', 'Offer package dispatched to candidate.');
      } else if (newStatus === 'Accepted') {
        updateCandidateStage(candidateId, 'Hired', 'Candidate accepted offer letter.');
      }
    }

    showToast(`Offer status changed to: ${newStatus}`);
  };

  // Employee Actions
  const convertOfferToEmployee = (
    offerId: string,
    mentorName: string = 'Senior Team Member',
    workLocation: string = 'Chennai OMR HQ'
  ): Employee | null => {
    const offer = data.offers.find((o: JobOffer) => o.id === offerId);
    if (!offer) return null;

    const candidate = data.candidates.find((c: Candidate) => c.id === offer.candidateId);
    if (!candidate) return null;

    // Check if already converted
    const existing = data.employees.find((e: Employee) => e.candidateId === candidate.id);
    if (existing) {
      showToast(`Employee record already exists for ${candidate.name} (ID: ${existing.employeeId})`, 'info');
      return existing;
    }

    const employeeId = `NTS-2026-${String(data.employees.length + 90).padStart(3, '0')}`;
    const newEmployee: Employee = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      employeeId,
      candidateId: candidate.id,
      name: candidate.name,
      email: `${candidate.name.toLowerCase().replace(/[^a-z]/g, '.') || 'emp'}@novatech.in`,
      phone: candidate.phone,
      department: offer.department,
      designation: offer.offeredDesignation,
      joiningDate: offer.joiningDate,
      onboardingStatus: 'Document Verification',
      mentorName,
      workLocation,
      reportingManager: currentUser.name
    };

    setData((prev: typeof data) => ({
      ...prev,
      employees: [newEmployee, ...prev.employees],
      // Ensure candidate is marked hired
      candidates: prev.candidates.map((c: Candidate) =>
        c.id === candidate.id ? { ...c, status: 'Hired' } : c
      )
    }));

    showToast(`Successfully onboarded ${candidate.name} as Employee ${employeeId}!`);
    return newEmployee;
  };

  const updateEmployeeOnboarding = (employeeId: string, status: OnboardingStatus) => {
    setData((prev: typeof data) => ({
      ...prev,
      employees: prev.employees.map((e: Employee) =>
        e.id === employeeId ? { ...e, onboardingStatus: status } : e
      )
    }));
    showToast(`Onboarding milestone updated: ${status}`);
  };

  const updateCompanySettings = (settings: CompanySettings) => {
    setData((prev: typeof data) => ({
      ...prev,
      companySettings: settings
    }));
    showToast('Company profile settings saved.');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({
      jobs: INITIAL_JOBS,
      candidates: INITIAL_CANDIDATES,
      audits: INITIAL_AUDITS,
      screenings: INITIAL_SCREENINGS,
      interviews: INITIAL_INTERVIEWS,
      offers: INITIAL_OFFERS,
      employees: INITIAL_EMPLOYEES,
      departments: INITIAL_DEPARTMENTS,
      companySettings: INITIAL_COMPANY_SETTINGS
    });
    showToast('System reset to default demo dataset.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: INITIAL_USERS,
        setCurrentUser,
        jobs: data.jobs,
        candidates: data.candidates,
        audits: data.audits,
        screenings: data.screenings,
        interviews: data.interviews,
        offers: data.offers,
        employees: data.employees,
        departments: data.departments,
        companySettings: data.companySettings,
        toast,
        showToast,
        hideToast,
        createJob,
        updateJob,
        deleteJob,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        updateCandidateStage,
        submitScreening,
        scheduleInterview,
        updateInterview,
        cancelInterview,
        submitInterviewFeedback,
        createOffer,
        updateOfferStatus,
        convertOfferToEmployee,
        updateEmployeeOnboarding,
        updateCompanySettings,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
