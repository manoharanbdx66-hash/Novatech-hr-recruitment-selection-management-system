export type UserRole = 'admin' | 'hr_manager' | 'interviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
}

export type JobStatus = 'Draft' | 'Published' | 'Closed' | 'Archived';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  experienceMin: number;
  experienceMax: number;
  salaryMinLakhs: number;
  salaryMaxLakhs: number;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  qualification: string;
  openingsCount: number;
  status: JobStatus;
  createdAt: string;
  closingDate: string;
}

export type ApplicationStage =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Offer Sent'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn';

export type CandidateSource =
  | 'LinkedIn'
  | 'Employee Referral'
  | 'Campus Placement'
  | 'Career Portal'
  | 'Job Board'
  | 'Direct';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  qualification: string;
  experienceYears: number;
  currentCompany?: string;
  currentRole?: string;
  source: CandidateSource;
  appliedJobId: string;
  appliedJobTitle: string;
  applicationDate: string;
  status: ApplicationStage;
  resumeFileName: string;
  resumeSummary: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface ApplicationAudit {
  id: string;
  candidateId: string;
  candidateName: string;
  fromStage: ApplicationStage;
  toStage: ApplicationStage;
  timestamp: string;
  changedBy: string;
  reason?: string;
  note?: string;
}

export interface ScreeningRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  matchScore: number; // 0 to 100 calculated aid
  experienceMatch: boolean;
  qualificationMatch: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: 'Shortlist' | 'Hold' | 'Reject';
  reviewerNotes: string;
  reviewedAt: string;
  reviewedBy: string;
}

export type InterviewRound =
  | 'Technical Round 1'
  | 'Technical Round 2'
  | 'HR Round'
  | 'Managerial Round';

export type InterviewMode =
  | 'Google Meet'
  | 'Microsoft Teams'
  | 'In-Person (Chennai HQ)'
  | 'Phone Screen';

export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface InterviewFeedback {
  technicalScore: number; // 1 to 5
  problemSolvingScore: number; // 1 to 5
  communicationScore: number; // 1 to 5
  cultureFitScore: number; // 1 to 5
  overallRecommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Strong Reject';
  notes: string;
  strengths: string[];
  areasOfImprovement: string[];
  submittedAt: string;
  submittedBy: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  roundName: InterviewRound;
  date: string;
  time: string;
  durationMinutes: number;
  mode: InterviewMode;
  meetingLink?: string;
  status: InterviewStatus;
  feedback?: InterviewFeedback;
}

export type OfferStatus = 'Draft' | 'Approved' | 'Sent' | 'Accepted' | 'Declined';

export interface JobOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  department: string;
  offeredDesignation: string;
  ctcAnnualLakhs: number;
  joiningDate: string;
  status: OfferStatus;
  approvedBy?: string;
  sentDate?: string;
  responseDate?: string;
  notes?: string;
}

export type OnboardingStatus =
  | 'Document Verification'
  | 'Asset Allocation'
  | 'Orientation & Welcome'
  | 'Active & Completed';

export interface Employee {
  id: string;
  employeeId: string;
  candidateId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  onboardingStatus: OnboardingStatus;
  mentorName: string;
  workLocation: string;
  reportingManager: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  head: string;
  openingsCount: number;
}

export interface CompanySettings {
  name: string;
  legalName: string;
  industry: string;
  headquarters: string;
  address: string;
  website: string;
  hrEmail: string;
  phone: string;
  timezone: string;
  currency: string;
  academicAffiliation: string;
}
