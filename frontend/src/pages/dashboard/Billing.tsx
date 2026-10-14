import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  Star, 
  ShieldCheck, 
  Building2, 
  PhoneCall,
  ArrowDownToLine,
  AlertCircle,
  Check,
  X,
  Clock,
  Sparkles,
  Coins,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Payment2FAModal from '@/components/modals/Payment2FAModal';

interface PaidSession {
  id: number;
  title: string;
  tutor: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  avatar: string;
}

interface PayoutItem {
  id: string;
  amt: number;
  date: string;
  status: string;
  bank: string;
}

interface PurchasedCourse {
  id: number;
  title: string;
  category: string;
  tutor: string;
  level: string;
  rating: string;
  sessions: string;
  price: string;
  purchaseDate: string;
  avatar: string;
  bg: string;
  border: string;
}

const paidSessionsData: PaidSession[] = [
  {
    id: 1,
    title: "Calculus — Integration by parts",
    tutor: "Dr. Chiamaka Eze",
    date: "Jun 5",
    time: "4:00 PM",
    duration: "60 min",
    price: "₦35,000",
    avatar: "/images/tutor-daniel.jpg"
  },
  {
    id: 2,
    title: "Mechanics — Projectile motion",
    tutor: "James Okonkwo",
    date: "Jun 3",
    time: "5:00 PM",
    duration: "60 min",
    price: "₦35,000",
    avatar: "/images/tutor-ibrahim.jpg"
  },
  {
    id: 3,
    title: "Listening drill — B2",
    tutor: "Halima Yusuf",
    date: "May 30",
    time: "6:30 PM",
    duration: "45 min",
    price: "₦28,000",
    avatar: "/images/tutor-adaeze.jpg"
  },
  {
    id: 4,
    title: "Spanish conversation practice",
    tutor: "Halima Yusuf",
    date: "May 25",
    time: "6:00 PM",
    duration: "45 min",
    price: "₦28,000",
    avatar: "/images/tutor-adaeze.jpg"
  }
];

const purchasedCoursesData: PurchasedCourse[] = [
  {
    id: 1,
    title: "Mastering Calculus Foundations",
    category: "MATHEMATICS",
    tutor: "Daniel Okafor",
    level: "Intermediate",
    rating: "4.9",
    sessions: "12 sessions",
    price: "₦34,000",
    purchaseDate: "May 12, 2026",
    avatar: "/images/tutor-daniel.jpg",
    bg: "bg-[#EAF5EE]",
    border: "border-[#D5EADB]"
  },
  {
    id: 2,
    title: "Physics for Engineers",
    category: "PHYSICS",
    tutor: "Dr. Ibrahim Sanni",
    level: "Advanced",
    rating: "4.9",
    sessions: "16 sessions",
    price: "₦28,000",
    purchaseDate: "Apr 28, 2026",
    avatar: "/images/tutor-ibrahim.jpg",
    bg: "bg-[#E8F3F5]",
    border: "border-[#D4E7EA]"
  },
  {
    id: 3,
    title: "French for Travellers",
    category: "LANGUAGES",
    tutor: "Adaeze Nwosu",
    level: "Beginner",
    rating: "4.8",
    sessions: "10 sessions",
    price: "₦18,000",
    purchaseDate: "Apr 10, 2026",
    avatar: "/images/tutor-adaeze.jpg",
    bg: "bg-[#FDF2E3]",
    border: "border-[#F3E3CD]"
  }
];

export default function Billing() {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('akademi_wallet_balance_ngn');
    return saved ? Number(saved) : 142500;
  });

  const [userRole] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved).role || 'student';
    } catch (e) {}
    return 'student';
  });
  const isTutor = userRole === 'tutor';

  const [tutorKyc] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_tutor_kyc');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: 'Daniel Chukwuebuka Okafor',
      status: 'Verified'
    };
  });

  const [minPayoutThreshold] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_min_payout_threshold');
      if (saved) return Number(saved);
    } catch (e) {}
    return 5000;
  });

  const [userTokens, setUserTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_tokens');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 450;
  });

  const [studentRewardMinutes, setStudentRewardMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_student_reward_minutes');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 30;
  });

  const [defaultGatewayName, setDefaultGatewayName] = useState(() => {
    return localStorage.getItem('akademi_default_gateway_name') || 'Paystack';
  });
  const [selectedPreset, setSelectedPreset] = useState<number | null>(2500);
  const [customAmount, setCustomAmount] = useState<string>('2500');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [paymentChannel, setPaymentChannel] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Dynamic Paid Sessions
  const [paidSessions, setPaidSessions] = useState<any[]>(() => {
    const dynamic: any[] = [];
    try {
      const saved = localStorage.getItem('akademi_booked_sessions');
      if (saved) {
        const list = JSON.parse(saved);
        list.forEach((b: any, i: number) => {
          dynamic.push({
            id: 1000 + i,
            title: `${b.subject} — 1:1 Session`,
            tutor: b.tutorName || 'Vetted Tutor',
            date: b.date || 'Today',
            time: b.time || '4:30 PM',
            duration: b.duration || '60 min',
            price: `₦${Number(b.price || 3500).toLocaleString()}`,
            avatar: b.tutorAvatar || '/images/tutor-daniel.jpg',
            isTokenSubsidized: Boolean(b.isTokenSubsidized || b.rewardSubsidyAmount > 0),
            rewardSubsidyAmount: b.rewardSubsidyAmount || 0,
            rewardMinutesUsed: b.rewardMinutesUsed || 0,
            tutorGrossEarnings: b.tutorGrossEarnings || b.price
          });
        });
      }
    } catch (e) {}
    return [...dynamic, ...paidSessionsData];
  });

  // Dynamic Purchased Courses
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(() => {
    const dynamic: PurchasedCourse[] = [];
    try {
      const saved = localStorage.getItem('akademi_purchased_courses');
      if (saved) {
        const list = JSON.parse(saved);
        list.forEach((c: any, i: number) => {
          dynamic.push({
            id: 2000 + i,
            title: c.title,
            category: c.category || 'ACADEMICS',
            tutor: c.tutorName || c.tutor || 'Lead Tutor',
            level: c.level || 'Intermediate',
            rating: c.rating || '4.9',
            sessions: c.sessions || '12 sessions',
            price: `₦${Number(c.price || 34000).toLocaleString()}`,
            purchaseDate: c.purchaseDate || 'Just now',
            avatar: c.avatar || '/images/tutor-daniel.jpg',
            bg: 'bg-[#EAF5EE]',
            border: 'border-[#D5EADB]'
          });
        });
      }
    } catch (e) {}
    return [...dynamic, ...purchasedCoursesData];
  });

  // Dynamic Transaction History
  const [userTransactions, setUserTransactions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'TX-892144',
        type: 'Session Payment',
        description: 'Calculus Session with Dr. Funmilayo Adeyemi',
        amount: '-₦3,500',
        status: 'Completed',
        date: 'Today, 2:45 PM'
      },
      {
        id: 'PSTK-551920',
        type: 'Deposit',
        description: 'Paystack Top Up (Card)',
        amount: '+₦10,000',
        status: 'Completed',
        date: 'Yesterday'
      },
      {
        id: 'CRS-441203',
        type: 'Course Purchase',
        description: 'Mastering Calculus Foundations (Daniel Okafor)',
        amount: '-₦34,000',
        status: 'Completed',
        date: 'May 12, 2026'
      }
    ];
  });

  // Payout Request State for Tutors
  const [payoutAmount, setPayoutAmount] = useState<string>('25000');
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutItem[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_tutor_payouts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'PO-9821', amt: 50000, date: 'Jun 05, 2026', status: 'Completed', bank: 'GTBank (•••6789)' },
      { id: 'PO-8812', amt: 35000, date: 'May 28, 2026', status: 'Completed', bank: 'GTBank (•••6789)' }
    ];
  });

  // Always reset scroll to the very top when Billing page mounts or route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem('akademi_wallet_balance_ngn', String(balance));
  }, [balance]);

  // Read default gateway configured in Admin
  useEffect(() => {
    try {
      const savedGw = localStorage.getItem('akademi_admin_gateways');
      if (savedGw) {
        const list = JSON.parse(savedGw);
        const def = list.find((g: any) => g.isDefault);
        if (def) setDefaultGatewayName(def.name);
      }
    } catch (e) {}
  }, [checkoutModalOpen]);

  // Storage listener to sync all billing data in real time
  useEffect(() => {
    const syncData = () => {
      try {
        const savedBal = localStorage.getItem('akademi_wallet_balance_ngn');
        if (savedBal) setBalance(Number(savedBal));
      } catch (e) {}

      try {
        const savedBookings = localStorage.getItem('akademi_booked_sessions');
        if (savedBookings) {
          const list = JSON.parse(savedBookings);
          const dynamic = list.map((b: any, i: number) => ({
            id: 1000 + i,
            title: `${b.subject} — 1:1 Session`,
            tutor: b.tutorName || 'Vetted Tutor',
            date: b.date || 'Today',
            time: b.time || '4:30 PM',
            duration: b.duration || '60 min',
            price: `₦${Number(b.price || 3500).toLocaleString()}`,
            avatar: b.tutorAvatar || '/images/tutor-daniel.jpg'
          }));
          setPaidSessions([...dynamic, ...paidSessionsData]);
        }
      } catch (e) {}

      try {
        const savedCourses = localStorage.getItem('akademi_purchased_courses');
        if (savedCourses) {
          const list = JSON.parse(savedCourses);
          const dynamic = list.map((c: any, i: number) => ({
            id: 2000 + i,
            title: c.title,
            category: c.category || 'ACADEMICS',
            tutor: c.tutorName || c.tutor || 'Lead Tutor',
            level: c.level || 'Intermediate',
            rating: c.rating || '4.9',
            sessions: c.sessions || '12 sessions',
            price: `₦${Number(c.price || 34000).toLocaleString()}`,
            purchaseDate: c.purchaseDate || 'Just now',
            avatar: c.avatar || '/images/tutor-daniel.jpg',
            bg: 'bg-[#EAF5EE]',
            border: 'border-[#D5EADB]'
          }));
          setPurchasedCourses([...dynamic, ...purchasedCoursesData]);
        }
      } catch (e) {}

      try {
        const savedTx = localStorage.getItem('akademi_user_transactions');
        if (savedTx) setUserTransactions(JSON.parse(savedTx));
      } catch (e) {}

      try {
        const savedGwName = localStorage.getItem('akademi_default_gateway_name');
        if (savedGwName) setDefaultGatewayName(savedGwName);
      } catch (e) {}
    };

    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const handleSelectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(String(amount));
  };

  const handleStartTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(customAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid top-up amount');
      return;
    }
    setCheckoutModalOpen(true);
  };

  const handleInitiatePaymentCheckout = () => {
    const require2FA = localStorage.getItem('akademi_require_payment_2fa') !== 'false';
    if (require2FA) {
      setIs2FAModalOpen(true);
    } else {
      handleCompletePayment();
    }
  };

  const handleCompletePayment = () => {
    const amt = Number(customAmount);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBal = balance + amt;
      setBalance(newBal);
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

      // Record in transaction history
      const ref = `PSTK-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx = {
        id: ref,
        type: 'Deposit',
        description: `Wallet Top Up via ${defaultGatewayName} (${paymentChannel.toUpperCase()})`,
        amount: `+₦${amt.toLocaleString()}`,
        status: 'Completed',
        date: 'Just now'
      };
      try {
        const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const updatedTx = [newTx, ...existingTx];
        setUserTransactions(updatedTx);
        localStorage.setItem('akademi_user_transactions', JSON.stringify(updatedTx));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}

      setCheckoutModalOpen(false);
      setIs2FAModalOpen(false);
      setSuccessToast(`₦${amt.toLocaleString()} added to your wallet via ${defaultGatewayName}!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 1100);
  };

  const handleStartPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutError(null);
    const amt = Number(payoutAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setPayoutError('Please enter a valid withdrawal amount.');
      return;
    }
    if (amt < minPayoutThreshold) {
      setPayoutError(`Minimum payout amount set by administrator is ₦${minPayoutThreshold.toLocaleString()}.`);
      return;
    }
    if (amt > balance) {
      setPayoutError(`Requested amount (₦${amt.toLocaleString()}) exceeds your available balance (₦${balance.toLocaleString()}).`);
      return;
    }
    setPayoutModalOpen(true);
  };

  const handleConfirmPayout = () => {
    const amt = Number(payoutAmount);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBal = Math.max(0, balance - amt);
      setBalance(newBal);
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

      const poId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
      const newEntry = {
        id: poId,
        amt: amt,
        date: 'Today, Just now',
        status: 'Processing',
        bank: `${tutorKyc.bankName || 'GTBank'} (•••${tutorKyc.accountNumber?.slice(-4) || '6789'})`
      };
      const updated = [newEntry, ...payoutHistory];
      setPayoutHistory(updated);
      localStorage.setItem('akademi_tutor_payouts', JSON.stringify(updated));

      // Record in user transactions
      const newTx = {
        id: poId,
        type: 'Tutor Payout',
        description: `Withdrawal to ${tutorKyc.bankName || 'GTBank'} (•••${tutorKyc.accountNumber?.slice(-4) || '6789'})`,
        amount: `-₦${amt.toLocaleString()}`,
        status: 'Processing',
        date: 'Just now'
      };
      try {
        const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const updatedTx = [newTx, ...existingTx];
        setUserTransactions(updatedTx);
        localStorage.setItem('akademi_user_transactions', JSON.stringify(updatedTx));
      } catch (e) {}

      setPayoutModalOpen(false);
      setSuccessToast(`Payout request of ₦${amt.toLocaleString()} submitted to ${tutorKyc.bankName || 'GTBank'}!`);
      setTimeout(() => setSuccessToast(null), 4500);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 max-w-6xl font-sans pb-12"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER */}
      <div>
        {isTutor ? (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full mb-1">
              <Building2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>Tutor Earnings & Settlement Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
              Earnings & Payouts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Request custom withdrawals to your verified Nigerian bank account and review settlement history.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-medium mb-1">Payments & wallet</p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
              Billing
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Top up your wallet, view paid sessions and purchased courses.
            </p>
          </div>
        )}
      </div>

      {/* 2. TOP 3 METRIC KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(isTutor ? [
          { label: "WITHDRAWABLE BALANCE", value: balance, prefix: "₦", decimals: 2, icon: Wallet },
          { label: "LIFETIME LESSON REVENUE", value: 485000, prefix: "₦", decimals: 0, icon: Calendar },
          { label: "COMPLETED PAYOUTS", value: 342500, prefix: "₦", decimals: 0, icon: ArrowDownToLine }
        ] : [
          { label: "WALLET BALANCE", value: balance, prefix: "₦", decimals: 2, icon: Wallet },
          { label: "LEARNTOKENS REWARDS", value: userTokens, suffix: " Tokens", decimals: 0, icon: Wallet },
          { label: "FREE REWARD MINUTES", value: studentRewardMinutes, suffix: " Mins Free", decimals: 0, icon: Clock }
        ]).map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-[#0F5338]/70" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                <AnimatedCounter 
                  value={stat.value} 
                  prefix={stat.prefix || ""} 
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals}
                />
              </h3>
            </div>
          );
        })}
      </div>

      {/* 3. MIDDLE SPLIT: CURRENT BALANCE & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card (5 cols): Current Balance */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#EAF5EE] text-[#0F5338] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {isTutor ? 'Withdrawable Balance' : 'Current balance'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </h2>

            {isTutor && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Connected Bank:</span>
                  <span className="font-bold text-slate-800">{tutorKyc.bankName || 'GTBank'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Account Number:</span>
                  <span className="font-mono font-bold text-slate-800">{tutorKyc.accountNumber || '0123456789'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Account Holder:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[170px]">{tutorKyc.accountName || 'Daniel Okafor'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
            {isTutor ? (
              <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-[11px] font-semibold">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Admin Min Balance: <strong>₦{minPayoutThreshold.toLocaleString()}</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Instant checkout via <strong className="text-slate-700 font-semibold">{defaultGatewayName}</strong></span>
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Direct NUBAN
            </span>
          </div>
        </div>

        {/* Right Card (7 cols): Tutor Custom Payout Request OR Student Top Up */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
          {isTutor ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownToLine className="w-4 h-4 text-[#0F5338]" />
                <h3 className="font-serif font-bold text-base text-[#141E18]">
                  Request Desired Payout
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Enter any withdrawal amount. Platform policy set by administrator requires a minimum balance of ₦{minPayoutThreshold.toLocaleString()}.
              </p>

              {/* Preset Withdrawal Pills */}
              <div className="grid grid-cols-4 gap-2.5 mb-5">
                {[5000, 10000, 25000, 50000].map((amt) => {
                  const isSelected = Number(payoutAmount) === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPayoutAmount(String(amt))}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-semibold transition-all text-center border",
                        isSelected
                          ? "bg-[#EAF5EE] border-2 border-[#0F5338] text-[#0F5338] font-bold shadow-2xs"
                          : "bg-white border-[#E8E3D7] text-slate-700 hover:border-slate-300"
                      )}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount & Form */}
              <form onSubmit={handleStartPayout} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      DESIRED PAYOUT AMOUNT (NGN)
                    </label>
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(String(balance))}
                      className="text-[11px] font-bold text-[#0F5338] hover:underline"
                    >
                      Withdraw All (₦{balance.toLocaleString()})
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-serif">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={minPayoutThreshold}
                      step="500"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl h-11 pl-8 pr-4 text-sm font-semibold text-[#141E18] focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>
                  {payoutError && (
                    <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {payoutError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full py-3 text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Request Payout of ₦{Number(payoutAmount || 0).toLocaleString()} &rarr;
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-[#0F5338]" />
                <h3 className="font-serif font-bold text-base text-[#141E18]">
                  Top up wallet
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Choose an amount to add to your balance instantly via {defaultGatewayName}.
              </p>

              {/* Preset Amount Pills */}
              <div className="grid grid-cols-4 gap-2.5 mb-5">
                {[1000, 2500, 5000, 10000].map((amt) => {
                  const isSelected = selectedPreset === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={cn(
                        "py-2.5 rounded-xl text-xs font-semibold transition-all text-center border",
                        isSelected
                          ? "bg-[#EAF5EE] border-2 border-[#0F5338] text-[#0F5338] font-bold shadow-2xs"
                          : "bg-white border-[#E8E3D7] text-slate-700 hover:border-slate-300"
                      )}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input & Submit Form */}
              <form onSubmit={handleStartTopup} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    OR ENTER CUSTOM AMOUNT (NGN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-serif">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedPreset(null);
                      }}
                      placeholder="Enter amount..."
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl h-11 pl-8 pr-4 text-sm font-semibold text-[#141E18] focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full py-3 text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  Continue to top up &rarr;
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* 4. RECENT SESSIONS / PAYOUT DISBURSALS */}
      {isTutor ? (
        <div className="bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-base text-[#141E18]">
                Recent Payout Disbursals
              </h3>
              <p className="text-xs text-slate-500">History of requested and settled transfers to your Nigerian bank.</p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Direct Paystack Settlement
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E3D7] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-bold">Payout Ref</th>
                  <th className="pb-3 font-bold">Destination Account</th>
                  <th className="pb-3 font-bold">Date Initiated</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Amount Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3D7]/60">
                {payoutHistory.map((po) => (
                  <tr key={po.id} className="hover:bg-[#FBF9F4]/60 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-700">{po.id}</td>
                    <td className="py-3.5 text-slate-800 font-medium">{po.bank}</td>
                    <td className="py-3.5 text-slate-500">{po.date}</td>
                    <td className="py-3.5">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        po.status === 'Completed' ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
                      )}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-[#0F5338] font-mono text-sm">
                      ₦{po.amt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F5338]" />
              <h3 className="font-serif font-bold text-lg text-[#141E18]">
                Paid sessions
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {paidSessions.length} session{paidSessions.length > 1 ? 's' : ''} recorded
            </span>
          </div>

          <div className="divide-y divide-[#E8E3D7]/70">
            {paidSessions.map((s) => (
              <div 
                key={s.id} 
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBF9F4]/80 -mx-6 px-6 transition-colors rounded-xl group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img 
                      src={s.avatar} 
                      alt={s.tutor} 
                      className="w-12 h-12 rounded-full object-cover shadow-2xs ring-2 ring-[#0F5338]/10 group-hover:ring-[#0F5338]/25 transition-all" 
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#141E18] tracking-tight leading-snug">
                      {s.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      with {s.tutor}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.date} · {s.time} · {s.duration}</span>
                      </div>
                      {s.isTokenSubsidized && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                          Token Subsidized (-₦{Number(s.rewardSubsidyAmount || 0).toLocaleString()} covered)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-[#141E18] font-mono block">
                      {s.price}
                    </span>
                    {s.isTokenSubsidized && (
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        Full Tutor Credit: ₦{Number(s.tutorGrossEarnings || 3500).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0F5338] bg-[#EAF5EE] border border-[#D5EADB] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5338]" />
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DYNAMIC TRANSACTION HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="font-serif font-bold text-base text-[#141E18]">
              All Payment Transactions & Wallet Activity
            </h3>
            <p className="text-xs text-slate-500">Live ledger of deposits, session checkout debits, course purchases, and payouts.</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            {userTransactions.length} Total Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E3D7] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-bold">Transaction Ref</th>
                <th className="pb-3 font-bold">Type</th>
                <th className="pb-3 font-bold">Description</th>
                <th className="pb-3 font-bold">Date & Time</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D7]/60">
              {userTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FBF9F4]/60 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-slate-700">{tx.id}</td>
                  <td className="py-3.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      tx.type === 'Deposit' ? "bg-emerald-100 text-emerald-800" :
                      tx.type === 'Course Purchase' ? "bg-purple-100 text-purple-800" :
                      tx.type === 'Tutor Payout' ? "bg-amber-100 text-amber-800" :
                      "bg-blue-100 text-blue-800"
                    )}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-800 font-medium">{tx.description}</td>
                  <td className="py-3.5 text-slate-500">{tx.date}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1 h-1 rounded-full bg-emerald-600" />
                      {tx.status || 'Completed'}
                    </span>
                  </td>
                  <td className={cn(
                    "py-3.5 text-right font-bold font-mono text-sm",
                    tx.amount.startsWith('+') ? "text-emerald-600" : "text-slate-900"
                  )}>
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. PURCHASED COURSES */}
      <div className="bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-serif font-bold text-base text-[#141E18]">
              Purchased courses
            </h3>
            <p className="text-xs text-slate-500">Courses you have enrolled in with lifetime access.</p>
          </div>
          <Link to="/dashboard/courses" className="text-xs font-semibold text-[#0F5338] hover:underline">
            Go to My Courses &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {purchasedCourses.map((course) => (
            <div
              key={course.id}
              className={`${course.bg} ${course.border} border rounded-2xl p-5 shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                    {course.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {course.price}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#141E18] mb-2 leading-snug">
                  {course.title}
                </h4>

                <div className="flex items-center gap-2 mb-4 text-xs text-slate-600">
                  <img src={course.avatar} alt={course.tutor} className="w-5 h-5 rounded-full object-cover" />
                  <span>{course.tutor}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-0.5 font-semibold text-slate-800">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {course.rating}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>{course.sessions}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Purchased {course.purchaseDate}
                </span>
                <span className="bg-white text-[#0F5338] border border-[#D5EADB] rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5338]" />
                  Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => !isProcessing && setCheckoutModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E8E3D7]"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#0F5338] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">Instant Top-up</h3>
                  <p className="text-xs text-emerald-100/80 mt-0.5">{defaultGatewayName} Gateway</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-emerald-200">Amount</p>
                  <p className="text-xl font-serif font-bold text-white">₦{Number(customAmount).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Payment Channel Selector */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Debit Card', icon: CreditCard },
                    { id: 'transfer', label: 'Bank Transfer', icon: Building2 },
                    { id: 'ussd', label: 'USSD', icon: PhoneCall },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setPaymentChannel(ch.id as any)}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all",
                        paymentChannel === ch.id
                          ? "border-[#0F5338] bg-[#EAF5EE] text-[#0F5338] font-bold shadow-2xs"
                          : "border-[#E8E3D7] text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <ch.icon className="h-4 w-4" />
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>

                {paymentChannel === 'card' && (
                  <div className="space-y-3 bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">CARD NUMBER</label>
                      <input 
                        type="text" 
                        readOnly 
                        value="5399 4120 •••• 8821" 
                        className="w-full h-9 px-3 bg-white border border-[#E8E3D7] rounded-lg font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">EXPIRY</label>
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

                {paymentChannel === 'transfer' && (
                  <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-2 text-center">
                    <p className="text-slate-500">Pay to Wema Bank / {defaultGatewayName} Virtual Account:</p>
                    <p className="text-base font-black text-[#0F5338] font-mono">0123 456 789</p>
                    <p className="text-[10px] text-slate-400">Account expires in 30 minutes</p>
                  </div>
                )}

                {paymentChannel === 'ussd' && (
                  <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-2 text-center">
                    <p className="text-slate-500">Dial on your registered phone:</p>
                    <p className="text-base font-black text-[#0F5338] font-mono">*737*50*{Number(customAmount)}#</p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleInitiatePaymentCheckout}
                  className="w-full py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing payment...
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Pay ₦{Number(customAmount).toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#0F5338]" /> 256-bit SSL encrypted & PCI-DSS compliant
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tutor Payout Confirmation Modal */}
      <AnimatePresence>
        {payoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
              onClick={() => !isProcessing && setPayoutModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#E8E3D7]"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#0F5338] text-white flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-900/50 px-2 py-0.5 rounded-full mb-1">
                    <Building2 className="w-3 h-3 text-emerald-300" />
                    <span>Tutor Settlement Hub</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg leading-tight">Confirm Payout Request</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-emerald-200">Payout Amount</p>
                  <p className="text-xl font-serif font-bold text-white">₦{Number(payoutAmount || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Bank & Settlement Details */}
                <div className="bg-[#FBF9F4] p-4 rounded-2xl border border-[#E8E3D7] text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E3D7]">
                    <span className="text-slate-500 font-medium">Destination Bank</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#0F5338]" />
                      {tutorKyc.bankName || 'Guaranty Trust Bank (GTBank)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E3D7]">
                    <span className="text-slate-500 font-medium">Account Number</span>
                    <span className="font-mono font-bold text-slate-900">
                      {tutorKyc.accountNumber || '0123456789'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E3D7]">
                    <span className="text-slate-500 font-medium">Account Name</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {tutorKyc.accountName || 'Daniel Chukwuebuka Okafor'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Disbursement Schedule</span>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      Weekly Friday 4:00 PM
                    </span>
                  </div>
                </div>

                {/* Remaining Balance Summary */}
                <div className="flex items-center justify-between text-xs px-1 text-slate-600">
                  <span>Estimated Balance After Withdrawal:</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">
                    ₦{Math.max(0, balance - Number(payoutAmount || 0)).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setPayoutModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmPayout}
                    className="flex-1 py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Confirm Payout
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#0F5338]" /> Verified Direct Bank NUBAN Settlement
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2FA Verification Modal Before Payment */}
      <Payment2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onSuccess={handleCompletePayment}
        amount={Number(customAmount)}
        purpose="Wallet Balance Top-Up"
        gatewayName={defaultGatewayName}
      />
    </motion.div>
  );
}
