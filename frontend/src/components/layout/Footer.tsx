import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('akademi_auth_user');
      if (savedAuth) {
        const u = JSON.parse(savedAuth);
        if (u.role === 'admin' || u.role === 'super_admin') {
          setIsAdminUser(true);
        }
      }
    } catch (e) {}
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Akademi. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <Link to="/courses" className="hover:text-slate-900 transition-colors">Courses</Link>
          <Link to="/tutors" className="hover:text-slate-900 transition-colors">Tutors</Link>
          <Link to="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          {isAdminUser && (
            <Link to="/admin" className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
            </Link>
          )}
          <Link to="/" className="hover:text-slate-900 transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-slate-900 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
