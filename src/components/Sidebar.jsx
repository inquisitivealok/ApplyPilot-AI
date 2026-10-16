import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Compass,
  Lightbulb,
  PlusCircle,
  X
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  applicationsCount,
  isMobileOpen,
  setIsMobileOpen,
  onOpenNewModal
}) {
  const handleNavClick = (view) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <h2>ApplyPilot AI</h2>
            <span>Smart Job Copilot</span>
          </div>
          {isMobileOpen && (
            <button
              className="action-icon-btn"
              style={{ marginLeft: 'auto' }}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="sidebar-nav">
          <div className="nav-section-label">Core Platform</div>

          <button
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Applications Tracker</span>
            <span className="nav-badge">{applicationsCount}</span>
          </button>

          <button
            className={`nav-item ${activeView === 'analyzer' ? 'active' : ''}`}
            onClick={() => handleNavClick('analyzer')}
          >
            <Sparkles size={18} />
            <span>AI Job Matcher</span>
            <span className="nav-badge" style={{ color: '#818cf8', fontWeight: 'bold' }}>AI</span>
          </button>

          <button
            className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavClick('analytics')}
          >
            <TrendingUp size={18} />
            <span>Funnel Analytics</span>
          </button>

          <div style={{ marginTop: '16px', padding: '0 4px' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                onOpenNewModal();
                setIsMobileOpen(false);
              }}
            >
              <PlusCircle size={16} />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Career Pro Tip Widget */}
        <div className="sidebar-pro-tip">
          <div className="pro-tip-header">
            <Lightbulb size={14} />
            <span>Smart Career Tip</span>
          </div>
          <p>
            Matching 5+ core keywords from the job description increases your ATS screen pass rate by up to 74%.
          </p>
        </div>

        {/* User Profile Mini Footer */}
        <div className="sidebar-footer">
          <div className="user-avatar">AP</div>
          <div className="user-info">
            <div className="user-name">Alex Parker</div>
            <div className="user-role">Full-Stack Candidate</div>
          </div>
        </div>
      </aside>
    </>
  );
}
