import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Image as ImageIcon,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommunityData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  coverImage: string;
  communityType: 'Tutor Masterclass' | 'Peer Study Hub';
  accessType: 'free' | 'paid';
  monthlyPrice: number;
  currency: string;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  membersCount: number;
  coursesCount: number;
  eventsCount: number;
  isVerified: boolean;
  tags: string[];
  attachedCourses?: string[];
  welcomeMessage?: string;
  createdAt: string;
}

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (community: CommunityData) => void;
}

const CATEGORY_PRESETS = [
  'Data & Tech',
  'Mathematics & Sciences',
  'Languages & Culture',
  'Professional Careers',
  'Exam & University Prep',
  'Business & Finance'
];

const COVER_PRESETS = [
  { name: 'Modern Tech Teal', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Academic Library', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Data & Coding', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Creative Studio', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80' },
];

export default function CreateCommunityModal({
  isOpen,
  onClose,
  onCommunityCreated
}: CreateCommunityModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Data & Tech');
  const [communityType, setCommunityType] = useState<'Tutor Masterclass' | 'Peer Study Hub'>('Tutor Masterclass');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [accessType, setAccessType] = useState<'free' | 'paid'>('paid');
  const [monthlyPrice, setMonthlyPrice] = useState('4500');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [attachedCourses, setAttachedCourses] = useState<string[]>(['Mastering Data Analytics', 'SQL & Python Foundations']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let authUser: any = null;
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) authUser = JSON.parse(saved);
    } catch (e) {}

    const currentUserRole = authUser?.role || localStorage.getItem('akademi_user_role') || (communityType === 'Tutor Masterclass' ? 'tutor' : 'student');
    const creatorName = authUser?.name || (currentUserRole === 'tutor' ? 'Dr. Babatunde' : 'Chiamaka Ada');
    const creatorAvatar = authUser?.avatar || (currentUserRole === 'tutor' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80');
    const creatorRole = authUser?.title || (currentUserRole === 'tutor' || communityType === 'Tutor Masterclass' ? 'Verified Tutor' : 'Peer Study Leader');

    const newCommunity: CommunityData = {
      id: `comm-${Date.now()}`,
      name: name.trim() || 'New Community Hub',
      slug: (name || 'new-community-hub').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: tagline.trim() || 'Collaborative learning, masterclasses, and study accountability.',
      description: description.trim() || 'An active ecosystem for peer problem-solving, course materials, weekly workshops, and mentor Q&A.',
      category,
      coverImage,
      communityType,
      accessType,
      monthlyPrice: accessType === 'paid' ? Number(monthlyPrice) || 4500 : 0,
      currency: 'NGN',
      creatorName,
      creatorRole,
      creatorAvatar,
      membersCount: 1,
      coursesCount: attachedCourses.length,
      eventsCount: 2,
      isVerified: true,
      tags: [category, accessType === 'paid' ? 'Paid Membership' : 'Free Access', 'Live Events'],
      attachedCourses,
      welcomeMessage: welcomeMessage.trim() || 'Welcome to our community hub! Introduce yourself in the discussions.',
      createdAt: 'Just now'
    };

    onCommunityCreated(newCommunity);
    onClose();
    // Reset state
    setStep(1);
    setName('');
    setTagline('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#0F5338] px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Users2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  Launch a Community
                </h2>
                <p className="text-xs text-emerald-100/80">Open to All Students & Tutors</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-sm font-semibold p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className={cn(
              "flex items-center gap-1.5 font-bold transition-colors",
              step === 1 ? "text-[#0F5338]" : "text-slate-400"
            )}>
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                step === 1 ? "bg-[#0F5338] text-white" : "bg-slate-200 text-slate-600"
              )}>1</span>
              Identity & Brand
            </div>
            <div className="h-0.5 w-10 bg-slate-200" />
            <div className={cn(
              "flex items-center gap-1.5 font-bold transition-colors",
              step === 2 ? "text-[#0F5338]" : "text-slate-400"
            )}>
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                step === 2 ? "bg-[#0F5338] text-white" : "bg-slate-200 text-slate-600"
              )}>2</span>
              Pricing & Access
            </div>
            <div className="h-0.5 w-10 bg-slate-200" />
            <div className={cn(
              "flex items-center gap-1.5 font-bold transition-colors",
              step === 3 ? "text-[#0F5338]" : "text-slate-400"
            )}>
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                step === 3 ? "bg-[#0F5338] text-white" : "bg-slate-200 text-slate-600"
              )}>3</span>
              Curriculum & Welcome
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* STEP 1: IDENTITY & BRAND */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Community Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Data Analytics Career Hub / Calculus Champions"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Community Type *
                    </label>
                    <select
                      value={communityType}
                      onChange={(e) => setCommunityType(e.target.value as 'Tutor Masterclass' | 'Peer Study Hub')}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      <option value="Tutor Masterclass">Tutor Masterclass</option>
                      <option value="Peer Study Hub">Peer Study Hub</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      {CATEGORY_PRESETS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      One-line Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master real projects & land high-paying roles"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    About the Community & Who It's For
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what members will achieve, weekly group schedules, and study resources included..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Cover Banner Image
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {COVER_PRESETS.map((cp, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCoverImage(cp.url)}
                        className={cn(
                          "relative rounded-xl overflow-hidden cursor-pointer h-20 border-2 transition-all group",
                          coverImage === cp.url ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-slate-200 opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={cp.url} alt={cp.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white leading-tight">{cp.name}</span>
                        </div>
                        {coverImage === cp.url && (
                          <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PRICING & ACCESS */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Choose Membership Model
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setAccessType('paid')}
                    className={cn(
                      "p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 relative",
                      accessType === 'paid' ? "border-[#0F5338] bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {accessType === 'paid' && (
                      <span className="absolute top-3 right-3 bg-[#0F5338] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <h4 className="font-bold text-slate-900 text-sm">Paid Monthly Membership</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Charge members a recurring monthly fee. Akademi automatically processes subscriptions and deposits your net earnings.
                    </p>
                  </div>

                  <div
                    onClick={() => setAccessType('free')}
                    className={cn(
                      "p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2",
                      accessType === 'free' ? "border-[#0F5338] bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <h4 className="font-bold text-slate-900 text-sm">100% Free Public Hub</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Free for any approved student to join. Great for building an audience, study circles, and upsells to 1:1 tutoring.
                    </p>
                  </div>
                </div>

                {accessType === 'paid' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Monthly Membership Price (NGN)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">₦</span>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e.target.value)}
                        className="w-full h-12 pl-9 pr-4 bg-white border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Tutor Net Earnings (after 10% platform fee):</span>
                      <span className="font-bold text-emerald-700">
                        ₦{Math.round(Number(monthlyPrice || 0) * 0.9).toLocaleString()} / member / month
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: CURRICULUM & WELCOME */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Attached Courses & Learning Material
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Members of this community get direct access to these course materials.</p>
                  <div className="space-y-2">
                    {attachedCourses.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> {c}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Included
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Welcome Announcement / Pinned Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a welcome post to greet members when they join your hub..."
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white leading-relaxed"
                  />
                </div>
              </motion.div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="flex-1 py-3 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="flex-[2] py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                >
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-[2] py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> Launch Community Now
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
