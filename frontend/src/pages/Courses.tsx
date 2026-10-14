import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Bookmark, 
  Search, 
  CheckCircle2, 
  Award, 
  GraduationCap,
  Sparkles,
  X,
  Download,
  Printer,
  CreditCard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseItem {
  id: number;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  sessions: number;
  tutor: string;
  description: string;
  color: string;
  isCompleted?: boolean;
  price?: number;
}

const coursesData: CourseItem[] = [
  {
    id: 1,
    title: 'Mastering Calculus Foundations',
    level: 'Intermediate',
    sessions: 12,
    tutor: 'Daniel Okafor',
    description: 'Build a solid foundation in calculus — from limits and derivatives to integration techniques.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 2,
    title: 'Conversational Spanish in 30 Days',
    level: 'Beginner',
    sessions: 20,
    tutor: 'Adaeze Nwosu',
    description: 'Go from zero to confident conversations in Spanish through immersive, practical daily sessions.',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    id: 3,
    title: 'Physics for Engineers',
    level: 'Advanced',
    sessions: 16,
    tutor: 'Dr. Ibrahim Sanni',
    description: 'Mechanics, thermodynamics, and electromagnetism — tailored for engineering students.',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    id: 4,
    title: 'Algebra Crash Course',
    level: 'Beginner',
    sessions: 8,
    tutor: 'Daniel Okafor',
    description: 'A fast-track programme covering algebraic expressions, equations, and graphing fundamentals.',
    color: 'bg-emerald-500/10 text-emerald-600',
    isCompleted: true,
  },
  {
    id: 5,
    title: 'French for Travellers',
    level: 'Beginner',
    sessions: 10,
    tutor: 'Adaeze Nwosu',
    description: 'Essential French phrases, pronunciation, and cultural tips for your next trip.',
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    id: 6,
    title: 'Quantum Mechanics Primer',
    level: 'Advanced',
    sessions: 14,
    tutor: 'Dr. Ibrahim Sanni',
    description: 'An introduction to quantum theory — wave functions, operators, and measurement.',
    color: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    id: 7,
    title: 'SAT Math Bootcamp',
    level: 'Intermediate',
    sessions: 18,
    tutor: 'Daniel Okafor',
    description: 'Targeted preparation for the SAT Math section with practice sets and strategies.',
    color: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 8,
    title: 'Spanish Literature Deep Dive',
    level: 'Advanced',
    sessions: 12,
    tutor: 'Adaeze Nwosu',
    description: 'Explore the great works of Spanish literature — from Cervantes to García Márquez.',
    color: 'bg-rose-500/10 text-rose-600',
  },
];

const levelColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-blue-500/10 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-500/10 text-purple-700 border-purple-200',
};

export default function Courses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Certificate Modal state
  const [certificateCourse, setCertificateCourse] = useState<CourseItem | null>(null);

  // Course Enrollment & Payment States
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<CourseItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'paystack'>('wallet');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccessModal, setEnrollmentSuccessModal] = useState(false);
  const [enrolledDetails, setEnrolledDetails] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_wallet_balance_ngn');
      if (saved) return Number(saved);
    } catch (e) {}
    return 142500;
  });

  // Load user name
  const [userName, setUserName] = useState('Chiamaka Adeyemi');

  useEffect(() => {
    try {
      const savedBal = localStorage.getItem('akademi_wallet_balance_ngn');
      if (savedBal) setWalletBalance(Number(savedBal));
      
      const savedBookmarks = localStorage.getItem('akademi_bookmarked_courses');
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }
      const savedAuth = localStorage.getItem('akademi_auth_user');
      if (savedAuth) {
        const u = JSON.parse(savedAuth);
        if (u.name) setUserName(u.name);
      }
    } catch (e) {}
  }, []);

  const handleEnrollSubmit = () => {
    if (!selectedCourseForEnrollment) return;
    setIsEnrolling(true);
    const course = selectedCourseForEnrollment;
    const price = course.price || (course.level === 'Advanced' ? 34000 : course.level === 'Intermediate' ? 28000 : 18000);

    setTimeout(() => {
      // 1. Save to purchased courses
      try {
        const existing = JSON.parse(localStorage.getItem('akademi_purchased_courses') || '[]');
        const newEntry = {
          id: Date.now(),
          title: course.title,
          category: 'ACADEMICS',
          tutor: course.tutor,
          level: course.level,
          rating: '4.9',
          sessions: `${course.sessions} sessions`,
          price: price,
          purchaseDate: 'Just now',
          avatar: '/images/tutor-daniel.jpg',
          paymentMethod: paymentMethod === 'paystack' ? 'Paystack Gateway' : 'Akademi Wallet'
        };
        localStorage.setItem('akademi_purchased_courses', JSON.stringify([newEntry, ...existing]));
      } catch (e) {}

      // 2. Save transaction
      try {
        const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const newTx = {
          id: `CRS-${Date.now().toString().slice(-6)}`,
          type: 'Course Purchase',
          description: `${course.title} (${course.tutor})`,
          amount: `-₦${price.toLocaleString()}`,
          status: 'Completed',
          date: 'Just now'
        };
        localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
      } catch (e) {}

      // 3. Update wallet balance if paid via wallet
      let newBal = walletBalance;
      if (paymentMethod === 'wallet') {
        newBal = Math.max(0, walletBalance - price);
        localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));
        setWalletBalance(newBal);
      }

      // 4. Notify listeners
      window.dispatchEvent(new Event('storage'));

      setEnrolledDetails({
        title: course.title,
        tutor: course.tutor,
        sessions: course.sessions,
        price: price,
        paymentMethod: paymentMethod === 'paystack' ? 'Paystack Gateway' : 'Akademi Wallet',
        newBalance: newBal
      });

      setIsEnrolling(false);
      setSelectedCourseForEnrollment(null);
      setEnrollmentSuccessModal(true);
    }, 1000);
  };

  const toggleBookmark = (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation();
    let updated: number[];
    let isAdded = false;

    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(item => item !== id);
      setToastMessage(`Removed "${title}" from your bookmarks.`);
    } else {
      updated = [...bookmarkedIds, id];
      isAdded = true;
      setToastMessage(`Saved "${title}" to your bookmarked courses.`);
    }

    setBookmarkedIds(updated);
    localStorage.setItem('akademi_bookmarked_courses', JSON.stringify(updated));
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">All Courses</h1>
              <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
                Explore the full Akademi catalogue. Filter by difficulty level, track bookmark favourites, and review accredited certificates.
              </p>
            </div>

            <Link
              to="/dashboard/courses"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors shadow-xs"
            >
              Go to My Enrolled Courses &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Search & Level Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses or tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
                  levelFilter === lvl
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const isBookmarked = bookmarkedIds.includes(course.id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Course Banner */}
                <div className={cn("h-36 flex items-center justify-center relative", course.color.split(' ')[0])}>
                  <BookOpen className={cn("h-12 w-12 opacity-40", course.color.split(' ')[1])} />
                  
                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(e, course.id, course.title)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:bg-white shadow-sm transition-all active:scale-90"
                    title={isBookmarked ? "Remove Bookmark" : "Save Course Bookmark"}
                  >
                    <Bookmark 
                      className={cn(
                        "h-4 w-4 transition-colors", 
                        isBookmarked ? "fill-emerald-600 text-emerald-600" : "text-slate-500"
                      )} 
                    />
                  </button>

                  {course.isCompleted && (
                    <span className="absolute bottom-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Award className="h-3 w-3" /> Accredited Certificate
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Level & Sessions */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border", levelColors[course.level])}>
                        {course.level}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {course.sessions} lessons
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    {/* Tutor */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                          {course.tutor.split(' ').map(p => p[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none">{course.tutor}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Lead Instructor</p>
                        </div>
                      </div>

                      {course.isCompleted ? (
                        <button
                          type="button"
                          onClick={() => setCertificateCourse(course)}
                          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <GraduationCap className="h-3.5 w-3.5" /> Certificate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedCourseForEnrollment(course)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0F5338] hover:bg-[#0A3D29] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95"
                        >
                          <span>Enrol ₦{(course.price || (course.level === 'Advanced' ? 34000 : course.level === 'Intermediate' ? 28000 : 18000)).toLocaleString()} &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Verifiable Certificate Modal */}
      <AnimatePresence>
        {certificateCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
              onClick={() => setCertificateCourse(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 p-8 text-center"
            >
              <button 
                onClick={() => setCertificateCourse(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Certificate Inner Frame */}
              <div className="border-4 border-double border-emerald-600/30 p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/20 relative">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
                  Akademi Verified Certificate of Completion
                </span>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-4 mb-1">
                  Certificate of Achievement
                </h2>
                <p className="text-xs text-slate-500 italic mb-4">This certifies that</p>

                <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-800 underline decoration-amber-400 decoration-2 underline-offset-4 mb-3">
                  {userName}
                </h3>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                  has successfully completed all modules and interactive problem sets for the course:
                  <br />
                  <strong className="text-slate-900 text-sm">{certificateCourse.title}</strong>
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-left text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Educator</span>
                    <span className="font-bold text-slate-800">{certificateCourse.tutor}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Issued On</span>
                    <span className="font-bold text-slate-800">Jun 14, 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Certificate ID</span>
                    <span className="font-mono font-bold text-emerald-700">AKD-2026-{certificateCourse.id}98X</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage('Downloading certificate PDF...');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4" /> Download Official PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Enrollment & Payment Modal */}
      <AnimatePresence>
        {selectedCourseForEnrollment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
              onClick={() => !isEnrolling && setSelectedCourseForEnrollment(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E8E3D7] z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 bg-[#0F5338] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">Course Enrolment</h3>
                  <p className="text-xs text-emerald-100/80 mt-0.5">{selectedCourseForEnrollment.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-200/70 block">Course Fee</span>
                  <span className="text-xl font-black text-white">
                    ₦{(selectedCourseForEnrollment.price || (selectedCourseForEnrollment.level === 'Advanced' ? 34000 : selectedCourseForEnrollment.level === 'Intermediate' ? 28000 : 18000)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instructor:</span>
                    <span className="font-bold text-slate-900">{selectedCourseForEnrollment.tutor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Curriculum:</span>
                    <span className="font-bold text-emerald-800">{selectedCourseForEnrollment.sessions} Intensive Lessons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Level:</span>
                    <span className="font-bold text-slate-900">{selectedCourseForEnrollment.level}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        paymentMethod === 'wallet'
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <p className="text-xs font-bold flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Wallet Balance
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">₦{walletBalance.toLocaleString()}</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paystack')}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        paymentMethod === 'paystack'
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <p className="text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Paystack
                      </p>
                      <p className="text-[10px] text-emerald-700 mt-0.5 font-semibold">Card / Bank / USSD</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant access to course syllabus and video materials</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isEnrolling}
                    onClick={() => setSelectedCourseForEnrollment(null)}
                    className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isEnrolling}
                    onClick={handleEnrollSubmit}
                    className="flex-[2] py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isEnrolling ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Verifying Payment...
                      </span>
                    ) : (
                      <span>Complete Enrolment →</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enrolment Success Modal */}
      <AnimatePresence>
        {enrollmentSuccessModal && enrolledDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setEnrollmentSuccessModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 border border-slate-200 text-center z-10"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Enrolment Confirmed! 🎉</h3>
              <p className="text-xs text-slate-500 mb-6">
                You are now enrolled in <span className="font-bold text-slate-800">{enrolledDetails.title}</span>.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 mb-6 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-bold text-slate-900">{enrolledDetails.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instructor:</span>
                  <span className="font-bold text-emerald-700">{enrolledDetails.tutor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sessions:</span>
                  <span className="font-semibold text-slate-900">{enrolledDetails.sessions} Lessons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold text-slate-900">
                    ₦{enrolledDetails.price.toLocaleString()} (Paid via {enrolledDetails.paymentMethod})
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/courses')}
                  className="flex-1 py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-xs text-center flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Go to My Courses</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/billing')}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Receipt →</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
