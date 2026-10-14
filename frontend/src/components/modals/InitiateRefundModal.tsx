import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, DollarSign, Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InitiateRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRefund: (amount: number, reason: string, refundType: 'Full' | 'Partial') => void;
  transaction: {
    id: string;
    student: string;
    tutor: string;
    amt: number;
    gw: string;
    date: string;
    status?: string;
  } | null;
}

export default function InitiateRefundModal({
  isOpen,
  onClose,
  onConfirmRefund,
  transaction
}: InitiateRefundModalProps) {
  const [refundType, setRefundType] = useState<'Full' | 'Partial'>('Full');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('Student Cancelled Session');
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setRefundType('Full');
      setCustomAmount(String(transaction.amt));
      setReason('Student Cancelled Session');
      setAdminNote('');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const maxAmount = transaction.amt;
  const effectiveAmount = refundType === 'Full' ? maxAmount : (Number(customAmount) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0 || effectiveAmount > maxAmount) {
      alert(`Please enter a valid refund amount between ₦1 and ₦${maxAmount.toLocaleString()}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmRefund(effectiveAmount, reason, refundType);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Initiate Direct Refund</h3>
                <p className="text-xs text-slate-400">Transaction ID: {transaction.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Transaction Overview Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Customer / Student</span>
                  <span className="font-bold text-slate-800">{transaction.student}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Payment Gateway</span>
                  <span className="font-bold text-emerald-700">{transaction.gw}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Original Charge</span>
                  <span className="font-extrabold text-slate-900 text-sm">₦{transaction.amt.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Date of Charge</span>
                  <span className="font-medium text-slate-700">{transaction.date}</span>
                </div>
              </div>
            </div>

            {/* Refund Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Refund Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setRefundType('Full'); setCustomAmount(String(maxAmount)); }}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    refundType === 'Full'
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  <p className="text-xs font-bold">Full Refund (100%)</p>
                  <p className="text-sm font-extrabold text-emerald-700 mt-1">₦{maxAmount.toLocaleString()}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRefundType('Partial')}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    refundType === 'Partial'
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}
                >
                  <p className="text-xs font-bold">Partial Refund</p>
                  <p className="text-xs text-slate-500 mt-1">Custom partial amount</p>
                </button>
              </div>
            </div>

            {/* Custom Amount Input for Partial */}
            {refundType === 'Partial' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Partial Refund Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₦</span>
                  <input
                    type="number"
                    min="100"
                    max={maxAmount}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`Max ₦${maxAmount.toLocaleString()}`}
                    required
                    className="w-full h-11 pl-8 pr-4 border border-slate-300 rounded-xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Maximum allowed: ₦{maxAmount.toLocaleString()}</p>
              </div>
            )}

            {/* Refund Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Refund
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-11 px-3 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Student Cancelled Session">Student Cancelled Session (Eligible for Refund)</option>
                <option value="Tutor No-Show">Tutor No-Show / Unattended Booking</option>
                <option value="Duplicate Card Charge">Duplicate Card Charge / Billing Error</option>
                <option value="Technical Classroom Disruption">Technical Classroom / Video Disruption</option>
                <option value="Customer Satisfaction / Goodwill Credit">Customer Satisfaction / Goodwill Credit</option>
              </select>
            </div>

            {/* Admin Internal Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Audit Note (Optional)
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Approved per student support ticket #492"
                className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Notice Alert */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Direct Gateway & Ledger Action:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Confirming this action will disburse <strong>₦{effectiveAmount.toLocaleString()}</strong> back to <strong>{transaction.student}</strong>'s wallet and log a verified refund event in the audit trail.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || effectiveAmount <= 0}
                className="flex-1 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Refund...</span>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Execute ₦{effectiveAmount.toLocaleString()} Refund</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
