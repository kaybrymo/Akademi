import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Star, 
  FileText, 
  Plus, 
  CheckCircle2, 
  X,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  ShieldCheck,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tutor {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  initials: string;
  subjects: string[];
  rating: number;
  sessions: number;
  rate: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  bg: string;
  bio: string;
  education: string;
}

const initialTutors: Tutor[] = [
  { 
    id: 1, 
    name: 'Daniel Okafor', 
    email: 'daniel.o@example.com',
    phone: '+234 803 123 4567',
    location: 'Cambridge / Lagos',
    initials: 'DO', 
    subjects: ['Mathematics', 'Further Math', 'Calculus', 'Physics'], 
    rating: 4.9, 
    sessions: 312, 
    rate: 3500,
    status: 'Verified', 
    bg: 'bg-emerald-100 text-emerald-700',
    bio: 'M.Sc Applied Mathematics from Cambridge. Passionate STEM educator.',
    education: 'M.Sc. Mathematics, Cambridge University'
  },
  { 
    id: 2, 
    name: 'Adaeze Nwosu', 
    email: 'adaeze.n@example.com',
    phone: '+234 802 987 6543',
    location: 'Lagos, Nigeria',
    initials: 'AN', 
    subjects: ['Spanish', 'French', 'English'], 
    rating: 4.8, 
    sessions: 204, 
    rate: 2800,
    status: 'Verified', 
    bg: 'bg-purple-100 text-purple-700',
    bio: 'Certified language instructor and polyglot.',
    education: 'M.A Romance Languages, Sorbonne'
  },
  { 
    id: 3, 
    name: 'Dr. Ibrahim Sanni', 
    email: 'ibrahim.s@example.com',
    phone: '+234 809 333 2211',
    location: 'Lagos / London',
    initials: 'IS', 
    subjects: ['Physics', 'Engineering', 'Mathematics'], 
    rating: 4.9, 
    sessions: 428, 
    rate: 4500,
    status: 'Verified', 
    bg: 'bg-blue-100 text-blue-700',
    bio: 'PhD in Mechanical Engineering from UNILAG.',
    education: 'Ph.D. Mechanical Engineering, UNILAG'
  },
  { 
    id: 4, 
    name: 'Chinwe Uche', 
    email: 'chinwe.u@example.com',
    phone: '+234 818 444 5566',
    location: 'Benin / UNN',
    initials: 'CU', 
    subjects: ['Chemistry', 'Biology', 'JAMB Prep'], 
    rating: 4.7, 
    sessions: 142, 
    rate: 2500,
    status: 'Verified', 
    bg: 'bg-rose-100 text-rose-700',
    bio: 'Former JAMB marker and exam strategist.',
    education: 'B.Sc. Biochemistry, UNIBEN'
  },
  { 
    id: 5, 
    name: 'Tobi Adeleke', 
    email: 'tobi.a@example.com',
    phone: '+234 812 777 8899',
    location: 'Ife, Osun State',
    initials: 'TA', 
    subjects: ['Economics', 'Government', 'Geography'], 
    rating: 4.6, 
    sessions: 97, 
    rate: 2200,
    status: 'Pending', 
    bg: 'bg-amber-100 text-amber-700',
    bio: 'Economics graduate from OAU.',
    education: 'B.Sc. Economics, OAU'
  },
  { 
    id: 6, 
    name: 'Grace Etim', 
    email: 'grace.etim@example.com',
    phone: '+234 805 666 1122',
    location: 'Port Harcourt',
    initials: 'GE', 
    subjects: ['English Lit', 'Creative Writing', 'IELTS'], 
    rating: 4.7, 
    sessions: 198, 
    rate: 4500,
    status: 'Suspended', 
    bg: 'bg-violet-100 text-violet-700',
    bio: 'Certified IELTS instructor with literary focus.',
    education: 'M.A. English Studies, UNIPORT'
  },
];

export default function AdminTutors() {
  const [tutors, setTutors] = useState<Tutor[]>(() => {
    let regList: any[] = [];
    try {
      const reg = localStorage.getItem('akademi_registered_tutors');
      if (reg) regList = JSON.parse(reg);
    } catch (e) {}

    const combined = [
      ...regList.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email || `${r.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: r.phone || '+234 800 000 0000',
        location: r.location || 'Lagos, Nigeria',
        initials: r.initials || 'TU',
        subjects: r.subjects || [r.subject || 'General Studies'],
        rating: r.rating || 5.0,
        sessions: r.sessions || 0,
        rate: r.rate || 3500,
        status: (r.status || 'Pending') as Tutor['status'],
        bg: 'bg-emerald-100 text-emerald-700',
        bio: r.bio || '',
        education: r.experience || 'Certified Educator'
      })),
      ...initialTutors
    ];

    try {
      const saved = localStorage.getItem('akademi_admin_tutors');
      if (saved) {
        const savedList: Tutor[] = JSON.parse(saved);
        return combined.map(c => {
          const match = savedList.find(s => s.id === c.id || s.name === c.name);
          return match ? { ...c, ...match } : c;
        });
      }
    } catch (e) {}
    return combined;
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Pending Verification' | 'Verified' | 'Suspended'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [inspectingKycTutor, setInspectingKycTutor] = useState<Tutor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newTutor, setNewTutor] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Lagos, Nigeria',
    subjects: 'Mathematics',
    rate: 4500,
    education: '',
    bio: '',
  });

  const saveTutors = (updated: Tutor[]) => {
    setTutors(updated);
    localStorage.setItem('akademi_admin_tutors', JSON.stringify(updated));

    // Also sync back to registered tutors list
    try {
      const savedReg = localStorage.getItem('akademi_registered_tutors');
      if (savedReg) {
        const regList = JSON.parse(savedReg);
        const updatedReg = regList.map((r: any) => {
          const match = updated.find(u => u.id === r.id || u.name === r.name);
          if (match) {
            return {
              ...r,
              status: match.status,
              verified: match.status === 'Verified'
            };
          }
          return r;
        });
        localStorage.setItem('akademi_registered_tutors', JSON.stringify(updatedReg));
      }
    } catch (e) {}

    // If currently logged-in user is this tutor, update auth state too
    try {
      const authUserStr = localStorage.getItem('akademi_auth_user');
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr);
        const match = updated.find(u => u.name === authUser.name || u.email === authUser.email);
        if (match) {
          authUser.status = match.status;
          authUser.verified = match.status === 'Verified';
          localStorage.setItem('akademi_auth_user', JSON.stringify(authUser));
        }
      }
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerify = (id: number) => {
    const updated = tutors.map(t => {
      if (t.id === id) {
        showToast(`Tutor "${t.name}" is now verified.`);
        return { ...t, status: 'Verified' as const };
      }
      return t;
    });
    saveTutors(updated);
    if (selectedTutor?.id === id) {
      setSelectedTutor(prev => prev ? { ...prev, status: 'Verified' } : null);
    }
  };

  const handleSuspend = (id: number) => {
    const updated = tutors.map(t => {
      if (t.id === id) {
        showToast(`Tutor "${t.name}" has been suspended.`);
        return { ...t, status: 'Suspended' as const };
      }
      return t;
    });
    saveTutors(updated);
    if (selectedTutor?.id === id) {
      setSelectedTutor(prev => prev ? { ...prev, status: 'Suspended' } : null);
    }
  };

  const handleRestore = (id: number) => {
    const updated = tutors.map(t => {
      if (t.id === id) {
        showToast(`Tutor "${t.name}" access restored to verified.`);
        return { ...t, status: 'Verified' as const };
      }
      return t;
    });
    saveTutors(updated);
    if (selectedTutor?.id === id) {
      setSelectedTutor(prev => prev ? { ...prev, status: 'Verified' } : null);
    }
  };

  const handleAddTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTutor.name.trim() || !newTutor.email.trim()) return;

    const initials = newTutor.name
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const created: Tutor = {
      id: Date.now(),
      name: newTutor.name,
      email: newTutor.email,
      phone: newTutor.phone || '+234 800 000 0000',
      location: newTutor.location,
      initials: initials || 'T',
      subjects: newTutor.subjects.split(',').map(s => s.trim()),
      rating: 5.0,
      sessions: 0,
      rate: Number(newTutor.rate) || 4000,
      status: 'Pending',
      bg: 'bg-amber-100 text-amber-700',
      bio: newTutor.bio || 'New tutor pending verification.',
      education: newTutor.education || 'B.Sc. Degree',
    };

    const updated = [created, ...tutors];
    saveTutors(updated);
    setShowAddModal(false);
    setNewTutor({
      name: '',
      email: '',
      phone: '',
      location: 'Lagos, Nigeria',
      subjects: 'Mathematics',
      rate: 4500,
      education: '',
      bio: '',
    });
    showToast(`Tutor profile for "${created.name}" created (Pending Verification).`);
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesTab = 
      activeTab === 'All' ? true :
      activeTab === 'Pending Verification' ? tutor.status === 'Pending' :
      activeTab === 'Verified' ? tutor.status === 'Verified' :
      tutor.status === 'Suspended';

    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const stats = [
    { label: 'Total Tutors', value: tutors.length, color: 'text-slate-900' },
    { label: 'Pending Verification', value: tutors.filter(t => t.status === 'Pending').length, color: 'text-amber-600' },
    { label: 'Verified', value: tutors.filter(t => t.status === 'Verified').length, color: 'text-emerald-600' },
    { label: 'Suspended', value: tutors.filter(t => t.status === 'Suspended').length, color: 'text-red-600' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tutor Directory & Verification</h1>
          <p className="text-sm text-slate-500 mt-1">Review credentials, approve applications, and manage verified educators</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by tutor or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm whitespace-nowrap gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Tutor
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {(['All', 'Pending Verification', 'Verified', 'Suspended'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
              activeTab === tab
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length === 0 ? (
          <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            No tutors match the selected filter.
          </div>
        ) : (
          filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center font-bold text-lg", tutor.bg)}>
                      {tutor.initials}
                    </div>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase",
                      tutor.status === 'Verified' ? "bg-emerald-100 text-emerald-700" : 
                      tutor.status === 'Pending' ? "bg-amber-100 text-amber-700" : 
                      "bg-red-100 text-red-700"
                    )}>
                      {tutor.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900">{tutor.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tutor.education}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tutor.subjects.map(sub => (
                      <span key={sub} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {tutor.rating > 0 ? tutor.rating : 'New'}
                  </div>
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-slate-900">{tutor.sessions}</span> lessons
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    ₦{tutor.rate.toLocaleString()}/hr
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-t border-slate-200 bg-slate-50 divide-x divide-slate-200">
                <button 
                  type="button"
                  onClick={() => setSelectedTutor(tutor)}
                  className="py-3 px-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="View Profile Details"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">Profile</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setInspectingKycTutor(tutor)}
                  className="py-3 px-1 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Inspect KYC Verification Documents"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span className="truncate">Docs</span>
                </button>

                {tutor.status === 'Pending' ? (
                  <button 
                    type="button"
                    onClick={() => handleVerify(tutor.id)}
                    className="py-3 px-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="truncate">Verify</span>
                  </button>
                ) : tutor.status === 'Verified' ? (
                  <button 
                    type="button"
                    onClick={() => handleSuspend(tutor.id)}
                    className="py-3 px-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span className="truncate">Suspend</span>
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => handleRestore(tutor.id)}
                    className="py-3 px-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="truncate">Restore</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tutor Profile Drawer/Modal */}
      <AnimatePresence>
        {selectedTutor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedTutor(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Tutor Profile</h3>
                <button onClick={() => setSelectedTutor(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0", selectedTutor.bg)}>
                    {selectedTutor.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedTutor.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedTutor.education}</p>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1.5",
                      selectedTutor.status === 'Verified' ? "bg-emerald-100 text-emerald-700" :
                      selectedTutor.status === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {selectedTutor.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{selectedTutor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{selectedTutor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{selectedTutor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg font-bold text-emerald-700">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>₦{selectedTutor.rate.toLocaleString()} / session</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Biography</h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedTutor.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTutor.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setInspectingKycTutor(selectedTutor)}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Inspect KYC Documents & Credentials →</span>
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  {selectedTutor.status === 'Pending' && (
                    <button 
                      onClick={() => handleVerify(selectedTutor.id)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                    >
                      Approve & Verify Tutor
                    </button>
                  )}
                  {selectedTutor.status === 'Verified' && (
                    <button 
                      onClick={() => handleSuspend(selectedTutor.id)}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                    >
                      Suspend Tutor
                    </button>
                  )}
                  {selectedTutor.status === 'Suspended' && (
                    <button 
                      onClick={() => handleRestore(selectedTutor.id)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                    >
                      Restore Verification
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* KYC Document Inspection Modal */}
        {inspectingKycTutor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 font-sans max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">KYC & Credential Verification</h3>
                    <p className="text-xs text-slate-500">{inspectingKycTutor.name} · {inspectingKycTutor.education}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setInspectingKycTutor(null)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-900 block">Verification Status</span>
                    <span className="text-[11px] text-blue-700">All submitted documents have passed automated optical character recognition (OCR) cross-checks.</span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                    inspectingKycTutor.status === 'Verified' ? "bg-emerald-100 text-emerald-800" :
                    inspectingKycTutor.status === 'Pending' ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                  )}>
                    {inspectingKycTutor.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submitted Credentials & Certificates</h4>
                  
                  {/* Document 1: Government ID Card */}
                  <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Government Issued National ID / NIN</p>
                        <p className="text-[11px] text-slate-500">Document No: NIN-V92810-LAG · Verified against NIMC database</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold">
                      ✓ Authentic
                    </span>
                  </div>

                  {/* Document 2: Degree Certificate */}
                  <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">University Degree Certificate</p>
                        <p className="text-[11px] text-slate-500">{inspectingKycTutor.education} · Verified Academic Credential</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold">
                      ✓ Degree Verified
                    </span>
                  </div>

                  {/* Document 3: TRCN Teaching License */}
                  <div className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">TRCN Educator Teaching Accreditation</p>
                        <p className="text-[11px] text-slate-500">Teachers Registration Council of Nigeria · Active License</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold">
                      ✓ Licensed
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setInspectingKycTutor(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Close Inspection
                </button>

                {inspectingKycTutor.status !== 'Verified' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleVerify(inspectingKycTutor.id);
                      setInspectingKycTutor(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Verify Tutor Now</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Tutor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Add Tutor Application</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTutor} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Kelechi Nwosu"
                    value={newTutor.name}
                    onChange={(e) => setNewTutor({ ...newTutor, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="kelechi@example.com"
                    value={newTutor.email}
                    onChange={(e) => setNewTutor({ ...newTutor, email: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Rate (₦/hr)</label>
                    <input 
                      type="number" 
                      value={newTutor.rate}
                      onChange={(e) => setNewTutor({ ...newTutor, rate: Number(e.target.value) })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Location</label>
                    <input 
                      type="text" 
                      value={newTutor.location}
                      onChange={(e) => setNewTutor({ ...newTutor, location: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subjects (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="Mathematics, Physics, Chemistry"
                    value={newTutor.subjects}
                    onChange={(e) => setNewTutor({ ...newTutor, subjects: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Degree / Education</label>
                  <input 
                    type="text" 
                    placeholder="B.Sc. Mechanical Engineering, UNILAG"
                    value={newTutor.education}
                    onChange={(e) => setNewTutor({ ...newTutor, education: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Create Tutor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
