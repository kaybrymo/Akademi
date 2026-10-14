import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, GraduationCap, ShieldCheck, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    initials?: string;
  } | null>(null);
  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false; // Default: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const loadSettings = () => {
      try {
        const savedAuth = localStorage.getItem('akademi_auth_user');
        if (savedAuth) {
          setUser(JSON.parse(savedAuth));
        } else {
          setUser(null);
        }

        const savedComm = localStorage.getItem('akademi_enable_communities');
        setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
      } catch (e) {
        setUser(null);
      }
    };

    loadSettings();
    window.addEventListener('storage', loadSettings);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', loadSettings);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('akademi_auth_user');
    window.dispatchEvent(new Event('storage'));
    setUser(null);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isTutor = user?.role === 'tutor';
  const dashboardPath = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? 'Admin Panel' : isTutor ? 'Tutor Workspace' : 'My Dashboard';

  return (
    <nav className={`fixed top-0 inset-x-0 h-16 z-50 transition-all duration-200 ${isScrolled ? 'bg-[#FBF9F4]/95 backdrop-blur-md border-b border-[#E8E3D7] shadow-xs' : 'bg-white/80 backdrop-blur-xs'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F5338] text-white font-bold flex items-center justify-center shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-[#0F5338] tracking-tight">Akademi</span>
        </Link>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <Link to="/courses" className="hover:text-[#0F5338] transition-colors">Courses</Link>
          {enableCommunities && (
            <Link to="/communities" className="hover:text-[#0F5338] transition-colors">Communities</Link>
          )}
          <Link to="/tutors" className="hover:text-[#0F5338] transition-colors">Find Tutors</Link>
          
          {user && (
            <Link to={dashboardPath} className="hover:text-[#0F5338] text-[#0F5338] font-bold transition-colors">
              {dashboardLabel}
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            to="/tutors" 
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-black/5 transition-colors"
            title="Search Tutors"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            /* Signed In User Pill */
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full pr-1">
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
                    title="Admin Portal"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Admin</span>
                  </Link>
                  <Link
                    to="/admin/communities"
                    className="inline-flex items-center text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded-full transition-colors"
                    title="Admin Communities"
                  >
                    Communities
                  </Link>
                </div>
              )}

              <Link
                to={dashboardPath}
                className="flex items-center gap-2 bg-[#FBF9F4] hover:bg-[#F3EFE6] border border-[#E8E3D7] rounded-full pl-2 pr-3.5 py-1 text-xs font-bold text-slate-900 transition-colors shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#0F5338] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {user.initials || user.name?.substring(0, 2) || 'U'}
                </div>
                <span>{user.name || 'Account'}</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest Auth Buttons */
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium text-slate-700 hover:text-[#0F5338] px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="bg-[#0F5338] hover:bg-[#0a3d29] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button 
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FBF9F4] flex flex-col font-sans">
          <div className="px-4 h-16 flex items-center justify-between border-b border-[#E8E3D7]">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-[#0F5338] text-white font-bold flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-[#0F5338] tracking-tight">Akademi</span>
            </Link>
            <button className="p-2 text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-6 gap-4 text-slate-800">
            <Link to="/courses" className="text-base font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Courses Catalogue</Link>
            {enableCommunities && (
              <Link to="/communities" className="text-base font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Communities Hub</Link>
            )}
            <Link to="/tutors" className="text-base font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Find Tutors</Link>
            {user && (
              <Link to={dashboardPath} className="text-base font-bold text-[#0F5338]" onClick={() => setIsMobileMenuOpen(false)}>
                {dashboardLabel}
              </Link>
            )}
            <hr className="border-[#E8E3D7] my-2" />
            {user ? (
              <button 
                type="button" 
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="text-left text-base font-semibold text-red-600 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out ({user.name})
              </button>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="bg-[#0F5338] text-white rounded-full px-5 py-3 text-center text-sm font-semibold shadow-xs" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
