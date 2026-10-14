import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  BookOpen, 
  Award, 
  TrendingUp, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  Mail,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LessonNotesModal from '@/components/ui/LessonNotesModal';

interface Student {
  id: number;
  name: string;
  email: string;
  avatar: string;
  course: string;
  progress: number;
  lastActive: string;
  sessionsCompleted: number;
  notesCount: number;
  status: 'active' | 'completed' | 'needs_attention';
  recentTopic: string;
}

const initialStudents: Student[] = [
  {
    id: 1,
    name: 'Chiamaka Obi',
    email: 'chiamaka.obi@student.akademi.ng',
    avatar: '/images/hero-student.jpg',
    course: 'A-level Mathematics',
    progress: 72,
    lastActive: 'Today, 2:15 PM',
    sessionsCompleted: 14,
    notesCount: 8,
    status: 'active',
    recentTopic: 'Integration by parts & substitution'
  },
  {
    id: 2,
    name: 'Emeka Nnaji',
    email: 'emeka.nnaji@student.akademi.ng',
    avatar: '/images/tutor-daniel.jpg',
    course: 'Physics Fundamentals',
    progress: 58,
    lastActive: 'Yesterday',
    sessionsCompleted: 9,
    notesCount: 5,
    status: 'active',
    recentTopic: 'Projectile motion & friction coefficients'
  },
  {
    id: 3,
    name: 'Amina Bello',
    email: 'amina.bello@student.akademi.ng',
    avatar: '/images/tutor-adaeze.jpg',
    course: 'Algebra Foundations',
    progress: 41,
    lastActive: '2 days ago',
    sessionsCompleted: 6,
    notesCount: 4,
    status: 'needs_attention',
    recentTopic: 'Quadratic formulas and graphing'
  },
  {
    id: 4,
    name: 'Segun Adeyemi',
    email: 'segun.adeyemi@student.akademi.ng',
    avatar: '/images/tutor-ibrahim.jpg',
    course: 'A-level Mathematics',
    progress: 86,
    lastActive: 'Today, 10:45 AM',
    sessionsCompleted: 20,
    notesCount: 12,
    status: 'active',
    recentTopic: 'Differential equations & vectors'
  },
  {
    id: 5,
    name: 'Ngozi Uche',
    email: 'ngozi.uche@student.akademi.ng',
    avatar: '/images/hero-student.jpg',
    course: 'Trigonometry & Calculus',
    progress: 94,
    lastActive: '3 days ago',
    sessionsCompleted: 18,
    notesCount: 11,
    status: 'completed',
    recentTopic: 'Advanced trigonometry proofs'
  },
  {
    id: 6,
    name: 'Yusuf Ibrahim',
    email: 'yusuf.ibrahim@student.akademi.ng',
    avatar: '/images/tutor-ibrahim.jpg',
    course: 'Physics Fundamentals',
    progress: 65,
    lastActive: '4 days ago',
    sessionsCompleted: 11,
    notesCount: 7,
    status: 'active',
    recentTopic: 'Quantum wave-particle duality'
  }
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'needs_attention' | 'completed'>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [noteModalStudent, setNoteModalStudent] = useState<Student | null>(null);
  const [selectedLessonNoteSession, setSelectedLessonNoteSession] = useState<any | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSuccessToast, setNoteSuccessToast] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && s.status === activeTab;
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !noteModalStudent) return;

    setStudents(prev => prev.map(s => s.id === noteModalStudent.id ? { ...s, notesCount: s.notesCount + 1 } : s));
    setNewNoteText('');
    setNoteModalStudent(null);
    setNoteSuccessToast(true);
    setTimeout(() => setNoteSuccessToast(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl font-sans"
    >
      {/* Toast */}
      {noteSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F5338] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Session note & homework successfully saved!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Roster & Academic Progress</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
            Students
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Monitor learning progress, assign homework, and review student session notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 text-[#0F5338] border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>142 Total Enrolled</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D7] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE STUDENTS</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">32</p>
          <span className="text-[10px] font-semibold text-emerald-600">↗ +4 this week</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D7] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVG. PROGRESS</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">74%</p>
          <span className="text-[10px] font-semibold text-emerald-600">↗ +6% on target</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D7] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LESSONS COMPLETED</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">184</p>
          <span className="text-[10px] font-semibold text-slate-500">Across 6 active courses</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#E8E3D7] shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NEEDS ATTENTION</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">3</p>
          <span className="text-[10px] font-semibold text-amber-700">Inactive &gt; 7 days</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D7]">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Students', count: students.length },
            { id: 'active', label: 'Active', count: students.filter(s => s.status === 'active').length },
            { id: 'needs_attention', label: 'Needs Attention', count: students.filter(s => s.status === 'needs_attention').length },
            { id: 'completed', label: 'Completed', count: students.filter(s => s.status === 'completed').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#0F5338] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No students found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter tab.</p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <div 
              key={student.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E3D7] hover:border-[#0F5338]/40 hover:bg-[#FBF9F4]/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <img 
                  src={student.avatar} 
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover shadow-2xs ring-2 ring-emerald-500/10" 
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{student.name}</h3>
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.2 rounded-full uppercase",
                      student.status === 'active' ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                      student.status === 'needs_attention' ? "bg-amber-50 text-amber-800 border border-amber-200" :
                      "bg-blue-50 text-blue-800 border border-blue-200"
                    )}>
                      {student.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{student.course} · {student.sessionsCompleted} sessions</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Topic: <span className="text-slate-600 font-medium">{student.recentTopic}</span></p>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <div className="w-32 hidden sm:block">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        student.progress > 70 ? "bg-[#0F5338]" : student.progress > 45 ? "bg-emerald-500" : "bg-amber-500"
                      )} 
                      style={{ width: `${student.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLessonNoteSession({
                      id: `student-${student.id}`,
                      title: `${student.course} Lesson`,
                      person: student.name,
                      tutorName: 'Dr. Chiamaka Eze',
                      date: 'Recent Lesson',
                      time: '4:30 PM'
                    })}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-[#EAF5EE] text-[#0F5338] rounded-xl text-xs font-semibold border border-slate-200 hover:border-emerald-200 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Notes ({student.notesCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNoteModalStudent(student)}
                    className="px-3 py-1.5 bg-[#EAF5EE] hover:bg-emerald-100 text-[#0F5338] rounded-xl text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Add Quick Session Note"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Quick Note</span>
                  </button>

                  <Link
                    to={`/dashboard/messages?recipient=${encodeURIComponent(student.name)}&role=student&topic=${encodeURIComponent(student.course)}&avatar=${encodeURIComponent(student.avatar)}`}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="px-3 py-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note / Homework Assignment Modal */}
      <AnimatePresence>
        {noteModalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Session Notes & Homework</h3>
                  <p className="text-xs text-slate-500">{noteModalStudent.name} · {noteModalStudent.course}</p>
                </div>
                <button onClick={() => setNoteModalStudent(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lesson Summary & Feedback
                  </label>
                  <textarea 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows={4}
                    placeholder="Enter key concepts covered, student mastery level, and practice questions for next class..."
                    required
                    className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                  />
                </div>

                <div className="bg-[#EAF5EE] p-3 rounded-xl border border-[#D5EADB] text-xs text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>This note will automatically be accessible to the student and recorded in their academic dashboard.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setNoteModalStudent(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save & Dispatch Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Profile Quick View Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base text-slate-900">Student Profile</h3>
                <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center">
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  className="w-16 h-16 rounded-full object-cover mx-auto mb-2.5 ring-4 ring-[#0F5338]/10"
                />
                <h4 className="font-bold text-base text-slate-900">{selectedStudent.name}</h4>
                <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                <div className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-50 text-[#0F5338] border border-emerald-200 rounded-full text-xs font-bold">
                  {selectedStudent.course}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#FBF9F4] p-3 rounded-2xl border border-[#E8E3D7] text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Progress</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedStudent.progress}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sessions</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedStudent.sessionsCompleted}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Notes</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedStudent.notesCount}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/dashboard/messages?recipient=${encodeURIComponent(selectedStudent.name)}&role=student&topic=${encodeURIComponent(selectedStudent.course)}&avatar=${encodeURIComponent(selectedStudent.avatar)}`}
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lesson Notes Modal */}
      <LessonNotesModal
        isOpen={!!selectedLessonNoteSession}
        onClose={() => setSelectedLessonNoteSession(null)}
        session={selectedLessonNoteSession}
        isTutorMode={true}
      />
    </motion.div>
  );
}
