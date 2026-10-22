import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, EmploymentType, JobStatus } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobToEdit?: Job | null;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  jobToEdit
}) => {
  const { createJob, updateJob, departments } = useApp();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('Chennai (OMR Tech Corridor) / Hybrid');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [experienceMin, setExperienceMin] = useState(2);
  const [experienceMax, setExperienceMax] = useState(5);
  const [salaryMinLakhs, setSalaryMinLakhs] = useState(10);
  const [salaryMaxLakhs, setSalaryMaxLakhs] = useState(16);
  const [openingsCount, setOpeningsCount] = useState(2);
  const [qualification, setQualification] = useState('B.E / B.Tech in IT / CSE or equivalent degree');
  const [closingDate, setClosingDate] = useState('2026-11-30');
  const [status, setStatus] = useState<JobStatus>('Published');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setDepartment(jobToEdit.department);
      setLocation(jobToEdit.location);
      setEmploymentType(jobToEdit.employmentType);
      setExperienceMin(jobToEdit.experienceMin);
      setExperienceMax(jobToEdit.experienceMax);
      setSalaryMinLakhs(jobToEdit.salaryMinLakhs);
      setSalaryMaxLakhs(jobToEdit.salaryMaxLakhs);
      setOpeningsCount(jobToEdit.openingsCount);
      setQualification(jobToEdit.qualification);
      setClosingDate(jobToEdit.closingDate);
      setStatus(jobToEdit.status);
      setDescription(jobToEdit.description);
      setSkills(jobToEdit.requiredSkills || []);
      setResponsibilities(jobToEdit.responsibilities || []);
    } else {
      // Default
      setTitle('');
      setDepartment(departments[0]?.name || 'Software Engineering');
      setLocation('Chennai (OMR Tech Corridor) / Hybrid');
      setEmploymentType('Full-time');
      setExperienceMin(2);
      setExperienceMax(5);
      setSalaryMinLakhs(10);
      setSalaryMaxLakhs(16);
      setOpeningsCount(2);
      setQualification('B.E / B.Tech in IT / CSE or equivalent degree');
      setClosingDate(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]);
      setStatus('Published');
      setDescription('');
      setSkills(['React', 'TypeScript', 'Node.js']);
      setResponsibilities([
        'Design, build and deliver scalable software applications',
        'Participate in architecture discussions and sprint reviews'
      ]);
    }
    setErrors({});
  }, [jobToEdit, departments, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      setSkills([...skills, skillsInput.trim()]);
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddResp = () => {
    if (responsibilitiesInput.trim()) {
      setResponsibilities([...responsibilities, responsibilitiesInput.trim()]);
      setResponsibilitiesInput('');
    }
  };

  const handleRemoveResp = (idx: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!department) newErrors.department = 'Department is required';
    if (!description.trim()) newErrors.description = 'Job description is required';
    if (skills.length === 0) newErrors.skills = 'At least 1 required skill must be added';
    if (experienceMin > experienceMax) newErrors.experience = 'Min experience cannot exceed max';
    if (salaryMinLakhs > salaryMaxLakhs) newErrors.salary = 'Min salary cannot exceed max';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (jobToEdit) {
      updateJob(jobToEdit.id, {
        title,
        department,
        location,
        employmentType,
        experienceMin,
        experienceMax,
        salaryMinLakhs,
        salaryMaxLakhs,
        openingsCount,
        qualification,
        closingDate,
        status,
        description,
        requiredSkills: skills,
        responsibilities
      });
    } else {
      createJob({
        title,
        department,
        location,
        employmentType,
        experienceMin,
        experienceMax,
        salaryMinLakhs,
        salaryMaxLakhs,
        openingsCount,
        qualification,
        closingDate,
        status,
        description,
        requiredSkills: skills,
        responsibilities
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {jobToEdit ? 'Edit Job Requisition' : 'Create New Job Opening'}
            </h2>
            <p className="text-xs text-slate-500">
              NovaTech Solutions Talent Acquisition Requisition Form
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer (React / Node.js)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Location &amp; Mode
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Chennai (OMR Tech Corridor) / Hybrid"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Number of Openings */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Headcount (Openings)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={openingsCount}
                onChange={(e) => setOpeningsCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Range (Years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experienceMin}
                  onChange={(e) => setExperienceMin(parseInt(e.target.value) || 0)}
                  placeholder="Min"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experienceMax}
                  onChange={(e) => setExperienceMax(parseInt(e.target.value) || 0)}
                  placeholder="Max"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              {errors.experience && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.experience}</p>
              )}
            </div>

            {/* Salary Range (LPA) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual CTC Budget (₹ Lakhs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={salaryMinLakhs}
                  onChange={(e) => setSalaryMinLakhs(parseFloat(e.target.value) || 0)}
                  placeholder="Min LPA"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={salaryMaxLakhs}
                  onChange={(e) => setSalaryMaxLakhs(parseFloat(e.target.value) || 0)}
                  placeholder="Max LPA"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              {errors.salary && <p className="text-[11px] text-rose-600 mt-1">{errors.salary}</p>}
            </div>

            {/* Minimum Qualification */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Educational Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. B.E / B.Tech in IT / CSE or equivalent degree"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Closing Date & Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Published">Published (Live for applicants)</option>
                <option value="Draft">Draft (Internal review)</option>
                <option value="Closed">Closed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of the job mandate and team context..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Required Skills Builder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills / Screening Criteria *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. React, Docker, PostgreSQL (Press Enter to add)"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {errors.skills && <p className="text-[11px] text-rose-600 mt-1">{errors.skills}</p>}
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Key Responsibilities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={responsibilitiesInput}
                onChange={(e) => setResponsibilitiesInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddResp();
                  }
                }}
                placeholder="Add role duty or responsibility..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddResp}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                Add
              </button>
            </div>
            <ul className="space-y-1 text-xs text-slate-700">
              {responsibilities.map((resp, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200"
                >
                  <span className="flex-1 pr-2">• {resp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveResp(i)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              {jobToEdit ? 'Save Changes' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
