import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Video, 
  CheckCircle2, 
  Globe, 
  Award, 
  ArrowLeft,
  CreditCard, 
  Lock, 
  Sparkles, 
  Send,
  MessageSquare,
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { cn, getAvatarUrl } from '@/lib/utils';
import { dispatchSessionBookedPush } from '@/lib/websocketPushEngine';

interface TutorDetail {
  id: number;
  name: string;
  initials: string;
  color: string;
  title: string;
  university: string;
  rating: number;
  reviewsCount: number;
  sessionsCompleted: number;
  ratePerSession: number;
  languages: string[];
  subjects: string[];
  bio: string;
  teachingApproach: string;
  education: string[];
  availability: {
    days: string[];
    slots: string[];
  };
  reviews: Array<{
    id: number;
    student: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

const initialTutorsData: Record<string, TutorDetail> = {
  '1': {
    id: 1,
    name: 'Daniel Okafor',
    initials: 'DO',
    color: 'bg-emerald-600',
    title: 'Lead Mathematics & Physics Specialist',
    university: 'University of Cambridge / University of Lagos',
    rating: 4.9,
    reviewsCount: 127,
    sessionsCompleted: 312,
    ratePerSession: 3500,
    languages: ['English (Native)', 'Yoruba (Fluent)'],
    subjects: ['Calculus', 'Further Mathematics', 'Linear Algebra', 'A-Level Physics', 'SAT Math'],
    bio: 'Cambridge-educated maths tutor with over 6 years of experience helping high school and university students master complex mathematical concepts. I focus on intuition, real-world applications, and rigorous problem-solving techniques.',
    teachingApproach: 'Every lesson is tailored to your learning pace. We break down daunting topics into bite-sized first principles, followed by interactive whiteboard problem walkthroughs and targeted practice sets.',
    education: [
      'M.Sc Applied Mathematics — University of Cambridge',
      'B.Sc Mathematics (First Class) — University of Lagos',
      'Certified A-Level & IB Curriculum Instructor'
    ],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      slots: ['10:00 AM', '2:00 PM', '4:30 PM', '6:00 PM', '7:30 PM']
    },
    reviews: [
      { id: 1, student: 'Chiamaka E.', rating: 5, date: '2 days ago', comment: 'Daniel explained integration by parts in 20 minutes better than my whole term of lectures. Truly outstanding educator!' },
      { id: 2, student: 'Tunde B.', rating: 5, date: '1 week ago', comment: 'Helped me jump from a C to an A* in A-Level Further Maths. Highly recommended!' },
      { id: 3, student: 'Somto A.', rating: 5, date: '2 weeks ago', comment: 'Clear explanations, patient approach, and great notes provided after every session.' }
    ]
  },
  '2': {
    id: 2,
    name: 'Adaeze Nwosu',
    initials: 'AN',
    color: 'bg-rose-600',
    title: 'Conversational Languages & Romance Linguistics',
    university: 'Sorbonne University / University of Nigeria',
    rating: 4.8,
    reviewsCount: 89,
    sessionsCompleted: 204,
    ratePerSession: 2800,
    languages: ['English', 'Spanish (DELE C2)', 'French (DALF C1)', 'Igbo'],
    subjects: ['Conversational Spanish', 'French for Beginners', 'DELE Exam Prep', 'Grammar & Writing'],
    bio: 'Certified language instructor and polyglot. I help students achieve natural speaking fluency and exam excellence through immersive, communicative drills without boring memorization.',
    teachingApproach: '80% speaking focus with interactive dialogue drills, cultural nuances, and instant corrective feedback.',
    education: [
      'M.A Romance Languages — Sorbonne Université',
      'B.A Foreign Languages — University of Nigeria, Nsukka',
      'Certified DELE / DALF Examiner'
    ],
    availability: {
      days: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'],
      slots: ['11:00 AM', '1:00 PM', '3:30 PM', '5:00 PM', '6:30 PM']
    },
    reviews: [
      { id: 1, student: 'Kemi O.', rating: 5, date: '3 days ago', comment: 'Adaeze makes speaking Spanish feel natural and fun. I passed my B1 exam easily!' },
      { id: 2, student: 'Mark J.', rating: 5, date: '2 weeks ago', comment: 'Great materials, fun conversation, and very encouraging teacher.' }
    ]
  },
  '3': {
    id: 3,
    name: 'Dr. Ibrahim Sanni',
    initials: 'IS',
    color: 'bg-blue-600',
    title: 'Senior Engineering & Physics Fellow',
    university: 'University of Lagos / Imperial College London',
    rating: 4.9,
    reviewsCount: 156,
    sessionsCompleted: 428,
    ratePerSession: 4500,
    languages: ['English', 'Hausa'],
    subjects: ['Physics for Engineers', 'Thermodynamics', 'Quantum Basics', 'Electromagnetism', 'JAMB / WAEC Physics'],
    bio: 'PhD in Mechanical Engineering. Taught over 400+ students across West Africa and the UK to ace engineering and advanced physics exams.',
    teachingApproach: 'Concept mastery through visual diagrams, derivation walkthroughs, and past exam pattern analysis.',
    education: [
      'Ph.D Mechanical Engineering — University of Lagos',
      'M.Sc Thermal Systems — Imperial College London',
      '10+ Years University Teaching Experience'
    ],
    availability: {
      days: ['Tue', 'Thu', 'Fri', 'Sat'],
      slots: ['9:00 AM', '11:30 AM', '3:00 PM', '5:15 PM', '7:00 PM']
    },
    reviews: [
      { id: 1, student: 'Emmanuel D.', rating: 5, date: '4 days ago', comment: 'Dr. Sanni’s mechanics explanations are unmatched. Cleared all my confusion for university physics.' }
    ]
  },
  '4': {
    id: 4,
    name: 'Chinwe Uche',
    initials: 'CU',
    color: 'bg-rose-500',
    title: 'Science & Medical Exam Strategist',
    university: 'University of Benin / UNN',
    rating: 4.7,
    reviewsCount: 63,
    sessionsCompleted: 142,
    ratePerSession: 2500,
    languages: ['English', 'Igbo'],
    subjects: ['Chemistry', 'Biology', 'JAMB Prep', 'Organic Chemistry'],
    bio: 'Former JAMB marker and exam strategist. 95% of my students score 280+ in JAMB. Specialises in science subjects and exam techniques.',
    teachingApproach: 'Targeted high-yield topic drill sets and past question analysis.',
    education: [
      'B.Sc Biochemistry — University of Benin',
      'Certified WAEC / JAMB Examiner'
    ],
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
      slots: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']
    },
    reviews: [
      { id: 1, student: 'Chioma A.', rating: 5, date: '5 days ago', comment: 'Chinwe makes chemistry formulas stick effortlessly.' }
    ]
  }
};

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const tutorIdStr = id || '1';
  const baseTutor = initialTutorsData[tutorIdStr] || initialTutorsData['1'];

  // Verification status from admin sync
  const [isVerified, setIsVerified] = useState<boolean>(true);

  // Reviews state with localStorage persistence
  const [reviewsList, setReviewsList] = useState(baseTutor.reviews);
  const [currentRating, setCurrentRating] = useState(baseTutor.rating);
  const [reviewsCount, setReviewsCount] = useState(baseTutor.reviewsCount);

  // New review form states
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRatingScore, setNewRatingScore] = useState(5);
  const [hoverRatingScore, setHoverRatingScore] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Booking Widget States
  const [selectedDay, setSelectedDay] = useState<string>(baseTutor.availability.days[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(baseTutor.availability.slots[2] || baseTutor.availability.slots[0]);
  const [selectedSubject, setSelectedSubject] = useState<string>(baseTutor.subjects[0]);
  const [sessionFormat, setSessionFormat] = useState<'1on1' | 'group' | 'in_person'>('1on1');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'paystack'>('wallet');
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [paystackChannel, setPaystackChannel] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isPaystackProcessing, setIsPaystackProcessing] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);
  const [bookedSessionId, setBookedSessionId] = useState<string>('');
  const [bookedDetails, setBookedDetails] = useState<{
    sessionId?: string;
    subject: string;
    day: string;
    slot: string;
    price: number;
    format: string;
    newBalance: number;
    paymentMethod: string;
  } | null>(null);

  // Admin Session Types & Location Mapping Policy (Virtual 1:1, Virtual Group, In-Person)
  const [sessionTypeSettings, setSessionTypeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_session_type_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      virtual1on1: true,
      virtualGroup: true,
      inPerson: false, // In-person disabled by default
      inPersonLgaMatch: true,
      inPersonStateMatch: true
    };
  });

  // Current wallet balance
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_wallet_balance_ngn');
      if (saved) return Number(saved);
    } catch (e) {}
    return 142500;
  });

  // Sync auth user name & reviews from localStorage
  useEffect(() => {
    // Wallet balance
    try {
      const savedBal = localStorage.getItem('akademi_wallet_balance_ngn');
      if (savedBal) setWalletBalance(Number(savedBal));
    } catch (e) {}

    // Session types
    try {
      const savedTypes = localStorage.getItem('akademi_session_type_settings');
      if (savedTypes) setSessionTypeSettings(JSON.parse(savedTypes));
    } catch (e) {}

    // Auth user
    try {
      const savedAuth = localStorage.getItem('akademi_auth_user');
      if (savedAuth) {
        const user = JSON.parse(savedAuth);
        if (user.name) setNewReviewerName(user.name);
      }
    } catch (e) {}

    // Check verification status from admin tutors
    try {
      const savedAdminTutors = localStorage.getItem('akademi_admin_tutors');
      if (savedAdminTutors) {
        const adminTutors = JSON.parse(savedAdminTutors);
        const match = adminTutors.find((t: any) => t.id === baseTutor.id || t.name === baseTutor.name);
        if (match) {
          setIsVerified(match.status === 'Verified');
        }
      }
    } catch (e) {}

    // Load stored reviews for this tutor
    try {
      const savedReviews = localStorage.getItem(`akademi_tutor_reviews_${baseTutor.id}`);
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [...parsed, ...baseTutor.reviews];
          setReviewsList(combined);
          
          // Recompute average
          const sum = combined.reduce((acc, curr) => acc + curr.rating, 0);
          const avg = Number((sum / combined.length).toFixed(1));
          setCurrentRating(avg);
          setReviewsCount(baseTutor.reviewsCount + parsed.length);
        }
      }
    } catch (e) {}
  }, [baseTutor.id, baseTutor.name]);

  const calculatePrice = () => {
    const base = baseTutor.ratePerSession;
    return sessionFormat === 'group' ? Math.round(base * 0.7) : base;
  };

  const executeCompleteBooking = (method: 'Wallet' | 'Paystack', updatedBal: number) => {
    const price = calculatePrice();
    const student = newReviewerName.trim() || 'Chiamaka Ada';

    // 1. Save to booked sessions (feeds tutor & student dashboards)
    try {
      const existingBookings = JSON.parse(localStorage.getItem('akademi_booked_sessions') || '[]');
      const newBooking = {
        id: `BS-${Date.now()}`,
        tutorId: String(baseTutor.id),
        tutorName: baseTutor.name,
        tutorAvatar: '/images/tutor-daniel.jpg',
        tutorInitials: baseTutor.initials,
        subject: selectedSubject,
        date: selectedDay,
        time: selectedSlot,
        timeSlot: selectedSlot,
        duration: '60 min',
        type: sessionFormat === 'group' ? 'group' : 'private',
        price: price,
        studentName: student,
        status: 'Upcoming',
        paymentMethod: method,
        bookedAt: new Date().toISOString()
      };
      localStorage.setItem('akademi_booked_sessions', JSON.stringify([newBooking, ...existingBookings]));
    } catch (e) {}

    // 2. Append session to user sessions list (feeds calendar & schedule views)
    const newSessionId = Date.now();
    try {
      const savedSessions = localStorage.getItem('akademi_user_sessions');
      const userSessions = savedSessions ? JSON.parse(savedSessions) : [];
      const newSession = {
        id: newSessionId,
        month: selectedDay,
        day: '15',
        title: `${selectedSubject} with ${baseTutor.name}`,
        person: baseTutor.name,
        avatar: '/images/tutor-daniel.jpg',
        time: `${selectedDay} · ${selectedSlot}`,
        duration: '60 min',
        status: 'upcoming',
        hasVideo: true,
        price: `₦${price.toLocaleString()}`,
        format: sessionFormat === 'group' ? 'Small Group (Virtual)' : '1:1 Virtual'
      };
      localStorage.setItem('akademi_user_sessions', JSON.stringify([newSession, ...userSessions]));
    } catch (e) {}

    // Dispatch WebSockets & Push Notification
    dispatchSessionBookedPush(baseTutor.name, selectedSubject, `${selectedDay} · ${selectedSlot}`, `₦${price.toLocaleString()}`);

    // 3. Record in user transaction history
    try {
      const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const newTx = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        type: 'Session Payment',
        description: `${selectedSubject} with ${baseTutor.name} (${sessionFormat === 'group' ? 'Group Virtual' : '1:1 Virtual'})`,
        amount: `-₦${price.toLocaleString()}`,
        status: 'Completed',
        date: 'Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
    } catch (e) {}

    // 4. Update wallet balance
    localStorage.setItem('akademi_wallet_balance_ngn', String(updatedBal));
    setWalletBalance(updatedBal);

    // 5. Notify all listeners
    window.dispatchEvent(new Event('storage'));

    const genSessionId = String(newSessionId);
    setBookedSessionId(genSessionId);

    setBookedDetails({
      sessionId: genSessionId,
      subject: selectedSubject,
      day: selectedDay,
      slot: selectedSlot,
      price,
      format: sessionFormat === 'group' ? 'Small Group Virtual (30% off)' : '1:1 Individual Virtual',
      newBalance: updatedBal,
      paymentMethod: method
    });

    setIsProcessingBooking(false);
    setIsPaystackProcessing(false);
    setPaystackOpen(false);
    setBookingSuccessModal(true);
  };

  const handleConfirmBooking = () => {
    const price = calculatePrice();
    if (paymentMethod === 'paystack') {
      setPaystackOpen(true);
      return;
    }

    setIsProcessingBooking(true);
    setTimeout(() => {
      let currentBal = walletBalance;
      try {
        const savedBal = localStorage.getItem('akademi_wallet_balance_ngn');
        if (savedBal) currentBal = Number(savedBal);
      } catch (e) {}

      const newBal = Math.max(0, currentBal - price);
      executeCompleteBooking('Wallet', newBal);
    }, 800);
  };

  const handlePaystackPaymentSubmit = () => {
    setIsPaystackProcessing(true);
    setTimeout(() => {
      executeCompleteBooking('Paystack', walletBalance);
    }, 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setReviewError('Please provide your review feedback comment.');
      return;
    }
    setReviewError(null);

    const name = newReviewerName.trim() || 'Student';
    const newEntry = {
      id: Date.now(),
      student: name,
      rating: newRatingScore,
      date: 'Just now',
      comment: newComment.trim()
    };

    const existingUserReviews = (() => {
      try {
        const saved = localStorage.getItem(`akademi_tutor_reviews_${baseTutor.id}`);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    })();

    const updatedUserReviews = [newEntry, ...existingUserReviews];
    localStorage.setItem(`akademi_tutor_reviews_${baseTutor.id}`, JSON.stringify(updatedUserReviews));

    const combined = [...updatedUserReviews, ...baseTutor.reviews];
    setReviewsList(combined);

    const sum = combined.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / combined.length).toFixed(1));
    setCurrentRating(avg);
    const totalCount = baseTutor.reviewsCount + updatedUserReviews.length;
    setReviewsCount(totalCount);

    // Also update global rating lookup for tutors list
    try {
      const allRatings = JSON.parse(localStorage.getItem('akademi_tutors_ratings') || '{}');
      allRatings[baseTutor.id] = { rating: avg, reviewCount: totalCount };
      localStorage.setItem('akademi_tutors_ratings', JSON.stringify(allRatings));
    } catch (e) {}

    setNewComment('');
    setReviewSuccessToast('Your review and star rating have been published!');
    setTimeout(() => setReviewSuccessToast(null), 3500);
  };

  const starLabels: Record<number, string> = {
    1: '1 Star — Unsatisfactory',
    2: '2 Stars — Fair',
    3: '3 Stars — Good',
    4: '4 Stars — Very Good',
    5: '5 Stars — Outstanding & Exceptional'
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {reviewSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{reviewSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/tutors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all tutors
          </Link>
          <span className="text-xs text-slate-400">
            {isVerified ? '✓ Verified Akademi Educator' : 'Akademi Educator Profile'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2-Columns: Tutor Bio, Experience & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Header Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className={cn("w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shrink-0 shadow-md", baseTutor.color)}>
                  {baseTutor.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                      {baseTutor.name}
                    </h1>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Verification Pending
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-emerald-600 mb-2">{baseTutor.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <Globe className="h-3.5 w-3.5 text-slate-400" /> {baseTutor.university}
                  </p>

                  {/* Rating & Stats Strip */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{currentRating}</span>
                      <span className="text-slate-500 font-normal">({reviewsCount} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Video className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{baseTutor.sessionsCompleted}+ sessions taught</span>
                    </div>

                    <div className="text-slate-500">
                      Languages: <span className="font-semibold text-slate-800">{baseTutor.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-base mb-2">About {baseTutor.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{baseTutor.bio}</p>
              </div>

              {/* Subjects Tags */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Subjects & Topics Taught</h4>
                <div className="flex flex-wrap gap-2">
                  {baseTutor.subjects.map((sub) => (
                    <span 
                      key={sub}
                      className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Teaching Methodology Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" /> Teaching Methodology & Approach
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{baseTutor.teachingApproach}</p>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Academic Credentials & Certifications</h4>
                <div className="space-y-2">
                  {baseTutor.education.map((edu, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                      <Award className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{edu}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Interactive Student Reviews & Review Submission Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Verified Student Reviews</h3>
                  <p className="text-xs text-slate-500">From students who booked and completed sessions.</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{currentRating} out of 5.0</span>
                </div>
              </div>

              {/* Review Submission Form */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Rate Your Experience with {baseTutor.name}
                  </h4>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  {/* Interactive Star Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Star Rating:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRatingScore(star)}
                            onMouseEnter={() => setHoverRatingScore(star)}
                            onMouseLeave={() => setHoverRatingScore(0)}
                            className="p-1 hover:scale-115 transition-transform focus:outline-none"
                            title={`${star} Star${star > 1 ? 's' : ''}`}
                          >
                            <Star 
                              className={cn(
                                "h-6 w-6 transition-colors",
                                (hoverRatingScore ? star <= hoverRatingScore : star <= newRatingScore)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 hover:text-amber-300"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-600 ml-2">
                        {starLabels[hoverRatingScore || newRatingScore]}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input 
                        type="text"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        placeholder="e.g. Chiamaka E."
                        className="w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Review Feedback</label>
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share how this tutor helped you understand challenging concepts, their teaching style, and pacing..."
                      rows={3}
                      className="w-full p-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3.5 w-3.5" /> {reviewError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" /> Post Verified Review
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="divide-y divide-slate-100 pt-2">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        {rev.student}
                        <span className="text-[10px] font-normal bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          Verified Student
                        </span>
                      </span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right 1-Column: Interactive Session Booking Widget */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl sticky top-24 space-y-6"
            >
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Instant Booking Available
                </span>
                <div className="flex items-baseline justify-between mt-3">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    ₦{calculatePrice().toLocaleString()}
                  </h2>
                  <span className="text-xs text-slate-500">per 60-min session</span>
                </div>
              </div>

              {/* 1. Choose Format */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Session Format
                  </label>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded font-semibold border border-emerald-200">
                    {sessionFormat === 'in_person' ? '📍 In-Person Lesson' : '📹 HD Virtual Meeting'}
                  </span>
                </div>

                <div className={cn(
                  "grid gap-2",
                  sessionTypeSettings.inPerson ? "grid-cols-3" : "grid-cols-2"
                )}>
                  {sessionTypeSettings.virtual1on1 && (
                    <button
                      type="button"
                      onClick={() => setSessionFormat('1on1')}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        sessionFormat === '1on1' 
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500" 
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <p className="text-xs font-bold">1:1 Virtual</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Private HD Video</p>
                    </button>
                  )}

                  {sessionTypeSettings.virtualGroup && (
                    <button
                      type="button"
                      onClick={() => setSessionFormat('group')}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        sessionFormat === 'group' 
                          ? "border-[#1E3A5F] bg-[#EBF3FA] text-[#1E3A5F] ring-1 ring-[#1E3A5F]" 
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <p className="text-xs font-bold">Group Virtual</p>
                      <p className="text-[10px] text-[#1E3A5F] font-semibold mt-0.5">Save 30%</p>
                    </button>
                  )}

                  {sessionTypeSettings.inPerson && (
                    <button
                      type="button"
                      onClick={() => setSessionFormat('in_person')}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        sessionFormat === 'in_person' 
                          ? "border-amber-500 bg-amber-50/50 text-amber-950 ring-1 ring-amber-500" 
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      )}
                    >
                      <p className="text-xs font-bold">📍 In-Person</p>
                      <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Same LGA</p>
                    </button>
                  )}
                </div>

                {/* If In-Person is selected, show location/LGA proximity verification notice */}
                {sessionFormat === 'in_person' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-amber-900">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Physical Lesson Proximity Rule</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-900/80">
                      Tutor location: <strong>Lagos (Ikeja LGA)</strong>. In-person lessons are strictly mapped to students in the same LGA for safe local meeting.
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Choose Subject */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Focus Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                >
                  {baseTutor.subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* 3. Choose Day & Time Slot */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Days
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {baseTutor.availability.days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "flex-1 min-w-[44px] py-2 rounded-lg text-xs font-bold transition-colors text-center",
                        selectedDay === day 
                          ? "bg-slate-900 text-white shadow-sm" 
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Time Slot ({selectedDay})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {baseTutor.availability.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                        selectedSlot === slot 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-1 ring-emerald-500" 
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <Clock className="h-3 w-3 text-slate-400" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Payment Method Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all",
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
                      "p-2.5 rounded-xl border text-left transition-all",
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

              {/* Summary Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lesson:</span>
                  <span className="font-semibold text-slate-900">{selectedSubject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">When:</span>
                  <span className="font-semibold text-slate-900">{selectedDay} at {selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-900">{paymentMethod === 'paystack' ? 'Paystack Gateway' : 'Akademi Wallet'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-emerald-600 text-sm">₦{calculatePrice().toLocaleString()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isProcessingBooking}
                className="w-full py-3.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isProcessingBooking ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Processing Payment & Booking...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> {paymentMethod === 'paystack' ? 'Pay with Paystack →' : 'Book & Lock In Slot'}
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" /> Free cancellation up to 24h before session
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Paystack In-Modal Checkout Drawer */}
      <AnimatePresence>
        {paystackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
              onClick={() => !isPaystackProcessing && setPaystackOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E8E3D7] z-10 font-sans"
            >
              {/* Paystack Green Header */}
              <div className="p-6 bg-[#0F5338] text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">
                      P
                    </div>
                    <h3 className="font-serif font-bold text-lg leading-tight">Paystack Checkout</h3>
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-0.5">Lesson Payment for {baseTutor.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-200/70 block">Amount</span>
                  <span className="text-xl font-black text-white">₦{calculatePrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Channel Selector */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {[
                    { id: 'card', label: '💳 Card' },
                    { id: 'transfer', label: '🏦 Transfer' },
                    { id: 'ussd', label: '📱 USSD' }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setPaystackChannel(ch.id as any)}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold transition-all text-center",
                        paystackChannel === ch.id 
                          ? "bg-white text-slate-900 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>

                {paystackChannel === 'card' && (
                  <div className="space-y-3 bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="5399 4100 8821 9024" 
                        className="w-full h-9 px-3 bg-white border border-[#E8E3D7] rounded-lg font-mono text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Expiry</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="08/28" 
                          className="w-full h-9 px-3 bg-white border border-[#E8E3D7] rounded-lg font-mono text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">CVV</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="•••" 
                          className="w-full h-9 px-3 bg-white border border-[#E8E3D7] rounded-lg font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paystackChannel === 'transfer' && (
                  <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-2 text-center">
                    <p className="text-slate-500">Pay to Wema Bank / Paystack Virtual Account:</p>
                    <p className="text-base font-black text-[#0F5338] font-mono">0123 456 789</p>
                    <p className="text-[10px] text-slate-400">Account expires in 30 minutes</p>
                  </div>
                )}

                {paystackChannel === 'ussd' && (
                  <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-2 text-center">
                    <p className="text-slate-500">Dial on your registered phone:</p>
                    <p className="text-base font-black text-[#0F5338] font-mono">*737*50*{calculatePrice()}#</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured 256-bit Paystack payment gateway</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isPaystackProcessing}
                    onClick={() => setPaystackOpen(false)}
                    className="flex-1 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPaystackProcessing}
                    onClick={handlePaystackPaymentSubmit}
                    className="flex-[2] py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isPaystackProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Verifying with Paystack...
                      </span>
                    ) : (
                      <span>Pay ₦{calculatePrice().toLocaleString()} with Paystack →</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Success Modal */}
      <AnimatePresence>
        {bookingSuccessModal && bookedDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setBookingSuccessModal(false)}
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

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">Session Confirmed! 🎉</h3>
              <p className="text-xs text-slate-500 mb-6">
                Your lesson with <span className="font-bold text-slate-800">{baseTutor.name}</span> is booked, verified, and scheduled.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 mb-6 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-bold text-slate-900">{bookedDetails.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="font-bold text-emerald-600">{bookedDetails.day} · {bookedDetails.slot} (60 min)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-semibold text-slate-900">{bookedDetails.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold text-slate-900">
                    ₦{bookedDetails.price.toLocaleString()} (Paid via {bookedDetails.paymentMethod})
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-[11px]">
                  <span className="text-slate-500">Updated Wallet Balance:</span>
                  <span className="font-bold text-emerald-700">₦{bookedDetails.newBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/sessions')}
                  className="flex-1 py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-xs text-center flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View My Schedule</span>
                </button>
                <Link
                  to={`/classroom/${bookedSessionId || '1'}`}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Classroom →</span>
                </Link>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/billing')}
                  className="text-[11px] text-slate-500 hover:text-[#0F5338] font-semibold underline"
                >
                  View Receipt in Billing & Wallet →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
