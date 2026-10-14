const fs = require('fs');
const path = require('path');

const targetPath = 'C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\akademi\\frontend\\src\\pages\\dashboard\\Messages.tsx';

const code = `import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Filter
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  sender: 'them' | 'me';
  text: string;
  time: string;
}

interface Conversation {
  id: number | string;
  name: string;
  role: string;
  avatar: string;
  time: string;
  preview: string;
  unread: number;
  online: boolean;
  contactType: 'student' | 'tutor' | 'admin';
  topic?: string;
  messages: Message[];
}

const adminDeskConversation: Conversation = {
  id: 999,
  name: 'Akademi Admin Desk',
  role: 'Platform Operations & Support',
  avatar: '/images/hero-student.jpg',
  time: 'Just now',
  preview: 'Hello! How can our administrative team assist you today?',
  unread: 1,
  online: true,
  contactType: 'admin',
  topic: 'Platform Support & Payouts',
  messages: [
    { 
      id: 1, 
      sender: 'them', 
      text: '🏛️ Welcome to the Direct Admin Support & Operations Desk! You can reach platform administrators directly here for payout inquiries, KYC verifications, student attendance disputes, or subject requests.', 
      time: 'Today · 8:00 AM' 
    },
    { 
      id: 2, 
      sender: 'me', 
      text: 'Good morning Admin. I wanted to confirm that my GTBank payout account details have been approved.', 
      time: 'Today · 8:15 AM' 
    },
    { 
      id: 3, 
      sender: 'them', 
      text: 'Yes! Your NUBAN bank details and NIN identity verification have been approved by compliance. Your automated weekly settlement is active.', 
      time: 'Today · 8:20 AM' 
    }
  ]
};

// Comprehensive preloaded student conversations
const defaultStudentConversations: Conversation[] = [
  {
    id: 501,
    name: 'Chiamaka Obi',
    role: 'Student · A-level Mathematics',
    avatar: '/images/hero-student.jpg',
    time: '5m',
    preview: "Thank you for the calculus notes, Dr. Eze!",
    unread: 1,
    online: true,
    contactType: 'student',
    topic: 'Integration by Parts & Substitution',
    messages: [
      { id: 1, sender: 'them', text: 'Hello! I finished the calculus practice worksheet.', time: 'Yesterday · 4:10 PM' },
      { id: 2, sender: 'me', text: 'Great job Chiamaka! How did question 4 feel?', time: 'Yesterday · 5:20 PM' },
      { id: 3, sender: 'them', text: 'Thank you for the calculus notes, Dr. Eze! The step-by-step substitution made total sense.', time: 'Today · 8:15 AM' }
    ]
  },
  {
    id: 505,
    name: 'Ngozi Uche',
    role: 'Student · Trigonometry & Calculus',
    avatar: '/images/hero-student.jpg',
    time: '10m',
    preview: 'Looking forward to our next trigonometric session.',
    unread: 0,
    online: true,
    contactType: 'student',
    topic: 'Trigonometry & Calculus',
    messages: [
      { id: 1, sender: 'them', text: 'Hi! I booked a 1-on-1 session for Trigonometry.', time: 'Today · 8:00 AM' },
      { id: 2, sender: 'me', text: 'Welcome Ngozi! I will have the formula cheat sheets ready for us.', time: 'Today · 8:10 AM' }
    ]
  },
  {
    id: 506,
    name: 'Yusuf Ibrahim',
    role: 'Student · Physics Lab & Wave Optics',
    avatar: '/images/tutor-ibrahim.jpg',
    time: '45m',
    preview: 'Can we review the slit diffraction problem?',
    unread: 0,
    online: false,
    contactType: 'student',
    topic: 'Physics Lab & Wave Optics',
    messages: [
      { id: 1, sender: 'them', text: 'Hello! Can we review the slit diffraction problem during our next slot?', time: 'Today · 7:45 AM' },
      { id: 2, sender: 'me', text: 'Absolutely Yusuf. Bring your calculator and lab notebook.', time: 'Today · 8:00 AM' }
    ]
  },
  {
    id: 502,
    name: 'Emeka Nnaji',
    role: 'Student · Physics Fundamentals',
    avatar: '/images/tutor-daniel.jpg',
    time: '2h',
    preview: 'I have submitted my vector assignment.',
    unread: 0,
    online: true,
    contactType: 'student',
    topic: 'Kinematics & Vector Fields',
    messages: [
      { id: 1, sender: 'them', text: 'I have submitted my vector assignment for grading.', time: 'Yesterday · 6:30 PM' },
      { id: 2, sender: 'me', text: 'Received Emeka! Reviewing it shortly.', time: 'Yesterday · 7:00 PM' }
    ]
  },
  {
    id: 503,
    name: 'Amina Bello',
    role: 'Student · Algebra & Trig',
    avatar: '/images/tutor-adaeze.jpg',
    time: '1d',
    preview: 'The quadratic formulas are much clearer now.',
    unread: 0,
    online: false,
    contactType: 'student',
    topic: 'Quadratic & Polynomial Functions',
    messages: [
      { id: 1, sender: 'them', text: 'The quadratic formulas are much clearer now. Thanks!', time: '2 days ago' }
    ]
  }
];

// Comprehensive preloaded tutor conversations
const defaultTutorConversations: Conversation[] = [
  {
    id: 1,
    name: 'Daniel Okafor',
    role: 'Lead Mathematics & Physics Specialist',
    avatar: '/images/tutor-daniel.jpg',
    time: '2m',
    preview: "Great work on the practice set — let's review tomorrow.",
    unread: 2,
    online: true,
    contactType: 'tutor',
    topic: 'A-Level Calculus & Mechanics',
    messages: [
      { id: 1, sender: 'them', text: 'Hi! Did you get a chance to look at the calculus worksheet?', time: 'Yesterday · 7:14 PM' },
      { id: 2, sender: 'me', text: 'Yes! I finished it but question 4 tripped me up.', time: 'Yesterday · 8:02 PM' },
      { id: 3, sender: 'them', text: 'Totally normal — substitution is tricky. Let me walk you through it.', time: 'Today · 8:31 AM' },
      { id: 4, sender: 'them', text: "Great work on the practice set — let's review Q4 tomorrow.", time: 'Today · 9:32 AM' }
    ]
  },
  {
    id: 2,
    name: 'Adaeze Nwosu',
    role: 'Conversational Spanish & French Tutor',
    avatar: '/images/tutor-adaeze.jpg',
    time: '1h',
    preview: "¡Hola! I've shared the vocabulary worksheet.",
    unread: 1,
    online: true,
    contactType: 'tutor',
    topic: 'Conversational Spanish & DELE Prep',
    messages: [
      { id: 1, sender: 'them', text: "¡Hola! I've shared the vocabulary worksheet for our session tomorrow. Review verbs in the preterite tense.", time: 'Today · 1:15 PM' },
      { id: 2, sender: 'me', text: 'Gracias Adaeze! I will practice the conjugation before we meet.', time: 'Today · 1:45 PM' }
    ]
  },
  {
    id: 3,
    name: 'Dr. Ibrahim Sanni',
    role: 'Physics & Engineering Specialist',
    avatar: '/images/tutor-ibrahim.jpg',
    time: '3h',
    preview: 'Sending over the reading list for quantum mechanics.',
    unread: 0,
    online: false,
    contactType: 'tutor',
    topic: 'Engineering Physics & Electromagnetism',
    messages: [
      { id: 1, sender: 'me', text: 'Hello Dr. Sanni, could you recommend reference materials on wave-particle duality?', time: 'Yesterday · 4:10 PM' },
      { id: 2, sender: 'them', text: 'Sending over a reading list for quantum mechanics chapters 3 and 4. Check page 82 for the slit experiment diagrams.', time: 'Today · 11:30 AM' }
    ]
  },
  {
    id: 4,
    name: 'Chinwe Uche',
    role: 'Science & Medical Exam Strategist',
    avatar: '/images/tutor-daniel.jpg',
    time: '1d',
    preview: 'Chemistry past question drills ready for review.',
    unread: 0,
    online: true,
    contactType: 'tutor',
    topic: 'Organic Chemistry & JAMB Medicine',
    messages: [
      { id: 1, sender: 'them', text: 'Hello! I uploaded the 50 high-yield chemistry reaction mechanisms in your study pack.', time: 'Yesterday · 2:00 PM' }
    ]
  }
];

const allPlatformContacts = [
  { id: 999, name: 'Akademi Admin Desk', role: 'Platform Operations & Support', avatar: '/images/hero-student.jpg', contactType: 'admin' as const, topic: 'Platform Operations' },
  { id: 1, name: 'Daniel Okafor', role: 'Lead Mathematics & Physics Specialist', avatar: '/images/tutor-daniel.jpg', contactType: 'tutor' as const, topic: 'Calculus & Physics' },
  { id: 2, name: 'Adaeze Nwosu', role: 'Conversational Spanish & French Tutor', avatar: '/images/tutor-adaeze.jpg', contactType: 'tutor' as const, topic: 'Languages & Fluency' },
  { id: 3, name: 'Dr. Ibrahim Sanni', role: 'Physics & Engineering Specialist', avatar: '/images/tutor-ibrahim.jpg', contactType: 'tutor' as const, topic: 'Physics & Mechanics' },
  { id: 4, name: 'Chinwe Uche', role: 'Science & Medical Exam Strategist', avatar: '/images/tutor-daniel.jpg', contactType: 'tutor' as const, topic: 'Chemistry & JAMB' },
  { id: 501, name: 'Chiamaka Obi', role: 'Student · A-level Mathematics', avatar: '/images/hero-student.jpg', contactType: 'student' as const, topic: 'A-level Mathematics' },
  { id: 505, name: 'Ngozi Uche', role: 'Student · Trigonometry & Calculus', avatar: '/images/hero-student.jpg', contactType: 'student' as const, topic: 'Trigonometry & Calculus' },
  { id: 506, name: 'Yusuf Ibrahim', role: 'Student · Physics Lab & Wave Optics', avatar: '/images/tutor-ibrahim.jpg', contactType: 'student' as const, topic: 'Physics Lab' },
  { id: 502, name: 'Emeka Nnaji', role: 'Student · Physics Fundamentals', avatar: '/images/tutor-daniel.jpg', contactType: 'student' as const, topic: 'Physics Fundamentals' },
  { id: 503, name: 'Amina Bello', role: 'Student · Algebra & Trig', avatar: '/images/tutor-adaeze.jpg', contactType: 'student' as const, topic: 'Algebra & Trig' },
  { id: 504, name: 'Segun Adeyemi', role: 'Student · Calculus Prep', avatar: '/images/tutor-ibrahim.jpg', contactType: 'student' as const, topic: 'Calculus Prep' }
];

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    role?: 'student' | 'tutor' | 'admin' | 'super_admin';
    avatar?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { name: 'Chiamaka Ada', role: 'student' };
  });

  const isTutor = currentUser.role === 'tutor';

  // Build the comprehensive initial list based on role
  const defaultList = useMemo(() => {
    return [
      adminDeskConversation,
      ...defaultStudentConversations,
      ...defaultTutorConversations
    ];
  }, []);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_platform_conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure default students and tutors are always present
          const existingIds = new Set(parsed.map(c => String(c.id)));
          const missing = defaultList.filter(d => !existingIds.has(String(d.id)));
          return [...parsed, ...missing];
        }
      }
    } catch (e) {}
    return defaultList;
  });

  const [selectedId, setSelectedId] = useState<number | string>(() => {
    const paramRecipient = searchParams.get('recipient');
    if (paramRecipient) {
      const match = conversations.find(c => c.name.toLowerCase() === paramRecipient.toLowerCase());
      if (match) return match.id;
    }
    return isTutor ? 501 : 1; // Default to top student for tutor, top tutor for student
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
      const roleParam = searchParams.get('role') || 'student';
      const topicParam = searchParams.get('topic') || 'Session Discussion';
      const avatarParam = searchParams.get('avatar') || '/images/hero-student.jpg';

      const existingIndex = conversations.findIndex(
        c => c.name.toLowerCase() === recipientParam.toLowerCase()
      );

      if (existingIndex >= 0) {
        setSelectedId(conversations[existingIndex].id);
      } else {
        const newId = \`CUST-\${Date.now()}\`;
        const newConv: Conversation = {
          id: newId,
          name: recipientParam,
          role: roleParam === 'student' ? \`Student · \${topicParam}\` : \`Educator · \${topicParam}\`,
          avatar: avatarParam,
          time: 'Just now',
          preview: \`Started conversation regarding \${topicParam}\`,
          unread: 0,
          online: true,
          contactType: roleParam === 'tutor' ? 'tutor' : 'student',
          topic: topicParam,
          messages: [
            {
              id: Date.now(),
              sender: 'them',
              text: \`Hello! Looking forward to discussing \${topicParam}. Let me know if you have any questions before our next session!\`,
              time: 'Just now'
            }
          ]
        };

        const updated = [newConv, ...conversations];
        setConversations(updated);
        setSelectedId(newId);
        try {
          localStorage.setItem('akademi_platform_conversations', JSON.stringify(updated));
        } catch (e) {}
      }
    }
  }, [searchParams]);

  // Sync with localStorage & other tabs
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedAuth = localStorage.getItem('akademi_auth_user');
        if (savedAuth) setCurrentUser(JSON.parse(savedAuth));

        const savedConvs = localStorage.getItem('akademi_platform_conversations');
        if (savedConvs) {
          setConversations(JSON.parse(savedConvs));
        }
      } catch (e) {}
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const saveAndSyncConvs = (newConvs: Conversation[]) => {
    setConversations(newConvs);
    try {
      localStorage.setItem('akademi_platform_conversations', JSON.stringify(newConvs));
    } catch (e) {}
  };

  const handleSelectConversation = (id: number | string) => {
    setSelectedId(id);
    const updated = conversations.map(c => String(c.id) === String(id) ? { ...c, unread: 0 } : c);
    saveAndSyncConvs(updated);
  };

  const allContacts = useMemo(() => {
    let extraTutors: any[] = [];
    try {
      const savedTutors = localStorage.getItem('akademi_registered_tutors');
      if (savedTutors) {
        const parsed = JSON.parse(savedTutors);
        extraTutors = parsed.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: \`\${t.speciality || 'Subject'} Educator\`,
          avatar: t.avatar || '/images/tutor-daniel.jpg',
          contactType: 'tutor' as const,
          topic: t.speciality
        }));
      }
    } catch (e) {}

    // Also include dynamic booked students
    let extraStudents: any[] = [];
    try {
      const savedBookings = localStorage.getItem('akademi_booked_sessions');
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        extraStudents = parsed.map((b: any, idx: number) => ({
          id: \`BK-ST-\${idx}\`,
          name: b.studentName || 'Chiamaka Adeyemi',
          role: \`Student · \${b.subject || 'Tutoring'}\`,
          avatar: '/images/hero-student.jpg',
          contactType: 'student' as const,
          topic: b.subject
        }));
      }
    } catch (e) {}

    const combined = [...allPlatformContacts, ...extraTutors, ...extraStudents];
    // Deduplicate by name
    const seen = new Set<string>();
    return combined.filter(item => {
      const k = item.name.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, []);

  const filteredContacts = allContacts.filter(c => {
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

  const handleStartChatWith = (contact: typeof allContacts[0]) => {
    const existing = conversations.find(
      c => String(c.id) === String(contact.id) || c.name.toLowerCase() === contact.name.toLowerCase()
    );

    if (existing) {
      handleSelectConversation(existing.id);
    } else {
      const newConv: Conversation = {
        id: contact.id,
        name: contact.name,
        role: contact.role,
        avatar: contact.avatar,
        time: 'Just now',
        preview: 'Conversation started',
        unread: 0,
        online: true,
        contactType: contact.contactType,
        topic: contact.topic,
        messages: [
          {
            id: Date.now(),
            sender: 'them',
            text: \`Hello \${currentUser.name || 'there'}! How can I assist you with your learning goals today?\`,
            time: 'Just now'
          }
        ]
      };
      const updated = [newConv, ...conversations];
      saveAndSyncConvs(updated);
      setSelectedId(contact.id);
    }
    setNewChatModalOpen(false);
    setContactSearch('');
  };

  const activeConv = conversations.find(c => String(c.id) === String(selectedId)) || conversations[0] || adminDeskConversation;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      text: userText,
      time: 'Just now'
    };

    const targetId = activeConv.id;

    const updated = conversations.map(c => {
      if (String(c.id) === String(targetId)) {
        return {
          ...c,
          time: 'Just now',
          preview: userText,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    saveAndSyncConvs(updated);
    setInputText('');

    // If messaging Admin Desk, simulate an immediate helpful response from Platform Support
    if (activeConv.contactType === 'admin' || activeConv.id === 999) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let replyText = "Thank you for contacting the Akademi Platform Operations team. We have received your inquiry and an administrator has flagged it for review.";
        
        const lower = userText.toLowerCase();
        if (lower.includes('payout') || lower.includes('withdraw') || lower.includes('money') || lower.includes('bank')) {
          replyText = "💳 [Payout & Disbursal Support]: Your payout inquiry has been logged in the central ledger. Withdrawals are processed automatically via Paystack Direct NUBAN settlement on scheduled payout days.";
        } else if (lower.includes('kyc') || lower.includes('verify') || lower.includes('nin') || lower.includes('certificate')) {
          replyText = "🛡️ [Verification Support]: Your credentials and KYC documents are in priority compliance queue. Once validated, your Verified Educator badge is updated.";
        } else if (lower.includes('dispute') || lower.includes('no-show') || lower.includes('absent')) {
          replyText = "⚠️ [Session & Dispute Desk]: Case logged for student attendance review. The classroom attendance logs and recording timestamps are being audited.";
        } else if (lower.includes('subject') || lower.includes('curriculum')) {
          replyText = "📚 [Curriculum Team]: Subject addition request received! Our academic review board will review the syllabus within 24 hours.";
        }

        const adminReply: Message = {
          id: Date.now() + 1,
          sender: 'them',
          text: replyText,
          time: 'Just now'
        };

        setConversations(prev => {
          const next = prev.map(c => {
            if (String(c.id) === String(targetId)) {
              return {
                ...c,
                preview: replyText,
                messages: [...c.messages, adminReply]
              };
            }
            return c;
          });
          try {
            localStorage.setItem('akademi_platform_conversations', JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }, 1000);
    } else if (activeConv.contactType === 'student' && isTutor) {
      // Simulate student response back to tutor
      setTimeout(() => {
        const studentReply: Message = {
          id: Date.now() + 2,
          sender: 'them',
          text: "Thank you for the quick message! I'm ready for our next lesson.",
          time: 'Just now'
        };

        setConversations(prev => {
          const next = prev.map(c => {
            if (String(c.id) === String(targetId)) {
              return {
                ...c,
                preview: studentReply.text,
                messages: [...c.messages, studentReply]
              };
            }
            return c;
          });
          try {
            localStorage.setItem('akademi_platform_conversations', JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }, 1200);
    }
  };

  const handleSelectTopicChip = (chipText: string) => {
    setInputText(chipText);
  };

  // Filter conversations by tab and search
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'all') return true;
    if (filterTab === 'students') return c.contactType === 'student';
    if (filterTab === 'tutors') return c.contactType === 'tutor';
    if (filterTab === 'admin') return c.contactType === 'admin';
    return true;
  });

  const studentCount = conversations.filter(c => c.contactType === 'student').length;
  const tutorCount = conversations.filter(c => c.contactType === 'tutor').length;
  const adminCount = conversations.filter(c => c.contactType === 'admin').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-6xl font-sans"
    >
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">
            {isTutor ? 'Educator Workspace · Student Roster & Operations' : 'Inbox & Tutoring Discussions'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            {isTutor 
              ? 'Chat directly with your enrolled students, coordinate lessons, and contact the Admin Desk.'
              : 'Directly communicate with your vetted tutors, submit questions, and get support.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNewChatModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-2xs transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* 2. MAIN 2-COLUMN CHAT CONTAINER */}
      <div className="bg-white rounded-3xl border border-[#E8E3D7] shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[660px]">
        
        {/* Left Column (5 cols): Contacts & Conversations List */}
        <div className="md:col-span-5 border-r border-[#E8E3D7] flex flex-col bg-white">
          {/* Search bar & New Chat trigger */}
          <div className="p-3.5 border-b border-[#E8E3D7] space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, tutors, topics..."
                className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-full h-9 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5338] shadow-2xs"
              />
            </div>

            {/* Role Filter Tabs (All, Students, Tutors, Admin) */}
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
                All ({conversations.length})
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
            </div>
          </div>

          {/* Conversations List */}
          <div className="divide-y divide-[#E8E3D7]/60 overflow-y-auto flex-1 max-h-[580px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <p className="text-xs font-semibold text-slate-600">No conversations in this view</p>
                <p className="text-[11px] text-slate-400">Click below to start a new chat with any student or tutor.</p>
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
                const isSelected = String(c.id) === String(selectedId);
                const isStudent = c.contactType === 'student';
                const isTutorContact = c.contactType === 'tutor';
                const isAdmin = c.contactType === 'admin';

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectConversation(c.id)}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 text-left transition-all relative group",
                      isSelected 
                        ? "bg-[#FBF9F4] border-l-4 border-[#0F5338] shadow-2xs" 
                        : "hover:bg-slate-50/80",
                      isAdmin && !isSelected && "bg-amber-50/30"
                    )}
                  >
                    {/* Avatar with Status Dot */}
                    <div className="relative shrink-0 mt-0.5">
                      {isAdmin ? (
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
                          {isAdmin && (
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

                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                        {c.preview}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {c.unread > 0 && (
                      <span className="w-4 h-4 bg-[#0F5338] text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {c.unread}
                      </span>
                    )}
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
                {activeConv.contactType === 'admin' ? (
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-base shadow-xs ring-2 ring-amber-400/50">
                    <Building2 className="w-5 h-5" />
                  </div>
                ) : (
                  <img 
                    src={activeConv.avatar} 
                    alt={activeConv.name}
                    className="w-10 h-10 rounded-full object-cover shadow-2xs" 
                  />
                )}
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm text-[#141E18]">
                    {activeConv.name}
                  </h3>
                  {activeConv.contactType === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[9px] font-black uppercase">
                      Admin Desk
                    </span>
                  )}
                  {activeConv.contactType === 'student' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-[9px] font-bold uppercase">
                      Enrolled Student
                    </span>
                  )}
                  {activeConv.contactType === 'tutor' && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[9px] font-bold uppercase">
                      Vetted Tutor
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {activeConv.topic ? \`\${activeConv.topic} · \` : ''}{activeConv.role}
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
          {activeConv.contactType === 'admin' && (
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
          {activeConv.contactType === 'student' && isTutor && (
            <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-200/60 flex items-center justify-between text-xs text-blue-950 font-medium">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Enrolled Student: <strong>{activeConv.name}</strong> ({activeConv.topic || 'Tutoring'})</span>
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
            {activeConv.messages.map((m) => {
              const isMe = m.sender === 'me';
              return (
                <div
                  key={m.id}
                  className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-2xs",
                      isMe
                        ? "bg-[#0F5338] text-white rounded-br-xs"
                        : activeConv.contactType === 'admin'
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
            })}

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
              placeholder={activeConv.contactType === 'admin' ? "Message Admin Desk directly (e.g. payout, KYC, dispute)..." : \`Message \${activeConv.name.split(' ')[0]}...\`}
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
                {filteredContacts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching contacts or tutors found.
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
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
\`;

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully wrote upgraded Messages.tsx');
