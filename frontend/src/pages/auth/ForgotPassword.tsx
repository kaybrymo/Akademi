import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'new_password' | 'success'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the recovery code.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('new_password');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('success');

      // Update user password simulation in localStorage
      try {
        const savedAuth = localStorage.getItem('akademi_auth_user');
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          parsed.password = newPassword;
          localStorage.setItem('akademi_auth_user', JSON.stringify(parsed));
        }
      } catch (e) {}

      // Auto redirect to login after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#FBF9F5]">
      {/* Left side - Deep Forest Green Branding */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-[#0E4833] text-white p-12 lg:p-16 justify-between relative">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Akademi</span>
        </Link>
        
        <div className="max-w-md my-auto py-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-6">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Account Security & Recovery.
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
            Reset your password securely. We will verify your identity with a 6-digit one-time passcode before allowing access to your learning workspace.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
            <p className="text-xs text-emerald-50 leading-relaxed mb-2">
              🛡️ <strong>Encrypted Password Reset</strong>
            </p>
            <p className="text-[11px] text-emerald-200/70">
              For security, reset links expire after 30 minutes. If you have 2FA enabled, you can also verify with your backup codes.
            </p>
          </div>
        </div>

        <div className="text-xs text-emerald-200/50">
          © 2026 Akademi Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 max-w-xl mx-auto w-full">
        <div className="w-full">
          <div className="mb-6">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F5338] transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              {step === 'email' && 'Reset your password'}
              {step === 'otp' && 'Verify reset code'}
              {step === 'new_password' && 'Create new password'}
              {step === 'success' && 'Password reset complete!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {step === 'email' && 'Enter the email associated with your student or tutor account.'}
              {step === 'otp' && `Enter the 6-digit code sent to ${email}. (Demo Code: Any 6 digits or 123456)`}
              {step === 'new_password' && 'Choose a strong password with at least 6 characters.'}
              {step === 'success' && 'Your password has been successfully updated.'}
            </p>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl"
            >
              {errorMsg}
            </motion.div>
          )}

          {infoMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoMsg}</span>
            </motion.div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="email">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ada@akademi.dev"
                    required
                    className="bg-white border border-[#E8E3D7] rounded-xl h-11 pl-10 pr-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0F5338] hover:bg-[#0a3d29] disabled:opacity-50 text-white rounded-full h-11 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                {isLoading ? 'Sending Recovery Code...' : 'Send Recovery Code'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="pt-4 text-center">
                <p className="text-xs text-slate-500">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-[#0F5338] hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center font-bold text-lg rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338]"
                  />
                ))}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0F5338] hover:bg-[#0a3d29] disabled:opacity-50 text-white rounded-full h-11 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                {isLoading ? 'Verifying Code...' : 'Verify Code & Proceed'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="hover:text-[#0F5338] font-medium"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setInfoMsg(`✓ Verification code has been resent to ${email || 'your email'}.`);
                    setTimeout(() => setInfoMsg(''), 4000);
                  }}
                  className="text-[#0F5338] font-bold hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === 'new_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="new-password">
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    id="new-password"
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="bg-white border border-[#E8E3D7] rounded-xl h-11 pl-10 pr-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5" htmlFor="confirm-password">
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    id="confirm-password"
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="bg-white border border-[#E8E3D7] rounded-xl h-11 pl-10 pr-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0F5338] hover:bg-[#0a3d29] disabled:opacity-50 text-white rounded-full h-11 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
              >
                {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5338] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Password Changed Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You can now sign in with your new credentials. Redirecting you to sign in...
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-[#0F5338] hover:bg-[#0a3d29] text-white rounded-full h-11 font-semibold text-xs transition-all shadow-xs"
              >
                Sign In Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
