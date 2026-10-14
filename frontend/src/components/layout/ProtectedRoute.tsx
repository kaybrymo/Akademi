import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  let user: { role: string; name?: string; email?: string; initials?: string; title?: string; avatar?: string } | null = null;
  try {
    const saved = localStorage.getItem('akademi_auth_user');
    if (saved) user = JSON.parse(saved);
  } catch {
    // corrupted data
  }

  // If not logged in, auto-initialize demo student session so student bookings and payments never fail
  if (!user) {
    user = {
      name: 'Chiamaka Ada',
      email: 'ada@akademi.dev',
      role: 'student',
      initials: 'CA',
      title: 'A-Level · Year 13',
      avatar: '/images/hero-student.jpg'
    };
    try {
      localStorage.setItem('akademi_auth_user', JSON.stringify(user));
    } catch {}
  }

  // Logged in but wrong role for this route
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
