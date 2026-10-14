import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, MessageSquare, BookOpen, Calendar, Award, Zap, Sparkles, 
  Share2, ChevronRight, CheckCircle2, Plus, Heart, MessageCircle, 
  MoreHorizontal, PlayCircle, FileText, Clock, Video, Lock, ShieldCheck,
  Send, Bot, Trophy, Star, ChevronDown, Check, Settings, X, Edit2, Trash2,
  CornerDownRight, Coins
} from 'lucide-react';
import { cn, getAvatarUrl, handleImageError } from '@/lib/utils';

type TabType = 'community' | 'classroom' | 'events' | 'experts' | 'leaderboard' | 'ai' | 'studio';

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('community');
  
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: 'Chiamaka Ada', role: 'student', email: 'ada@akademi.dev' };
  });
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [community, setCommunity] = useState<any>(() => {
    const defaultCommunities = [
      {
        id: 'comm-1',
        name: 'Data Analytics Career Hub',
        slug: 'data-analytics-career-hub',
        category: 'Data & Tech',
        tagline: 'Learn data analysis from scratch.',
        communityType: 'Tutor Masterclass',
        banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        creator: 'Ade Adeyemi',
        creatorRole: 'Lead Data Analytics Tutor & Mentor',
        membersCount: 342,
        isEnrolled: true,
        monthlyPrice: 4500,
        accessType: 'paid',
        modules: [
            {
              id: 1, title: 'Module 1: Foundations', progress: 100, lessons: [
                { title: 'Intro to Data', duration: '12:45', type: 'video', completed: true },
                { title: 'Excel Basics', duration: 'PDF', type: 'doc', completed: true }
              ]
            }
        ],
        events: [
            { id: 1, title: 'Weekly Q&A', date: 'Tomorrow, 5:00 PM GMT+1', time: '17:00', host: 'Ade Adeyemi', meetingRoom: 'room-123' }
        ],
        experts: [
          {
            id: 'exp-1',
            name: 'Ade Adeyemi',
            role: 'Lead Data Analytics Instructor',
            subjects: 'Python, SQL, PowerBI, Machine Learning',
            hourlyRate: 6500,
            rating: 4.9,
            reviewsCount: 52,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            bio: 'Senior Data Architect & Career Coach. Over 8 years industry experience helping students land tech roles.',
            verified: true
          },
          {
            id: 'exp-2',
            name: 'Chinwe Uche',
            role: 'Resident Project Reviewer & TA',
            subjects: 'Data Visualization & Portfolio Projects',
            hourlyRate: 4500,
            rating: 4.8,
            reviewsCount: 29,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            bio: 'Data Analyst & Teaching Assistant. Leads weekly portfolio review office hours.',
            verified: true
          }
        ]
      },
      {
        id: 'comm-2',
        name: "Calculus & Advanced Math Circle",
        slug: 'calculus-advanced-math-circle',
        category: 'Mathematics & Sciences',
        tagline: 'Master pure mathematics and calculus.',
        communityType: 'Tutor Masterclass',
        banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        creator: 'Dr. Chiamaka Eze',
        creatorRole: 'PhD Pure Mathematics',
        membersCount: 821,
        isEnrolled: true,
        monthlyPrice: 0,
        accessType: 'free',
        modules: [
            {
              id: 1, title: 'Module 1: Foundations of Integration', progress: 100, lessons: [
                { title: 'Anti-derivatives intro', duration: '12:45', type: 'video', completed: true },
                { title: 'Indefinite Integrals Worksheet', duration: 'PDF', type: 'doc', completed: true }
              ]
            },
            {
              id: 2, title: 'Module 2: Advanced Techniques', progress: 40, lessons: [
                { title: 'Integration by Parts', duration: '18:20', type: 'video', completed: true },
                { title: 'Trigonometric Substitution', duration: '24:10', type: 'video', completed: false },
                { title: 'Module 2 Practice Set', duration: 'Quiz', type: 'doc', completed: false }
              ]
            }
        ],
        events: [
            { id: 1, title: 'Weekly Integration Live Q&A', date: 'Tomorrow, 5:00 PM GMT+1', time: '17:00', host: 'Dr. Chiamaka Eze', meetingRoom: 'room-123' }
        ],
        experts: [
          {
            id: 'exp-1',
            name: 'Dr. Chiamaka Eze',
            role: 'Lead Subject Instructor',
            subjects: 'Advanced Calculus, Differential Equations',
            hourlyRate: 7500,
            rating: 4.9,
            reviewsCount: 48,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            bio: 'PhD Pure Mathematics, 8+ years university teaching & research experience. Leads live masterclasses and exam cohorts.',
            verified: true
          },
          {
            id: 'exp-2',
            name: 'Daniel Okafor',
            role: 'Resident Teaching Assistant (TA)',
            subjects: 'Linear Algebra, Mechanics, Problem Sessions',
            hourlyRate: 5000,
            rating: 4.8,
            reviewsCount: 34,
            avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=300&q=80',
            bio: 'Senior Math Tutor & Engineering TA. Runs weekly problem-solving breakout sessions and answers student questions.',
            verified: true
          }
        ]
      }
    ];

    try {
      const saved = localStorage.getItem('akademi_communities');
      let all = saved ? JSON.parse(saved) : defaultCommunities;
      let found = all.find((c: any) => c.id === id || c.slug === id);
      if (found) {
        return {
          ...found,
          modules: found.modules || defaultCommunities[1].modules,
          events: found.events || defaultCommunities[1].events,
          experts: found.experts || defaultCommunities[1].experts,
          communityType: found.communityType || (found.creatorRole?.toLowerCase().includes('tutor') ? 'Tutor Masterclass' : 'Peer Study Hub'),
          banner: found.coverImage || found.banner || defaultCommunities[0].banner,
          avatar: found.creatorAvatar || found.avatar || defaultCommunities[0].avatar,
          creator: found.creatorName || found.creator || 'Community Creator',
          creatorRole: found.creatorRole || 'Host',
          membersCount: found.membersCount || 120,
          isEnrolled: true,
          monthlyPrice: found.monthlyPrice || 0,
          accessType: found.accessType || 'free'
        };
      }
    } catch (e) {}

    return defaultCommunities[1];
  });

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const isOwner = Boolean(
    (user?.name && community?.creator && user.name.toLowerCase().trim() === community.creator.toLowerCase().trim()) ||
    (user?.email && community?.creatorEmail && user.email.toLowerCase().trim() === community.creatorEmail.toLowerCase().trim()) ||
    (user?.name && community?.creatorName && user.name.toLowerCase().trim() === community.creatorName.toLowerCase().trim())
  );
  const isSuperAdmin = Boolean(user?.role === 'super_admin' || user?.role === 'admin');
  const canEditCommunity = Boolean(isOwner || isSuperAdmin);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(() => {
    try {
      const joined = JSON.parse(localStorage.getItem('akademi_joined_communities') || '[]');
      if (joined.includes(id) || joined.includes(community?.id)) return true;
    } catch (e) {}
    return true; // Default enrolled
  });

  const handleToggleEnroll = () => {
    if (isEnrolled) {
      setIsEnrolled(false);
      setCommunity((prev: any) => ({
        ...prev,
        membersCount: Math.max(1, (prev.membersCount || 1) - 1)
      }));
      try {
        const joined = JSON.parse(localStorage.getItem('akademi_joined_communities') || '[]');
        const next = joined.filter((jId: string) => jId !== community.id && jId !== id);
        localStorage.setItem('akademi_joined_communities', JSON.stringify(next));
      } catch (e) {}
      showToast(`Left ${community.name}. You can rejoin anytime!`);
    } else {
      setIsEnrolled(true);
      setCommunity((prev: any) => ({
        ...prev,
        membersCount: (prev.membersCount || 0) + 1
      }));
      try {
        const joined = JSON.parse(localStorage.getItem('akademi_joined_communities') || '[]');
        if (!joined.includes(community.id)) {
          joined.push(community.id);
          localStorage.setItem('akademi_joined_communities', JSON.stringify(joined));
        }
      } catch (e) {}
      showToast(`🎉 Joined ${community.name}! You now have full member access.`);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: community.name,
      text: `Join ${community.name} on Akademi!`,
      url: url,
    };
    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showToast("✓ Shared successfully!");
        return;
      } catch (err) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("🔗 Community invite link copied to clipboard!");
    } catch (e) {
      showToast("🔗 Link: " + url);
    }
  };

  const saveCommunity = (updated: any) => {
    if (!canEditCommunity) {
      showToast("⚠️ Permission Denied: Only the creator or Super Admin can edit this hub.");
      return;
    }
    setCommunity(updated);
    try {
      const saved = localStorage.getItem('akademi_communities');
      let all = saved ? JSON.parse(saved) : [];
      const idx = all.findIndex((c: any) => c.id === updated.id);
      if (idx !== -1) {
        all[idx] = updated;
      } else {
        all.push(updated);
      }
      localStorage.setItem('akademi_communities', JSON.stringify(all));
    } catch (e) {}
    setIsStudioOpen(false);
    showToast("✓ Community profile and content vault updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] font-sans pb-20">
      {isAdmin && (
        <div className="bg-slate-900 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <ShieldCheck className="w-5 h-5" /> 🛡️ Super Admin Community Controls
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/communities" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
              📊 Open in Admin Console
            </Link>
          </div>
        </div>
      )}
      
      {/* Header / Banner */}
      <div className="relative min-h-[300px] md:min-h-[340px] w-full bg-slate-900 flex flex-col justify-between p-6 md:p-8">
        <img 
          src={community.banner} 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent pointer-events-none" />
        
        {/* Navigation Breadcrumb & Top Bar Actions */}
        <div className="relative z-10 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <Link to="/dashboard/communities" className="text-white/80 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            &larr; Back to Communities
          </Link>

          {canEditCommunity && (
            <button 
              type="button"
              onClick={() => setIsStudioOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all cursor-pointer ring-2 ring-amber-400/50 active:scale-95"
            >
              <Settings className="w-4 h-4 text-slate-950" />
              <span>{isSuperAdmin && !isOwner ? '🛡️ Super Admin Editor' : '⚙️ Author Studio & Settings'}</span>
            </button>
          )}
        </div>

        {/* Header Content Info */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 max-w-7xl mx-auto w-full pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border-4 border-[#FBF9F4] overflow-hidden shrink-0 shadow-xl bg-white relative">
              <img 
                src={getAvatarUrl(community.creator, community.avatar)} 
                alt="Creator" 
                onError={(e) => handleImageError(e, community.creator)}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md inline-block">
                  {community.category}
                </span>
                <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block",
                  community.communityType === 'Tutor Masterclass' ? "bg-amber-400 text-amber-950 font-black" : "bg-blue-400 text-blue-950 font-black"
                )}>
                  {community.communityType === 'Tutor Masterclass' ? '🎓 Tutor Masterclass' : '👥 Peer Study Hub'}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-1">
                {community.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> By {community.creator} ({community.creatorRole})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users2 className="w-4 h-4" /> {community.membersCount?.toLocaleString()} Members
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0 pb-1">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Share community invite link"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Share</span>
            </button>
            
            {isOwner ? (
              <div className="px-4 py-2.5 bg-amber-400/20 border border-amber-300/50 backdrop-blur-md rounded-xl text-amber-200 text-xs font-extrabold shadow-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>👑 Community Host & Creator</span>
              </div>
            ) : isSuperAdmin ? (
              <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-md rounded-xl text-emerald-200 text-xs font-extrabold shadow-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>🛡️ Platform Super Admin</span>
              </div>
            ) : (
              <button 
                type="button"
                onClick={handleToggleEnroll}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95",
                  isEnrolled 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                    : "bg-[#0F5338] hover:bg-[#0A3D29] text-white"
                )}
                title={isEnrolled ? "Click to leave community" : "Click to join community"}
              >
                {isEnrolled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enrolled Member</span>
                  </>
                ) : (
                  <span>Join Community Space</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl shadow-2xs border border-[#E8E3D7]">
          {[
            { id: 'community', label: 'Community', icon: MessageSquare },
            { id: 'classroom', label: 'Classroom', icon: BookOpen },
            { id: 'events', label: 'Events & Live', icon: Calendar },
            { id: 'experts', label: 'Resident Experts', icon: Users2 },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'ai', label: 'AI Companion', icon: Bot },
            ...(canEditCommunity ? [{ id: 'studio', label: '⚙️ Creator Studio', icon: Settings }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'studio') {
                  setIsStudioOpen(true);
                } else {
                  setActiveTab(tab.id as TabType);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-[#0F5338] text-white shadow-sm" 
                  : tab.id === 'studio'
                    ? "bg-amber-50 text-amber-900 border border-amber-300 font-black hover:bg-amber-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'community' && <CommunityTab user={user} isAdmin={isAdmin} community={community} showToast={showToast} />}
                {activeTab === 'classroom' && <ClassroomTab modules={community.modules} setCommunity={setCommunity} canEdit={canEditCommunity} showToast={showToast} onOpenStudio={() => setIsStudioOpen(true)} />}
                {activeTab === 'events' && <EventsTab events={community.events} setCommunity={setCommunity} canEdit={canEditCommunity} showToast={showToast} />}
                {activeTab === 'experts' && <ExpertsTab community={community} setCommunity={setCommunity} canEdit={canEditCommunity} showToast={showToast} onOpenStudio={() => setIsStudioOpen(true)} />}
                {activeTab === 'leaderboard' && <LeaderboardTab />}
                {activeTab === 'ai' && <AITab />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <SidebarWidgets canEdit={canEditCommunity} onOpenStudio={() => setIsStudioOpen(true)} />
          </div>
        </div>
      </div>

      {isStudioOpen && (
        <CreatorStudioModal 
          community={community} 
          onClose={() => setIsStudioOpen(false)} 
          onSave={saveCommunity} 
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 font-semibold text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Creator Studio Modal ---
function CreatorStudioModal({ community, onClose, onSave }: { community: any, onClose: () => void, onSave: (c: any) => void }) {
  const [activeTab, setActiveTab] = useState(1);
  const [editComm, setEditComm] = useState({ ...community });

  const [newExpName, setNewExpName] = useState('');
  const [newExpRole, setNewExpRole] = useState('Resident Teaching Assistant (TA)');
  const [newExpSubjects, setNewExpSubjects] = useState('');
  const [newExpRate, setNewExpRate] = useState<number>(5000);
  const [newExpBio, setNewExpBio] = useState('');
  const [newExpAvatar, setNewExpAvatar] = useState('');

  const PRESET_TUTORS = [
    {
      name: 'Dr. Babatunde Lawal',
      role: 'Lead Physics & Applied Math Specialist',
      subjects: 'Pure Math, Calculus, Mechanics',
      hourlyRate: 8000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'PhD Applied Physics. 10+ years coaching university exam candidates.'
    },
    {
      name: 'Daniel Okafor',
      role: 'Resident Teaching Assistant (TA)',
      subjects: 'Linear Algebra, Calculus Problem Sets',
      hourlyRate: 5000,
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Math Tutor & Engineering TA. Leads weekly problem-solving breakout sessions.'
    },
    {
      name: 'Adaeze Nwosu',
      role: 'Resident Essay Coach & Mentor',
      subjects: 'Academic Writing, Critical Thinking',
      hourlyRate: 6000,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Master of Arts. Specialist in structured problem decomposition and essays.'
    },
    {
      name: 'Dr. Ibrahim Sanni',
      role: 'Economics & Commerce Mentor',
      subjects: 'Microeconomics, Econometrics',
      hourlyRate: 7000,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Economics Lecturer and Industry Quant Analyst.'
    },
    {
      name: 'Chinwe Uche',
      role: 'Resident Project Reviewer & TA',
      subjects: 'Data Projects, Portfolio Reviews',
      hourlyRate: 4500,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Biochemist & Senior Tutor. Answers student questions in community threads.'
    }
  ];

  const handleSelectPreset = (tutorName: string) => {
    const found = PRESET_TUTORS.find(t => t.name === tutorName);
    if (found) {
      setNewExpName(found.name);
      setNewExpRole(found.role);
      setNewExpSubjects(found.subjects);
      setNewExpRate(found.hourlyRate);
      setNewExpBio(found.bio);
      setNewExpAvatar(found.avatar);
    }
  };

  const handleAddExpert = () => {
    if (!newExpName.trim()) return;

    const expObj = {
      id: `exp-${Date.now()}`,
      name: newExpName.trim(),
      role: newExpRole.trim() || 'Resident Teaching Assistant (TA)',
      subjects: newExpSubjects.trim() || 'General Subject Mentorship',
      hourlyRate: Number(newExpRate) || 5000,
      rating: 4.9,
      reviewsCount: 1,
      avatar: newExpAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bio: newExpBio.trim() || 'Verified resident tutor supporting community Q&A and 1-on-1 tutoring.',
      verified: true
    };

    setEditComm({
      ...editComm,
      experts: [...(editComm.experts || []), expObj]
    });

    setNewExpName('');
    setNewExpSubjects('');
    setNewExpBio('');
    setNewExpAvatar('');
  };

  const handleSave = () => {
    onSave(editComm);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#0F5338]" /> Creator Studio
            </h2>
            <p className="text-xs text-slate-500 mt-1">Manage your community settings and content</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 1, label: 'Brand & Creator Profile', icon: Edit2 },
              { id: 2, label: 'Access & Pricing', icon: Lock },
              { id: 3, label: 'Classroom & Content Vault', icon: BookOpen },
              { id: 4, label: 'Events & Masterclasses', icon: Calendar },
              { id: 5, label: 'Resident Experts & Staff', icon: Users2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                  activeTab === tab.id ? "bg-[#0F5338] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {activeTab === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Community Brand</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Community Name</label>
                      <input value={editComm.name} onChange={e => setEditComm({...editComm, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Slug URL</label>
                      <input value={editComm.slug} onChange={e => setEditComm({...editComm, slug: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700">Tagline</label>
                      <input value={editComm.tagline || ''} onChange={e => setEditComm({...editComm, tagline: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Category</label>
                      <input value={editComm.category} onChange={e => setEditComm({...editComm, category: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700">Cover Banner URL</label>
                      <input value={editComm.banner} onChange={e => setEditComm({...editComm, banner: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Creator Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Creator Name</label>
                      <input value={editComm.creator} onChange={e => setEditComm({...editComm, creator: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Role / Bio (e.g. PhD Pure Math)</label>
                      <input value={editComm.creatorRole} onChange={e => setEditComm({...editComm, creatorRole: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-slate-700">Creator Avatar URL</label>
                      <input value={editComm.avatar} onChange={e => setEditComm({...editComm, avatar: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Access & Pricing</h3>
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={() => setEditComm({...editComm, accessType: 'free', monthlyPrice: 0})}
                    className={cn("px-6 py-3 rounded-xl border text-sm font-bold flex-1 transition-all", editComm.accessType === 'free' ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50")}
                  >
                    Free Access
                  </button>
                  <button 
                    onClick={() => setEditComm({...editComm, accessType: 'paid'})}
                    className={cn("px-6 py-3 rounded-xl border text-sm font-bold flex-1 transition-all", editComm.accessType === 'paid' ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "border-slate-200 text-slate-600 hover:bg-slate-50")}
                  >
                    Paid Membership
                  </button>
                </div>
                
                {editComm.accessType === 'paid' && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block mb-2">Monthly Price (₦)</label>
                    <div className="relative mb-4">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₦</span>
                      <input 
                        type="number" 
                        value={editComm.monthlyPrice} 
                        onChange={e => setEditComm({...editComm, monthlyPrice: Number(e.target.value)})}
                        className="w-full border border-slate-300 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-slate-900"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-200 mb-2">
                      <span>Platform Fee (10%)</span>
                      <span className="font-bold text-red-500">- ₦{(editComm.monthlyPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-900 font-bold">
                      <span>Your Estimated Earnings / Member</span>
                      <span className="text-emerald-600">₦{(editComm.monthlyPrice * 0.9).toFixed(2)} / month</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Content Vault</h3>
                  <button 
                    onClick={() => {
                      const newModule = { id: Date.now(), title: 'New Module', progress: 0, lessons: [] };
                      setEditComm({...editComm, modules: [...(editComm.modules || []), newModule]});
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5338] text-white text-xs font-bold rounded-lg hover:bg-[#0A3D29]"
                  >
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                <div className="space-y-4">
                  {(editComm.modules || []).map((mod: any, mIdx: number) => (
                    <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 p-3 flex items-center justify-between border-b border-slate-200">
                        <input 
                          value={mod.title}
                          onChange={(e) => {
                            const newMods = [...editComm.modules];
                            newMods[mIdx].title = e.target.value;
                            setEditComm({...editComm, modules: newMods});
                          }}
                          className="bg-white border border-slate-200 px-2 py-1 rounded text-sm font-bold w-2/3"
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const newMods = [...editComm.modules];
                              newMods[mIdx].lessons.push({ title: 'New Lesson', type: 'video', duration: '10:00', completed: false, link: '' });
                              setEditComm({...editComm, modules: newMods});
                            }}
                            className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded"
                          >
                            + Lesson
                          </button>
                          <button 
                            onClick={() => {
                              const newMods = editComm.modules.filter((_: any, i: number) => i !== mIdx);
                              setEditComm({...editComm, modules: newMods});
                            }}
                            className="text-xs text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 space-y-2 bg-white">
                        {mod.lessons.map((lesson: any, lIdx: number) => (
                          <div key={lIdx} className="flex flex-wrap gap-2 items-center border border-slate-100 p-2 rounded-lg bg-slate-50/50">
                            <select 
                              value={lesson.type}
                              onChange={(e) => {
                                const newMods = [...editComm.modules];
                                newMods[mIdx].lessons[lIdx].type = e.target.value;
                                setEditComm({...editComm, modules: newMods});
                              }}
                              className="text-xs border border-slate-200 rounded p-1 bg-white"
                            >
                              <option value="video">Video</option>
                              <option value="doc">PDF Document</option>
                            </select>
                            <input 
                              value={lesson.title}
                              placeholder="Lesson Title"
                              onChange={(e) => {
                                const newMods = [...editComm.modules];
                                newMods[mIdx].lessons[lIdx].title = e.target.value;
                                setEditComm({...editComm, modules: newMods});
                              }}
                              className="text-xs border border-slate-200 rounded p-1 bg-white flex-1 min-w-[120px]"
                            />
                            <input 
                              value={lesson.duration}
                              placeholder="Duration"
                              onChange={(e) => {
                                const newMods = [...editComm.modules];
                                newMods[mIdx].lessons[lIdx].duration = e.target.value;
                                setEditComm({...editComm, modules: newMods});
                              }}
                              className="text-xs border border-slate-200 rounded p-1 bg-white w-20"
                            />
                            <input 
                              value={lesson.link || ''}
                              placeholder="Resource Link URL"
                              onChange={(e) => {
                                const newMods = [...editComm.modules];
                                newMods[mIdx].lessons[lIdx].link = e.target.value;
                                setEditComm({...editComm, modules: newMods});
                              }}
                              className="text-xs border border-slate-200 rounded p-1 bg-white w-32"
                            />
                            <button 
                              onClick={() => {
                                const newMods = [...editComm.modules];
                                newMods[mIdx].lessons = newMods[mIdx].lessons.filter((_: any, i: number) => i !== lIdx);
                                setEditComm({...editComm, modules: newMods});
                              }}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {mod.lessons.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No lessons in this module.</p>}
                      </div>
                    </div>
                  ))}
                  {(!editComm.modules || editComm.modules.length === 0) && (
                    <div className="text-center py-8 text-slate-500 text-sm">No modules yet. Click "Add Module" to start.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-900">Events & Masterclasses</h3>
                  <button 
                    onClick={() => {
                      const newEvent = { id: Date.now(), title: 'New Workshop', date: 'Upcoming', time: '12:00', host: editComm.creator, meetingRoom: '' };
                      setEditComm({...editComm, events: [...(editComm.events || []), newEvent]});
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5338] text-white text-xs font-bold rounded-lg hover:bg-[#0A3D29]"
                  >
                    <Plus className="w-4 h-4" /> Schedule Event
                  </button>
                </div>

                <div className="space-y-3">
                  {(editComm.events || []).map((ev: any, idx: number) => (
                    <div key={ev.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
                      <button 
                        onClick={() => {
                          const newEvents = editComm.events.filter((_: any, i: number) => i !== idx);
                          setEditComm({...editComm, events: newEvents});
                        }}
                        className="absolute right-3 top-3 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
                          <input 
                            value={ev.title}
                            onChange={(e) => {
                              const newEvents = [...editComm.events];
                              newEvents[idx].title = e.target.value;
                              setEditComm({...editComm, events: newEvents});
                            }}
                            className="w-full text-sm border border-slate-200 rounded p-1.5 mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                          <input 
                            value={ev.date}
                            onChange={(e) => {
                              const newEvents = [...editComm.events];
                              newEvents[idx].date = e.target.value;
                              setEditComm({...editComm, events: newEvents});
                            }}
                            className="w-full text-sm border border-slate-200 rounded p-1.5 mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Host Name</label>
                          <input 
                            value={ev.host}
                            onChange={(e) => {
                              const newEvents = [...editComm.events];
                              newEvents[idx].host = e.target.value;
                              setEditComm({...editComm, events: newEvents});
                            }}
                            className="w-full text-sm border border-slate-200 rounded p-1.5 mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Meeting Room ID / Link</label>
                          <input 
                            value={ev.meetingRoom}
                            onChange={(e) => {
                              const newEvents = [...editComm.events];
                              newEvents[idx].meetingRoom = e.target.value;
                              setEditComm({...editComm, events: newEvents});
                            }}
                            className="w-full text-sm border border-slate-200 rounded p-1.5 mt-1 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!editComm.events || editComm.events.length === 0) && (
                    <div className="text-center py-8 text-slate-500 text-sm">No events scheduled.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 5 && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-[#0F5338]" /> Resident Experts & Teaching Staff
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Assign subject instructors, teaching assistants (TAs), and mentors to answer Q&A and provide 1-on-1 tutoring.
                  </p>
                </div>

                {/* Add New Expert Form */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-600" /> Add New Resident Expert
                    </h4>
                    <span className="text-[11px] text-slate-500">Pick from verified tutors or enter custom details</span>
                  </div>

                  {/* Preset Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Quick Select Verified Platform Tutor</label>
                    <select
                      onChange={(e) => handleSelectPreset(e.target.value)}
                      defaultValue=""
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-800"
                    >
                      <option value="" disabled>-- Select a Verified Akademi Tutor --</option>
                      {PRESET_TUTORS.map((t) => (
                        <option key={t.name} value={t.name}>
                          {t.name} ({t.role} · ₦{t.hourlyRate.toLocaleString()}/hr)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Expert Name *</label>
                      <input
                        type="text"
                        value={newExpName}
                        onChange={(e) => setNewExpName(e.target.value)}
                        placeholder="e.g. Daniel Okafor"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Community Role / Title *</label>
                      <input
                        type="text"
                        value={newExpRole}
                        onChange={(e) => setNewExpRole(e.target.value)}
                        placeholder="e.g. Resident TA & Problem Coach"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Subjects & Specialties</label>
                      <input
                        type="text"
                        value={newExpSubjects}
                        onChange={(e) => setNewExpSubjects(e.target.value)}
                        placeholder="e.g. Pure Mathematics, Linear Algebra"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">1-on-1 Hourly Rate (₦)</label>
                      <input
                        type="number"
                        value={newExpRate}
                        onChange={(e) => setNewExpRate(Number(e.target.value))}
                        placeholder="5000"
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Bio & Teaching Credential</label>
                      <input
                        type="text"
                        value={newExpBio}
                        onChange={(e) => setNewExpBio(e.target.value)}
                        placeholder="e.g. 5+ years experience teaching engineering students and solving complex exam questions."
                        className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 mt-1"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddExpert}
                    disabled={!newExpName.trim()}
                    className="w-full py-2.5 bg-[#0F5338] disabled:opacity-40 text-white rounded-xl text-xs font-bold hover:bg-[#0A3D29] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Resident Expert to Teaching Staff
                  </button>
                </div>

                {/* Current Staff List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Community Experts ({(editComm.experts || []).length})
                  </h4>

                  {(editComm.experts || []).map((exp: any, idx: number) => (
                    <div key={exp.id || idx} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img src={exp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} alt={exp.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-slate-900">{exp.name}</h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F5338] font-extrabold border border-emerald-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> {exp.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{exp.subjects}</p>
                          <p className="text-xs font-bold text-emerald-800 mt-0.5">₦{(exp.hourlyRate || 5000).toLocaleString()}/hr · ⭐ {exp.rating || 4.9}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editComm.experts || []).filter((_: any, i: number) => i !== idx);
                          setEditComm({ ...editComm, experts: updated });
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Expert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {(!editComm.experts || editComm.experts.length === 0) && (
                    <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No resident experts assigned yet. Use the form above to add teaching assistants or mentors.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-[#0F5338] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#0A3D29] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Tabs Implementations ---

function CommunityTab({ user, isAdmin, community, showToast }: any) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: community.creator,
      authorRole: community.creatorRole,
      avatar: community.avatar,
      title: 'Welcome to the Hub! 🚀',
      content: "Hi everyone! Welcome to our community space. Make sure to check the Classroom tab for the latest modules and events.",
      likes: 45,
      comments: 2,
      time: '2h ago',
      isPinned: true,
      commentsList: [
        {
          id: 101,
          author: 'David Olu',
          authorRole: 'Member',
          avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&q=80',
          time: '1h ago',
          content: 'Excited to be here! Looking forward to the live masterclass.',
          likes: 3,
          replies: []
        },
        {
          id: 102,
          author: 'Ngozi Eze',
          authorRole: 'Member',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
          time: '35m ago',
          content: 'Just checked the worksheets in Module 1, super comprehensive!',
          likes: 1,
          replies: []
        }
      ]
    },
    {
      id: 2,
      author: 'David Olu',
      authorRole: 'Member',
      avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&q=80',
      title: 'Stuck on the latest practice assignment',
      content: 'Can someone explain how to approach question 4 from the worksheet? I keep getting a different answer.',
      likes: 8,
      comments: 1,
      time: '5h ago',
      isPinned: false,
      commentsList: [
        {
          id: 201,
          author: community.creator,
          authorRole: community.creatorRole,
          avatar: community.avatar,
          time: '3h ago',
          content: 'Hi David! Remember to apply the chain rule first before expanding the polynomial.',
          likes: 5,
          replies: [
            {
              id: 301,
              author: 'David O.',
              authorRole: 'Member',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
              time: '2h ago',
              content: 'Got it, thank you! That made step 3 work out evenly.',
              likes: 2,
              replyingTo: community.creator
            }
          ]
        }
      ]
    }
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(1);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [likedPostIds, setLikedPostIds] = useState<number[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<number[]>([]);
  
  // Nested Replies State
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [likedReplyIds, setLikedReplyIds] = useState<number[]>([]);

  const handleLikePost = (postId: number) => {
    if (likedPostIds.includes(postId)) {
      setLikedPostIds(likedPostIds.filter(id => id !== postId));
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
      showToast("Removed like from post.");
    } else {
      setLikedPostIds([...likedPostIds, postId]);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      showToast("❤️ Liked post!");
    }
  };

  const handleLikeComment = (postId: number, commentId: number) => {
    if (likedCommentIds.includes(commentId)) {
      setLikedCommentIds(likedCommentIds.filter(id => id !== commentId));
      setPosts(posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsList: (p.commentsList || []).map(c => c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c)
        };
      }));
      showToast("Removed like from comment.");
    } else {
      setLikedCommentIds([...likedCommentIds, commentId]);
      setPosts(posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsList: (p.commentsList || []).map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
        };
      }));
      showToast("❤️ Liked comment!");
    }
  };

  const handleLikeReply = (postId: number, commentId: number, replyId: number) => {
    if (likedReplyIds.includes(replyId)) {
      setLikedReplyIds(likedReplyIds.filter(id => id !== replyId));
      setPosts(posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsList: (p.commentsList || []).map((c: any) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, likes: Math.max(0, r.likes - 1) } : r)
            };
          })
        };
      }));
      showToast("Removed like from reply.");
    } else {
      setLikedReplyIds([...likedReplyIds, replyId]);
      setPosts(posts.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          commentsList: (p.commentsList || []).map((c: any) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, likes: (r.likes || 0) + 1 } : r)
            };
          })
        };
      }));
      showToast("❤️ Liked reply!");
    }
  };

  const handleAddComment = (postId: number) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      author: user?.name || 'You',
      authorRole: user?.role === 'tutor' ? 'Tutor' : user?.role === 'admin' ? 'Super Admin' : 'Member',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
      time: 'Just now',
      content: text,
      likes: 0,
      replies: []
    };

    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const updatedList = [...(p.commentsList || []), newComment];
      return {
        ...p,
        commentsList: updatedList,
        comments: updatedList.length
      };
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
    showToast("✓ Comment posted successfully!");
  };

  const handleAddReply = (postId: number, commentId: number, replyingToAuthor: string) => {
    const text = (replyInputs[commentId] || '').trim();
    if (!text) return;

    const newReply = {
      id: Date.now(),
      author: user?.name || 'You',
      authorRole: user?.role === 'tutor' ? 'Verified Tutor' : user?.role === 'admin' ? 'Super Admin' : 'Member',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
      time: 'Just now',
      content: text,
      likes: 0,
      replyingTo: replyingToAuthor
    };

    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        commentsList: (p.commentsList || []).map((c: any) => {
          if (c.id !== commentId) return c;
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        })
      };
    }));

    setReplyInputs({ ...replyInputs, [commentId]: '' });
    setReplyingToCommentId(null);
    showToast(`✓ Reply posted to ${replyingToAuthor}!`);
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    showToast("Post deleted successfully.");
  };

  const handleSharePost = async (post: any) => {
    const url = `${window.location.href}#post-${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("🔗 Post link copied to clipboard!");
    } catch (e) {
      showToast("🔗 Link: " + url);
    }
  };

  const handlePostSubmit = () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) return;
    const newPost = {
      id: Date.now(),
      author: user?.name || 'You',
      authorRole: user?.role === 'tutor' ? 'Verified Tutor' : user?.role === 'admin' ? 'Platform Admin' : 'Member',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
      title: newPostTitle,
      content: newPostBody,
      likes: 0,
      comments: 0,
      time: 'Just now',
      isPinned: false,
      commentsList: []
    };
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostBody('');
    showToast("✓ Discussion post published!");
  };

  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Start a Discussion</h3>
        <input 
          type="text" 
          placeholder="Discussion Title..."
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-t-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-[-1px]"
        />
        <textarea 
          placeholder="Share your question, insight, or resource with the community..."
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
          rows={3}
          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-b-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold cursor-pointer hover:bg-slate-200">#General</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold cursor-pointer hover:bg-slate-200">#Q&A</span>
          </div>
          <button 
            type="button"
            onClick={handlePostSubmit} 
            className="px-4 py-2 bg-[#0F5338] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#0A3D29] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Post Discussion
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => {
          const isLiked = likedPostIds.includes(post.id);
          const isCommentsOpen = openCommentsPostId === post.id;
          const currentCommentInput = commentInputs[post.id] || '';

          return (
            <div 
              key={post.id} 
              id={`post-${post.id}`}
              className={cn("bg-white rounded-2xl border p-5 shadow-2xs relative transition-all", post.isPinned ? "border-emerald-300 ring-1 ring-emerald-200" : "border-[#E8E3D7]")}
            >
              {isAdmin && (
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-md text-xs font-bold transition-colors cursor-pointer"
                  title="Super Admin Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {post.isPinned && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 mb-3 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Pinned Announcement
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={getAvatarUrl(post.author, post.avatar)} 
                    alt={post.author} 
                    onError={(e) => handleImageError(e, post.author)}
                    className="w-10 h-10 rounded-full object-cover shadow-xs border border-slate-200" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{post.author}</h4>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-md font-bold",
                        post.authorRole?.includes('Tutor') ? "bg-amber-100 text-amber-800" : 
                        post.authorRole === 'Peer Study Leader' ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                      )}>
                        {post.authorRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{post.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pr-6">
                <h3 className="text-base font-bold text-slate-900 mb-2">{post.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{post.content}</p>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => handleLikePost(post.id)} 
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                      isLiked 
                        ? "bg-rose-50 text-rose-600 border border-rose-200" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                    title={isLiked ? "Click to unlike (1 like per user)" : "Click to like (1 like per user)"}
                  >
                    <Heart className={cn("w-4 h-4", isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
                    <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)} 
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer",
                      isCommentsOpen 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>{post.comments || (post.commentsList || []).length} Comments</span>
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => handleSharePost(post)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                  title="Copy post link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Threaded Comments Section */}
              {isCommentsOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-[#FBF9F4]/70 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Discussion Comments ({(post.commentsList || []).length})
                  </h4>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {(post.commentsList || []).map((comment: any) => {
                      const isCommentLiked = likedCommentIds.includes(comment.id);
                      const isReplying = replyingToCommentId === comment.id;
                      const currentReplyInput = replyInputs[comment.id] || '';

                      return (
                        <div key={comment.id} className="bg-white rounded-2xl p-4 border border-[#E8E3D7] shadow-2xs">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <img 
                                src={getAvatarUrl(comment.author, comment.avatar)} 
                                alt={comment.author} 
                                onError={(e) => handleImageError(e, comment.author)}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                              />
                              <span className="text-xs font-bold text-slate-900">{comment.author}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">{comment.authorRole}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed pl-8 pr-2 mb-2">
                            {comment.content}
                          </p>
                          <div className="pl-8 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleLikeComment(post.id, comment.id)}
                              className={cn(
                                "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                                isCommentLiked ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-slate-600"
                              )}
                              title="1 like per comment allowed"
                            >
                              <Heart className={cn("w-3 h-3", isCommentLiked ? "fill-rose-500 text-rose-500" : "")} />
                              <span>{comment.likes || 0}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setReplyingToCommentId(isReplying ? null : comment.id)}
                              className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 transition-all cursor-pointer"
                            >
                              <CornerDownRight className="w-3 h-3 text-emerald-600" />
                              <span>Reply</span>
                            </button>
                          </div>

                          {/* Inline Reply Composer */}
                          {isReplying && (
                            <div className="mt-3 pl-8 pt-3 border-t border-slate-100 flex flex-col gap-2">
                              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                                <span className="flex items-center gap-1">
                                  <CornerDownRight className="w-3 h-3 text-emerald-600" />
                                  Replying to <strong className="text-slate-800 font-bold">{comment.author}</strong>
                                </span>
                                <button 
                                  type="button" 
                                  onClick={() => setReplyingToCommentId(null)}
                                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text"
                                  placeholder={`Reply to ${comment.author}...`}
                                  value={currentReplyInput}
                                  onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddReply(post.id, comment.id, comment.author);
                                    }
                                  }}
                                  className="flex-1 bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddReply(post.id, comment.id, comment.author)}
                                  disabled={!currentReplyInput.trim()}
                                  className="px-3.5 py-2 bg-[#0F5338] disabled:opacity-40 text-white rounded-xl text-xs font-bold hover:bg-[#0A3D29] transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Nested Replies List */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 pt-2 pl-3 sm:pl-5 border-l-2 border-emerald-400/50 space-y-2.5 ml-4 sm:ml-6">
                              {comment.replies.map((reply: any) => {
                                const isReplyLiked = likedReplyIds.includes(reply.id);

                                return (
                                  <div key={reply.id} className="bg-[#FBF9F4] rounded-xl p-3 border border-[#E8E3D7]/80 shadow-2xs">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <img 
                                          src={getAvatarUrl(reply.author, reply.avatar)} 
                                          alt={reply.author} 
                                          onError={(e) => handleImageError(e, reply.author)}
                                          className="w-5 h-5 rounded-full object-cover border border-slate-200" 
                                        />
                                        <span className="text-xs font-bold text-slate-900">{reply.author}</span>
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-slate-600 font-semibold border border-slate-200/80">{reply.authorRole}</span>
                                        {reply.replyingTo && (
                                          <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                            @{reply.replyingTo}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-medium">{reply.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-700 leading-relaxed pl-7 pr-1 mb-1.5">
                                      {reply.content}
                                    </p>
                                    <div className="pl-7 flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleLikeReply(post.id, comment.id, reply.id)}
                                        className={cn(
                                          "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer",
                                          isReplyLiked ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-slate-600"
                                        )}
                                        title="1 like per reply"
                                      >
                                        <Heart className={cn("w-2.5 h-2.5", isReplyLiked ? "fill-rose-500 text-rose-500" : "")} />
                                        <span>{reply.likes || 0}</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {(!post.commentsList || post.commentsList.length === 0) && (
                      <p className="text-xs text-slate-400 py-2 text-center">No comments yet. Start the conversation below!</p>
                    )}
                  </div>

                  {/* Comment Input Box */}
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="text"
                      placeholder="Write a helpful reply or comment..."
                      value={currentCommentInput}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                      className="flex-1 bg-white border border-[#E8E3D7] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!currentCommentInput.trim()}
                      className="px-4 py-2.5 bg-[#0F5338] disabled:opacity-40 text-white rounded-xl text-xs font-bold hover:bg-[#0A3D29] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {posts.length === 0 && <p className="text-center text-slate-500 py-6">No posts yet. Be the first to start a discussion!</p>}
      </div>
    </div>
  );
}

function ClassroomTab({ modules, setCommunity, canEdit, showToast, onOpenStudio }: any) {
  const toggleLesson = (mIdx: number, lIdx: number) => {
    setCommunity((prev: any) => {
      const newMods = [...(prev.modules || [])];
      newMods[mIdx].lessons[lIdx].completed = !newMods[mIdx].lessons[lIdx].completed;
      return { ...prev, modules: newMods };
    });
    showToast("Lesson progress updated!");
  };

  const handleAddModuleDirect = () => {
    const title = prompt("Enter Module Title:", `Module ${(modules || []).length + 1}: Core Concepts`);
    if (!title || !title.trim()) return;

    const newMod = {
      id: Date.now(),
      title: title.trim(),
      progress: 0,
      lessons: [
        { title: 'Introductory Lesson & Setup', duration: '15:00', type: 'video', completed: false },
        { title: 'Module Resource Guide (PDF)', duration: 'Doc', type: 'doc', completed: false }
      ]
    };

    setCommunity((prev: any) => ({
      ...prev,
      modules: [...(prev.modules || []), newMod]
    }));
    showToast("✓ New module added to Classroom!");
  };

  const handleAddLessonDirect = (mIdx: number) => {
    const title = prompt("Enter Lesson Title:", "New Practice Topic");
    if (!title || !title.trim()) return;

    setCommunity((prev: any) => {
      const newMods = [...(prev.modules || [])];
      newMods[mIdx].lessons.push({
        title: title.trim(),
        duration: '10:00',
        type: 'video',
        completed: false
      });
      return { ...prev, modules: newMods };
    });
    showToast("✓ New lesson added!");
  };

  const handleDeleteModule = (mIdx: number) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    setCommunity((prev: any) => {
      const newMods = (prev.modules || []).filter((_: any, i: number) => i !== mIdx);
      return { ...prev, modules: newMods };
    });
    showToast("Module deleted.");
  };

  return (
    <div className="space-y-4">
      {/* Creator In-Tab Controls */}
      {canEdit && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <h4 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-800" />
              <span>Classroom & Vault Management</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">Add modules, video lessons, and downloadable worksheets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddModuleDirect}
              className="px-3.5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
            <button
              type="button"
              onClick={onOpenStudio}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Full Studio</span>
            </button>
          </div>
        </div>
      )}

      {(!modules || modules.length === 0) ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No course modules published yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {canEdit ? "Get started by adding your first curriculum module or uploading video lessons." : "The instructor is currently preparing modules for this classroom."}
          </p>
          {canEdit && (
            <button
              type="button"
              onClick={handleAddModuleDirect}
              className="px-4 py-2 bg-[#0F5338] text-white rounded-xl text-xs font-bold hover:bg-[#0A3D29] inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add First Module
            </button>
          )}
        </div>
      ) : (
        modules.map((mod: any, mIdx: number) => (
          <div key={mod.id || mIdx} className="bg-white rounded-2xl border border-[#E8E3D7] overflow-hidden shadow-2xs">
            <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900">{mod.title}</h3>
                {canEdit && (
                  <button 
                    onClick={() => handleDeleteModule(mIdx)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden hidden sm:block">
                  <div className="bg-[#0F5338] h-full rounded-full" style={{ width: `${mod.progress || 0}%` }} />
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleAddLessonDirect(mIdx)}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-extrabold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Lesson
                  </button>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {(mod.lessons || []).map((lesson: any, lIdx: number) => (
                <div key={lIdx} onClick={() => toggleLesson(mIdx, lIdx)} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    {lesson.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : lesson.type === 'video' ? (
                      <PlayCircle className="w-5 h-5 text-slate-300 group-hover:text-[#0F5338] shrink-0 transition-colors" />
                    ) : (
                      <FileText className="w-5 h-5 text-slate-300 group-hover:text-amber-500 shrink-0 transition-colors" />
                    )}
                    <span className={cn("text-sm font-semibold", lesson.completed ? "text-slate-600 line-through decoration-slate-300" : "text-slate-900")}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {lesson.link && (
                      <a href={lesson.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline" onClick={e => e.stopPropagation()}>Resource Link</a>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {lesson.duration}
                    </span>
                  </div>
                </div>
              ))}
              {(!mod.lessons || mod.lessons.length === 0) && (
                <div className="p-4 text-xs text-slate-400 text-center">No lessons in this module yet.</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function EventsTab({ events, setCommunity, canEdit, showToast }: any) {
  const handleScheduleDirect = () => {
    const title = prompt("Enter Masterclass / Workshop Title:", "Weekly Live Q&A & Code Review");
    if (!title || !title.trim()) return;

    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      date: 'This Saturday, 6:00 PM GMT+1',
      time: '18:00',
      host: 'Community Host',
      meetingRoom: `room-${Math.floor(Math.random() * 900 + 100)}`
    };

    setCommunity((prev: any) => ({
      ...prev,
      events: [...(prev.events || []), newEvent]
    }));
    showToast("✓ Live masterclass scheduled!");
  };

  const handleDeleteEvent = (evId: number) => {
    setCommunity((prev: any) => ({
      ...prev,
      events: (prev.events || []).filter((e: any) => e.id !== evId)
    }));
    showToast("Event removed.");
  };

  return (
    <div className="space-y-4">
      {/* Creator In-Tab Controls */}
      {canEdit && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-emerald-500/10 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-800" />
              <span>Live Events & Masterclasses</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">Schedule live webinars and interactive video masterclasses.</p>
          </div>
          <button
            type="button"
            onClick={handleScheduleDirect}
            className="px-3.5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Event</span>
          </button>
        </div>
      )}

      {(!events || events.length === 0) ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          No live events currently scheduled.
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-[#0F5338] to-[#166C48] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden gap-4">
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-1">Next Live Event Upcoming</h2>
              <p className="text-emerald-100 text-sm">{events[0].title} on {events[0].date}</p>
            </div>
            <Link to={`/classroom/meeting-${events[0].meetingRoom || events[0].id}`} className="relative z-10 px-5 py-2.5 bg-white text-[#0F5338] font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <Video className="w-4 h-4" /> Join Meeting Lobby
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((ev: any) => (
              <div key={ev.id} className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FBF9F4] rounded-xl flex items-center justify-center border border-[#E8E3D7]">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{ev.date} • Host: {ev.host}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/classroom/meeting-${ev.meetingRoom || ev.id}`}
                    className="px-4 py-2 bg-emerald-50 text-[#0F5338] font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Room
                  </Link>
                  {canEdit && (
                    <button 
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                      title="Remove Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExpertsTab({ community, setCommunity, canEdit, showToast, onOpenStudio }: any) {
  const experts = community.experts || [];

  const handleBookExpert = (exp: any) => {
    try {
      const saved = localStorage.getItem('akademi_booked_sessions');
      const existing = saved ? JSON.parse(saved) : [];
      const newSession = {
        id: `sess-${Date.now()}`,
        tutorName: exp.name,
        tutorAvatar: exp.avatar,
        subject: exp.subjects ? exp.subjects.split(',')[0] : community.name,
        date: 'Tomorrow, 4:00 PM GMT+1',
        time: '16:00',
        format: '1-on-1',
        status: 'Confirmed',
        meetingUrl: `/classroom/session-${Date.now().toString().slice(-4)}`,
        amount: `₦${(exp.hourlyRate || 5000).toLocaleString()}`,
        communityName: community.name
      };
      const updated = [newSession, ...existing];
      localStorage.setItem('akademi_booked_sessions', JSON.stringify(updated));

      // Record transaction
      const curBal = Number(localStorage.getItem('akademi_wallet_balance_ngn') || 142500);
      const newBal = Math.max(0, curBal - (exp.hourlyRate || 5000));
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

      const txSaved = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const tx = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        type: '1-on-1 Tutoring Session',
        description: `1-on-1 Tutoring with ${exp.name} (${community.name})`,
        amount: `-₦${(exp.hourlyRate || 5000).toLocaleString()}`,
        status: 'Completed',
        date: 'Today, Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([tx, ...txSaved]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    showToast(`🎉 1-on-1 Tutoring session with ${exp.name} booked successfully! Session confirmed on your Schedule.`);
  };

  const handleRemoveExpertDirect = (idx: number) => {
    if (!confirm("Are you sure you want to remove this resident expert from the community?")) return;
    const updated = (community.experts || []).filter((_: any, i: number) => i !== idx);
    setCommunity((prev: any) => ({
      ...prev,
      experts: updated
    }));

    try {
      const saved = localStorage.getItem('akademi_communities');
      if (saved) {
        const all = JSON.parse(saved);
        const updatedList = all.map((c: any) => c.id === community.id ? { ...c, experts: updated } : c);
        localStorage.setItem('akademi_communities', JSON.stringify(updatedList));
      }
    } catch (e) {}

    showToast("Expert removed from community teaching staff.");
  };

  return (
    <div className="space-y-6">
      {/* Host Controls Banner */}
      {canEdit && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-emerald-500/10 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-emerald-800" />
              <span>Resident Experts & Teaching Staff</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage instructors and teaching assistants who answer Q&A and provide 1-on-1 private tutoring.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenStudio}
            className="px-4 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add / Manage Experts</span>
          </button>
        </div>
      )}

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {experts.map((exp: any, idx: number) => (
          <div key={exp.id || idx} className="bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between relative group hover:shadow-md transition-all">
            {/* Header role badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0F5338] text-xs font-black border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {exp.role}
              </span>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => handleRemoveExpertDirect(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove from Community"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={getAvatarUrl(exp.name, exp.avatar)} 
                alt={exp.name} 
                onError={(e) => handleImageError(e, exp.name)}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm shrink-0" 
              />
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-1.5">
                  {exp.name}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold mt-0.5">{exp.subjects}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" /> {exp.rating || 4.9}
                  </span>
                  <span>•</span>
                  <span>{exp.reviewsCount || 30}+ Student Sessions</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {exp.bio && (
              <p className="text-xs text-slate-600 leading-relaxed mb-5 bg-[#FBF9F4] p-3 rounded-xl border border-[#E8E3D7]/70">
                "{exp.bio}"
              </p>
            )}

            {/* Rate & Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">1-on-1 Tutoring Rate:</span>
                <span className="font-extrabold text-[#0F5338] text-sm">
                  ₦{(exp.hourlyRate || 5000).toLocaleString()} <span className="text-xs font-normal text-slate-500">/ hr</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleBookExpert(exp)}
                  className="py-2.5 px-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book 1-on-1</span>
                </button>

                <Link
                  to={`/dashboard/messages?recipient=${encodeURIComponent(exp.name)}&role=tutor&avatar=${encodeURIComponent(exp.avatar || '')}`}
                  className="py-2.5 px-3 bg-[#FBF9F4] hover:bg-slate-100 text-slate-700 border border-[#E8E3D7] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Direct Message</span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {experts.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Users2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No Resident Experts Assigned Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Community hosts can add verified platform tutors or elevate teaching assistants to provide 1-on-1 tutoring.
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={onOpenStudio}
                className="px-5 py-2.5 bg-[#0F5338] text-white text-xs font-bold rounded-xl hover:bg-[#0A3D29] transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm mt-2"
              >
                <Plus className="w-4 h-4" /> Add Your First Resident Expert
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderboardTab({ showToast }: any) {
  const [showVipModal, setShowVipModal] = useState(false);
  const [userPoints, setUserPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_user_leaderboard_points');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 1850; // User is #1 Rank by default!
  });

  const [hasClaimedGrant, setHasClaimedGrant] = useState(() => {
    return localStorage.getItem('akademi_vip_grant_claimed') === 'true';
  });

  const leaders = [
    { rank: 1, name: 'Chiamaka Ada (You)', points: userPoints, level: 7, levelName: 'Akademi Legend', avatar: '/images/hero-student.jpg', isUser: true },
    { rank: 2, name: 'Tunde Okafor', points: 1450, level: 5, levelName: 'Grandmaster Mentor', avatar: '/images/tutor-daniel.jpg', isUser: false },
    { rank: 3, name: 'Aisha Kano', points: 1220, level: 4, levelName: 'Lead Scholar', avatar: '/images/tutor-adaeze.jpg', isUser: false },
    { rank: 4, name: 'Emeka Nnaji', points: 980, level: 3, levelName: 'Master Contributor', avatar: '/images/tutor-ibrahim.jpg', isUser: false },
    { rank: 5, name: 'Segun Adeyemi', points: 850, level: 3, levelName: 'Master Contributor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', isUser: false },
  ];

  const handleClaimGrant = () => {
    if (hasClaimedGrant) {
      if (showToast) showToast('You have already claimed your ₦100,000 Tutoring Sponsorship Grant!');
      return;
    }
    try {
      const curBal = Number(localStorage.getItem('akademi_wallet_balance_ngn') || 142500);
      const newBal = curBal + 100000;
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));
      localStorage.setItem('akademi_vip_grant_claimed', 'true');
      setHasClaimedGrant(true);

      const savedTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const vipTx = {
        id: `VIP-${Date.now().toString().slice(-6)}`,
        type: 'VIP Award Sponsorship Grant',
        description: '🏆 Akademi #1 Rank Excellence Award Grant Credited',
        amount: '+₦100,000',
        status: 'Completed',
        date: 'Today, Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([vipTx, ...savedTx]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    if (showToast) showToast('🎉 ₦100,000 Tutoring Sponsorship Grant credited to your Akademi Wallet!');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner: Rank #1 Milestone & Company Award Invitation */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-700 rounded-3xl p-6 sm:p-7 text-slate-950 shadow-md relative overflow-hidden border border-amber-300">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
              <Trophy className="w-4 h-4 fill-current text-amber-400" />
              <span>Rank #1 Leaderboard Contributor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-950">
              Official Akademi Company VIP Award & Invitation
            </h2>
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              Achieving Rank #1 or Akademi Legend Status (1,000+ pts) qualifies you for an official company award, physical trophy, ₦100,000 tutoring grant, and gala invitation!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowVipModal(true)}
            className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-2xl text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer shrink-0 border border-amber-400/40"
          >
            <Sparkles className="w-4 h-4 fill-amber-300" />
            <span>View VIP Award & Invitation →</span>
          </button>
        </div>
      </div>

      {/* Point Earning Rules Card */}
      <div className="bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">How Engagement Points Work</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500">Activity-Driven Ranking</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { action: 'Helpful Q&A Answers', pts: '+20 pts', icon: '💬', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { action: 'Community Upvotes', pts: '+10 pts', icon: '❤️', color: 'bg-rose-50 text-rose-800 border-rose-200' },
            { action: 'Vault Module Done', pts: '+50 pts', icon: '📚', color: 'bg-blue-50 text-blue-800 border-blue-200' },
            { action: 'Live Masterclass', pts: '+100 pts', icon: '📅', color: 'bg-purple-50 text-purple-800 border-purple-200' },
            { action: 'Daily Study Streak', pts: '+15 pts/day', icon: '🔥', color: 'bg-amber-50 text-amber-800 border-amber-200' },
          ].map((item, idx) => (
            <div key={idx} className={cn("p-3 rounded-2xl border text-center space-y-1", item.color)}>
              <span className="text-lg block">{item.icon}</span>
              <p className="text-[11px] font-bold leading-tight">{item.action}</p>
              <span className="text-xs font-black block">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Top Contributors Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-[#E8E3D7] overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Trophy className="w-5 h-5 text-amber-500" /> 30-Day Top Contributors Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Updated in real-time based on active community problem solving and participation.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-[#0F5338] rounded-full text-xs font-black border border-emerald-200">
            Season 1 Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {leaders.map(l => (
            <div key={l.rank} className={cn("p-4 flex items-center justify-between gap-4 transition-colors", l.isUser ? "bg-amber-50/60 font-medium" : "hover:bg-slate-50")}>
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border",
                  l.rank === 1 ? "bg-amber-400 text-slate-950 border-amber-500 shadow-2xs" :
                  l.rank === 2 ? "bg-slate-200 text-slate-700 border-slate-300" :
                  l.rank === 3 ? "bg-orange-200 text-orange-800 border-orange-300" : "bg-slate-100 text-slate-500 border-slate-200"
                )}>
                  #{l.rank}
                </div>

                <div className="flex items-center gap-3">
                  <img src={l.avatar} alt={l.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{l.name}</h4>
                      {l.rank === 1 && (
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] rounded uppercase tracking-wider border border-amber-500 flex items-center gap-1 shadow-2xs">
                          <Trophy className="w-3 h-3 fill-current" /> #1 Rank
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 inline-block mt-0.5">
                      Level {l.level}: {l.levelName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-[#0F5338] text-base block">{l.points.toLocaleString()} pts</span>
                <span className="text-[10px] text-slate-400 font-semibold">Active Contributor</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Company VIP Award & Invitation Modal */}
      <AnimatePresence>
        {showVipModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0F5338] via-emerald-800 to-[#0A3D29] p-6 text-white relative">
                <button
                  type="button"
                  onClick={() => setShowVipModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black mb-3 shadow-md border border-amber-300">
                  <Trophy className="w-6 h-6 fill-current text-slate-950" />
                </div>
                <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-400/30">
                  Official Company VIP Award
                </span>
                <h3 className="text-xl font-serif font-bold text-white mt-1">
                  Akademi Hall of Fame & Excellence Gala Invitation
                </h3>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
                  <p className="font-bold text-sm text-amber-900">
                    🎟️ Official Invitation to Top #1 Learner
                  </p>
                  <p className="leading-relaxed">
                    You are officially invited to the <strong>Akademi Annual Excellence Gala & Award Ceremony</strong> to receive your physical <strong>Top Contributor Trophy & Certificate</strong> presented by company executive leadership!
                  </p>
                </div>

                {/* VIP Perks */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Included VIP Contributor Rewards:
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Physical Trophy & Certificate:</strong>
                        <p className="text-slate-500 text-[11px]">Awarded in person at the Gala or delivered directly to your address.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Coins className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">₦100,000 Tutoring Sponsorship Grant:</strong>
                        <p className="text-slate-500 text-[11px]">Funded directly into your wallet for 1-on-1 tutoring sessions.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-bold">Paid TA & Peer Tutor Offer:</strong>
                        <p className="text-slate-500 text-[11px]">Fast-tracked invitation to become a paid Teaching Assistant on Akademi.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim Grant Action Button */}
                <button
                  type="button"
                  onClick={handleClaimGrant}
                  disabled={hasClaimedGrant}
                  className={cn(
                    "w-full py-3 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98",
                    hasClaimedGrant ? "bg-slate-200 text-slate-600 border border-slate-300 opacity-80" : "bg-[#0F5338] hover:bg-[#0A3D29] text-white"
                  )}
                >
                  <Coins className="w-4 h-4" />
                  <span>{hasClaimedGrant ? '✓ ₦100,000 Grant Claimed & Credited' : 'Claim ₦100,000 Sponsorship Grant to Wallet'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AITab() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm your study companion for this community. I've read all the modules and resources here. What would you like to review today?" }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: "That's a great question! Based on the community resources, here is a quick overview to help you out..." }]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E3D7] h-[500px] flex flex-col shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Akademi AI Companion</h3>
          <p className="text-[11px] text-slate-500">Trained on community materials</p>
        </div>
      </div>
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex items-start gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-slate-200" : "bg-emerald-100")}>
              {msg.role === 'user' ? <Users2 className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-emerald-700" />}
            </div>
            <div className={cn("p-3 rounded-2xl text-sm", msg.role === 'user' ? "bg-[#0F5338] text-white rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm")}>
              {msg.content}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4 ml-11">
            <button onClick={() => sendMsg("Explain the core concepts of Module 1")} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-colors">
              Explain Module 1
            </button>
            <button onClick={() => sendMsg("Give me a practice quiz")} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold hover:bg-emerald-50 transition-colors">
              Give me a practice quiz
            </button>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-100">
        <form onSubmit={e => { e.preventDefault(); sendMsg(input); }} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about the course..." 
            className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5338]"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0F5338] text-white rounded-lg hover:bg-[#0A3D29] transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Sidebar ---
function SidebarWidgets({ canEdit, onOpenStudio }: { canEdit?: boolean; onOpenStudio?: () => void }) {
  return (
    <>
      {canEdit ? (
        /* Author Studio Quick Launcher Widget */
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-600/10 border-2 border-amber-300 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Creator Studio & Hub Settings</h3>
              <p className="text-[10px] text-amber-900 font-medium">Community Owner Tools</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Update your community banner, bio, access pricing, course modules, video lessons, and live webinars.
          </p>
          <button
            type="button"
            onClick={onOpenStudio}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Open Creator Studio Editor</span>
          </button>
        </div>
      ) : (
        /* Community Guidelines Card for Regular Members */
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider">Community Honor Code</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">Active Peer Learning</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Share answers kindly, participate in weekly challenges, and respect fellow students and resident mentors.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs">
        <h3 className="font-bold text-slate-900 mb-3 text-sm">Weekly Challenge 🎯</h3>
        <p className="text-xs text-slate-600 mb-4">Complete your latest module tasks and upload your workings to the community feed.</p>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
          <div className="bg-amber-400 h-full rounded-full w-1/3" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 text-right">33% Completed</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs">
        <h3 className="font-bold text-slate-900 mb-4 text-sm">Course Completion</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.42)} className="text-[#0F5338]" />
            </svg>
            <span className="absolute text-xl font-bold text-slate-900">42%</span>
          </div>
        </div>
      </div>
    </>
  );
}
