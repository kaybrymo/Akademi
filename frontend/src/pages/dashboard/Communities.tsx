import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, 
  Search, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Zap, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Award,
  Lock,
  ExternalLink,
  MessageSquare,
  Flame,
  Check,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, getAvatarUrl, handleImageError } from '@/lib/utils';
import CreateCommunityModal, { type CommunityData } from '@/components/modals/CreateCommunityModal';
import Payment2FAModal from '@/components/modals/Payment2FAModal';

const INITIAL_COMMUNITIES: CommunityData[] = [
  {
    id: 'comm-1',
    name: 'Data Analytics Career Hub',
    slug: 'data-analytics-career-hub',
    tagline: 'Master SQL, PowerBI, Python & land high-paying global analytics roles.',
    description: 'An active ecosystem for aspiring data analysts. Members get weekly live portfolio build workshops, resume audits, and direct tutor coaching from industry experts.',
    category: 'Data & Tech',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    communityType: 'Tutor Masterclass',
    accessType: 'paid',
    monthlyPrice: 4500,
    currency: 'NGN',
    creatorName: 'Ade Adeyemi',
    creatorRole: 'Verified Tutor',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membersCount: 342,
    coursesCount: 3,
    eventsCount: 6,
    isVerified: true,
    tags: ['Data & Tech', 'Paid Membership', 'Career Coaching', 'Live Portfolio Builds'],
    attachedCourses: ['Data Analytics Foundations with SQL', 'Python for Exploratory Data Analysis', 'PowerBI Executive Dashboards'],
    welcomeMessage: 'Welcome to the Data Analytics Career Hub! Check the pinned curriculum to start your project pathway.',
    createdAt: '2 weeks ago'
  },
  {
    id: 'comm-2',
    name: 'Dr. Chiamaka\'s Calculus Circle',
    slug: 'calculus-advanced-math-circle',
    tagline: 'From Integration by Parts to Multivariable Calculus — mastered together.',
    description: 'A study mastermind for engineering and university mathematics students. Daily problem sets, past paper breakdowns, and exam preparation masterclasses.',
    category: 'Mathematics & Sciences',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
    communityType: 'Tutor Masterclass',
    accessType: 'free',
    monthlyPrice: 0,
    currency: 'NGN',
    creatorName: 'Dr. Chiamaka Eze',
    creatorRole: 'Verified Tutor',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    membersCount: 820,
    coursesCount: 2,
    eventsCount: 8,
    isVerified: true,
    tags: ['Mathematics & Sciences', 'Free Public Hub', 'Calculus Mastery', 'Exam Prep'],
    attachedCourses: ['A-level & University Calculus Essentials', 'Differential Equations Masterclass'],
    welcomeMessage: 'Welcome to our Math Circle! Post any challenging math question in the Q&A thread.',
    createdAt: '1 month ago'
  },
  {
    id: 'comm-3',
    name: 'Polyglot Spanish & Global Languages',
    slug: 'polyglot-spanish-global-languages',
    tagline: 'Conversational fluency, cultural masterclasses & live speaking practice.',
    description: 'Immerse yourself in authentic conversational Spanish with native and verified tutors. Includes weekly group speaking salons and vocabulary decks.',
    category: 'Languages & Culture',
    coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80',
    communityType: 'Tutor Masterclass',
    accessType: 'paid',
    monthlyPrice: 3500,
    currency: 'NGN',
    creatorName: 'Halima Yusuf',
    creatorRole: 'Verified Tutor',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    membersCount: 215,
    coursesCount: 2,
    eventsCount: 4,
    isVerified: true,
    tags: ['Languages & Culture', 'Paid Membership', 'Speaking Club', 'DELE Prep'],
    attachedCourses: ['Conversational Spanish for Beginners', 'Advanced Business Spanish'],
    welcomeMessage: '¡Bienvenidos! Practice your 60-second audio intro in our introductions channel.',
    createdAt: '3 weeks ago'
  },
  {
    id: 'comm-4',
    name: 'UNILAG Engineering 300L Mastermind',
    slug: 'unilag-engineering-300l',
    tagline: 'Collaborative problem solving and exam prep cohorts for 300L engineering students.',
    description: 'Student-led study hub for tackling past questions, assignments, and understanding core engineering concepts together.',
    category: 'Mathematics & Sciences',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    communityType: 'Peer Study Hub',
    accessType: 'free',
    monthlyPrice: 0,
    currency: 'NGN',
    creatorName: 'Chiamaka Ada',
    creatorRole: 'Peer Study Leader',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    membersCount: 188,
    coursesCount: 3,
    eventsCount: 5,
    isVerified: false,
    tags: ['Engineering', 'Free Hub', 'Study Group', 'Exam Prep'],
    attachedCourses: [],
    welcomeMessage: 'Welcome guys! Let us tackle this semester together.',
    createdAt: '2 months ago'
  },
  {
    id: 'comm-5',
    name: 'JAMB & Post-UTME 2026 Daily Squad',
    slug: 'jamb-post-utme-2026',
    tagline: 'Daily questions, past papers and accountability for 2026 JAMBites.',
    description: 'Join thousands of students studying daily. We post mock questions, explain answers, and track our reading progress.',
    category: 'Exam & University Prep',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    communityType: 'Peer Study Hub',
    accessType: 'free',
    monthlyPrice: 0,
    currency: 'NGN',
    creatorName: 'Oluwaseun Ojo',
    creatorRole: 'Peer Study Leader',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membersCount: 1205,
    coursesCount: 0,
    eventsCount: 2,
    isVerified: false,
    tags: ['JAMB', 'Post-UTME', 'Study Group', 'Free Hub'],
    attachedCourses: [],
    welcomeMessage: 'Welcome! Start by introducing yourself and your target course.',
    createdAt: '1 week ago'
  }
];

export default function Communities() {
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const isSuperAdmin = user?.role === 'super_admin';

  const [communities, setCommunities] = useState<CommunityData[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_communities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COMMUNITIES;
  });

  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_joined_communities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['comm-2']; // User is enrolled in free Math circle by default
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [accessFilter, setAccessFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [communityTypeFilter, setCommunityTypeFilter] = useState<'All Hubs' | 'Tutor Masterclasses' | 'Peer Study Circles'>('All Hubs');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'explore' | 'joined'>('explore');

  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    const syncSettings = () => {
      const savedComm = localStorage.getItem('akademi_enable_communities');
      setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [subscribingCommunity, setSubscribingCommunity] = useState<CommunityData | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveCommunities = (updated: CommunityData[]) => {
    setCommunities(updated);
    try {
      localStorage.setItem('akademi_communities', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleCommunityCreated = (newCommunity: CommunityData) => {
    const updated = [newCommunity, ...communities];
    saveCommunities(updated);
    // Auto join creator to their community
    const updatedJoined = [...joinedCommunityIds, newCommunity.id];
    setJoinedCommunityIds(updatedJoined);
    localStorage.setItem('akademi_joined_communities', JSON.stringify(updatedJoined));
    showToast(`🚀 Community "${newCommunity.name}" created and launched successfully!`);
  };

  const handleJoinFreeCommunity = (comm: CommunityData) => {
    if (joinedCommunityIds.includes(comm.id)) {
      showToast(`You are already a member of "${comm.name}".`);
      return;
    }

    const updatedJoined = [...joinedCommunityIds, comm.id];
    setJoinedCommunityIds(updatedJoined);
    localStorage.setItem('akademi_joined_communities', JSON.stringify(updatedJoined));

    // Increment member count
    const updated = communities.map(c => c.id === comm.id ? { ...c, membersCount: c.membersCount + 1 } : c);
    saveCommunities(updated);

    showToast(`✓ Welcome! You have joined "${comm.name}" (Free Access).`);
  };

  const handleInitiatePaidSubscription = (comm: CommunityData) => {
    if (joinedCommunityIds.includes(comm.id)) {
      showToast(`You have an active membership in "${comm.name}".`);
      return;
    }

    setSubscribingCommunity(comm);

    // Check if Payment 2FA is required
    const is2FARequired = localStorage.getItem('akademi_require_payment_2fa') !== 'false';
    if (is2FARequired) {
      setShow2FAModal(true);
    } else {
      processMembershipPayment(comm);
    }
  };

  const processMembershipPayment = (comm: CommunityData) => {
    const updatedJoined = [...joinedCommunityIds, comm.id];
    setJoinedCommunityIds(updatedJoined);
    localStorage.setItem('akademi_joined_communities', JSON.stringify(updatedJoined));

    // Deduct from wallet if available or process via gateway
    try {
      const curBal = Number(localStorage.getItem('akademi_wallet_balance_ngn') || 142500);
      const newBal = Math.max(0, curBal - comm.monthlyPrice);
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

      // Record transaction
      const savedTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const subTx = {
        id: `SUB-${Date.now().toString().slice(-6)}`,
        type: 'Community Membership',
        description: `Monthly Membership: ${comm.name}`,
        amount: `-₦${comm.monthlyPrice.toLocaleString()}`,
        status: 'Completed',
        date: 'Today, Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([subTx, ...savedTx]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    // Increment members
    const updated = communities.map(c => c.id === comm.id ? { ...c, membersCount: c.membersCount + 1 } : c);
    saveCommunities(updated);

    setSubscribingCommunity(null);
    setShow2FAModal(false);
    showToast(`🎉 Membership Activated! You are now subscribed to "${comm.name}" (₦${comm.monthlyPrice.toLocaleString()}/mo).`);
  };

  const categories = ['All', 'Data & Tech', 'Mathematics & Sciences', 'Languages & Culture', 'Professional Careers'];

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesAccess = 
      accessFilter === 'All' ? true :
      accessFilter === 'Free' ? c.accessType === 'free' :
      c.accessType === 'paid';

    const matchesType = 
      communityTypeFilter === 'All Hubs' ? true :
      communityTypeFilter === 'Tutor Masterclasses' ? c.communityType === 'Tutor Masterclass' :
      c.communityType === 'Peer Study Hub';

    const matchesView = activeView === 'explore' ? true : joinedCommunityIds.includes(c.id);

    return matchesSearch && matchesCat && matchesAccess && matchesType && matchesView;
  });

  const totalMembersAcrossPlatform = communities.reduce((acc, c) => acc + c.membersCount, 0);

  if (!enableCommunities) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 border border-amber-300 rounded-3xl flex items-center justify-center text-[#0F5338] mx-auto shadow-md">
          <Users2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
            🔒 Communities Hidden by Super Admin
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Communities Launch Pending</h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            The platform admin has disabled the Communities module while focusing on 1-on-1 & Group Tutoring. Discover verified expert tutors to book live sessions.
          </p>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            to="/tutors"
            className="px-6 py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-2xl text-xs font-extrabold shadow-lg transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find & Book Expert Tutors →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-16 w-full"
    >
      {/* Super Admin Banner */}
      {isSuperAdmin && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-amber-700 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-amber-900 leading-snug">
              🛡️ Super Admin Controls: Manage, curate, feature, and unpublish platform communities in the Moderation Desk
            </p>
          </div>
          <Link to="/admin/communities" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0">
            Moderation Desk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-md"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0F5338] via-[#0A3D29] to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] sm:text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Communities as Products · Peer Cohorts & Masterminds</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            Learn Together in Expert-Led Communities
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-2xl">
            Join verified tutor communities for weekly live workshops, project reviews, curriculum vaults, and peer study groups.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex flex-col items-center justify-center active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> <span>Launch a Community</span>
              </div>
              <span className="text-[9px] opacity-90 mt-0.5 font-medium">For Students, Tutors & Study Leaders</span>
            </button>

            <div className="flex items-center gap-4 text-xs text-emerald-100/90 pl-1 sm:pl-2">
              <span className="flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-emerald-400" />
                <strong className="text-white">{totalMembersAcrossPlatform.toLocaleString()}+</strong> Active Members
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <strong className="text-white">{communities.length}</strong> Active Hubs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Tabs & Search Bar */}
      <div className="space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
        {/* Row 1: View Modes & Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* View Mode Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveView('explore')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                activeView === 'explore'
                  ? "bg-white text-[#0F5338] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Explore All Hubs ({communities.length})</span>
            </button>

            <button
              onClick={() => setActiveView('joined')}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer",
                activeView === 'joined'
                  ? "bg-white text-[#0F5338] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Enrolled Hubs ({joinedCommunityIds.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search community name, topic or tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-[#FBF9F4] border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 2: Secondary Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Community Type Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1 text-[11px]">Type:</span>
            {(['All Hubs', 'Tutor Masterclasses', 'Peer Study Circles'] as const).map(type => (
              <button
                key={type}
                onClick={() => setCommunityTypeFilter(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  communityTypeFilter === type
                    ? "bg-[#0F5338] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                )}
              >
                {type === 'Tutor Masterclasses' ? '🎓 Tutor Masterclasses' : type === 'Peer Study Circles' ? '👥 Peer Study Circles' : 'All Hubs'}
              </button>
            ))}
          </div>

          {/* Pricing Access Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1 text-[11px]">Access:</span>
            {(['All', 'Free', 'Paid'] as const).map(access => (
              <button
                key={access}
                onClick={() => setAccessFilter(access)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  accessFilter === access
                    ? "bg-[#0F5338] text-white shadow-2xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                )}
              >
                {access === 'All' ? 'All Access' : access === 'Free' ? 'Free Hubs' : 'Paid Subscriptions'}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Category Horizontal Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-1 w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                selectedCategory === cat
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs font-bold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Users2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No communities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or category filters, or be the first to launch a community in this topic!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5338] text-white text-xs font-bold rounded-xl mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Launch Community
            </button>
          </div>
        ) : (
          filteredCommunities.map((comm) => {
            const isCreator = Boolean(
              (user?.name && comm?.creatorName && user.name.toLowerCase().trim() === comm.creatorName.toLowerCase().trim()) ||
              (user?.email && (comm as any)?.creatorEmail && user.email.toLowerCase().trim() === (comm as any).creatorEmail.toLowerCase().trim())
            );
            const isJoined = joinedCommunityIds.includes(comm.id) || isCreator;

            return (
              <motion.div
                key={comm.id}
                layout
                className={cn(
                  "bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group",
                  isCreator ? "border-amber-400 ring-2 ring-amber-300/40" : "border-slate-200"
                )}
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={comm.coverImage} 
                      alt={comm.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-900 shadow-2xs">
                            {comm.category}
                          </span>
                          {isCreator && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1 border border-amber-300 animate-pulse">
                              👑 Your Hub (Creator)
                            </span>
                          )}
                        </div>

                        {comm.accessType === 'paid' ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />
                            ₦{comm.monthlyPrice.toLocaleString()}<span className="text-[9px] font-normal opacity-90">/mo</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-sm flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Free Access
                          </span>
                        )}
                      </div>
                      
                      <div className="flex">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5",
                          comm.communityType === 'Tutor Masterclass' 
                            ? "bg-emerald-900/90 text-amber-400 border border-emerald-500/30 backdrop-blur-xs" 
                            : "bg-indigo-900/90 text-blue-300 border border-indigo-500/30 backdrop-blur-xs"
                        )}>
                          {comm.communityType === 'Tutor Masterclass' ? '🎓 Tutor Masterclass' : '👥 Peer Study Hub'}
                        </span>
                      </div>
                    </div>

                    {/* Member Count Overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-semibold">
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 text-[11px]">
                        <Users2 className="w-3 h-3 text-emerald-400" />
                        {comm.membersCount.toLocaleString()} members
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 text-[11px]">
                        <BookOpen className="w-3 h-3 text-blue-400" />
                        {comm.coursesCount} courses
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0F5338] transition-colors leading-snug">
                        {comm.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        {comm.tagline}
                      </p>
                    </div>

                    {/* Creator Identity */}
                    <div className={cn("flex items-center gap-3 p-3 rounded-2xl border", isCreator ? "bg-amber-50/70 border-amber-200" : "bg-slate-50 border-slate-100")}>
                      <img 
                        src={getAvatarUrl(comm.creatorName, comm.creatorAvatar)} 
                        alt={comm.creatorName} 
                        onError={(e) => handleImageError(e, comm.creatorName)}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {isCreator ? `${comm.creatorName} (You)` : comm.creatorName}
                          </span>
                          {comm.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          {isCreator && (
                            <span className="ml-1 px-1.5 py-0.2 bg-amber-200 text-amber-950 font-black text-[9px] rounded uppercase">
                              Host
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-medium mt-0.5 truncate flex items-center gap-1">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                            comm.creatorRole === 'Verified Tutor' ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                          )}>
                            {comm.creatorRole}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Attached Highlights */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Weekly Live Coaching Workshops & Q&A</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>24/7 Peer Mastermind & Resource Vault</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                  {isCreator ? (
                    <div className="flex items-center gap-2 pt-3">
                      <Link
                        to={`/communities/${comm.id}`}
                        className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Open Your Hub (Host Controls) &rarr;</span>
                      </Link>
                    </div>
                  ) : isJoined ? (
                    <div className="flex items-center gap-2 pt-3">
                      <Link
                        to={`/communities/${comm.id}`}
                        className="flex-1 py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
                      >
                        Open Community Space & Feed &rarr;
                      </Link>
                    </div>
                  ) : comm.accessType === 'free' ? (
                    <div className="pt-3">
                      <button
                        onClick={() => handleJoinFreeCommunity(comm)}
                        className="w-full py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Globe className="w-4 h-4" /> Join Free Community
                      </button>
                    </div>
                  ) : (
                    <div className="pt-3">
                      <button
                        onClick={() => handleInitiatePaidSubscription(comm)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Zap className="w-4 h-4 fill-current text-amber-300" /> Subscribe (₦{comm.monthlyPrice.toLocaleString()}/mo)
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Creator Studio Launch Modal */}
      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />

      {/* 2FA Verification Modal for Paid Subscriptions */}
      {subscribingCommunity && (
        <Payment2FAModal
          isOpen={show2FAModal}
          onClose={() => setShow2FAModal(false)}
          onSuccess={() => processMembershipPayment(subscribingCommunity)}
          amount={subscribingCommunity.monthlyPrice}
          purpose={`Monthly Community Membership: ${subscribingCommunity.name}`}
        />
      )}
    </motion.div>
  );
}
