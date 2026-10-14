import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Wallet, 
  Calendar, 
  Clock, 
  Users, 
  User, 
  CreditCard, 
  Building2, 
  PhoneCall, 
  ShieldCheck,
  Zap,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Payment2FAModal from '@/components/modals/Payment2FAModal';
import { dispatchSessionBookedPush } from '@/lib/websocketPushEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: string;
    name: string;
    subject: string;
    rate: number;
    avatar: string;
    initials: string;
  };
}

const DEFAULT_TIME_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:30 PM', '6:00 PM', '8:00 PM'];
const DURATIONS: { label: string; mins: number }[] = [
  { label: '45 min', mins: 45 },
  { label: '60 min', mins: 60 },
  { label: '90 min', mins: 90 },
];

function getNextTwoWeeks(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getDayCode(d: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[d.getDay()];
}

interface ScheduledSlot {
  id: string;
  date: Date;
  dateStr: string;
  dateLabel: string;
  time: string;
}

export default function BookingModal({ isOpen, onClose, tutor }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [activeDate, setActiveDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [scheduledSlots, setScheduledSlots] = useState<ScheduledSlot[]>([]);

  const [sessionType, setSessionType] = useState<'private' | 'group'>('private');
  const [duration, setDuration] = useState<number>(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Paystack in-modal popup state
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [paystackAmount, setPaystackAmount] = useState(5000);
  const [paystackChannel, setPaystackChannel] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isPaystackProcessing, setIsPaystackProcessing] = useState(false);

  const dates = getNextTwoWeeks();
  const visibleDates = dates.slice(weekOffset * 7, weekOffset * 7 + 7);

  // Auto-select first date when modal opens if none selected
  React.useEffect(() => {
    if (isOpen && selectedDates.length === 0 && !activeDate && visibleDates.length > 0) {
      setSelectedDates([visibleDates[0]]);
      setActiveDate(visibleDates[0]);
    }
  }, [isOpen]);

  // Load Tutor's Scheduled Preferred Times
  const availableSlotsForDate = React.useMemo(() => {
    const targetDate = activeDate || (selectedDates.length > 0 ? selectedDates[0] : null);
    if (!targetDate) return DEFAULT_TIME_SLOTS;
    try {
      const savedSlots = localStorage.getItem('akademi_tutor_available_slots');
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots);
        const dayCode = getDayCode(targetDate);
        if (parsed[dayCode] && Array.isArray(parsed[dayCode]) && parsed[dayCode].length > 0) {
          return parsed[dayCode] as string[];
        }
      }
    } catch (e) {}
    return DEFAULT_TIME_SLOTS;
  }, [activeDate, selectedDates]);

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_wallet_balance_ngn');
      if (saved) return Number(saved);
    } catch (e) {}
    return 3000;
  });

  const [rewardMinutesBalance, setRewardMinutesBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_student_reward_minutes');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 30; // Default grant of 30 converted reward minutes
  });
  const [applyRewardMinutes, setApplyRewardMinutes] = useState(false);
  const [topUpNotice, setTopUpNotice] = useState<string | null>(null);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  // Sync wallet & rewards balance if updated elsewhere
  React.useEffect(() => {
    const syncWalletAndRewards = () => {
      try {
        const saved = localStorage.getItem('akademi_wallet_balance_ngn');
        if (saved) setWalletBalance(Number(saved));
        const savedMins = localStorage.getItem('akademi_student_reward_minutes');
        if (savedMins !== null) setRewardMinutesBalance(Number(savedMins));
      } catch (e) {}
    };
    window.addEventListener('storage', syncWalletAndRewards);
    return () => window.removeEventListener('storage', syncWalletAndRewards);
  }, []);

  const [existingBookings, setExistingBookings] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_booked_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Re-read existing bookings on storage change
  React.useEffect(() => {
    const loadExisting = () => {
      try {
        const saved = localStorage.getItem('akademi_booked_sessions');
        if (saved) setExistingBookings(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', loadExisting);
    return () => window.removeEventListener('storage', loadExisting);
  }, []);

  // Multi-day toggle directly from "This Week" / "Next Week" day buttons
  const handleToggleDay = (d: Date) => {
    const dTime = d.toDateString();
    setActiveDate(d);
    setSelectedDates(prev => {
      const exists = prev.some(item => item.toDateString() === dTime);
      if (exists) {
        // Toggle off if already selected
        return prev.filter(item => item.toDateString() !== dTime);
      } else {
        return [...prev, d];
      }
    });
  };

  // Assign time slot to all selected days
  const handleSelectTimeSlot = (time: string) => {
    setSelectedTime(time);
    const targetDays = selectedDates.length > 0 ? selectedDates : (activeDate ? [activeDate] : []);
    if (targetDays.length === 0) return;

    const newSlots = [...scheduledSlots];

    targetDays.forEach(d => {
      const dStr = formatDateShort(d);
      const dLabel = formatDateLabel(d);
      const slotId = `${dStr}_${time}`;

      const hasConflict = existingBookings.some((b: any) => b.date === dStr && b.time === time);
      if (!hasConflict) {
        const existsIndex = newSlots.findIndex(s => s.id === slotId);
        if (existsIndex >= 0) {
          // Toggle off
          newSlots.splice(existsIndex, 1);
        } else {
          newSlots.push({
            id: slotId,
            date: d,
            dateStr: dStr,
            dateLabel: dLabel,
            time: time
          });
        }
      }
    });

    setScheduledSlots(newSlots);
  };

  const handleRemoveScheduledSlot = (slotId: string) => {
    setScheduledSlots(prev => prev.filter(s => s.id !== slotId));
  };

  // Pricing calculations
  const effectiveSlots = scheduledSlots.length > 0 ? scheduledSlots : (
    (selectedDates.length > 0 ? selectedDates : (activeDate ? [activeDate] : []))
      .filter(() => !!selectedTime)
      .map(d => ({
        id: `${formatDateShort(d)}_${selectedTime}`,
        date: d,
        dateStr: formatDateShort(d),
        dateLabel: formatDateLabel(d),
        time: selectedTime!
      }))
  );

  const sessionCount = Math.max(1, effectiveSlots.length);
  const totalMinutes = duration * sessionCount;
  const singlePrice = Math.round(tutor.rate * duration / 60);
  const singleFinalPrice = sessionType === 'group' ? Math.round(singlePrice * 0.7) : singlePrice;
  const rawTotal = singleFinalPrice * sessionCount;
  const bundleDiscountPercent = sessionCount >= 4 ? 0.10 : sessionCount >= 2 ? 0.05 : 0;
  const standardFinalPrice = Math.round(rawTotal * (1 - bundleDiscountPercent));
  const savings = rawTotal - standardFinalPrice;

  // Reward Minutes Subsidy calculation
  const maxAppliableMinutes = Math.min(rewardMinutesBalance, totalMinutes);
  const appliedRewardMinutes = applyRewardMinutes ? maxAppliableMinutes : 0;
  const rewardSubsidyAmount = appliedRewardMinutes > 0 
    ? Math.round((appliedRewardMinutes / totalMinutes) * standardFinalPrice) 
    : 0;
  const finalPrice = Math.max(0, standardFinalPrice - rewardSubsidyAmount);

  const canAfford = walletBalance >= finalPrice;
  const deficit = Math.max(0, finalPrice - walletBalance);

  // Check if any selected day has a conflict with the currently highlighted time
  const conflictingSession = React.useMemo(() => {
    if (!selectedTime) return null;
    const targetDays = selectedDates.length > 0 ? selectedDates : (activeDate ? [activeDate] : []);
    for (const d of targetDays) {
      const dStr = formatDateShort(d);
      const found = existingBookings.find((b: any) => b.date === dStr && b.time === selectedTime);
      if (found) return found;
    }
    return null;
  }, [selectedDates, activeDate, selectedTime, existingBookings]);

  const handleOpenPaystack = (amount: number) => {
    setPaystackAmount(amount);
    setPaystackOpen(true);
  };

  const handlePaystackPayment = () => {
    setIsPaystackProcessing(true);
    setTimeout(() => {
      setIsPaystackProcessing(false);
      const newBal = walletBalance + paystackAmount;
      setWalletBalance(newBal);
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

      // Record transaction
      const ref = `PSTK_${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const newTx = {
          id: ref,
          type: 'Deposit',
          description: `Paystack Top Up (${paystackChannel.toUpperCase()})`,
          amount: `+₦${paystackAmount.toLocaleString()}`,
          status: 'Completed',
          date: 'Just now'
        };
        localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
      } catch (e) {}

      window.dispatchEvent(new Event('storage'));
      setPaystackOpen(false);
      setTopUpNotice(`✓ Paystack payment of ₦${paystackAmount.toLocaleString()} verified (Ref: ${ref}). You can now confirm your session!`);
      setTimeout(() => setTopUpNotice(null), 5000);
    }, 1400);
  };

  const handleInitiateConfirm = () => {
    const require2FA = localStorage.getItem('akademi_require_payment_2fa') !== 'false';
    if (require2FA && finalPrice > 0) {
      setIs2FAModalOpen(true);
    } else {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newBalance = walletBalance - finalPrice;
      setWalletBalance(newBalance);
      localStorage.setItem('akademi_wallet_balance_ngn', String(newBalance));

      // Deduct reward minutes if applied
      if (appliedRewardMinutes > 0) {
        const newRewardMinutes = Math.max(0, rewardMinutesBalance - appliedRewardMinutes);
        setRewardMinutesBalance(newRewardMinutes);
        localStorage.setItem('akademi_student_reward_minutes', String(newRewardMinutes));
      }

      const existing = JSON.parse(localStorage.getItem('akademi_booked_sessions') || '[]');

      // Generate booking records for all scheduled session slots
      const newBookings = effectiveSlots.map((slot, index) => ({
        id: `BS-${Date.now()}-${index + 1}`,
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatar: tutor.avatar,
        tutorInitials: tutor.initials,
        subject: tutor.subject,
        date: slot.dateStr,
        time: slot.time,
        duration: `${duration} min`,
        type: sessionType,
        price: Math.round(finalPrice / sessionCount),
        studentPaid: Math.round(finalPrice / sessionCount),
        tutorGrossEarnings: Math.round(standardFinalPrice / sessionCount),
        rewardMinutesUsed: Math.round(appliedRewardMinutes / sessionCount),
        rewardSubsidyAmount: Math.round(rewardSubsidyAmount / sessionCount),
        isTokenSubsidized: appliedRewardMinutes > 0,
        status: 'Upcoming',
        bookedAt: new Date().toISOString(),
      }));

      localStorage.setItem('akademi_booked_sessions', JSON.stringify([...newBookings, ...existing]));

      // Record in user transaction history
      try {
        const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const subsidyNote = appliedRewardMinutes > 0 ? ` (Includes ₦${rewardSubsidyAmount.toLocaleString()} LearnTokens Subsidy)` : '';
        const newTx = {
          id: `TX-${Date.now().toString().slice(-6)}`,
          type: 'Session Payment',
          description: `${tutor.subject} with ${tutor.name} (${sessionCount} lesson${sessionCount > 1 ? 's' : ''})${subsidyNote}`,
          amount: `-₦${finalPrice.toLocaleString()}`,
          status: 'Completed',
          date: 'Just now'
        };
        localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
      } catch (e) {}

      // Dispatch WebSockets push notification
      const firstSlot = effectiveSlots[0];
      const slotDisplay = firstSlot ? `${firstSlot.dateStr} · ${firstSlot.time}` : 'Upcoming';
      dispatchSessionBookedPush(tutor.name, tutor.subject, slotDisplay, `₦${finalPrice.toLocaleString()}`);

      window.dispatchEvent(new Event('storage'));
      setIsProcessing(false);
      setStep(4);
    }, 1200);
  };

  const reset = () => {
    setStep(1);
    setSelectedDates([]);
    setActiveDate(null);
    setSelectedTime(null);
    setScheduledSlots([]);
    setSessionType('private');
    setDuration(60);
    setWeekOffset(0);
    setApplyRewardMinutes(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden font-sans"
          >
            {/* Header */}
            {step < 4 && (
              <div className="px-6 pt-5 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {tutor.avatar ? (
                      <img src={tutor.avatar} alt={tutor.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0F5338] text-white flex items-center justify-center font-bold text-sm">
                        {tutor.initials}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-slate-900">{tutor.name}</p>
                      <p className="text-xs text-slate-500">{tutor.subject}</p>
                    </div>
                  </div>
                  <button type="button" onClick={reset} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  {[1,2,3,4].map((s) => (
                    <div key={s} className={cn('h-1.5 rounded-full transition-all duration-300', s === step ? 'bg-[#0F5338] w-6' : s < step ? 'bg-emerald-300 w-3' : 'bg-slate-200 w-3')} />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-bold text-base text-slate-900">Pick session dates & times</h2>
                  {effectiveSlots.length > 0 && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {effectiveSlots.length} Selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select one or multiple days to schedule repeated lessons with {tutor.name}.
                </p>

                {/* Week Navigator */}
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{weekOffset === 0 ? 'This Week' : 'Next Week'}</span>
                  <button type="button" onClick={() => setWeekOffset(Math.min(1, weekOffset + 1))} disabled={weekOffset === 1} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Day selector - Multi-day clickable strip */}
                <div className="grid grid-cols-7 gap-1.5 mb-5">
                  {visibleDates.map((d, i) => {
                    const isSelected = selectedDates.some(item => item.toDateString() === d.toDateString()) || (activeDate?.toDateString() === d.toDateString());
                    const hasScheduledSlots = scheduledSlots.some(s => s.dateStr === formatDateShort(d));
                    const isFirst = i === 0 && weekOffset === 0;

                    return (
                      <button 
                        key={i} 
                        type="button" 
                        onClick={() => handleToggleDay(d)}
                        className={cn(
                          'flex flex-col items-center py-2.5 rounded-2xl text-center transition-all relative active:scale-95',
                          isSelected 
                            ? 'bg-[#0F5338] text-white shadow-md font-bold' 
                            : hasScheduledSlots 
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold' 
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#0F5338]'
                        )}
                      >
                        <span className={cn('text-[9px] font-bold uppercase tracking-wider', isSelected ? 'text-emerald-100' : 'opacity-70')}>
                          {d.toLocaleDateString('en', { weekday: 'short' })}
                        </span>
                        <span className={cn('text-sm font-extrabold mt-0.5', isFirst && !isSelected && 'text-[#0F5338]')}>
                          {d.getDate()}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 absolute bottom-1" />
                        )}
                        {!isSelected && hasScheduledSlots && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Section */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Available Times {selectedDates.length > 1 ? `(${selectedDates.length} Days Selected)` : activeDate ? `— ${formatDateLabel(activeDate)}` : ''}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✨ Tutor's Available Slots
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {availableSlotsForDate.map((t) => {
                      const isTimeChosen = effectiveSlots.some(s => s.time === t && (
                        selectedDates.some(d => s.dateStr === formatDateShort(d)) || (activeDate && s.dateStr === formatDateShort(activeDate))
                      ));
                      
                      const hasConflict = (selectedDates.length > 0 ? selectedDates : (activeDate ? [activeDate] : [])).some(
                        d => existingBookings.some((b: any) => b.date === formatDateShort(d) && b.time === t)
                      );

                      return (
                        <button 
                          key={t} 
                          type="button" 
                          onClick={() => handleSelectTimeSlot(t)}
                          className={cn(
                            'py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5',
                            isTimeChosen && 'bg-[#0F5338] text-white border-[#0F5338] shadow-xs ring-2 ring-[#0F5338]/20',
                            !isTimeChosen && hasConflict && 'bg-amber-50/70 border-amber-300 text-amber-900 hover:bg-amber-100',
                            !isTimeChosen && !hasConflict && 'bg-white border-slate-200 text-slate-700 hover:border-[#0F5338] hover:text-[#0F5338]'
                          )}
                        >
                          <span>{t}</span>
                          {isTimeChosen ? (
                            <span className="text-[9px] font-bold text-emerald-200">✓ Selected</span>
                          ) : hasConflict ? (
                            <span className="text-[9px] font-bold text-amber-700">⚠️ Conflict</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Conflict Warning Notification */}
                  {conflictingSession && (
                    <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-900">⚠️ Schedule Conflict Detected</p>
                        <p className="text-slate-600 mt-0.5 leading-relaxed text-[11px]">
                          You already have a booked session (<strong>{conflictingSession.subject}</strong> with {conflictingSession.tutorName}) at <strong>{selectedTime}</strong> on {conflictingSession.date}. Please choose a different slot.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-Session Queue Box */}
                {effectiveSlots.length > 0 && (
                  <div className="mt-4 p-3.5 bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-[#0F5338]" />
                        <span>{effectiveSlots.length} Scheduled Lesson{effectiveSlots.length > 1 ? 's' : ''} in this Booking</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setScheduledSlots([]); setSelectedDates([]); }}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-semibold"
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Selected Slots Chips */}
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {effectiveSlots.map((slot) => (
                        <div 
                          key={slot.id}
                          className="bg-white border border-[#E8E3D7] rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-800 shadow-2xs"
                        >
                          <span>{slot.dateLabel} · {slot.time}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveScheduledSlot(slot.id)}
                            className="text-slate-400 hover:text-red-500 rounded p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  disabled={effectiveSlots.length === 0}
                  className="w-full mt-6 bg-[#0F5338] hover:bg-[#0A3D29] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98]"
                >
                  Continue with {sessionCount} Session{sessionCount > 1 ? 's' : ''} →
                </button>
              </div>
            )}

            {/* Step 2: Session Config */}
            {step === 2 && (
              <div className="p-6">
                <h2 className="font-bold text-base text-slate-900 mb-1">Session details</h2>
                <p className="text-xs text-slate-500 mb-5">Choose type and duration for your {sessionCount} scheduled lesson{sessionCount > 1 ? 's' : ''}</p>
                
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Session Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'private' as const, Icon: User, label: '1:1 Private', desc: 'Dedicated session just for you' },
                      { key: 'group' as const, Icon: Users, label: 'Group Session', desc: '30% cheaper, 3–8 students' },
                    ].map(({ key, Icon, label, desc }) => (
                      <button key={key} type="button" onClick={() => setSessionType(key)}
                        className={cn('p-3.5 rounded-2xl border-2 text-left transition-all active:scale-95',
                          sessionType === key ? 'border-[#0F5338] bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                        )}>
                        <Icon className={cn('w-5 h-5 mb-1.5', sessionType === key ? 'text-[#0F5338]' : 'text-slate-400')} />
                        <p className="text-xs font-bold text-slate-900">{label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Duration per Session</p>
                  <div className="flex gap-2">
                    {DURATIONS.map(({ label, mins }) => (
                      <button key={mins} type="button" onClick={() => setDuration(mins)}
                        className={cn('flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95',
                          duration === mins ? 'bg-[#0F5338] text-white border-[#0F5338]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0F5338] hover:text-[#0F5338]'
                        )}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Rewards & Token Subsidy Card */}
                {rewardMinutesBalance > 0 && (
                  <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/60 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-950">
                          Apply LearnTokens Reward Time
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                        {rewardMinutesBalance} Mins Available
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-amber-900/80 leading-tight">
                        {applyRewardMinutes 
                          ? `Applying ${appliedRewardMinutes} min free time (-₦${rewardSubsidyAmount.toLocaleString()})`
                          : `Use your earned reward time to discount this booking`}
                      </p>
                      <button
                        type="button"
                        onClick={() => setApplyRewardMinutes(!applyRewardMinutes)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0",
                          applyRewardMinutes 
                            ? "bg-amber-600 text-white shadow-xs" 
                            : "bg-white border border-amber-300 text-amber-900 hover:bg-amber-100"
                        )}
                      >
                        {applyRewardMinutes ? '✓ Applied' : 'Apply Free Mins'}
                      </button>
                    </div>
                    {applyRewardMinutes && (
                      <p className="text-[10px] text-emerald-800 font-medium pt-1 border-t border-amber-200/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Akademi subsidizes ₦{rewardSubsidyAmount.toLocaleString()} from rewards pool. Tutor receives 100% full earnings (₦{standardFinalPrice.toLocaleString()}).
                      </p>
                    )}
                  </div>
                )}

                {/* Total & Discount Card */}
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-3 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-800">
                      {sessionCount} Session{sessionCount > 1 ? 's' : ''} ({duration} min each)
                    </span>
                  </div>
                  <div className="text-right">
                    {(bundleDiscountPercent > 0 || rewardSubsidyAmount > 0) && (
                      <p className="text-[10px] text-slate-400 line-through">₦{rawTotal.toLocaleString()}</p>
                    )}
                    <p className="text-base font-black text-[#0F5338]">₦{finalPrice.toLocaleString()}</p>
                  </div>
                </div>

                {bundleDiscountPercent > 0 && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>🎉 Multi-Session Savings: ₦{savings.toLocaleString()} discounted ({bundleDiscountPercent * 100}% off)!</span>
                  </div>
                )}

                {rewardSubsidyAmount > 0 && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>🪙 Reward Subsidy: ₦{rewardSubsidyAmount.toLocaleString()} covered by LearnTokens ({appliedRewardMinutes} mins)!</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Back</button>
                  <button type="button" onClick={() => setStep(3)} className="flex-[2] py-3 rounded-xl bg-[#0F5338] hover:bg-[#0A3D29] text-white text-sm font-semibold transition-all active:scale-[0.98]">Review & Confirm →</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm & Pay */}
            {step === 3 && (
              <div className="p-6">
                <h2 className="font-bold text-base text-slate-900 mb-1">Confirm your booking</h2>
                <p className="text-xs text-slate-500 mb-4">Review {sessionCount} scheduled session{sessionCount > 1 ? 's' : ''} and pay from your wallet</p>
                
                <div className="bg-[#FBF9F4] rounded-2xl p-4 border border-[#E8E3D7] mb-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {tutor.avatar ? (
                      <img src={tutor.avatar} alt={tutor.name} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#0F5338] text-white font-bold text-sm flex items-center justify-center">{tutor.initials}</div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-slate-900">{tutor.name}</p>
                      <p className="text-xs text-slate-500">{tutor.subject}</p>
                    </div>
                  </div>

                  {/* Scheduled Slots List */}
                  <div className="space-y-1.5 max-h-36 overflow-y-auto py-1 divide-y divide-[#E8E3D7]/60">
                    {effectiveSlots.map((slot, idx) => (
                      <div key={slot.id || idx} className="flex items-center justify-between text-xs pt-1.5 first:pt-0">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{slot.dateStr} at {slot.time}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">({duration} min)</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#E8E3D7]">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Standard Tuition ({sessionCount} lessons):</span>
                      <span className="font-semibold">₦{rawTotal.toLocaleString()}</span>
                    </div>

                    {bundleDiscountPercent > 0 && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                        <span>Multi-Session Discount ({bundleDiscountPercent * 100}%):</span>
                        <span>-₦{savings.toLocaleString()}</span>
                      </div>
                    )}

                    {rewardSubsidyAmount > 0 && (
                      <div className="flex items-center justify-between text-xs text-amber-800 font-bold bg-amber-100/60 px-2 py-1 rounded-lg">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          LearnTokens Reward Subsidy ({appliedRewardMinutes} min):
                        </span>
                        <span>-₦{rewardSubsidyAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-[#E8E3D7]">
                      <div>
                        <span className="text-xs text-slate-700 font-bold">{sessionType === 'group' ? 'Group Session' : '1:1 Private'} · Net to Pay</span>
                        {rewardSubsidyAmount > 0 && (
                          <span className="block text-[10px] text-emerald-700 font-medium">Tutor receives full ₦{standardFinalPrice.toLocaleString()} earnings</span>
                        )}
                      </div>
                      <span className="text-base font-black text-[#0F5338]">₦{finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notice Banner */}
                {topUpNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{topUpNotice}</span>
                  </div>
                )}

                {/* Wallet Balance & Paystack Top Up */}
                {canAfford ? (
                  <div className="rounded-xl p-3.5 bg-emerald-50 border border-emerald-200 flex items-center justify-between mb-5 text-sm">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-xs text-emerald-900">Wallet: ₦{walletBalance.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                      ✓ Balance Sufficient
                    </span>
                  </div>
                ) : (
                  <div className="rounded-2xl p-4 bg-amber-50 border border-amber-200 mb-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-amber-950">
                          Wallet: ₦{walletBalance.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                        Short ₦{deficit.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-900/80 leading-normal">
                      Your balance is short by ₦{deficit.toLocaleString()} for all {sessionCount} sessions. Top up with Paystack to continue without leaving your booking:
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleOpenPaystack(deficit)}
                        className="px-4 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Paystack Top Up (₦{deficit.toLocaleString()})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenPaystack(5000)}
                        className="px-3 py-2 bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      >
                        + ₦5,000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenPaystack(10000)}
                        className="px-3 py-2 bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 rounded-xl text-xs font-semibold transition-all active:scale-95"
                      >
                        + ₦10,000
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">← Back</button>
                  <button type="button" onClick={handleInitiateConfirm} disabled={!canAfford || isProcessing}
                    className="flex-[2] py-3 rounded-xl bg-[#0F5338] hover:bg-[#0A3D29] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    {isProcessing ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>) : `✓ Confirm & Pay (${sessionCount} Sessions)`}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="p-8 text-center">
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-5">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Session Booked! 🎉</h2>
                  <p className="text-sm text-slate-500 mb-1"><strong>{tutor.name}</strong> · {tutor.subject}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {scheduledSlots.length > 0
                      ? `${scheduledSlots.length} Session${scheduledSlots.length > 1 ? 's' : ''} (${scheduledSlots.map(s => `${s.dateLabel} at ${s.time}`).join(', ')})`
                      : selectedDates.length > 0 ? `${formatDateShort(selectedDates[0])} at ${selectedTime || '4:30 PM'}` : 'Confirmed Session'} · {duration} min
                  </p>
                  <p className="text-sm font-bold text-[#0F5338] mt-2">₦{finalPrice.toLocaleString()} paid from wallet</p>
                  {appliedRewardMinutes > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{appliedRewardMinutes} min LearnTokens reward subsidy applied (₦{rewardSubsidyAmount.toLocaleString()} saved!)</span>
                    </div>
                  )}
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-2 mt-7">
                  <Link to="/dashboard/sessions" onClick={reset} className="flex-1 py-3 rounded-xl bg-[#0F5338] hover:bg-[#0A3D29] text-white text-sm font-semibold text-center transition-all active:scale-[0.98]">View Sessions →</Link>
                  <button type="button" onClick={reset} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Close</button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Embedded Paystack Top-Up Checkout Window */}
      {paystackOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
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
                <p className="text-xs text-emerald-100/80 mt-0.5">Direct Wallet Top-Up</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-emerald-200">Amount to Pay</p>
                <p className="text-xl font-serif font-bold text-white">₦{paystackAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Payment Channel Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card' as const, label: 'Debit Card', icon: CreditCard },
                  { id: 'transfer' as const, label: 'Bank Transfer', icon: Building2 },
                  { id: 'ussd' as const, label: 'USSD', icon: PhoneCall },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setPaystackChannel(ch.id)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all active:scale-95",
                      paystackChannel === ch.id
                        ? "border-[#0F5338] bg-[#EAF5EE] text-[#0F5338] font-bold shadow-2xs"
                        : "border-[#E8E3D7] text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <ch.icon className="h-4 w-4" />
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>

              {paystackChannel === 'card' && (
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
                  <p className="text-base font-black text-[#0F5338] font-mono">*737*50*{paystackAmount}#</p>
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
                  onClick={handlePaystackPayment}
                  className="flex-[2] py-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isPaystackProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Verifying with Paystack...
                    </span>
                  ) : (
                    <span>Pay ₦{paystackAmount.toLocaleString()} with Paystack →</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2FA Security Modal Before Session Booking Confirmation */}
      <Payment2FAModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onSuccess={() => {
          setIs2FAModalOpen(false);
          handleConfirm();
        }}
        amount={finalPrice}
        purpose={`${tutor.subject} Tutoring with ${tutor.name}`}
      />
    </AnimatePresence>
  );
}
