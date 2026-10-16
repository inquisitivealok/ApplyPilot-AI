import React from 'react';
import { Menu, Plus, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Topbar({
  activeView,
  setActiveView,
  onOpenNewModal,
  setIsMobileOpen
}) {
  const getHeaderInfo = () => {
    switch (activeView) {
      case 'analyzer':
        return {
          title: 'AI Job Description Analyzer',
          subtitle: 'Evaluate your resume fit, extract missing keywords, and draft cold pitches'
        };
      case 'analytics':
        return {
          title: 'Career Funnel & Analytics',
          subtitle: 'Visualize your interview progression, offer conversion, and job search metrics'
        };
      default:
        return {
          title: 'Job Application Tracker',
          subtitle: 'Monitor deadlines, interview stages, offers, and follow-ups in one place'
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle-btn"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="page-title-group">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        {activeView !== 'analyzer' && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('analyzer')}
            title="Open AI Analyzer"
          >
            <Sparkles size={15} style={{ color: '#818cf8' }} />
            <span style={{ display: 'none', sm: 'inline' }}>AI Matcher</span>
          </button>
        )}

        {activeView !== 'dashboard' && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('dashboard')}
            title="Go to Applications Tracker"
          >
            <LayoutDashboard size={15} />
            <span>Tracker</span>
          </button>
        )}

        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenNewModal}
        >
          <Plus size={16} />
          <span>Add Job</span>
        </button>
      </div>
    </header>
  );
}
