import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Public & Auth Pages
import { LoginPage } from './pages/LoginPage';
import { PublicFeedbackPage } from './pages/PublicFeedbackPage';

// Admin 7 Sections Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminFormBuilderPage } from './pages/admin/AdminFormBuilderPage';
import { AdminInvitationsPage } from './pages/admin/AdminInvitationsPage';
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminEmailManagementPage } from './pages/admin/AdminEmailManagementPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Helper for query preservation when redirecting
const RedirectToFeedback = () => {
  const location = useLocation();
  return <Navigate to={`/feedback${location.search}`} replace />;
};

// Protected Admin Layout (Enforces Admin authentication)
const AdminLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
        <Sidebar />
        <main
          className="main-content"
          style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: 'var(--bg-primary)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 68px)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* 1. Only Login Page in Application: Admin Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Public Review Form (ZERO login required - accessed via token link) */}
      <Route path="/feedback" element={<PublicFeedbackPage />} />
      <Route path="/feedback/:token" element={<PublicFeedbackPage />} />
      <Route path="/review-form" element={<RedirectToFeedback />} />
      <Route path="/submit-review" element={<RedirectToFeedback />} />
      <Route path="/review" element={<RedirectToFeedback />} />
      <Route path="/direct-review" element={<RedirectToFeedback />} />

      {/* 3. Section 1: Dashboard Overview */}
      <Route
        path="/"
        element={
          <AdminLayout>
            <AdminOverviewPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/overview"
        element={
          <AdminLayout>
            <AdminOverviewPage />
          </AdminLayout>
        }
      />

      {/* 4. Section 2: Create Feedback Form */}
      <Route
        path="/admin/form-builder"
        element={
          <AdminLayout>
            <AdminFormBuilderPage />
          </AdminLayout>
        }
      />

      {/* 5. Section 3: Manage Invitations */}
      <Route
        path="/admin/invitations"
        element={
          <AdminLayout>
            <AdminInvitationsPage />
          </AdminLayout>
        }
      />

      {/* 6. Section 4: Submitted Reviews */}
      <Route
        path="/admin/reviews"
        element={
          <AdminLayout>
            <AdminSubmissionsPage />
          </AdminLayout>
        }
      />

      {/* 7. Section 5: Feedback Analytics */}
      <Route
        path="/admin/analytics"
        element={
          <AdminLayout>
            <AdminAnalyticsPage />
          </AdminLayout>
        }
      />

      {/* 8. Section 6: Email Management */}
      <Route
        path="/admin/email"
        element={
          <AdminLayout>
            <AdminEmailManagementPage />
          </AdminLayout>
        }
      />

      {/* 9. Section 7: Admin Settings */}
      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <AdminSettingsPage />
          </AdminLayout>
        }
      />

      {/* Backwards compatibility aliases */}
      <Route path="/cycles" element={<Navigate to="/admin/invitations" replace />} />
      <Route path="/assessments" element={<Navigate to="/admin/reviews" replace />} />
      <Route path="/reports/360" element={<Navigate to="/admin/reviews" replace />} />
      <Route path="/reports/my-360" element={<Navigate to="/admin/reviews" replace />} />
      <Route path="/analytics" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/competencies" element={<Navigate to="/admin/form-builder" replace />} />
      <Route path="/employees" element={<Navigate to="/admin/invitations" replace />} />
      <Route path="/development-plans" element={<Navigate to="/admin/reviews" replace />} />
      <Route path="/audit-logs" element={<Navigate to="/admin/email" replace />} />

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
