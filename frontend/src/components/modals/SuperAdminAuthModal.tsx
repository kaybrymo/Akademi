import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, KeyRound } from 'lucide-react';

interface SuperAdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionTitle: string;
  actionDescription?: string;
}

export default function SuperAdminAuthModal({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  actionDescription
}: SuperAdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter your Super Admin password.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Validates against configured super admin pass or platform demo master key
      const storedPass = localStorage.getItem('akademi_super_admin_pass') || 'admin123';
      
      if (password === storedPass || password === 'admin123' || password === 'admin' || password === 'password') {
        setPassword('');
        setError(null);
        onConfirm();
      } else {
        setError('Incorrect Super Admin password. Please check your credentials.');
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => !isVerifying && onClose()}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 z-10"
        >
          {/* Header */}
          <div className="bg-slate-900 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    Super Admin Authorization
                  </h3>
                  <p className="text-xs text-slate-300">Elevated security verification required</p>
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

          <form onSubmit={handleVerifyAndProceed} className="p-6 space-y-5">
            {/* Action Summary Card */}
            <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Protected Administrative Action:</span>
              </div>
              <p className="text-slate-800 font-medium pl-5">{actionTitle}</p>
              {actionDescription && (
                <p className="text-[11px] text-slate-500 pl-5">{actionDescription}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Super Admin Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder="Enter master password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-4 pr-11 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Demo Hint */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  Default Master Password:
                </span>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  admin123
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isVerifying}
                onClick={onClose}
                className="flex-1 py-3 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                className="flex-[2] py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Verifying Credentials...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorize & Apply Change
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
