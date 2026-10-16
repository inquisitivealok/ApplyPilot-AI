import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function ApplicationForm({ initialData, onClose, onSave }) {
  const isEditing = Boolean(initialData);

  const [company, setCompany] = useState(initialData?.company || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [status, setStatus] = useState(initialData?.status || 'Applied');
  const [dateApplied, setDateApplied] = useState(
    () => initialData?.dateApplied || new Date().toISOString().split('T')[0]
  );
  const [workType, setWorkType] = useState(initialData?.workType || 'Remote');
  const [location, setLocation] = useState(initialData?.location || '');
  const [salary, setSalary] = useState(initialData?.salary || '');
  const [jobUrl, setJobUrl] = useState(initialData?.jobUrl || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(', ') : ''
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!company.trim()) {
      errs.company = 'Company name is required';
    }
    if (!jobTitle.trim()) {
      errs.jobTitle = 'Job title / role is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...initialData,
      id: initialData?.id || `app-${Date.now()}`,
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      status,
      dateApplied,
      workType,
      location: location.trim() || 'Remote',
      salary: salary.trim(),
      jobUrl: jobUrl.trim(),
      notes: notes.trim(),
      tags: tags.length > 0 ? tags : ['General']
    };

    onSave(payload);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        <div className="form-grid-2">
          {/* Company */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-company">
              <span>Company Name *</span>
            </label>
            <input
              id="app-company"
              type="text"
              className="form-input"
              placeholder="e.g. Stripe, OpenAI, Figma"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={errors.company ? { borderColor: 'var(--status-rejected)' } : {}}
              aria-required="true"
              aria-invalid={errors.company ? 'true' : 'false'}
              aria-describedby={errors.company ? 'company-error' : undefined}
              autoFocus
            />
            {errors.company && (
              <span id="company-error" style={{ fontSize: '0.75rem', color: 'var(--status-rejected)' }}>
                {errors.company}
              </span>
            )}
          </div>

          {/* Job Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-job-title">
              <span>Job Title / Role *</span>
            </label>
            <input
              id="app-job-title"
              type="text"
              className="form-input"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              style={errors.jobTitle ? { borderColor: 'var(--status-rejected)' } : {}}
              aria-required="true"
              aria-invalid={errors.jobTitle ? 'true' : 'false'}
              aria-describedby={errors.jobTitle ? 'jobtitle-error' : undefined}
            />
            {errors.jobTitle && (
              <span id="jobtitle-error" style={{ fontSize: '0.75rem', color: 'var(--status-rejected)' }}>
                {errors.jobTitle}
              </span>
            )}
          </div>
        </div>

        <div className="form-grid-2">
          {/* Status */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-status">Application Status</label>
            <select
              id="app-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date Applied */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-date">Date Applied</label>
            <input
              id="app-date"
              type="date"
              className="form-input"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-2">
          {/* Job URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-url">Job Posting URL</label>
            <input
              id="app-url"
              type="url"
              className="form-input"
              placeholder="https://company.com/careers/job-id"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>

          {/* Work Mode */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-work-type">Work Mode</label>
            <select
              id="app-work-type"
              className="form-select"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-location">Location</label>
            <input
              id="app-location"
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Salary */}
          <div className="form-group">
            <label className="form-label" htmlFor="app-salary">Target Salary / Range</label>
            <input
              id="app-salary"
              type="text"
              className="form-input"
              placeholder="e.g. $140k - $175k"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label" htmlFor="app-tags">
            <span>Tech Stack / Keywords</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Comma-separated
            </span>
          </label>
          <input
            id="app-tags"
            type="text"
            className="form-input"
            placeholder="e.g. React, TypeScript, GraphQL, Next.js"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="app-notes">Notes, Recruiter Details & Follow-ups</label>
          <textarea
            id="app-notes"
            className="form-textarea"
            placeholder="e.g. Submitted via referral. Technical interview scheduled for next week with hiring manager..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : 'Create Application'}
        </button>
      </div>
    </form>
  );
}

export default function ApplicationModal({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
      >
        <div className="modal-header">
          <div>
            <h3 id="app-modal-title">{initialData ? 'Edit Job Application' : 'Add New Job Application'}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {initialData
                ? 'Update stage notes, interview timelines, or compensation'
                : 'Log a new opportunity to track through your hiring pipeline'}
            </p>
          </div>
          <button className="action-icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <ApplicationForm
          key={initialData?.id || 'new'}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
