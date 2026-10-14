import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Payment2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  purpose: string;
  gatewayName?: string;
}

export default function Payment2FAModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  purpose,
  gatewayName = 'Paystack'
}: Payment2FAModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(45);
  const [resendActive, setResendActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setCountdown(45);
      setResendActive(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val.replace(/\D/g, '');
    setOtp(newOtp);
    setError(null);

    // Auto-focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit payment authentication code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 900);
  };

  const handleResend = () => {
    setCountdown(45);
    setResendActive(false);
    setError(null);
    setOtp(['', '', '', '', '', '']);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header Banner */}
          <div className="bg-[#0E4833] text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_60%)] pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Payment 2FA Security</h3>
                  <p className="text-xs text-emerald-200/80">Authorize platform transaction</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/60 hover:text-white text-sm font-semibold p-1.5 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Transaction Details Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Payment Authorization</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[200px]">{purpose}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Via {gatewayName} Gateway</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Amount</p>
                <p className="text-lg font-black text-emerald-700">₦{amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Instruction */}
            <div className="text-center">
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-digit confirmation code has been generated for your account. Enter the authorization code below to approve the charge.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold text-amber-900">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                Demo 2FA Code: <span className="font-mono font-bold tracking-widest text-amber-950">123456</span>
              </div>
            </div>

            {/* 6-Digit OTP Box Grid */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={cn(
                      "w-11 h-12 text-center text-lg font-black font-mono rounded-xl border transition-all outline-none",
                      digit 
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20" 
                        : "border-slate-300 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    )}
                  />
                ))}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl h-11 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authorizing & Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize Payment of ₦{amount.toLocaleString()}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <span>Didn't receive code?</span>
                  {resendActive ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="font-bold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span className="text-slate-400">Resend in {countdown}s</span>
                  )}
                </div>
              </div>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by Akademi 256-Bit Bank Grade Payment Encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
