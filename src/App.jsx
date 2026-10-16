import React, { useState, useEffect } from 'react';
import './App.css';
import { loadApplications, saveApplications, INITIAL_APPLICATIONS } from './data/mockData';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatsCards from './components/StatsCards';
import ApplicationTracker from './components/ApplicationTracker';
import ApplicationModal from './components/ApplicationModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import JobAnalyzer from './components/JobAnalyzer';
import AnalyticsView from './components/AnalyticsView';
import Toast from './components/Toast';

export default function App() {
  // Application Data State
  const [applications, setApplications] = useState(() => loadApplications());

  // Active view: 'dashboard' | 'analyzer' | 'analytics'
  const [activeView, setActiveView] = useState('dashboard');

  // Filter & UI State
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [deletingApplication, setDeletingApplication] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with localStorage
  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  // Modal Handlers
  const handleOpenNewModal = () => {
    setEditingApplication(null);
    setIsAppModalOpen(true);
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setIsAppModalOpen(true);
  };

  const handleSaveApplication = (savedApp) => {
    setApplications((prev) => {
      const exists = prev.some((item) => item.id === savedApp.id);
      if (exists) {
        showToast(`Updated application for ${savedApp.company}`, 'success');
        return prev.map((item) => (item.id === savedApp.id ? savedApp : item));
      } else {
        showToast(`Added ${savedApp.company} (${savedApp.jobTitle})`, 'success');
        return [savedApp, ...prev];
      }
    });
  };

  const handleDeleteApplication = (application) => {
    setDeletingApplication(application);
  };

  const handleConfirmDelete = (applicationId) => {
    const target = applications.find((a) => a.id === applicationId);
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    showToast(`Removed application for ${target?.company || 'job'}`, 'danger');
  };

  const handleClearSampleData = () => {
    setApplications((prev) => {
      const customOnly = prev.filter((app) => !app.isSample);
      saveApplications(customOnly);
      return customOnly;
    });
    showToast('Removed preloaded sample applications.', 'info');
  };

  const handleResetDemoData = () => {
    setApplications((prev) => {
      const userCreated = prev.filter((app) => !app.isSample);
      const combined = [...INITIAL_APPLICATIONS, ...userCreated];
      saveApplications(combined);
      return combined;
    });
    showToast('Restored sample job applications!', 'info');
  };

  const handleAddToTrackerFromAnalyzer = (newApp) => {
    const fullApp = {
      id: `app-${Date.now()}`,
      company: newApp.company,
      jobTitle: newApp.jobTitle,
      status: newApp.status || 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
      location: 'Remote',
      workType: 'Remote',
      salary: '',
      jobUrl: '',
      tags: newApp.tags || ['React', 'Frontend'],
      notes: newApp.notes || 'Analyzed with ApplyPilot AI'
    };
    setApplications((prev) => [fullApp, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        applicationsCount={applications.length}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenNewModal={handleOpenNewModal}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Topbar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenNewModal={handleOpenNewModal}
          setIsMobileOpen={setIsMobileOpen}
          totalCount={applications.length}
        />

        <main className="main-body">
          {activeView === 'dashboard' && (
            <>
              {/* Stats Overview Cards */}
              <StatsCards
                applications={applications}
                activeFilter={statusFilter}
                onSelectFilter={(filterKey) => setStatusFilter(filterKey)}
              />

              {/* Application Tracker Table & Filters */}
              <ApplicationTracker
                applications={applications}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onEditApplication={handleEditApplication}
                onDeleteApplication={handleDeleteApplication}
                onOpenNewModal={handleOpenNewModal}
                onResetDemoData={handleResetDemoData}
                onClearSampleData={handleClearSampleData}
              />
            </>
          )}

          {activeView === 'analyzer' && (
            <JobAnalyzer
              onAddToTracker={handleAddToTrackerFromAnalyzer}
              showToast={showToast}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              applications={applications}
              setActiveView={setActiveView}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Application Modal */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onSave={handleSaveApplication}
        initialData={editingApplication}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingApplication)}
        application={deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
