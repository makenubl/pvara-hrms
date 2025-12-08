import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useCompanyStore } from './store/companyStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import LeaveManagement from './pages/LeaveManagement';
import Payroll from './pages/Payroll';
import Performance from './pages/Performance';
import Recruitment from './pages/Recruitment';
import Learning from './pages/Learning';
import Compliance from './pages/Compliance';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// SaaS Pages
import Pricing from './pages/Pricing';
import CompanyOnboarding from './pages/CompanyOnboarding';
import SubscriptionManagement from './pages/SubscriptionManagement';
import LandingPage from './pages/LandingPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  const { isSubscriptionActive } = useCompanyStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check subscription status for protected routes
  if (!isSubscriptionActive()) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

// Public Route Wrapper (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { token } = useAuthStore();
  const { applyTheme, currentCompany } = useCompanyStore();

  // Apply theme on mount and when company changes
  useEffect(() => {
    if (currentCompany?.branding) {
      applyTheme();
    }
  }, [currentCompany, applyTheme]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/onboarding" element={<CompanyOnboarding />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/employees"
          element={<ProtectedRoute><Employees /></ProtectedRoute>}
        />
        <Route
          path="/attendance"
          element={<ProtectedRoute><Attendance /></ProtectedRoute>}
        />
        <Route
          path="/leaves"
          element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>}
        />
        <Route
          path="/payroll"
          element={<ProtectedRoute><Payroll /></ProtectedRoute>}
        />
        <Route
          path="/performance"
          element={<ProtectedRoute><Performance /></ProtectedRoute>}
        />
        <Route
          path="/recruitment"
          element={<ProtectedRoute><Recruitment /></ProtectedRoute>}
        />
        <Route
          path="/learning"
          element={<ProtectedRoute><Learning /></ProtectedRoute>}
        />
        <Route
          path="/compliance"
          element={<ProtectedRoute><Compliance /></ProtectedRoute>}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute><Analytics /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><Settings /></ProtectedRoute>}
        />
        <Route
          path="/subscription"
          element={<ProtectedRoute><SubscriptionManagement /></ProtectedRoute>}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
