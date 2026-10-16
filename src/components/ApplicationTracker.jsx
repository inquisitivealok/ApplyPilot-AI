import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ExternalLink,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  DollarSign,
  PlusCircle,
  Inbox,
  RotateCcw
} from 'lucide-react';

export default function ApplicationTracker({
  applications,
  statusFilter,
  setStatusFilter,
  onEditApplication,
  onDeleteApplication,
  onOpenNewModal,
  onResetDemoData,
  onClearSampleData
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const hasSampleData = useMemo(() => {
    return applications.some((app) => app.isSample);
  }, [applications]);

  // Filter and search logic
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== 'all' && app.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Work type filter
      if (workTypeFilter !== 'All' && app.workType !== workTypeFilter) {
        return false;
      }

      // Text search: company, job title, application status, location, notes, tags
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesCompany = (app.company || '').toLowerCase().includes(query);
        const matchesTitle = (app.jobTitle || '').toLowerCase().includes(query);
        const matchesStatus = (app.status || '').toLowerCase().includes(query);
        const matchesLocation = (app.location || '').toLowerCase().includes(query);
        const matchesNotes = (app.notes || '').toLowerCase().includes(query);
        const matchesTags = (app.tags || []).some((t) => t.toLowerCase().includes(query));

        return matchesCompany || matchesTitle || matchesStatus || matchesLocation || matchesNotes || matchesTags;
      }

      return true;
    });
  }, [applications, statusFilter, workTypeFilter, searchTerm]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: applications.length,
      applied: applications.filter((a) => a.status === 'Applied').length,
      interview: applications.filter((a) => a.status === 'Interview').length,
      offer: applications.filter((a) => a.status === 'Offer').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length
    };
  }, [applications]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Status badge helper
  const renderStatusBadge = (status) => {
    const s = (status || 'applied').toLowerCase();
    let badgeClass = 'badge-applied';
    if (s.includes('interview')) badgeClass = 'badge-interview';
    else if (s.includes('offer')) badgeClass = 'badge-offer';
    else if (s.includes('reject')) badgeClass = 'badge-rejected';

    return (
      <span className={`badge ${badgeClass}`}>
        <span className="badge-dot" />
        {status}
      </span>
    );
  };

  return (
    <div className="tracker-section">
      {/* Top Controls Toolbar */}
      <div className="tracker-toolbar">
        {/* Search Input */}
        <div className="search-input-group">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by company, job title, status, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="status-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'applied', label: 'Applied' },
            { id: 'interview', label: 'Interviews' },
            { id: 'offer', label: 'Offers' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`status-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span className="status-tab-count">{counts[tab.id] || 0}</span>
            </button>
          ))}
        </div>

        {/* Additional Filters & View Switcher */}
        <div className="filter-actions-group">
          <select
            className="form-select"
            style={{ width: 'auto', padding: '7px 32px 7px 12px', fontSize: '0.8rem' }}
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
            aria-label="Filter by work location"
          >
            <option value="All">All Locations</option>
            <option value="Remote">Remote Only</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Sample Data Control Button */}
          {hasSampleData ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClearSampleData}
              title="Remove preloaded sample records to work with only your applications"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              <Trash2 size={13} style={{ color: 'var(--status-rejected)' }} />
              <span>Clear Sample Data</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetDemoData}
              title="Load realistic sample job applications"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              <RotateCcw size={13} style={{ color: 'var(--primary)' }} />
              <span>Restore Samples</span>
            </button>
          )}

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
              aria-label="Table view"
            >
              <List size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid cards view"
              aria-label="Cards view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Content or Clear Empty States */}
      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={28} />
          </div>
          <h3>No job applications tracked yet</h3>
          <p>
            Start logging your job search opportunities, or load the realistic sample data to explore the tracker.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewModal}>
              <PlusCircle size={15} />
              <span>Add Your First Application</span>
            </button>
            {onResetDemoData && (
              <button className="btn btn-secondary btn-sm" onClick={onResetDemoData}>
                <RotateCcw size={14} />
                <span>Load Sample Applications</span>
              </button>
            )}
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={28} />
          </div>
          <h3>No applications match your filter</h3>
          <p>
            {searchTerm
              ? `No results found for "${searchTerm}". Try adjusting your keywords or clearing the filter.`
              : `No applications with status "${statusFilter}" match your criteria.`}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setWorkTypeFilter('All');
              }}
            >
              Reset Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewModal}>
              <PlusCircle size={15} />
              <span>Add New Application</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="table-container">
          <table className="applications-table" aria-label="Job Applications Tracker">
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Role & Stack</th>
                <th scope="col">Date Applied</th>
                <th scope="col">Work Mode</th>
                <th scope="col">Status</th>
                <th scope="col">Salary</th>
                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  {/* Company */}
                  <td>
                    <div className="company-cell">
                      <div
                        className="company-logo"
                        style={{
                          backgroundColor: app.color ? `${app.color}22` : '#1e293b',
                          borderColor: app.color || 'var(--border-medium)',
                          color: app.color || '#fff'
                        }}
                      >
                        {app.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="company-details">
                        <div className="company-name">
                          {app.company}
                          {app.isSample && (
                            <span className="badge-sample" title="Preloaded demo opportunity">
                              Sample
                            </span>
                          )}
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="external-link-btn"
                              title="Open original job posting"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                        <span className="company-location">{app.location || 'Location not specified'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role & Tags */}
                  <td>
                    <div className="role-title">{app.jobTitle}</div>
                    {app.tags && app.tags.length > 0 && (
                      <div className="role-tags">
                        {app.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="role-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Date Applied */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(app.dateApplied)}</span>
                    </div>
                  </td>

                  {/* Work Mode */}
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color:
                          app.workType === 'Remote'
                            ? '#34d399'
                            : app.workType === 'Hybrid'
                            ? '#818cf8'
                            : 'var(--text-secondary)'
                      }}
                    >
                      {app.workType || 'Remote'}
                    </span>
                  </td>

                  {/* Status */}
                  <td>{renderStatusBadge(app.status)}</td>

                  {/* Salary */}
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                      {app.salary || '—'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="action-icon-btn"
                        onClick={() => onEditApplication(app)}
                        title="Edit application"
                        aria-label={`Edit ${app.company}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-icon-btn delete"
                        onClick={() => onDeleteApplication(app)}
                        title="Delete application"
                        aria-label={`Delete ${app.company}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards / Grid View */
        <div className="apps-grid-view">
          {filteredApplications.map((app) => (
            <div key={app.id} className="app-grid-card">
              <div className="app-grid-card-top">
                <div className="company-cell">
                  <div
                    className="company-logo"
                    style={{
                      backgroundColor: app.color ? `${app.color}22` : '#1e293b',
                      borderColor: app.color || 'var(--border-medium)',
                      color: app.color || '#fff'
                    }}
                  >
                    {app.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="company-name">
                      {app.company}
                      {app.isSample && (
                        <span className="badge-sample" title="Preloaded demo opportunity">
                          Sample
                        </span>
                      )}
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="external-link-btn"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    <div className="company-location">
                      <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {app.location || 'Remote'}
                    </div>
                  </div>
                </div>
                {renderStatusBadge(app.status)}
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{app.jobTitle}</h4>
                {app.tags && app.tags.length > 0 && (
                  <div className="role-tags" style={{ marginBottom: '10px' }}>
                    {app.tags.map((tag, idx) => (
                      <span key={idx} className="role-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {app.notes && <div className="app-grid-notes">{app.notes}</div>}
              </div>

              <div className="app-grid-card-bottom">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span>Applied: {formatDate(app.dateApplied)}</span>
                  {app.salary && (
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <DollarSign size={12} style={{ display: 'inline' }} />
                      {app.salary}
                    </span>
                  )}
                </div>

                <div className="actions-cell">
                  <button
                    className="action-icon-btn"
                    onClick={() => onEditApplication(app)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="action-icon-btn delete"
                    onClick={() => onDeleteApplication(app)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
