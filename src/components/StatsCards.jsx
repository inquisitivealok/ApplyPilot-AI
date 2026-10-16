import React from 'react';
import {
  Briefcase,
  Calendar,
  Award,
  XCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function StatsCards({ applications, activeFilter, onSelectFilter }) {
  const total = applications.length;
  const interviews = applications.filter(
    (app) => app.status === 'Interview'
  ).length;
  const offers = applications.filter((app) => app.status === 'Offer').length;
  const rejections = applications.filter(
    (app) => app.status === 'Rejected'
  ).length;

  const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* Total Applications Card */}
      <div
        className={`stat-card total ${activeFilter === 'all' ? 'active-border' : ''}`}
        onClick={() => onSelectFilter && onSelectFilter('all')}
        style={{ cursor: 'pointer' }}
        title="Click to view all applications"
      >
        <div className="stat-card-header">
          <span className="stat-label">Total Tracked</span>
          <div className="stat-icon-wrapper">
            <Briefcase size={20} />
          </div>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-meta">
          <span className="stat-highlight">
            <TrendingUp size={13} /> Active pipeline
          </span>
          <span>across all channels</span>
        </div>
      </div>

      {/* Interviews Card */}
      <div
        className="stat-card interview"
        onClick={() => onSelectFilter && onSelectFilter('Interview')}
        style={{ cursor: 'pointer' }}
        title="Click to filter by interviews"
      >
        <div className="stat-card-header">
          <span className="stat-label">In Interviews</span>
          <div className="stat-icon-wrapper">
            <Calendar size={20} />
          </div>
        </div>
        <div className="stat-value">{interviews}</div>
        <div className="stat-meta">
          <span className="stat-highlight">
            <Clock size={13} /> {interviewRate}% rate
          </span>
          <span>from submissions</span>
        </div>
      </div>

      {/* Offers Card */}
      <div
        className="stat-card offer"
        onClick={() => onSelectFilter && onSelectFilter('Offer')}
        style={{ cursor: 'pointer' }}
        title="Click to filter by offers"
      >
        <div className="stat-card-header">
          <span className="stat-label">Offers Received</span>
          <div className="stat-icon-wrapper">
            <Award size={20} />
          </div>
        </div>
        <div className="stat-value">{offers}</div>
        <div className="stat-meta">
          <span className="stat-highlight">
            {offers > 0 ? '🎉 Action ready' : 'Targeting 1+'}
          </span>
          <span>{offerRate}% conversion</span>
        </div>
      </div>

      {/* Rejections Card */}
      <div
        className="stat-card rejected"
        onClick={() => onSelectFilter && onSelectFilter('Rejected')}
        style={{ cursor: 'pointer' }}
        title="Click to filter by rejections"
      >
        <div className="stat-card-header">
          <span className="stat-label">Archived / Rejected</span>
          <div className="stat-icon-wrapper">
            <XCircle size={20} />
          </div>
        </div>
        <div className="stat-value">{rejections}</div>
        <div className="stat-meta">
          <span className="stat-highlight">Learning points</span>
          <span>for resume tuning</span>
        </div>
      </div>
    </div>
  );
}
