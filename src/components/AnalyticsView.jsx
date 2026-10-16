import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  PieChart,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export default function AnalyticsView({ applications, setActiveView }) {
  const total = applications.length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const interviewRate = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offerCount / total) * 100) : 0;

  // Work type breakdown
  const remoteCount = applications.filter((a) => a.workType === 'Remote').length;
  const hybridCount = applications.filter((a) => a.workType === 'Hybrid').length;
  const onsiteCount = applications.filter((a) => a.workType === 'On-site').length;

  // Tag frequency analysis
  const skillFrequency = {};
  applications.forEach((app) => {
    (app.tags || []).forEach((tag) => {
      skillFrequency[tag] = (skillFrequency[tag] || 0) + 1;
    });
  });

  const sortedSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        className="analyzer-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.15) 100%)',
          borderColor: 'rgba(56, 189, 248, 0.3)'
        }}
      >
        <div className="analyzer-banner-text">
          <span className="badge badge-applied" style={{ marginBottom: '8px' }}>
            <TrendingUp size={12} /> Pipeline Conversion Insights
          </span>
          <h2>Search Efficiency & Progression Analytics</h2>
          <p>
            Track how effectively your applications convert from initial submissions into technical interviews and final offers.
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveView('dashboard')}
        >
          Back to Tracker
        </button>
      </div>

      {/* Conversion Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Interview Conversion</span>
            <div className="stat-icon-wrapper" style={{ background: 'var(--status-interview-bg)', color: 'var(--status-interview)' }}>
              <Target size={20} />
            </div>
          </div>
          <div className="stat-value">{interviewRate}%</div>
          <div className="stat-meta">
            <span className="stat-highlight" style={{ color: 'var(--status-interview)' }}>
              Industry benchmark: 15-20%
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Offer Close Rate</span>
            <div className="stat-icon-wrapper" style={{ background: 'var(--status-offer-bg)', color: 'var(--status-offer)' }}>
              <Award size={20} />
            </div>
          </div>
          <div className="stat-value">{offerRate}%</div>
          <div className="stat-meta">
            <span className="stat-highlight" style={{ color: 'var(--status-offer)' }}>
              {offerCount} active offer received
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Average Pipeline Velocity</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value">14 Days</div>
          <div className="stat-meta">
            <span>from application to round 1</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Search Health Index</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="stat-value">92/100</div>
          <div className="stat-meta">
            <span className="stat-highlight" style={{ color: '#34d399' }}>Excellent activity</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="analyzer-grid">
        {/* Pipeline Funnel */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <span>Application Conversion Funnel</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Total Applied */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>1. Total Submissions</span>
                <span style={{ color: 'var(--text-muted)' }}>{total} applications (100%)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary-gradient)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Interviews */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>2. Active Interviews</span>
                <span style={{ color: 'var(--text-muted)' }}>{interviewCount} stages ({interviewRate}%)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(8, interviewRate)}%`, height: '100%', background: 'var(--status-interview)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Offers */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>3. Final Offers</span>
                <span style={{ color: 'var(--text-muted)' }}>{offerCount} offers ({offerRate}%)</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(5, offerRate)}%`, height: '100%', background: 'var(--status-offer)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Rejections */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>4. Archived / Unmatched</span>
                <span style={{ color: 'var(--text-muted)' }}>{rejectedCount} roles</span>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (rejectedCount / total) * 100 : 0}%`, height: '100%', background: 'var(--status-rejected)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Most Targeted Tech & Location Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: '#818cf8' }} />
            <span>Target Tech Stack Breakdown</span>
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {sortedSkills.map(([skill, count], idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.825rem'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{skill}</span>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}
                >
                  {count} jobs
                </span>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Work Mode Breakdown
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{remoteCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Remote</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#818cf8' }}>{hybridCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hybrid</div>
            </div>
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{onsiteCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On-site</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
