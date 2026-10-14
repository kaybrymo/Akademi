import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Paperclip, 
  CheckCheck,
  Building2,
  ShieldCheck,
  Sparkles,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  UserPlus,
  GraduationCap,
  Users,
  Calendar,
  FileText,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn, getAvatarUrl } from '@/lib/utils';
import { dispatchChatMessagePush } from '@/lib/websocketPushEngine';

// Universal Message Ledger Schema (Supports cross-role two-way communication)
export interface LedgerMessage {
  id: string | number;
  fromName: string;
  fromRole: 'student' | 'tutor' | 'admin' | 'super_admin';
  toName: string;
  text: string;
  time: string;
  timestamp: number;
}

export interface PlatformContact {
  id: number | string;
  name: string;
  role: string;
  avatar: string;
  contactType: 'student' | 'tutor' | 'admin';
  topic: string;
  online: boolean;
}

// Master Directory of All Platform Participants
const MASTER_CONTACTS: PlatformContact[] = [
  // Platform Support / Admin
  {
    id: 'admin-desk',
    name: 'Akademi Admin Desk',
    role: 'Platform Operations & Support Desk',
    avatar: '/images/hero-student.jpg',
    contactType: 'admin',
    topic: 'Platform Support & Payouts',
    online: true
  },
  // Tutors
  {
    id: 'tutor-chiamaka-eze',
    name: 'Dr. Chiamaka Eze',
    role: 'Lead Mathematics & Calculus Specialist',
    avatar: '/images/tutor-daniel.jpg',
    contactType: 'tutor',
    topic: 'Calculus & Advanced Mathematics',
    online: true
  },
  {
    id: 'tutor-daniel-okafor',
    name: 'Daniel Okafor',
    role: 'Mathematics & Mechanics Specialist',
    avatar: '/images/tutor-daniel.jpg',
    contactType: 'tutor',
    topic: 'A-Level Mathematics & Mechanics',
    online: true
  },
  {
    id: 'tutor-adaeze-nwosu',
    name: 'Adaeze Nwosu',
    role: 'Conversational Spanish & French Educator',
    avatar: '/images/tutor-adaeze.jpg',
    contactType: 'tutor',
    topic: 'Conversational Spanish & DELE Prep',
    online: true
  },
  {
    id: 'tutor-ibrahim-sanni',
    name: 'Dr. Ibrahim Sanni',
    role: 'Physics & Engineering Specialist',
    avatar: '/images/tutor-ibrahim.jpg',
    contactType: 'tutor',
    topic: 'Engineering Physics & Electromagnetism',
    online: false
  },
  {
    id: 'tutor-chinwe-uche',
    name: 'Chinwe Uche',
    role: 'Science & Medical Exam Strategist',
    avatar: '/images/tutor-daniel.jpg',
    contactType: 'tutor',
    topic: 'Organic Chemistry & JAMB Medicine',
    online: true
  },
  // Students
  {
    id: 'student-chiamaka-ada',
    name: 'Chiamaka Ada',
    role: 'Student · A-Level Science & Mathematics',
    avatar: '/images/hero-student.jpg',
    contactType: 'student',
    topic: 'A-Level Science & Mathematics',
    online: true
  },
  {
    id: 'student-chiamaka-obi',
    name: 'Chiamaka Obi',
    role: 'Student · A-Level Mathematics',
    avatar: '/images/hero-student.jpg',
    contactType: 'student',
    topic: 'Calculus & Integration by Parts',
    online: true
  },
  {
    id: 'student-ngozi-uche',
    name: 'Ngozi Uche',
    role: 'Student · Trigonometry & Calculus',
    avatar: '/images/hero-student.jpg',
    contactType: 'student',
    topic: 'Trigonometry & Calculus',
    online: true
  },
  {
    id: 'student-yusuf-ibrahim',
    name: 'Yusuf Ibrahim',
    role: 'Student · Physics Lab & Wave Optics',
    avatar: '/images/tutor-ibrahim.jpg',
    contactType: 'student',
    topic: 'Physics Lab & Wave Optics',
    online: false
  },
  {
    id: 'student-emeka-nnaji',
    name: 'Emeka Nnaji',
    role: 'Student · Physics Fundamentals',
    avatar: '/images/tutor-daniel.jpg',
    contactType: 'student',
    topic: 'Kinematics & Vector Fields',
    online: true
  },
  {
    id: 'student-amina-bello',
    name: 'Amina Bello',
    role: 'Student · Algebra & Trig',
    avatar: '/images/tutor-adaeze.jpg',
    contactType: 'student',
    topic: 'Quadratic & Polynomial Functions',
    online: false
  },
  {
    id: 'student-segun-adeyemi',
    name: 'Segun Adeyemi',
    role: 'Student · Calculus Prep',
    avatar: '/images/tutor-ibrahim.jpg',
    contactType: 'student',
    topic: 'Calculus Prep & Derivatives',
    online: true
  }
];

// Initial shared conversation history across the platform
const initialLedgerSeed: LedgerMessage[] = [
  // Student Chiamaka Ada <-> Dr. Chiamaka Eze (Tutor)
  {
    id: 'seed-1',
    fromName: 'Chiamaka Ada',
    fromRole: 'student',
    toName: 'Dr. Chiamaka Eze',
    text: 'Good morning Dr. Eze! I worked through the calculus substitution worksheet.',
    time: 'Yesterday · 4:10 PM',
    timestamp: Date.now() - 86400000
  },
  {
    id: 'seed-2',
    fromName: 'Dr. Chiamaka Eze',
    fromRole: 'tutor',
    toName: 'Chiamaka Ada',
    text: 'Wonderful work Chiamaka! Let us review question 4 during our upcoming session today.',
    time: 'Today · 8:30 AM',
    timestamp: Date.now() - 3600000
  },
  // Student Chiamaka Ada <-> Adaeze Nwosu (Tutor)
  {
    id: 'seed-3',
    fromName: 'Adaeze Nwosu',
    fromRole: 'tutor',
    toName: 'Chiamaka Ada',
    text: '¡Hola Chiamaka! I have uploaded the Spanish vocabulary cheat sheet for our session tomorrow.',
    time: 'Today · 1:15 PM',
    timestamp: Date.now() - 7200000
  },
  // Student Chiamaka Ada <-> Admin Desk
  {
    id: 'seed-4',
    fromName: 'Akademi Admin Desk',
    fromRole: 'admin',
    toName: 'Chiamaka Ada',
    text: '🏛️ Welcome to the Akademi Student Concierge. Let us know if you need help with session bookings or wallet top-ups.',
    time: 'Today · 8:00 AM',
    timestamp: Date.now() - 14400000
  },
  // Tutor Dr. Chiamaka Eze <-> Student Chiamaka Obi
  {
    id: 'seed-5',
    fromName: 'Chiamaka Obi',
    fromRole: 'student',
    toName: 'Dr. Chiamaka Eze',
    text: 'Thank you for the calculus notes, Dr. Eze! The integration by parts cheat sheet was super clear.',
    time: 'Today · 8:15 AM',
    timestamp: Date.now() - 10800000
  },
  // Tutor Dr. Chiamaka Eze <-> Student Ngozi Uche
  {
    id: 'seed-6',
    fromName: 'Ngozi Uche',
    fromRole: 'student',
    toName: 'Dr. Chiamaka Eze',
    text: 'Hi Dr. Eze! I just booked a 1-on-1 session for Trigonometry.',
    time: 'Today · 8:00 AM',
    timestamp: Date.now() - 12000000
  },
  {
    id: 'seed-7',
    fromName: 'Dr. Chiamaka Eze',
    fromRole: 'tutor',
    toName: 'Ngozi Uche',
    text: 'Welcome Ngozi! I have confirmed your slot and added the trigonometry prep pack.',
    time: 'Today · 8:10 AM',
    timestamp: Date.now() - 11400000
  },
  // Tutor Dr. Chiamaka Eze <-> Admin Desk
  {
    id: 'seed-8',
    fromName: 'Dr. Chiamaka Eze',
    fromRole: 'tutor',
    toName: 'Akademi Admin Desk',
    text: 'Good morning Admin. Please confirm my GTBank payout account details for scheduled disbursal.',
    time: 'Today · 8:15 AM',
    timestamp: Date.now() - 9000000
  },
  {
    id: 'seed-9',
    fromName: 'Akademi Admin Desk',
    fromRole: 'admin',
    toName: 'Dr. Chiamaka Eze',
    text: '💳 [Payout Disbursal Support]: Your NUBAN bank details and NIN identity verification are approved. Your automated settlement is active.',
    time: 'Today · 8:20 AM',
    timestamp: Date.now() - 8400000
  }
];

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Current Active Logged-in Persona
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: 'student' | 'tutor' | 'admin' | 'super_admin';
    avatar?: string;
    email?: string;
    title?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Chiamaka Ada',
      role: 'student',
      avatar: '/images/hero-student.jpg',
      email: 'student@akademi.com',
      title: 'A-Level Science & Mathematics Student'
    };
  });

  const isTutor = currentUser.role === 'tutor';
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  // 2. Global Universal Message Ledger
  const [ledger, setLedger] = useState<LedgerMessage[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_global_message_ledger');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialLedgerSeed;
  });

  // 3. Dynamic Registered / Extra Contacts
  const [customContacts, setCustomContacts] = useState<PlatformContact[]>(() => {
    let extra: PlatformContact[] = [];
    try {
      const savedTutors = localStorage.getItem('akademi_registered_tutors');
      if (savedTutors) {
        const parsed = JSON.parse(savedTutors);
        parsed.forEach((t: any) => {
          extra.push({
            id: `custom-tutor-${t.id || t.name}`,
            name: t.name,
            role: `${t.speciality || 'Subject'} Educator`,
            avatar: t.avatar || '/images/tutor-daniel.jpg',
            contactType: 'tutor',
            topic: t.speciality || 'General Tutoring',
            online: true
          });
        });
      }
    } catch (e) {}
    return extra;
  });

  // Combine All Contacts (Excluding the current logged in user from their own contact list)
  const availableContacts = useMemo(() => {
    const all = [...MASTER_CONTACTS, ...customContacts];
    const seen = new Set<string>();
    return all.filter(c => {
      // Exclude self
      if (c.name.toLowerCase() === currentUser.name.toLowerCase()) return false;
      // If user is Admin, exclude 'Akademi Admin Desk' from their own contact list
      if (isAdmin && (c.name.includes('Admin') || c.contactType === 'admin')) return false;

      const key = c.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [currentUser.name, isAdmin, customContacts]);

  // 4. Default Selected Contact based on Role
  const [selectedContactName, setSelectedContactName] = useState<string>(() => {
    const paramRecipient = searchParams.get('recipient');
    if (paramRecipient) return paramRecipient;

    if (isTutor) return 'Chiamaka Ada'; // Tutors default to student Chiamaka Ada
    if (isAdmin) return 'Dr. Chiamaka Eze'; // Admin defaults to top tutor
    return 'Dr. Chiamaka Eze'; // Students default to Dr. Chiamaka Eze
  });

  const [filterTab, setFilterTab] = useState<'all' | 'students' | 'tutors' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [modalFilterTab, setModalFilterTab] = useState<'all' | 'students' | 'tutors' | 'admin'>('all');
  const [contactSearch, setContactSearch] = useState('');

  // Handle URL Query Params (e.g. /dashboard/messages?recipient=Ngozi+Uche&role=student&topic=...)
  useEffect(() => {
    const recipientParam = searchParams.get('recipient');
    if (recipientParam) {
      setSelectedContactName(recipientParam);

      // Ensure this contact exists in directory
      const exists = availableContacts.some(c => c.name.toLowerCase() === recipientParam.toLowerCase());
      if (!exists) {
        const roleParam = searchParams.get('role') || 'student';
        const topicParam = searchParams.get('topic') || 'Tutoring Discussion';
        const avatarParam = searchParams.get('avatar') || '/images/hero-student.jpg';

        const newContact: PlatformContact = {
          id: `dyn-${Date.now()}`,
          name: recipientParam,
          role: roleParam === 'tutor' ? `Educator · ${topicParam}` : `Student · ${topicParam}`,
          avatar: avatarParam,
          contactType: roleParam === 'tutor' ? 'tutor' : 'student',
          topic: topicParam,
          online: true
        };

        setCustomContacts(prev => [...prev, newContact]);
      }
    }
  }, [searchParams, availableContacts]);

  // Sync with localStorage & other tabs (instant reactive updates when role is toggled!)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedAuth = localStorage.getItem('akademi_auth_user');
        if (savedAuth) {
          const parsedUser = JSON.parse(savedAuth);
          if (parsedUser.name !== currentUser.name || parsedUser.role !== currentUser.role) {
            setCurrentUser(parsedUser);

            // Auto-align counterpart contact when role switches
            if (parsedUser.role === 'tutor') {
              setSelectedContactName('Chiamaka Ada');
            } else if (parsedUser.role === 'student') {
              setSelectedContactName('Dr. Chiamaka Eze');
            } else if (parsedUser.role === 'admin') {
              setSelectedContactName('Dr. Chiamaka Eze');
            }
          }
        }

        const savedLedger = localStorage.getItem('akademi_global_message_ledger');
        if (savedLedger) {
          setLedger(JSON.parse(savedLedger));
        }
      } catch (e) {}
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, [currentUser.name, currentUser.role]);

  // Helper to persist and broadcast ledger changes
  const saveAndBroadcastLedger = (newLedger: LedgerMessage[]) => {
    setLedger(newLedger);
    try {
      localStorage.setItem('akademi_global_message_ledger', JSON.stringify(newLedger));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  // Helper: Normalize name aliases (e.g. Admin aliases)
  const matchNames = (nameA: string, nameB: string) => {
    const a = nameA.toLowerCase().trim();
    const b = nameB.toLowerCase().trim();
    if (a === b) return true;
    if ((a.includes('admin') || a === 'ngozi eze') && (b.includes('admin') || b === 'ngozi eze')) return true;
    return false;
  };

  // Find the currently active contact object
  const activeContact: PlatformContact = useMemo(() => {
    const found = availableContacts.find(c => matchNames(c.name, selectedContactName));
    if (found) return found;

    // Fallback default
    return availableContacts[0] || {
      id: 'default',
      name: selectedContactName || 'Dr. Chiamaka Eze',
      role: 'Akademi Participant',
      avatar: '/images/tutor-daniel.jpg',
      contactType: 'tutor',
      topic: 'General Tutoring',
      online: true
    };
  }, [availableContacts, selectedContactName]);

  // Filter messages specifically for the thread between currentUser and activeContact
  const currentThreadMessages = useMemo(() => {
    return ledger.filter(m => {
      const isFromMeToThem = matchNames(m.fromName, currentUser.name) && matchNames(m.toName, activeContact.name);
      const isFromThemToMe = matchNames(m.fromName, activeContact.name) && matchNames(m.toName, currentUser.name);
      return isFromMeToThem || isFromThemToMe;
    }).sort((a, b) => a.timestamp - b.timestamp);
  }, [ledger, currentUser.name, activeContact.name]);

  // Generate enriched conversation list with latest previews and unread counts for current user
  const conversationList = useMemo(() => {
    return availableContacts.map(contact => {
      // Find all messages exchanged with this contact
      const messagesWithContact = ledger.filter(m => {
        const isFromMeToThem = matchNames(m.fromName, currentUser.name) && matchNames(m.toName, contact.name);
        const isFromThemToMe = matchNames(m.fromName, contact.name) && matchNames(m.toName, currentUser.name);
        return isFromMeToThem || isFromThemToMe;
      }).sort((a, b) => b.timestamp - a.timestamp);

      const latestMsg = messagesWithContact[0];
      const preview = latestMsg ? latestMsg.text : `Start conversation with ${contact.name.split(' ')[0]}`;
      const time = latestMsg ? latestMsg.time : 'New';

      return {
        ...contact,
        preview,
        time,
        hasMessages: messagesWithContact.length > 0,
        latestTimestamp: latestMsg ? latestMsg.timestamp : 0
      };
    }).sort((a, b) => b.latestTimestamp - a.latestTimestamp);
  }, [availableContacts, ledger, currentUser.name]);

  // Filter conversations by category tab & search
  const filteredConversations = useMemo(() => {
    return conversationList.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.topic && c.topic.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterTab === 'all') return true;
      if (filterTab === 'students') return c.contactType === 'student';
      if (filterTab === 'tutors') return c.contactType === 'tutor';
      if (filterTab === 'admin') return c.contactType === 'admin';
      return true;
    });
  }, [conversationList, searchQuery, filterTab]);

  const studentCount = conversationList.filter(c => c.contactType === 'student').length;
  const tutorCount = conversationList.filter(c => c.contactType === 'tutor').length;
  const adminCount = conversationList.filter(c => c.contactType === 'admin').length;

  // Send Message Handler (Writes to Universal Message Ledger)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: LedgerMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fromName: currentUser.name,
      fromRole: currentUser.role,
      toName: activeContact.name,
      text: userText,
      time: 'Just now',
      timestamp: Date.now()
    };

    const updated = [...ledger, newMsg];
    saveAndBroadcastLedger(updated);
    dispatchChatMessagePush(currentUser.name, userText);
    setInputText('');

    // If sending to Admin Desk, provide instant simulated operations reply
    if (activeContact.contactType === 'admin' || activeContact.name.includes('Admin')) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let replyText = "Thank you for contacting the Akademi Platform Operations team. We have received your inquiry and an administrator has flagged it for review.";
        
        const lower = userText.toLowerCase();
        if (lower.includes('payout') || lower.includes('withdraw') || lower.includes('money') || lower.includes('bank')) {
          replyText = "💳 [Payout Disbursal Support]: Your payout inquiry has been logged. Withdrawals are processed automatically via Paystack Direct NUBAN settlement on scheduled payout days.";
        } else if (lower.includes('kyc') || lower.includes('verify') || lower.includes('nin') || lower.includes('certificate')) {
          replyText = "🛡️ [Verification Support]: Your credentials and KYC documents are in priority compliance queue. Once validated, your Verified Educator badge is updated.";
        } else if (lower.includes('dispute') || lower.includes('no-show') || lower.includes('absent')) {
          replyText = "⚠️ [Session & Dispute Desk]: Case logged for student attendance review. Classroom attendance logs and recording timestamps are being audited.";
        }

        const adminReply: LedgerMessage = {
          id: `msg-admin-${Date.now()}`,
          fromName: 'Akademi Admin Desk',
          fromRole: 'admin',
          toName: currentUser.name,
          text: replyText,
          time: 'Just now',
          timestamp: Date.now()
        };

        const withAdminReply = [...updated, adminReply];
        saveAndBroadcastLedger(withAdminReply);
      }, 1000);
    }
  };

  const handleSelectTopicChip = (chipText: string) => {
    setInputText(chipText);
  };

  const handleStartChatWith = (contact: PlatformContact) => {
    setSelectedContactName(contact.name);
    setNewChatModalOpen(false);
    setContactSearch('');
  };

  const filteredModalContacts = availableContacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.role.toLowerCase().includes(contactSearch.toLowerCase()) ||
      (c.topic && c.topic.toLowerCase().includes(contactSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (modalFilterTab === 'all') return true;
    if (modalFilterTab === 'students') return c.contactType === 'student';
    if (modalFilterTab === 'tutors') return c.contactType === 'tutor';
    if (modalFilterTab === 'admin') return c.contactType === 'admin';
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-6xl font-sans"
    >
      {/* 1. TOP HEADER & ACTIVE TEST PERSONA INDICATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">
              {isTutor ? 'Educator Workspace' : (isAdmin ? 'Admin Operations Desk' : 'Student Inbox')}
            </span>
            <span className="text-slate-300">·</span>
            
            {/* Prominent Active Persona Pill */}
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#E8E3D7] shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>You are messaging as:</span>
              <strong className="text-[#0F5338] underline decoration-emerald-300 underline-offset-2">
                {currentUser.name}
              </strong>
              <span className={cn(
                "text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-wide",
                isTutor ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : 
                (isAdmin ? "bg-amber-100 text-amber-950 border border-amber-300" : "bg-blue-100 text-blue-900 border border-blue-300")
              )}>
                {currentUser.role}
              </span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isTutor 
              ? 'Real-time two-way communication with your enrolled students, fellow faculty, and Admin Desk.'
              : (isAdmin
                  ? 'Central direct messaging desk. Answer educator inquiries and student support tickets.'
                  : 'Chat directly with your vetted tutors in real time and reach platform support.')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewChatModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* 2. MAIN 2-COLUMN CHAT CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#E8E3D7] shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[660px]">
        
        {/* Left Column (5 cols): Conversations & Contacts List */}
        <div className="md:col-span-5 border-r border-[#E8E3D7] flex flex-col bg-white">
          {/* Search bar & Category Filter Tabs */}
          <div className="p-3.5 border-b border-[#E8E3D7] space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, tutors, subjects..."
                className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-full h-9 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5338] shadow-2xs"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={cn(
                  "px-3 py-1 rounded-full whitespace-nowrap transition-all",
                  filterTab === 'all' 
                    ? "bg-[#0F5338] text-white shadow-2xs" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                All ({conversationList.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('students')}
                className={cn(
                  "px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1",
                  filterTab === 'students' 
                    ? "bg-blue-600 text-white shadow-2xs" 
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                )}
              >
                <Users className="w-3 h-3" />
                <span>Students ({studentCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterTab('tutors')}
                className={cn(
                  "px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1",
                  filterTab === 'tutors' 
                    ? "bg-emerald-700 text-white shadow-2xs" 
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                )}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Tutors ({tutorCount})</span>
              </button>

              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setFilterTab('admin')}
                  className={cn(
                    "px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1",
                    filterTab === 'admin' 
                      ? "bg-amber-600 text-white shadow-2xs" 
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100"
                  )}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Admin ({adminCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="divide-y divide-[#E8E3D7]/60 overflow-y-auto flex-1 max-h-[580px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <p className="text-xs font-semibold text-slate-600">No contacts in this view</p>
                <p className="text-[11px] text-slate-400">Click below to start a chat with any student or tutor.</p>
                <button
                  type="button"
                  onClick={() => setNewChatModalOpen(true)}
                  className="mt-2 px-3.5 py-1.5 bg-[#0F5338] text-white rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Conversation</span>
                </button>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = matchNames(c.name, selectedContactName);
                const isStudent = c.contactType === 'student';
                const isTutorContact = c.contactType === 'tutor';
                const isAdminContact = c.contactType === 'admin';

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedContactName(c.name)}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 text-left transition-all relative group",
                      isSelected 
                        ? "bg-[#FBF9F4] border-l-4 border-[#0F5338] shadow-2xs" 
                        : "hover:bg-slate-50/80",
                      isAdminContact && !isSelected && "bg-amber-50/30"
                    )}
                  >
                    {/* Avatar with Online Dot */}
                    <div className="relative shrink-0 mt-0.5">
                      {isAdminContact ? (
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-amber-400/50">
                          <Building2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <img 
                          src={c.avatar} 
                          alt={c.name}
                          className={cn(
                            "w-10 h-10 rounded-full object-cover shadow-2xs",
                            isSelected ? "ring-2 ring-[#0F5338]" : ""
                          )} 
                        />
                      )}
                      {c.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    {/* Name, Role Badge & Message Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <p className="font-bold text-[#141E18] text-xs truncate">
                            {c.name}
                          </p>
                          {isAdminContact && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-black uppercase tracking-wider shrink-0">
                              Admin
                            </span>
                          )}
                          {isStudent && (
                            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
                              Student
                            </span>
                          )}
                          {isTutorContact && (
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">
                              Tutor
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {c.time}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 font-semibold truncate mb-0.5">
                        {c.topic || c.role}
                      </p>

                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal font-normal">
                        {c.preview}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Active Chat Thread */}
        <div className="md:col-span-7 flex flex-col bg-[#FBF9F4]/40 justify-between">
          
          {/* Active Thread Header */}
          <div className="p-4 bg-white border-b border-[#E8E3D7] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                {activeContact.contactType === 'admin' ? (
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-amber-400/50">
                    <Building2 className="w-5 h-5" />
                  </div>
                ) : (
                  <img 
                    src={activeContact.avatar} 
                    alt={activeContact.name}
                    className="w-10 h-10 rounded-full object-cover shadow-2xs" 
                  />
                )}
                {activeContact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#141E18]">
                    {activeContact.name}
                  </h3>
                  {activeContact.contactType === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[9px] font-black uppercase">
                      Admin Desk
                    </span>
                  )}
                  {activeContact.contactType === 'student' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-[9px] font-bold uppercase">
                      Enrolled Student
                    </span>
                  )}
                  {activeContact.contactType === 'tutor' && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[9px] font-bold uppercase">
                      Vetted Tutor
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {activeContact.topic ? `${activeContact.topic} · ` : ''}{activeContact.role}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/sessions"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E3D7] hover:bg-[#F3EFE6] text-slate-700 rounded-full text-xs font-semibold transition-colors"
                title="View Schedule"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Sessions</span>
              </Link>
              
              <Link
                to="/classroom/session-101"
                className="p-2 rounded-full border border-[#E8E3D7] bg-white hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors"
                title="Join Video Room"
              >
                <Video className="w-3.5 h-3.5 text-[#0F5338]" />
              </Link>
            </div>
          </div>

          {/* Direct Admin Inquiry Topic Chips (Visible when Admin Desk is active) */}
          {activeContact.contactType === 'admin' && (
            <div className="px-3 py-2 bg-amber-50/80 border-b border-amber-200/50 flex items-center gap-1.5 overflow-x-auto">
              {[
                { icon: '💳', label: 'Payout', text: 'Hi Admin, I would like to check on my recent payout disbursal and settlement timeline.' },
                { icon: '🛡️', label: 'KYC', text: 'Hi Admin, please review my teaching credentials and NUBAN bank verification status.' },
                { icon: '⚠️', label: 'Dispute', text: 'Hi Admin, I want to report a student attendance dispute for review.' },
                { icon: '📚', label: 'Subjects', text: 'Hi Admin, I would like to request adding a new subject to the course catalog.' },
                { icon: '⚙️', label: 'Account', text: 'Hi Admin, I need assistance with my platform settings.' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTopicChip(chip.text)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100/70 text-amber-950 rounded-full border border-amber-200 text-[11px] font-semibold whitespace-nowrap transition-colors active:scale-95"
                >
                  <span className="text-[11px]">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Enrolled Student Context Banner */}
          {activeContact.contactType === 'student' && isTutor && (
            <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-200/60 flex items-center justify-between text-xs text-blue-950 font-medium">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Enrolled Student: <strong>{activeContact.name}</strong> ({activeContact.topic || 'Tutoring'})</span>
              </div>
              <Link 
                to="/dashboard/students" 
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                View Roster &rarr;
              </Link>
            </div>
          )}

          {/* Messages Thread Bubbles */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[480px]">
            {currentThreadMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <p className="text-xs font-semibold text-slate-600">No messages yet with {activeContact.name}</p>
                <p className="text-[11px] text-slate-400">Type a message below to start this live tutoring thread!</p>
              </div>
            ) : (
              currentThreadMessages.map((m) => {
                const isMe = matchNames(m.fromName, currentUser.name);
                return (
                  <div
                    key={m.id}
                    className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                  >
                    {!isMe && (
                      <span className="text-[10px] font-bold text-slate-600 mb-1 px-1">
                        {m.fromName}
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-2xs",
                        isMe
                          ? "bg-[#0F5338] text-white rounded-br-xs"
                          : activeContact.contactType === 'admin'
                          ? "bg-white text-slate-900 border-2 border-amber-300/80 rounded-bl-xs shadow-sm"
                          : "bg-white text-slate-900 border border-[#E8E3D7] rounded-bl-xs"
                      )}
                    >
                      <p>{m.text}</p>
                      <div 
                        className={cn(
                          "text-[10px] mt-1.5 flex items-center gap-1",
                          isMe ? "text-emerald-100/70 justify-end" : "text-slate-400"
                        )}
                      >
                        <span>{m.time}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span>Akademi Operations is typing a response...</span>
              </div>
            )}
          </div>

          {/* Bottom Message Input Bar */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 bg-white border-t border-[#E8E3D7] flex items-center gap-2.5 shadow-2xs"
          >
            <button
              type="button"
              className="w-9 h-9 rounded-full border border-[#E8E3D7] bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-2xs shrink-0 transition-colors"
              title="Attach Lesson Material / Homework"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeContact.name.split(' ')[0]} as ${currentUser.name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FBF9F4] border border-[#E8E3D7] rounded-full h-9 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5338] shadow-2xs"
            />

            <button
              type="submit"
              className="bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full h-9 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-[0.98] shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* New Message / Start Conversation Modal */}
      <AnimatePresence>
        {newChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#0F5338]" />
                  <h3 className="font-bold text-base text-slate-900">Start New Conversation</h3>
                </div>
                <button 
                  onClick={() => setNewChatModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search student or tutor by name, course, or subject..."
                  className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl h-10 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                  autoFocus
                />
              </div>

              {/* Modal Category Filter Tabs */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setModalFilterTab('all')}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors",
                    modalFilterTab === 'all' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setModalFilterTab('students')}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors",
                    modalFilterTab === 'students' ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-800"
                  )}
                >
                  Students
                </button>
                <button
                  type="button"
                  onClick={() => setModalFilterTab('tutors')}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors",
                    modalFilterTab === 'tutors' ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800"
                  )}
                >
                  Tutors
                </button>
                <button
                  type="button"
                  onClick={() => setModalFilterTab('admin')}
                  className={cn(
                    "px-3 py-1 rounded-full transition-colors",
                    modalFilterTab === 'admin' ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-900"
                  )}
                >
                  Admin Desk
                </button>
              </div>

              {/* Contacts List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredModalContacts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching contacts or participants found.
                  </div>
                ) : (
                  filteredModalContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleStartChatWith(contact)}
                      className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#FBF9F4] rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="w-9 h-9 rounded-full object-cover shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{contact.name}</h4>
                            {contact.contactType === 'admin' && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[8px] font-black uppercase rounded">
                                Admin
                              </span>
                            )}
                            {contact.contactType === 'student' && (
                              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-800 text-[8px] font-bold uppercase rounded border border-blue-200">
                                Student
                              </span>
                            )}
                            {contact.contactType === 'tutor' && (
                              <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 text-[8px] font-bold uppercase rounded border border-emerald-200">
                                Educator
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{contact.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full text-[11px] font-bold shadow-2xs transition-all active:scale-95 shrink-0"
                      >
                        Chat
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
