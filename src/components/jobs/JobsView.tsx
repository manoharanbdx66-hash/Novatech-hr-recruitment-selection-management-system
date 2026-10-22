import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobStatus, Candidate } from '../../types';
import { JobFormModal } from './JobFormModal';
import { JobDetailModal } from './JobDetailModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  Archive,
  AlertCircle
} from 'lucide-react';

interface JobsViewProps {
  onSelectCandidate?: (candidate: Candidate) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ onSelectCandidate }) => {
  const { jobs, candidates, deleteJob, updateJob, currentUser, departments } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const canManage = currentUser.role === 'admin' || currentUser.role === 'hr_manager';

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Published':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Draft':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Closed':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Archived':
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const handleToggleStatus = (job: Job) => {
    const newStatus: JobStatus = job.status === 'Published' ? 'Closed' : 'Published';
    updateJob(job.id, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Job Requisitions &amp; Vacancies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company openings, position descriptions, criteria, and hiring targets.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setJobToEdit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Job Requisition</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, department, or skill..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Dept filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
            <option value="Archived">Archived</option>
          </select>

          <span className="text-xs text-slate-400 font-mono pl-2">
            Showing {filteredJobs.length} of {jobs.length}
          </span>
        </div>
      </div>

      {/* Jobs Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-700">No job openings found</div>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search filters or create a new job requisition.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const applicantCount = candidates.filter((c) => c.appliedJobId === job.id).length;
            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{job.id}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedJob(job)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                  >
                    {job.title}
                  </h3>

                  <div className="text-xs text-slate-500 mt-1 font-medium">
                    {job.department}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.experienceMin} - {job.experienceMax} yrs exp · {job.employmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>₹{job.salaryMinLakhs} - ₹{job.salaryMaxLakhs} LPA</span>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[10px] text-slate-400 py-0.5">
                        +{job.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer metrics & actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{applicantCount} applicants</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-normal">{job.openingsCount} openings</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canManage && (
                      <>
                        <button
                          onClick={() => {
                            setJobToEdit(job);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-50"
                          title="Edit Job"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <JobFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        jobToEdit={jobToEdit}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onEdit={(j) => {
          setSelectedJob(null);
          setJobToEdit(j);
          setIsFormOpen(true);
        }}
        onSelectCandidate={onSelectCandidate}
      />

      <ConfirmationModal
        isOpen={!!jobToDelete}
        title="Delete Job Requisition"
        description={`Are you sure you want to delete "${jobToDelete?.title}"? This cannot be undone.`}
        confirmLabel="Delete Requisition"
        isDestructive={true}
        onConfirm={() => {
          if (jobToDelete) {
            deleteJob(jobToDelete.id);
            setJobToDelete(null);
          }
        }}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  );
};
