import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CreditCard, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AdminOverview() {
  const [defaultGatewayName, setDefaultGatewayName] = useState(() => {
    return localStorage.getItem('akademi_default_gateway_name') || 'Paystack';
  });
  const [commissionRate, setCommissionRate] = useState(() => {
    return Number(localStorage.getItem('akademi_commission_rate') || 10);
  });
  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false;
  });

  React.useEffect(() => {
    const syncGateway = () => {
      const gw = localStorage.getItem('akademi_default_gateway_name');
      if (gw) setDefaultGatewayName(gw);
      const comm = localStorage.getItem('akademi_commission_rate');
      if (comm) setCommissionRate(Number(comm));
      const savedComm = localStorage.getItem('akademi_enable_communities');
      setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
    };
    window.addEventListener('storage', syncGateway);
    return () => window.removeEventListener('storage', syncGateway);
  }, []);

  const [bookings, setBookings] = useState([
    { id: 1, student: 'Chioma Adeyemi', tutor: 'Dr. Ibrahim Musa', subject: 'Further Math', date: 'Today, 2:00 PM', amount: '₦5,000', status: 'Confirmed' },
    { id: 2, student: 'Oluwaseun Ojo', tutor: 'Sarah Okafor', subject: 'Physics', date: 'Today, 4:30 PM', amount: '₦4,500', status: 'Pending' },
    { id: 3, student: 'Aisha Bello', tutor: 'Chinedu Eze', subject: 'Chemistry', date: 'Tomorrow, 10:00 AM', amount: '₦4,500', status: 'Confirmed' },
    { id: 4, student: 'Emeka Uzo', tutor: 'Dr. Ibrahim Musa', subject: 'Calculus', date: 'Tomorrow, 1:00 PM', amount: '₦5,000', status: 'Cancelled' },
    { id: 5, student: 'Ngozi Okoro', tutor: 'Grace Etim', subject: 'Biology', date: 'Oct 24, 3:00 PM', amount: '₦4,000', status: 'Confirmed' },
  ]);

  const [activeRange, setActiveRange] = useState<'7d' | '30d' | '90d'>('7d');

  const chartData = {
    '7d': [
      { day: 'Mon', sessions: 24, revenue: 120000 },
      { day: 'Tue', sessions: 32, revenue: 160000 },
      { day: 'Wed', sessions: 28, revenue: 140000 },
      { day: 'Thu', sessions: 45, revenue: 225000 },
      { day: 'Fri', sessions: 52, revenue: 260000 },
      { day: 'Sat', sessions: 68, revenue: 340000 },
      { day: 'Sun', sessions: 40, revenue: 200000 },
    ],
    '30d': [
      { day: 'Week 1', sessions: 180, revenue: 900000 },
      { day: 'Week 2', sessions: 210, revenue: 1050000 },
      { day: 'Week 3', sessions: 245, revenue: 1225000 },
      { day: 'Week 4', sessions: 290, revenue: 1450000 },
    ],
    '90d': [
      { day: 'Month 1', sessions: 780, revenue: 3900000 },
      { day: 'Month 2', sessions: 920, revenue: 4600000 },
      { day: 'Month 3', sessions: 1150, revenue: 5750000 },
    ]
  };

  const currentChart = chartData[activeRange];
  const maxSessions = Math.max(...currentChart.map(d => d.sessions));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
          <p className="text-sm text-slate-500 mt-1">Platform activity, revenue analytics, and quick operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to="/admin/payments" 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200 shadow-2xs"
          >
            <CreditCard className="h-4 w-4" /> {defaultGatewayName} Default Active
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Students', value: '12,847', trend: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', link: '/admin/users' },
          { label: 'Active Tutors', value: '423', trend: '+5 verified', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-100', link: '/admin/tutors' },
          { label: 'Sessions Today', value: '189', trend: '32 live now', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/admin/sessions' },
          { label: 'Revenue (MTD)', value: '₦4.82M', trend: '+15% growth', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-100', link: '/admin/payments' },
          enableCommunities
            ? { label: 'Communities Governance', value: '4 Active Hubs', trend: '₦1.7M MRR', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100', link: '/admin/communities' }
            : { label: 'Communities Module', value: 'Launch Inactive', trend: 'Disabled in Settings', icon: BookOpen, color: 'text-slate-500', bg: 'bg-slate-100', link: '/admin/settings' },
        ].map((stat, i) => (
          <Link 
            key={i} 
            to={stat.link}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend.split(' ')[0]}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          to="/admin/tutors" 
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-5 flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Review Pending Tutors</h4>
              <p className="text-xs text-slate-600">2 applications awaiting approval</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          to="/admin/payments" 
          className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 p-5 flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Manage Payment Gateways</h4>
              <p className="text-xs text-slate-600">{defaultGatewayName} default · {commissionRate}% commission</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link 
          to="/admin/subjects" 
          className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-5 flex items-center justify-between hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Subject Catalog</h4>
              <p className="text-xs text-slate-600">10 categories active</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
        </Link>
        {enableCommunities ? (
          <Link 
            to="/admin/communities" 
            className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 p-5 flex items-center justify-between hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Community Moderation</h4>
                <p className="text-xs text-slate-600">Review & Manage Hubs</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link 
            to="/admin/settings" 
            className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-400 text-white flex items-center justify-center font-bold">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">Communities Module</h4>
                  <span className="text-[9px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">Disabled</span>
                </div>
                <p className="text-xs text-slate-500">Enable in Platform Settings</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform Activity & Session Volume</h3>
                <p className="text-xs text-slate-500">Live completed sessions and student attendance trend</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['7d', '30d', '90d'] as const).map((r) => (
                  <button 
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                      activeRange === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Quarter'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div className="h-64 flex items-end gap-3 sm:gap-6 pt-8 pb-2 px-2">
              {currentChart.map((item, idx) => {
                const heightPct = Math.round((item.sessions / maxSessions) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-semibold whitespace-nowrap pointer-events-none shadow-lg z-10">
                      {item.sessions} sessions · ₦{item.revenue.toLocaleString()}
                    </div>

                    <div className="w-full bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={cn(
                          "w-full rounded-t-lg transition-colors group-hover:bg-emerald-600",
                          idx === currentChart.length - 2 ? "bg-emerald-500" : "bg-emerald-400/80"
                        )}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">Recent Lesson Bookings</h3>
              <Link to="/admin/sessions" className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">
                View all sessions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Tutor</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-semibold text-slate-900">{row.student}</td>
                      <td className="px-6 py-3 text-slate-600">{row.tutor}</td>
                      <td className="px-6 py-3 text-slate-600">{row.subject}</td>
                      <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">{row.date}</td>
                      <td className="px-6 py-3 font-bold text-slate-900">{row.amount}</td>
                      <td className="px-6 py-3">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                          row.status === 'Confirmed' ? "bg-emerald-100 text-emerald-700" :
                          row.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Top Tutors */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-900">Highest Rated Tutors</h3>
              <Link to="/admin/tutors" className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
                Manage
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Dr. Ibrahim Musa', initials: 'IM', subject: 'Mathematics', rating: '4.9', sessions: 342, bg: 'bg-blue-100 text-blue-700' },
                { name: 'Sarah Okafor', initials: 'SO', subject: 'Physics', rating: '4.8', sessions: 289, bg: 'bg-emerald-100 text-emerald-700' },
                { name: 'Chinedu Eze', initials: 'CE', subject: 'Chemistry', rating: '4.9', sessions: 256, bg: 'bg-indigo-100 text-indigo-700' },
                { name: 'Grace Etim', initials: 'GE', subject: 'Biology', rating: '4.7', sessions: 198, bg: 'bg-amber-100 text-amber-700' },
                { name: 'David Osei', initials: 'DO', subject: 'Economics', rating: '4.8', sessions: 167, bg: 'bg-violet-100 text-violet-700' },
              ].map((tutor, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0", tutor.bg)}>
                      {tutor.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-none">{tutor.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{tutor.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600">★ {tutor.rating}</span>
                    <p className="text-[10px] text-slate-400">{tutor.sessions} lessons</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
