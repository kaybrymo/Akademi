import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, BookOpen, Clock, Filter, ChevronDown, X, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import BookingModal from '@/components/ui/BookingModal';

const initialTutorsList = [
  {
    id: 1,
    name: 'Daniel Okafor',
    initials: 'DO',
    color: 'bg-emerald-500',
    subjects: ['Mathematics', 'Further Maths', 'Physics', 'Calculus'],
    speciality: 'A-Level & University',
    rating: 4.9,
    reviewCount: 127,
    rate: 3500,
    sessions: 312,
    experience: '6 years',
    languages: ['English', 'Yoruba'],
    verified: true,
    bio: 'Cambridge-educated maths tutor with a passion for making complex concepts simple. Specialises in A-Level and first-year university mathematics.',
  },
  {
    id: 2,
    name: 'Adaeze Nwosu',
    initials: 'AN',
    color: 'bg-purple-500',
    subjects: ['Spanish', 'French', 'English', 'Linguistics'],
    speciality: 'Language Fluency',
    rating: 4.8,
    reviewCount: 89,
    rate: 2800,
    sessions: 204,
    experience: '4 years',
    languages: ['English', 'Igbo', 'Spanish', 'French'],
    verified: true,
    bio: 'Native Spanish speaker and certified language instructor. I make language learning enjoyable and practical through conversational techniques.',
  },
  {
    id: 3,
    name: 'Dr. Ibrahim Sanni',
    initials: 'IS',
    color: 'bg-blue-500',
    subjects: ['Physics', 'Engineering', 'Mathematics', 'Thermodynamics'],
    speciality: 'Engineering & Sciences',
    rating: 4.9,
    reviewCount: 156,
    rate: 4500,
    sessions: 428,
    experience: '9 years',
    languages: ['English', 'Hausa'],
    verified: true,
    bio: 'PhD in Mechanical Engineering from University of Lagos. Helped 400+ students ace WAEC, JAMB and university Physics examinations.',
  },
  {
    id: 4,
    name: 'Chinwe Uche',
    initials: 'CU',
    color: 'bg-rose-500',
    subjects: ['Chemistry', 'Biology', 'JAMB Prep', 'Organic Chemistry'],
    speciality: 'Science & Exam Prep',
    rating: 4.7,
    reviewCount: 63,
    rate: 2500,
    sessions: 142,
    experience: '3 years',
    languages: ['English', 'Igbo'],
    verified: true,
    bio: 'Former JAMB marker and exam strategist. 95% of my students score 280+ in JAMB. Specialises in science subjects and exam techniques.',
  },
  {
    id: 5,
    name: 'Tobi Adeleke',
    initials: 'TA',
    color: 'bg-amber-500',
    subjects: ['Economics', 'Government', 'Geography', 'Commerce'],
    speciality: 'Social Sciences',
    rating: 4.6,
    reviewCount: 41,
    rate: 2200,
    sessions: 97,
    experience: '2 years',
    languages: ['English', 'Yoruba'],
    verified: false,
    bio: 'Economics graduate from Obafemi Awolowo University. Passionate about making social sciences relatable with real-world examples.',
  },
  {
    id: 6,
    name: 'Dr. Funmilayo Adeyemi',
    initials: 'FA',
    color: 'bg-teal-500',
    subjects: ['English Literature', 'Creative Writing', 'IELTS', 'Essay Writing'],
    speciality: 'English & Communication',
    rating: 4.8,
    reviewCount: 112,
    rate: 3200,
    sessions: 265,
    experience: '7 years',
    languages: ['English', 'Yoruba'],
    verified: true,
    bio: 'Published author and English PhD with expertise in British and African literature. IELTS Band 9 scorer. Helps students achieve Band 7+ consistently.',
  },
];

interface TutorItem {
  id: number;
  name: string;
  initials: string;
  color: string;
  subjects: string[];
  speciality: string;
  rating: number;
  reviewCount: number;
  rate: number;
  sessions: number;
  experience: string;
  languages: string[];
  verified: boolean;
  bio: string;
  status?: string;
  email?: string;
}

const subjectGroups = ['All', 'Mathematics', 'Sciences', 'Languages', 'Technology', 'Business', 'Arts & Humanities'];

export default function Tutors() {
  const [tutors, setTutors] = useState<TutorItem[]>(initialTutorsList);
  const [bookingTutor, setBookingTutor] = useState<{ id: string; name: string; subject: string; rate: number; avatar: string; initials: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [maxRate, setMaxRate] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'rating' | 'rate-asc' | 'rate-desc' | 'sessions'>('rating');

  // Load custom ratings / admin verification status from localStorage
  useEffect(() => {
    const loadTutors = () => {
      let registered: any[] = [];
      try {
        const savedReg = localStorage.getItem('akademi_registered_tutors');
        if (savedReg) {
          registered = JSON.parse(savedReg);
        }
      } catch (e) {}

      let updated = [...registered, ...initialTutorsList];

      // Check custom ratings from localStorage
      try {
        const savedRatings = localStorage.getItem('akademi_tutors_ratings');
        if (savedRatings) {
          const ratingMap = JSON.parse(savedRatings);
          updated = updated.map(t => {
            if (ratingMap[t.id]) {
              return {
                ...t,
                rating: ratingMap[t.id].rating ?? t.rating,
                reviewCount: ratingMap[t.id].reviewCount ?? t.reviewCount
              };
            }
            return t;
          });
        }
      } catch (e) {}

      // Check admin verified tutors
      try {
        const savedAdminTutors = localStorage.getItem('akademi_admin_tutors');
        if (savedAdminTutors) {
          const adminTutors = JSON.parse(savedAdminTutors);
          updated = updated.map(t => {
            const match = adminTutors.find((adm: any) => adm.id === t.id || adm.name === t.name || (t.email && adm.email === t.email));
            if (match) {
              return {
                ...t,
                verified: match.status === 'Verified',
                status: match.status
              };
            }
            return t;
          });
        }
      } catch (e) {}

      setTutors(updated);
    };

    loadTutors();
    window.addEventListener('storage', loadTutors);
    return () => window.removeEventListener('storage', loadTutors);
  }, []);

  const filtered = tutors
    .filter(t => {
      // Strictly exclude pending or unverified tutors from the student directory
      const isApproved = t.verified === true && t.status !== 'Pending' && t.status !== 'Suspended';
      if (!isApproved) return false;

      const matchesSearch = !searchQuery ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup = selectedGroup === 'All' || t.subjects.some(s => {
        if (selectedGroup === 'Sciences') return ['Physics', 'Chemistry', 'Biology', 'Engineering', 'Organic Chemistry'].includes(s);
        if (selectedGroup === 'Mathematics') return s.includes('Math') || s.includes('Maths') || s === 'Calculus';
        if (selectedGroup === 'Languages') return ['Spanish', 'French', 'English Literature', 'English', 'IELTS', 'Linguistics'].includes(s);
        if (selectedGroup === 'Business') return ['Economics', 'Commerce', 'Accounting'].includes(s);
        if (selectedGroup === 'Arts & Humanities') return ['Government', 'Geography', 'English Literature', 'Creative Writing'].includes(s);
        return s.toLowerCase().includes(selectedGroup.toLowerCase());
      });

      const matchesRate = t.rate <= maxRate;
      const matchesRating = t.rating >= minRating;

      return matchesSearch && matchesGroup && matchesRate && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'rate-asc') return a.rate - b.rate;
      if (sortBy === 'rate-desc') return b.rate - a.rate;
      if (sortBy === 'sessions') return b.sessions - a.sessions;
      return 0;
    });

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero search bar */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-extrabold mb-3"
          >
            Find your perfect verified tutor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 mb-8 text-base sm:text-lg"
          >
            Vetted educators across mathematics, sciences, languages & exam prep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tutor name, subject (e.g. Calculus, Physics), or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 rounded-2xl bg-white text-slate-900 pl-12 pr-10 text-sm sm:text-base shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 border border-slate-200"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subject group filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {subjectGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={cn(
                "px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border shadow-2xs",
                selectedGroup === group
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-slate-900"
              )}
            >
              {group}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap shadow-2xs",
              showFilters
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {minRating > 0 || maxRate < 10000 ? `(Active)` : ''}
          </button>
        </div>

        {/* Advanced filters drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Max Hourly / Session Rate
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={500}
                    value={maxRate}
                    onChange={(e) => setMaxRate(Number(e.target.value))}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="text-sm font-bold text-emerald-700 w-24 text-right bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    ₦{maxRate.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Minimum Star Rating
                </label>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border font-semibold transition-all",
                        minRating === r
                          ? "bg-amber-50 border-amber-400 text-amber-800 shadow-xs"
                          : "border-slate-200 text-slate-600 hover:border-amber-300 bg-white"
                      )}
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Sort Directory By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                >
                  <option value="rating">Top Rated & Reviewed</option>
                  <option value="rate-asc">Price: Low to High</option>
                  <option value="rate-desc">Price: High to Low</option>
                  <option value="sessions">Most Experienced (Sessions)</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count & active sorting */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> vetted tutors
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
            >
              <option value="rating">Top Rated</option>
              <option value="rate-asc">Rate: Low to High</option>
              <option value="rate-desc">Rate: High to Low</option>
              <option value="sessions">Most Taught Sessions</option>
            </select>
          </div>
        </div>

        {/* Tutor cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tutor, i) => (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-sm", tutor.color)}>
                      {tutor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{tutor.name}</h3>
                        {tutor.verified ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shrink-0">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium shrink-0">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-600 font-medium mt-0.5">{tutor.speciality}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-900">{tutor.rating}</span>
                        <span className="text-xs text-slate-400">({tutor.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{tutor.bio}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tutor.subjects.map((s) => (
                      <span key={s} className="text-[11px] bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl py-2">
                      <p className="font-bold text-slate-900">{tutor.sessions}</p>
                      <p className="text-[10px] text-slate-400">sessions</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl py-2">
                      <p className="font-bold text-slate-900">{tutor.experience}</p>
                      <p className="text-[10px] text-slate-400">exp.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl py-2">
                      <p className="font-bold text-emerald-600">₦{tutor.rate.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">/ session</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/tutors/${tutor.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    View profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBookingTutor({ id: String(tutor.id), name: tutor.name, subject: tutor.subjects[0] || 'General Tutoring', rate: tutor.rate, avatar: '', initials: tutor.initials })}
                    className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Book session
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No tutors matched your criteria</h3>
            <p className="text-xs text-slate-500">Try widening your search terms, subject group, or price range.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGroup('All'); setMinRating(0); setMaxRate(10000); }}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>

        {/* Booking Modal */}
        {bookingTutor && (
          <BookingModal
            isOpen={!!bookingTutor}
            onClose={() => setBookingTutor(null)}
            tutor={bookingTutor}
          />
        )}
      </>
    );
  }
