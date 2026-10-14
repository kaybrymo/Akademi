import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Trash2, 
  Clock, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  RefreshCw,
  Play,
  Download,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminRecording {
  id: number;
  sessionTitle: string;
  tutorName: string;
  tutorEmail: string;
  date: string;
  duration: string;
  sizeMb: number;
  daysRemaining: number;
  isKept: boolean;
  status: 'Active (Free 10d)' | 'Extended (Billed)' | 'Expired (Pending Purge)';
}

const initialAdminRecordings: AdminRecording[] = [
  {
    id: 1,
    sessionTitle: 'Calculus — Integration by parts & substitution',
    tutorName: 'Dr. Ibrahim Musa',
    tutorEmail: 'ibrahim.m@example.com',
    date: 'Jun 9, 2026',
    duration: '58 min',
    sizeMb: 240,
    daysRemaining: 7,
    isKept: false,
    status: 'Active (Free 10d)',
  },
  {
    id: 2,
    sessionTitle: 'Spanish conversation drill & verb conjugations',
    tutorName: 'Sarah Okafor',
    tutorEmail: 'sarah.o@example.com',
    date: 'Jun 7, 2026',
    duration: '44 min',
    sizeMb: 180,
    daysRemaining: 5,
    isKept: false,
    status: 'Active (Free 10d)',
  },
  {
    id: 3,
    sessionTitle: 'Physics — Quantum mechanics and wave packets',
    tutorName: 'Dr. Ibrahim Musa',
    tutorEmail: 'ibrahim.m@example.com',
    date: 'May 28, 2026',
    duration: '62 min',
    sizeMb: 310,
    daysRemaining: 9999,
    isKept: true,
    status: 'Extended (Billed)',
  },
  {
    id: 4,
    sessionTitle: 'Essay structure & thesis development workshop',
    tutorName: 'David Osei',
    tutorEmail: 'david.o@example.com',
    date: 'May 20, 2026',
    duration: '50 min',
    sizeMb: 210,
    daysRemaining: 0,
    isKept: false,
    status: 'Expired (Pending Purge)',
  },
];

export default function AdminRecordings() {
  const [recordings, setRecordings] = useState<AdminRecording[]>(initialAdminRecordings);
  const [monthlyStorageFee, setMonthlyStorageFee] = useState<number>(() => {
    return Number(localStorage.getItem('akademi_recording_monthly_fee') || 1500);
  });
  const [freeRetentionDays, setFreeRetentionDays] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePricing = () => {
    localStorage.setItem('akademi_recording_monthly_fee', String(monthlyStorageFee));
    showToast(`Monthly recording retention fee set to ₦${monthlyStorageFee.toLocaleString()} / month.`);
  };

  const handleRunPurge = () => {
    const expiredCount = recordings.filter(r => r.status === 'Expired (Pending Purge)').length;
    setRecordings(recordings.filter(r => r.status !== 'Expired (Pending Purge)'));
    showToast(`Purge complete! ${expiredCount} expired recordings (>10 days) removed to free disk space.`);
  };

  const handleDeleteRecording = (id: number) => {
    const target = recordings.find(r => r.id === id);
    setRecordings(recordings.filter(r => r.id !== id));
    showToast(`Recording "${target?.sessionTitle}" purged from platform storage.`);
  };

  const filtered = recordings.filter(r => 
    r.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tutorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStorageMb = recordings.reduce((acc, curr) => acc + curr.sizeMb, 0);
  const extendedCount = recordings.filter(r => r.isKept).length;
  const monthlyRevenue = extendedCount * monthlyStorageFee;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 font-sans pb-12"
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recording & Storage Policy Controls</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure 10-day retention policies, set tutor storage billing pricing, and monitor storage utilization.
          </p>
        </div>
        <button
          onClick={handleRunPurge}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" /> Run 10-Day Purge Cleanup
        </button>
      </div>

      {/* Storage KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved Recordings', value: recordings.length, icon: Database, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Total Storage Consumed', value: `${(totalStorageMb / 1024).toFixed(2)} GB`, icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Extended Storage Plans', value: `${extendedCount} Tutors`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Monthly Storage MRR', value: `₦${monthlyRevenue.toLocaleString()}`, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-lg shrink-0", stat.bg, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Storage Settings & Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2-Column: Recordings Audit Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Recording Vault</h2>
              <p className="text-xs text-slate-500">Live inventory of active and extended video recordings.</p>
            </div>
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search session or tutor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-5 py-3">Session & Tutor</th>
                    <th className="px-5 py-3">Recorded</th>
                    <th className="px-5 py-3">Size</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                        No recordings match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-bold text-slate-900 leading-snug">{rec.sessionTitle}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{rec.tutorName} ({rec.tutorEmail})</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                          {rec.date}
                          <p className="text-[10px] text-slate-400">{rec.duration}</p>
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-700">{rec.sizeMb} MB</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                            rec.status.includes('Extended') ? "bg-emerald-100 text-emerald-800" :
                            rec.status.includes('Active') ? "bg-blue-100 text-blue-800" :
                            "bg-red-100 text-red-800"
                          )}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteRecording(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Purge Recording"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1-Column: Pricing Policy Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
              <Database className="h-5 w-5 text-emerald-600" />
              <h3>Storage Pricing Configuration</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Set the monthly fee charged to tutors who elect to keep and retain session recordings beyond the complimentary 10-day window.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Free Retention Window
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={freeRetentionDays} 
                    readOnly
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 font-bold"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400 font-bold">
                    Days
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Applies to all new session recordings automatically.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tutor Monthly Storage Rate (₦ / Month)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="500" 
                    step="100"
                    value={monthlyStorageFee}
                    onChange={(e) => setMonthlyStorageFee(Number(e.target.value))}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400 font-bold">
                    ₦ / mo
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <p className="font-semibold text-slate-700">Storage Economics:</p>
                <p className="text-slate-500">10 Extended Recordings &rarr; <span className="font-bold text-emerald-600">₦{(monthlyStorageFee * 10).toLocaleString()} / mo</span></p>
                <p className="text-slate-500">50 Extended Recordings &rarr; <span className="font-bold text-emerald-600">₦{(monthlyStorageFee * 50).toLocaleString()} / mo</span></p>
              </div>

              <button
                onClick={handleSavePricing}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" /> Save Storage Rate
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 text-xs text-blue-900 leading-relaxed">
            <h4 className="font-bold text-blue-950 mb-1">Attendee Privacy Guarantee</h4>
            <p className="text-blue-800">
              Recordings are guarded by database-level enrollment checks. Only authenticated students who attended the session can launch playback replays.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
