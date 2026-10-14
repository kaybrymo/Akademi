import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Public pages
import Landing from '@/pages/Landing';
import Courses from '@/pages/Courses';
import Tutors from '@/pages/Tutors';
import TutorProfile from '@/pages/TutorProfile';
import NotFound from '@/pages/NotFound';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Interactive Classroom & Meeting Suite
import Classroom from '@/pages/classroom/Classroom';

// Student / Tutor dashboard pages
import Overview from '@/pages/dashboard/Overview';
import Sessions from '@/pages/dashboard/Sessions';
import DashboardCourses from '@/pages/dashboard/Courses';
import Messages from '@/pages/dashboard/Messages';
import Billing from '@/pages/dashboard/Billing';
import Settings from '@/pages/dashboard/Settings';
import Recordings from '@/pages/dashboard/Recordings';
import Students from '@/pages/dashboard/Students';
import Notifications from '@/pages/dashboard/Notifications';
import CommunityRedirect from '@/components/layout/CommunityRedirect';

// Admin pages — lazy loaded
import { lazy, Suspense } from 'react';
const AdminLayout     = lazy(() => import('@/components/layout/AdminLayout'));
const AdminOverview   = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminUsers      = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminTutors     = lazy(() => import('@/pages/admin/AdminTutors'));
const AdminSessions   = lazy(() => import('@/pages/admin/AdminSessions'));
const AdminSubjects   = lazy(() => import('@/pages/admin/AdminSubjects'));
const AdminPayments   = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminSettings   = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminRecordings = lazy(() => import('@/pages/admin/AdminRecordings'));

import ScrollToTop from '@/components/layout/ScrollToTop';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route path="/tutor/:id" element={<TutorProfile />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Full-screen Interactive Video Meeting Room — Protected for Authenticated Participants */}
          <Route 
            path="/classroom/:sessionId" 
            element={
              <ProtectedRoute allowedRoles={['student', 'tutor', 'admin', 'super_admin']}>
                <Classroom />
              </ProtectedRoute>
            } 
          />

          {/* Student & Tutor Dashboard — requires any authenticated role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student', 'tutor', 'admin', 'super_admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="students" element={<Students />} />
            <Route path="recordings" element={<Recordings />} />
            <Route path="courses" element={<DashboardCourses />} />
            <Route path="learning-profile" element={<DashboardCourses />} />
            <Route path="student-profile" element={<DashboardCourses />} />
            <Route path="messages" element={<Messages />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Admin Panel — requires admin or super_admin role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<Suspense fallback={<LoadingSpinner />}><AdminOverview /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<LoadingSpinner />}><AdminUsers /></Suspense>} />
            <Route path="tutors" element={<Suspense fallback={<LoadingSpinner />}><AdminTutors /></Suspense>} />
            <Route path="sessions" element={<Suspense fallback={<LoadingSpinner />}><AdminSessions /></Suspense>} />
            <Route path="recordings" element={<Suspense fallback={<LoadingSpinner />}><AdminRecordings /></Suspense>} />
            <Route path="subjects" element={<Suspense fallback={<LoadingSpinner />}><AdminSubjects /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<LoadingSpinner />}><AdminPayments /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingSpinner />}><AdminSettings /></Suspense>} />
          </Route>

          {/* 404 — catch-all */}
          {/* Communities are a separate app now */}
          <Route path="/communities/*" element={<CommunityRedirect />} />
          <Route path="/community/*" element={<CommunityRedirect />} />
          <Route path="/dashboard/communities/*" element={<CommunityRedirect />} />
          <Route path="/dashboard/community/*" element={<CommunityRedirect />} />
          <Route path="/admin/communities" element={<CommunityRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
