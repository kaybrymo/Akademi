import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  BookOpen, 
  Trash2, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { requestWebPushPermission, getWebPushPermissionState } from '@/lib/websocketPushEngine';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'session' | 'payment' | 'message' | 'course';
  link?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Session confirmed with Dr. Ibrahim Sanni',
    desc: 'Your Physics 1-on-1 session is scheduled for 20 Aug at 2:00 PM.',
    time: '5m ago',
    read: false,
    type: 'session',
    link: '/dashboard/sessions'
  },
  {
    id: 'notif-2',
    title: 'New lesson notes uploaded',
    desc: 'Daniel Okafor uploaded summary formulas and homework for Calculus.',
    time: '1h ago',
    read: false,
    type: 'course',
    link: '/dashboard/sessions'
  },
  {
    id: 'notif-3',
    title: 'Wallet Top-up Successful',
    desc: '₦10,000 was credited to your Akademi wallet via Paystack.',
    time: '3h ago',
    read: true,
    type: 'payment',
    link: '/dashboard/billing'
  },
  {
    id: 'notif-4',
    title: 'New message from Halima Yusuf',
    desc: '¡Hola! I have shared the vocabulary list for our upcoming conversation session.',
    time: '1d ago',
    read: true,
    type: 'message',
    link: '/dashboard/messages'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_NOTIFICATIONS;
  });

  const [pushPermission, setPushPermission] = useState(getWebPushPermissionState);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const syncNotifs = () => {
      try {
        const saved = localStorage.getItem('akademi_user_notifications');
        if (saved) setNotifications(JSON.parse(saved));
        setPushPermission(getWebPushPermissionState());
      } catch (e) {}
    };
    window.addEventListener('storage', syncNotifs);
    return () => window.removeEventListener('storage', syncNotifs);
  }, []);

  const handleEnablePush = async () => {
    const res = await requestWebPushPermission();
    setPushPermission(res);
    if (res === 'granted') {
      setToastMsg('✓ Mobile & Browser Push Notifications enabled!');
    } else {
      setToastMsg('Push Notifications permission state: ' + res);
    }
    setTimeout(() => setToastMsg(null), 3000);
  };

  const save = (items: NotificationItem[]) => {
    setNotifications(items);
    localStorage.setItem('akademi_user_notifications', JSON.stringify(items));
    window.dispatchEvent(new Event('storage'));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    save(updated);
    setToastMsg('All notifications marked as read');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    save(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    save(updated);
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'session': return <Calendar className="w-4 h-4 text-[#0F5338]" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'course': return <BookOpen className="w-4 h-4 text-amber-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl font-sans"
    >
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F5338] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#141E18] tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Stay updated with your scheduled lessons, messages, payments, and tutor notes.
          </p>
        </div>

      {/* Web Push Permission Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <Bell className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Instant Mobile & Desktop OS Push Notifications</h3>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                pushPermission === 'granted' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              )}>
                {pushPermission === 'granted' ? '✓ Push Active' : 'Permission Pending'}
              </span>
            </div>
            <p className="text-xs text-purple-100/80 mt-0.5">
              Receive real-time push banners on your phone and desktop when tutors send messages or upload lesson notes.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnablePush}
          disabled={pushPermission === 'granted'}
          className={cn(
            "px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer",
            pushPermission === 'granted' ? "bg-white/10 text-white/70 border border-white/20 cursor-default" : "bg-purple-500 hover:bg-purple-400 text-white"
          )}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{pushPermission === 'granted' ? '✓ OS Notifications Active' : 'Enable Mobile Push →'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
          {notifications.some(n => !n.read) && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-[#E8E3D7] pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
            filter === 'all'
              ? "bg-[#0F5338] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
            filter === 'unread'
              ? "bg-[#0F5338] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E3D7] p-12 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No notifications to show</p>
            <p className="text-xs text-slate-400">You are all caught up with your lessons and updates.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={cn(
                "bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs flex items-start justify-between gap-4 transition-all hover:border-[#0F5338]/40",
                !item.read ? "border-emerald-200 bg-emerald-50/10" : "border-[#E8E3D7]"
              )}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#FBF9F4] border border-[#E8E3D7] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn("text-xs sm:text-sm font-bold truncate", !item.read ? "text-slate-900" : "text-slate-700")}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{item.time}</span>
                    {item.link && (
                      <Link
                        to={item.link}
                        className="font-bold text-[#0F5338] hover:underline flex items-center gap-0.5"
                      >
                        <span>View details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleRead(item.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  title={item.read ? "Mark as unread" : "Mark as read"}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
