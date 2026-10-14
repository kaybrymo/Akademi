import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, 
  Search, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  Filter, 
  ExternalLink,
  Flame,
  Zap,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { CommunityData } from '@/components/modals/CreateCommunityModal';

const INITIAL_ADMIN_COMMUNITIES: (CommunityData & { isFeatured?: boolean; isFlagged?: boolean })[] = [
  {
    id: 'comm-1',
    name: 'Data Analytics Career Hub',
    slug: 'data-analytics-career-hub',
    tagline: 'Master SQL, PowerBI, Python & land high-paying global analytics roles.',
    description: 'An active ecosystem for aspiring data analysts with weekly live portfolio build workshops and tutor coaching.',
    category: 'Data & Tech',
    communityType: 'Tutor Masterclass',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    accessType: 'paid',
    monthlyPrice: 4500,
    currency: 'NGN',
    creatorName: 'Ade Adeyemi',
    creatorRole: 'Lead Data Analytics Tutor & Mentor',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membersCount: 342,
    coursesCount: 3,
    eventsCount: 6,
    isVerified: true,
    isFeatured: true,
    isFlagged: false,
    tags: ['Data & Tech', 'Paid Membership', 'Tutor Masterclass'],
    createdAt: '2 weeks ago'
  },
  {
    id: 'comm-2',
    name: 'Calculus & Advanced Math Circle',
    slug: 'calculus-advanced-math-circle',
    tagline: 'From Integration by Parts to Multivariable Calculus — mastered together.',
    description: 'A study mastermind for engineering and university mathematics students.',
    category: 'Mathematics & Sciences',
    communityType: 'Tutor Masterclass',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
    accessType: 'free',
    monthlyPrice: 0,
    currency: 'NGN',
    creatorName: 'Dr. Chiamaka Eze',
    creatorRole: 'PhD Pure Mathematics, University of Lagos',
    creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    membersCount: 820,
    coursesCount: 2,
    eventsCount: 8,
    isVerified: true,
    isFeatured: true,
    isFlagged: false,
    tags: ['Mathematics & Sciences', 'Free Public Hub', 'Tutor Masterclass'],
    createdAt: '1 month ago'
  },
  {
    id: 'comm-3',
    name: 'UNILAG Engineering 300L Mastermind',
    slug: 'unilag-engineering-300l-mastermind',
    tagline: 'Thermodynamics, Circuit Theory & Exam Prep study squad.',
    description: 'Student-led peer problem solving and past question archives for engineering undergraduates.',
    category: 'Mathematics & Sciences',
    communityType: 'Peer Study Hub',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    accessType: 'free',
    monthlyPrice: 0,
    currency: 'NGN',
    creatorName: 'Chiamaka Ada',
    creatorRole: 'Peer Study Leader · 300L Mechanical Eng',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membersCount: 145,
    coursesCount: 1,
    eventsCount: 3,
    isVerified: true,
    isFeatured: false,
    isFlagged: false,
    tags: ['Mathematics & Sciences', 'Free Public Hub', 'Peer Study Hub'],
    createdAt: '3 weeks ago'
  },
  {
    id: 'comm-4',
    name: 'JAMB & Post-UTME 2026 Daily Squad',
    slug: 'jamb-post-utme-2026-daily-squad',
    tagline: 'Daily 50 CBT questions challenge, subject sprints & peer accountability.',
    description: 'Collaborative student study cohort preparing for university entrance examinations across Nigeria.',
    category: 'Exam & University Prep',
    communityType: 'Peer Study Hub',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    accessType: 'paid',
    monthlyPrice: 1500,
    currency: 'NGN',
    creatorName: 'Oluwaseun Ojo',
    creatorRole: 'Peer Study Leader · JAMB 320 Scorer',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    membersCount: 410,
    coursesCount: 2,
    eventsCount: 7,
    isVerified: true,
    isFeatured: false,
    isFlagged: false,
    tags: ['Exam & University Prep', 'Paid Membership', 'Peer Study Hub'],
    createdAt: '1 week ago'
  }
];

export default function AdminCommunities() {
  const [communities, setCommunities] = useState<(CommunityData & { isFeatured?: boolean; isFlagged?: boolean })[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_communities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ADMIN_COMMUNITIES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Tutor' | 'Student' | 'Featured' | 'Flagged'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectingCommunity, setInspectingCommunity] = useState<(CommunityData & { isFeatured?: boolean; isFlagged?: boolean }) | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveCommunities = (updated: any[]) => {
    setCommunities(updated);
    try {
      localStorage.setItem('akademi_communities', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleToggleFeatured = (id: string) => {
    const target = communities.find(c => c.id === id);
    if (!target) return;
    const nextState = !target.isFeatured;
    const updated = communities.map(c => c.id === id ? { ...c, isFeatured: nextState } : c);
    saveCommunities(updated);
    showToast(nextState ? `⭐ "${target.name}" is now featured on the homepage directory!` : `"${target.name}" removed from featured hub spotlight.`);
  };

  const handleToggleVerified = (id: string) => {
    const target = communities.find(c => c.id === id);
    if (!target) return;
    const nextState = !target.isVerified;
    const updated = communities.map(c => c.id === id ? { ...c, isVerified: nextState } : c);
    saveCommunities(updated);
    showToast(nextState ? `🛡️ Verified Badge granted to "${target.name}".` : `Verified badge revoked for "${target.name}".`);
  };

  const handleRemoveSpam = (id: string) => {
    const target = communities.find(c => c.id === id);
    if (!target) return;
    if (confirm(`Are you sure you want to permanently remove and unpublish "${target.name}" for policy violations / spam?`)) {
      const updated = communities.filter(c => c.id !== id);
      saveCommunities(updated);

      // Log in Super Admin Audit Trail
      try {
        const savedLogs = JSON.parse(localStorage.getItem('akademi_admin_audit_logs') || '[]');
        const spamLog = {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          adminName: 'Chiamaka Eze',
          adminEmail: 'superadmin@akademi.com',
          role: 'Super Admin',
          action: 'Spam Community Removed',
          category: 'Content Moderation',
          details: `Unpublished and deleted community "${target.name}" created by ${target.creatorName}`,
          ipAddress: '197.210.64.12 (Lagos, NG)',
          status: 'Authorized',
          timestamp: 'Today, Just now'
        };
        localStorage.setItem('akademi_admin_audit_logs', JSON.stringify([spamLog, ...savedLogs]));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      showToast(`🗑️ Community "${target.name}" removed and logged in audit trails.`);
    }
  };

  const filteredCommunities = communities.filter(c => {
    const isTutor = c.creatorRole.toLowerCase().includes('tutor') || c.tags.some(t => t.toLowerCase().includes('tutor'));
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = 
      typeFilter === 'All' ? true :
      typeFilter === 'Tutor' ? isTutor :
      typeFilter === 'Student' ? !isTutor :
      typeFilter === 'Featured' ? Boolean(c.isFeatured) :
      Boolean(c.isFlagged);

    return matchesSearch && matchesType;
  });

  const totalMembers = communities.reduce((acc, c) => acc + c.membersCount, 0);
  const totalMRR = communities
    .filter(c => c.accessType === 'paid')
    .reduce((acc, c) => acc + (c.membersCount * c.monthlyPrice), 0);
  const platformMRR = totalMRR * 0.10;
  const platformCommission = totalMRR * 0.10;
  const netTutorPayout = totalMRR * 0.90;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Toast Notification */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Super Admin Community Governance Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Communities Moderation & Curation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Govern all platform communities, curate homepage spotlights, manage verification badges, and unpublish spam.
          </p>
        </div>
        <Link 
          to="/communities" 
          target="_blank"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View Public Directory
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Active Hubs', value: communities.length, icon: Users2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Total Members', value: totalMembers.toLocaleString(), icon: Flame, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Gross MRR', value: `₦${(totalMRR / 1000000).toFixed(2)}M/mo`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Platform 10% Commission', value: `₦${(platformCommission / 1000000).toFixed(2)}M/mo`, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Net Tutor Payout', value: `₦${(netTutorPayout / 1000000).toFixed(2)}M/mo`, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-100' },
          { label: 'Featured Hubs', value: communities.filter(c => c.isFeatured).length, icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'All', label: 'All Communities' },
            { id: 'Tutor', label: '🎓 Tutor Masterclasses' },
            { id: 'Student', label: '👥 Student Peer Hubs' },
            { id: 'Featured', label: '⭐ Featured Hubs' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                typeFilter === f.id
                  ? "bg-[#0F5338] text-white shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search community name or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Community & Topic</th>
                <th className="px-5 py-3.5">Creator Identity</th>
                <th className="px-5 py-3.5">Access & Pricing</th>
                <th className="px-5 py-3.5">Members</th>
                <th className="px-5 py-3.5">Curation Status</th>
                <th className="px-5 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCommunities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    No communities match your current search and filter settings.
                  </td>
                </tr>
              ) : (
                filteredCommunities.map((c) => {
                  const isTutor = c.creatorRole.toLowerCase().includes('tutor');

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={c.coverImage} 
                            alt={c.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{c.name}</span>
                              {c.isFeatured && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black uppercase flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">{c.tagline}</p>
                            <span className="text-[10px] text-slate-400 font-mono">/{c.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{c.creatorName}</div>
                        <div className="text-[11px] text-slate-500">{c.creatorRole}</div>
                        <span className={cn(
                          "inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase",
                          isTutor ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-blue-100 text-blue-900 border border-blue-300"
                        )}>
                          {isTutor ? '🎓 Tutor Masterclass' : '👥 Peer Study Hub'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {c.accessType === 'paid' ? (
                          <div>
                            <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              ₦{c.monthlyPrice.toLocaleString()}/mo
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Paid Subscription</div>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              Free Public
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Open Access</div>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{c.membersCount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400">{c.coursesCount || 0} attached courses</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {c.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Hub
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Feature Spotlight Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(c.id)}
                            className={cn(
                              "p-2 rounded-lg text-xs font-bold transition-all border",
                              c.isFeatured
                                ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                                : "bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 border-slate-200"
                            )}
                            title={c.isFeatured ? "Remove from Featured Spotlight" : "Feature on Homepage"}
                          >
                            <Star className={cn("w-3.5 h-3.5", c.isFeatured && "fill-white")} />
                          </button>

                          {/* Verify Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleVerified(c.id)}
                            className={cn(
                              "p-2 rounded-lg text-xs font-bold transition-all border",
                              c.isVerified
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                            )}
                            title={c.isVerified ? "Revoke Verification" : "Award Verification"}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspect Members Button */}
                          <button
                            type="button"
                            onClick={() => setInspectingCommunity(c)}
                            className="p-2 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-lg text-xs font-bold transition-all"
                            title="Member inspection drawer / moderation audit"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Remove Spam Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveSpam(c.id)}
                            className="p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg text-xs font-bold transition-all"
                            title="Remove & Unpublish Spam Community"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Inspection Drawer */}
      <AnimatePresence>
        {inspectingCommunity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectingCommunity(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Member Inspection Drawer</h3>
                  <p className="text-xs text-slate-500 mt-1">Moderation audit for {inspectingCommunity.name}</p>
                </div>
                <button 
                  onClick={() => setInspectingCommunity(null)}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Creator Identity</span>
                    <span className="text-sm font-bold text-slate-900">{inspectingCommunity.creatorName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Community Type</span>
                    <span className="text-sm font-bold text-slate-900">{inspectingCommunity.communityType}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Total Members Enrolled</span>
                    <span className="text-sm font-bold text-slate-900">{inspectingCommunity.membersCount}</span>
                  </div>
                  {inspectingCommunity.accessType === 'paid' && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm font-medium text-slate-500">Gross MRR</span>
                      <span className="text-sm font-bold text-emerald-600">₦{(inspectingCommunity.membersCount * inspectingCommunity.monthlyPrice).toLocaleString()}/mo</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Moderation Audit Log</h4>
                  <ul className="space-y-3">
                    <li className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>No spam or policy violations detected.</span>
                    </li>
                    <li className="text-xs text-slate-600 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Creator identity verified by platform.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => setInspectingCommunity(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
