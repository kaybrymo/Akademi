import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center p-6 font-sans">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-16">
        <div className="w-9 h-9 rounded-xl bg-[#0F5338] text-white flex items-center justify-center shadow-md">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="font-serif font-bold text-2xl tracking-tight text-[#0F5338]">Akademi</span>
      </Link>

      {/* Floating Icon */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
          <GraduationCap className="w-12 h-12 text-slate-300" />
        </div>
      </motion.div>

      {/* 404 Number */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[120px] font-black text-slate-100 leading-none select-none -mb-4"
      >
        404
      </motion.p>

      {/* Heading & subtext */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          The link may be broken, or the page may have been moved or deleted.
        </p>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors shadow-sm active:scale-95"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </motion.div>

      <p className="mt-12 text-[11px] text-slate-400">© 2026 Akademi · All rights reserved</p>
    </div>
  );
}
