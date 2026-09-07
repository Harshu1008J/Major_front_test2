import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/dashboard/Home';
import { Profile } from './pages/dashboard/Profile';
import { MyQRCode } from './pages/dashboard/MyQRCode';
import { MedicalRecords } from './pages/dashboard/MedicalRecords';
import { PatientsAccessed } from './pages/dashboard/PatientsAccessed';
import { AccessLog } from './pages/dashboard/AccessLog';
import { AIAssistant } from './pages/dashboard/AIAssistant';
import { SupportMap } from './pages/dashboard/SupportMap';
import { Scanner } from './pages/dashboard/Scanner';
import { ScanResult } from './pages/ScanResult';
import { AdminVerification } from './pages/AdminVerification';
import { HospitalPendingVerification } from './pages/HospitalPendingVerification';

// Protected layout wrapper with hospital verification gate
const DashboardRoute: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { user } = useAuth();

  // If a hospital account is logged in but not yet verified, gate them to pending verification screen
  if (user?.role === 'hospital' && (!user.verified || user.status === 'pending' || user.status === 'rejected')) {
    return <HospitalPendingVerification />;
  }

  return <AppLayout title={title}>{children}</AppLayout>;
};

// Route guard for patient-only sections
const PatientOnlyRoute: React.FC<{ children: React.ReactNode; fallbackTo?: string }> = ({
  children,
  fallbackTo = '/dashboard',
}) => {
  const { user } = useAuth();
  if (user?.role === 'hospital') {
    return <Navigate to={fallbackTo} replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Verification Management Console */}
          <Route path="/admin" element={<AdminVerification />} />

          {/* Unified Dashboard Overview (Role-Aware) */}
          <Route
            path="/dashboard"
            element={
              <DashboardRoute title="Overview">
                <Home />
              </DashboardRoute>
            }
          />

          {/* Profile (Role-Aware: Patient Vitals vs Hospital Facility Credentials) */}
          <Route
            path="/dashboard/profile"
            element={
              <DashboardRoute title="Profile & Credentials">
                <Profile />
              </DashboardRoute>
            }
          />

          {/* Patient-Only: My QR Pass */}
          <Route
            path="/dashboard/qr"
            element={
              <PatientOnlyRoute>
                <DashboardRoute title="My MedQR+ Pass">
                  <MyQRCode />
                </DashboardRoute>
              </PatientOnlyRoute>
            }
          />

          {/* Patient Medical Records (re-routed to Patients for hospital) */}
          <Route
            path="/dashboard/records"
            element={
              <PatientOnlyRoute fallbackTo="/dashboard/patients">
                <DashboardRoute title="My Medical Records">
                  <MedicalRecords />
                </DashboardRoute>
              </PatientOnlyRoute>
            }
          />

          {/* Hospital-Specific: Patients Accessed */}
          <Route
            path="/dashboard/patients"
            element={
              <DashboardRoute title="Patients Accessed">
                <PatientsAccessed />
              </DashboardRoute>
            }
          />

          {/* Hospital-Specific: Scan History & Access Logs */}
          <Route
            path="/dashboard/history"
            element={
              <DashboardRoute title="Scan History & Access Logs">
                <AccessLog />
              </DashboardRoute>
            }
          />

          {/* AI Assistant (Role-Aware: Personal Health Coach vs Clinical Scoped Assistant) */}
          <Route
            path="/dashboard/ai"
            element={
              <DashboardRoute title="AI Assistant">
                <AIAssistant />
              </DashboardRoute>
            }
          />

          {/* Patient-Only: Healthcare Support Map */}
          <Route
            path="/dashboard/map"
            element={
              <PatientOnlyRoute>
                <DashboardRoute title="Healthcare Support Map">
                  <SupportMap />
                </DashboardRoute>
              </PatientOnlyRoute>
            }
          />

          {/* QR Scanner (Universal / Clinical Hardware) */}
          <Route
            path="/dashboard/scanner"
            element={
              <DashboardRoute title="QR Scanner">
                <Scanner />
              </DashboardRoute>
            }
          />

          {/* QR Scan Result View (Key 3-Tier Screen) */}
          <Route path="/scan-result/:tier" element={<ScanResult />} />
          <Route path="/scan-result" element={<ScanResult />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
