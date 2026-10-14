import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  ShieldCheck, 
  X, 
  Gift, 
  Star, 
  ExternalLink,
  MessageCircle,
  Coins,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferralSnapcodeBadgeProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    role: string;
    subject?: string;
    avatar?: string;
    initials?: string;
    rate?: number;
  };
}

export default function ReferralSnapcodeBadge({
  isOpen,
  onClose,
  user
}: ReferralSnapcodeBadgeProps) {
  const [copied, setCopied] = useState(false);
  const isTutor = user.role?.toLowerCase() === 'tutor';

  // Generate unique referral code from name
  const cleanCode = (user.name || 'AKADEMI')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .substring(0, 6);
  const refCode = isTutor ? `TUTOR-${cleanCode}-10` : `LEARN-${cleanCode}-15`;
  const shareUrl = `${window.location.origin}/register?ref=${refCode}&role=student`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = isTutor 
      ? encodeURIComponent(
          `🎓 Book private lessons with me (${user.name}) on Akademi! Use my referral code *${refCode}* to get *10% OFF* your first live session:\n${shareUrl}`
        )
      : encodeURIComponent(
          `📚 Hey! I'm learning with vetted tutors on Akademi. Use my student invite code *${refCode}* to get *15% OFF* your first 1:1 lesson:\n${shareUrl}`
        );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
      >
        {/* Header Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", isTutor ? "bg-amber-400" : "bg-emerald-400")} />
            <h3 className="font-bold text-sm">
              {isTutor ? 'Official Educator Snapcode Badge' : 'Student Referral & Rewards Pass'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex flex-col items-center text-center">
          {/* Snapchat-Style Snapcode Card */}
          <div className={cn(
            "relative w-64 h-80 rounded-[2.5rem] p-4 shadow-xl border-4 border-slate-950 flex flex-col items-center justify-between text-slate-950 overflow-hidden",
            isTutor 
              ? "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500" 
              : "bg-gradient-to-b from-emerald-300 via-teal-400 to-emerald-500"
          )}>
            {/* Top Snapcode Dot Frame */}
            <div className="absolute inset-2 border-2 border-dashed border-slate-950/40 rounded-[2rem] pointer-events-none" />

            {/* Top Brand Logo */}
            <div className="flex items-center gap-1.5 pt-2 z-10">
              <div className="w-6 h-6 rounded-lg bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                {isTutor ? '🎓' : '🌟'}
              </div>
              <span className="font-black text-sm tracking-tight text-slate-950">AKADEMI PASS</span>
            </div>

            {/* Middle QR Code Matrix & Avatar Centerpiece */}
            <div className="relative w-36 h-36 bg-white rounded-2xl p-2.5 border-2 border-slate-950 shadow-inner flex items-center justify-center z-10">
              {/* Stylized QR Code Matrix SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current opacity-90">
                {/* Corner Position Boxes */}
                <rect x="0" y="0" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="8" y="8" width="12" height="12" fill="currentColor" rx="2" />

                <rect x="72" y="0" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="80" y="8" width="12" height="12" fill="currentColor" rx="2" />

                <rect x="0" y="72" width="28" height="28" fill="currentColor" rx="4" />
                <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                <rect x="8" y="80" width="12" height="12" fill="currentColor" rx="2" />

                {/* Dot matrix pattern */}
                <circle cx="36" cy="14" r="3" />
                <circle cx="50" cy="14" r="3" />
                <circle cx="64" cy="14" r="3" />
                <circle cx="14" cy="36" r="3" />
                <circle cx="14" cy="50" r="3" />
                <circle cx="14" cy="64" r="3" />
                <circle cx="86" cy="36" r="3" />
                <circle cx="86" cy="50" r="3" />
                <circle cx="86" cy="64" r="3" />
                <circle cx="36" cy="86" r="3" />
                <circle cx="50" cy="86" r="3" />
                <circle cx="64" cy="86" r="3" />
                <circle cx="36" cy="36" r="3" />
                <circle cx="64" cy="64" r="3" />
                <circle cx="64" cy="36" r="3" />
                <circle cx="36" cy="64" r="3" />
              </svg>

              {/* Center Avatar Overlay */}
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-slate-950 bg-emerald-600 text-white font-black text-sm flex items-center justify-center overflow-hidden shadow-md">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.initials || (isTutor ? 'ED' : 'ST')}</span>
                )}
              </div>
            </div>

            {/* Bottom Info & Referral Tag */}
            <div className="text-center pb-2 z-10">
              <div className="flex items-center justify-center gap-1">
                <h4 className="font-extrabold text-xs text-slate-950 truncate max-w-[170px]">{user.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0 fill-emerald-400" />
              </div>
              <p className="text-[10px] font-bold text-slate-800 truncate">
                {isTutor ? (user.subject || 'Verified Educator') : 'Verified Student Member'}
              </p>
              <div className="mt-1 px-2.5 py-0.5 bg-slate-950 text-white rounded-full font-mono text-[10px] font-black tracking-wider shadow-xs">
                {refCode}
              </div>
            </div>
          </div>

          {/* Referral Perk Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left w-full space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              {isTutor ? <Gift className="w-4 h-4 text-emerald-600" /> : <Coins className="w-4 h-4 text-amber-600" />}
              <span>{isTutor ? 'Educator Referral Bounty' : 'Student LearnTokens Reward Bounty'}</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              When others register with your code <span className="font-bold font-mono text-emerald-800">{refCode}</span>:
            </p>
            <ul className="text-[11px] text-emerald-800 space-y-1 list-disc pl-4 font-medium">
              {isTutor ? (
                <>
                  <li>New students get <strong className="text-emerald-950">10% OFF</strong> their first session.</li>
                  <li>You receive <strong className="text-emerald-950">₦2,000 cash credit</strong> directly to your wallet!</li>
                </>
              ) : (
                <>
                  <li>Your classmates get <strong className="text-emerald-950">15% OFF</strong> their first tutoring session.</li>
                  <li>You receive <strong className="text-emerald-950">+150 LearnTokens</strong> (convertible into free tutoring time)!</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" /> Share on WhatsApp
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
