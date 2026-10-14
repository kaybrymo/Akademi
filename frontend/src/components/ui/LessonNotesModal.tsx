import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  X, 
  Download, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Paperclip, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ExternalLink,
  Sparkles,
  BookOpen,
  Check,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { dispatchLessonNotesPush } from '@/lib/websocketPushEngine';

export interface HomeworkItem {
  id: string;
  task: string;
  dueDate?: string;
  completed?: boolean;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'link';
  url?: string;
}

export interface LessonNote {
  sessionId: string | number;
  sessionTitle: string;
  tutorName: string;
  tutorAvatar?: string;
  studentName?: string;
  date: string;
  time?: string;
  summary: string;
  keyPoints: string[];
  homework: HomeworkItem[];
  attachments: AttachmentItem[];
  updatedAt?: string;
}

// Initial mock notes database for default sessions
const INITIAL_NOTES: Record<string, LessonNote> = {
  'DS-1': {
    sessionId: 'DS-1',
    sessionTitle: 'Calculus — Integration by parts',
    tutorName: 'Daniel Okafor',
    tutorAvatar: '/images/tutor-daniel.jpg',
    date: '20 Aug 2026',
    time: '4:30 PM',
    summary: 'Focused on applying the LIATE rule for selecting u and dv in Integration by Parts. We worked through 4 exam-style definite and indefinite integrals.',
    keyPoints: [
      'Formula: ∫ u dv = uv - ∫ v du',
      'Use LIATE priority: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential',
      'Watch out for signs when dv contains negative trigonometric functions (e.g. ∫ sin x dx = -cos x)'
    ],
    homework: [
      { id: 'hw-1', task: 'Complete questions 1 to 6 on the attached Integration Worksheet', dueDate: 'Friday, 22 Aug', completed: false },
      { id: 'hw-2', task: 'Review repeated integration by parts example on page 4', dueDate: 'Friday, 22 Aug', completed: true },
      { id: 'hw-3', task: 'Practice tabular method for polynomial × exponential integrals', dueDate: 'Sunday, 24 Aug', completed: false }
    ],
    attachments: [
      { id: 'att-1', name: 'Integration_By_Parts_Worksheet_Set1.pdf', size: '1.4 MB', type: 'pdf' },
      { id: 'att-2', name: 'LIATE_Rule_CheatSheet.pdf', size: '850 KB', type: 'pdf' },
      { id: 'att-3', name: 'Whiteboard_Solutions_Session1.png', size: '2.1 MB', type: 'image' }
    ],
    updatedAt: 'Today at 5:32 PM'
  },
  'DS-2': {
    sessionId: 'DS-2',
    sessionTitle: 'Spanish conversation practice',
    tutorName: 'Adaeze Nwosu',
    tutorAvatar: '/images/tutor-adaeze.jpg',
    date: '21 Aug 2026',
    time: '6:00 PM',
    summary: 'Practiced conversational scenarios in the restaurant and airport contexts. Focused on the difference between Por and Para, as well as subjunctive mood triggers.',
    keyPoints: [
      'Por: reason, duration, exchange, travel route',
      'Para: recipient, deadline, purpose/in order to, destination',
      'Key phrases: "¿Podría traerme la cuenta, por favor?", "Estoy listo para ordenar"'
    ],
    homework: [
      { id: 'hw-4', task: 'Record a 2-minute voice note describing your favorite meal in Spanish', dueDate: 'Monday, 24 Aug', completed: false },
      { id: 'hw-5', task: 'Memorize 15 vocabulary cards on travel and dining', dueDate: 'Monday, 24 Aug', completed: false }
    ],
    attachments: [
      { id: 'att-4', name: 'Spanish_Restaurant_Dialogue_Phrases.pdf', size: '920 KB', type: 'pdf' },
      { id: 'att-5', name: 'Por_vs_Para_Summary_Guide.pdf', size: '640 KB', type: 'pdf' }
    ],
    updatedAt: 'Yesterday'
  },
  'DS-3': {
    sessionId: 'DS-3',
    sessionTitle: 'Physics — Quantum basics',
    tutorName: 'Dr. Ibrahim Sanni',
    tutorAvatar: '/images/tutor-ibrahim.jpg',
    date: '23 Aug 2026',
    time: '5:15 PM',
    summary: 'Introduced wave-particle duality, Planck constant calculations, and photoelectric effect thresholds with stopping potential graphs.',
    keyPoints: [
      'E = hf = hc / λ',
      'Einstein photoelectric equation: hf = Φ + KE_max',
      'Threshold frequency (f₀) is the minimum frequency required to liberate electrons: Φ = h f₀'
    ],
    homework: [
      { id: 'hw-6', task: 'Solve Questions 1 through 8 on Photoelectric calculations', dueDate: 'Saturday, 23 Aug', completed: false },
      { id: 'hw-7', task: 'Plot stopping potential vs frequency from Table 3 experimental data', dueDate: 'Saturday, 23 Aug', completed: false }
    ],
    attachments: [
      { id: 'att-6', name: 'Quantum_Physics_Lecture_Summary_Slides.pdf', size: '3.8 MB', type: 'pdf' },
      { id: 'att-7', name: 'Past_Exam_Photoelectric_Problems.pdf', size: '1.1 MB', type: 'pdf' }
    ],
    updatedAt: '2 days ago'
  },
  'DS-4': {
    sessionId: 'DS-4',
    sessionTitle: 'Organic Chemistry Revision',
    tutorName: 'Chinwe Uche',
    tutorAvatar: '/images/tutor-adaeze.jpg',
    date: '28 Jul 2026',
    time: '2:00 PM',
    summary: 'Reviewed SN1 vs SN2 nucleophilic substitution reaction mechanisms and stereochemical outcomes (inversion vs racemization).',
    keyPoints: [
      'SN2: 1-step concerted mechanism, backside attack leads to Walden inversion (favored by 1° alkyl halides and polar aprotic solvents)',
      'SN1: 2-step mechanism with carbocation intermediate, leads to racemization (favored by 3° alkyl halides and polar protic solvents)'
    ],
    homework: [
      { id: 'hw-8', task: 'Draw complete arrow-pushing mechanisms for the 5 reaction schemes in Chapter 14', dueDate: 'Completed', completed: true }
    ],
    attachments: [
      { id: 'att-8', name: 'SN1_SN2_Mechanism_Flowchart.pdf', size: '1.6 MB', type: 'pdf' }
    ],
    updatedAt: 'Jul 28, 2026'
  }
};

export function getStoredLessonNotes(): Record<string, LessonNote> {
  try {
    const saved = localStorage.getItem('akademi_session_notes');
    if (saved) {
      return { ...INITIAL_NOTES, ...JSON.parse(saved) };
    }
  } catch (e) {}
  return INITIAL_NOTES;
}

export function saveStoredLessonNote(note: LessonNote) {
  try {
    const current = getStoredLessonNotes();
    current[String(note.sessionId)] = note;
    localStorage.setItem('akademi_session_notes', JSON.stringify(current));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
}

interface LessonNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string | number;
    title?: string;
    person?: string;
    tutorName?: string;
    subject?: string;
    date?: string;
    time?: string;
    duration?: string;
    type?: string;
  } | null;
  isTutorMode?: boolean;
}

export default function LessonNotesModal({
  isOpen,
  onClose,
  session,
  isTutorMode = false
}: LessonNotesModalProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
  const [allNotes, setAllNotes] = useState<Record<string, LessonNote>>(getStoredLessonNotes());
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Edit form states
  const [editSummary, setEditSummary] = useState('');
  const [editKeyPoints, setEditKeyPoints] = useState<string[]>([]);
  const [newKeyPointText, setNewKeyPointText] = useState('');
  const [editHomework, setEditHomework] = useState<HomeworkItem[]>([]);
  const [newHwTask, setNewHwTask] = useState('');
  const [newHwDue, setNewHwDue] = useState('');
  const [editAttachments, setEditAttachments] = useState<AttachmentItem[]>([]);
  const [mockFileName, setMockFileName] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const load = () => setAllNotes(getStoredLessonNotes());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  useEffect(() => {
    if (session && isOpen) {
      const sessionIdStr = String(session.id);
      const note = allNotes[sessionIdStr] || {
        sessionId: session.id,
        sessionTitle: session.title || `${session.subject || 'Subject'} Lesson`,
        tutorName: session.person || session.tutorName || 'Vetted Tutor',
        date: session.date || 'Today',
        time: session.time || '4:30 PM',
        summary: `Lesson notes for ${session.title || session.subject || 'this session'}. Key concepts and practice materials uploaded for student review.`,
        keyPoints: [
          'Core theoretical concepts introduced and analyzed',
          'Worked through step-by-step sample practice problems',
          'Identified key areas to review ahead of next meeting'
        ],
        homework: [
          { id: `hw-${Date.now()}-1`, task: 'Review the session summary formulas and practice questions', dueDate: 'Before next lesson', completed: false }
        ],
        attachments: [
          { id: `att-${Date.now()}-1`, name: `${(session.title || 'Lesson').replace(/\s+/g, '_')}_Summary.pdf`, size: '1.2 MB', type: 'pdf' }
        ],
        updatedAt: 'Just now'
      };

      setEditSummary(note.summary);
      setEditKeyPoints([...note.keyPoints]);
      setEditHomework([...note.homework]);
      setEditAttachments([...note.attachments]);
      setActiveTab(isTutorMode ? 'edit' : 'view');
    }
  }, [session, isOpen, isTutorMode]);

  if (!isOpen || !session) return null;

  const sessionIdStr = String(session.id);
  const currentNote: LessonNote = allNotes[sessionIdStr] || {
    sessionId: session.id,
    sessionTitle: session.title || `${session.subject || 'Subject'} Lesson`,
    tutorName: session.person || session.tutorName || 'Vetted Tutor',
    date: session.date || 'Today',
    time: session.time || '4:30 PM',
    summary: editSummary || 'Lesson notes are ready for review. Click below to download practice materials.',
    keyPoints: editKeyPoints.length ? editKeyPoints : ['Core concepts reviewed during session.'],
    homework: editHomework,
    attachments: editAttachments,
    updatedAt: 'Recently updated'
  };

  const handleToggleHomework = (hwId: string) => {
    const updatedHw = currentNote.homework.map(h => 
      h.id === hwId ? { ...h, completed: !h.completed } : h
    );
    const updatedNote: LessonNote = {
      ...currentNote,
      homework: updatedHw
    };
    saveStoredLessonNote(updatedNote);
    setAllNotes(getStoredLessonNotes());
  };

  const handleSaveTutorNote = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNote: LessonNote = {
      sessionId: session.id,
      sessionTitle: session.title || 'Lesson',
      tutorName: session.person || session.tutorName || 'Dr. Chiamaka Eze',
      date: session.date || 'Today',
      time: session.time || '4:30 PM',
      summary: editSummary,
      keyPoints: editKeyPoints,
      homework: editHomework,
      attachments: editAttachments,
      updatedAt: 'Just now'
    };
    saveStoredLessonNote(updatedNote);
    setAllNotes(getStoredLessonNotes());
    dispatchLessonNotesPush(updatedNote.tutorName, updatedNote.sessionTitle);
    setActiveTab('view');
    setDownloadToast('Lesson notes & materials published successfully!');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleAddKeyPoint = () => {
    if (!newKeyPointText.trim()) return;
    setEditKeyPoints(prev => [...prev, newKeyPointText.trim()]);
    setNewKeyPointText('');
  };

  const handleRemoveKeyPoint = (idx: number) => {
    setEditKeyPoints(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddHomework = () => {
    if (!newHwTask.trim()) return;
    setEditHomework(prev => [
      ...prev,
      {
        id: `hw-${Date.now()}`,
        task: newHwTask.trim(),
        dueDate: newHwDue.trim() || 'Next session',
        completed: false
      }
    ]);
    setNewHwTask('');
    setNewHwDue('');
  };

  const handleRemoveHomework = (hwId: string) => {
    setEditHomework(prev => prev.filter(h => h.id !== hwId));
  };

  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: AttachmentItem[] = Array.from(files).map((f, idx) => {
      const sizeInKb = Math.round(f.size / 1024);
      const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
      const ext = f.name.split('.').pop()?.toLowerCase();
      const type: 'pdf' | 'doc' | 'image' | 'link' = 
        ext === 'pdf' ? 'pdf' : 
        ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '') ? 'image' : 'doc';

      return {
        id: `att-${Date.now()}-${idx}`,
        name: f.name,
        size: sizeStr,
        type: type,
        url: URL.createObjectURL(f)
      };
    });

    setEditAttachments(prev => [...prev, ...newItems]);
    setDownloadToast(`Attached ${newItems.length} file(s) successfully!`);
    setTimeout(() => setDownloadToast(null), 2500);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddAttachment = () => {
    if (!mockFileName.trim()) return;
    const name = mockFileName.endsWith('.pdf') ? mockFileName : `${mockFileName}.pdf`;
    setEditAttachments(prev => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        name: name,
        size: '1.5 MB',
        type: 'pdf'
      }
    ]);
    setMockFileName('');
  };

  const handleRemoveAttachment = (attId: string) => {
    setEditAttachments(prev => prev.filter(a => a.id !== attId));
  };

  const triggerDownload = (fileName: string) => {
    setDownloadToast(`Preparing & downloading "${fileName}"...`);

    const fileContent = `================================================================================
AKADEMI ONLINE LEARNING PLATFORM
LESSON SUMMARY & STUDY PACK
================================================================================

Lesson Title   : ${currentNote.sessionTitle}
Tutor          : ${currentNote.tutorName}
Date           : ${currentNote.date}
Generated At   : ${new Date().toLocaleString()}

--------------------------------------------------------------------------------
1. TUTOR'S LESSON SUMMARY:
--------------------------------------------------------------------------------
${currentNote.summary}

--------------------------------------------------------------------------------
2. KEY FORMULAS & ESSENTIAL TAKEAWAYS:
--------------------------------------------------------------------------------
${currentNote.keyPoints.map((pt, i) => `  [${i + 1}] ${pt}`).join('\n')}

--------------------------------------------------------------------------------
3. ASSIGNED HOMEWORK & ACTION ITEMS:
--------------------------------------------------------------------------------
${currentNote.homework.map((hw, i) => `  [${hw.completed ? 'X' : ' '}] ${hw.task} (Due: ${hw.dueDate || 'Next lesson'})`).join('\n')}

--------------------------------------------------------------------------------
4. ATTACHED STUDY RESOURCES:
--------------------------------------------------------------------------------
${currentNote.attachments.map(a => `  - ${a.name} (${a.size})`).join('\n')}

================================================================================
© ${new Date().getFullYear()} Akademi Inc. All rights reserved.
================================================================================`;

    try {
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.endsWith('.zip') 
        ? `${currentNote.sessionTitle.replace(/\s+/g, '_')}_StudyPack.txt` 
        : fileName.endsWith('.pdf') 
        ? fileName.replace('.pdf', '_Summary.txt') 
        : fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }

    setTimeout(() => {
      setDownloadToast(`Downloaded "${fileName}" successfully!`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs font-sans">
        {/* Toast */}
        {downloadToast && (
          <div className="fixed top-6 right-6 z-60 bg-[#0F5338] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{downloadToast}</span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#FBF9F4] border-b border-[#E8E3D7] p-5 sm:p-6 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#0F5338] border border-[#D5EADB] flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 leading-tight">
                    {currentNote.sessionTitle}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-[#EAF5EE] text-[#0F5338] border border-[#D5EADB] text-[10px] font-bold uppercase rounded-full tracking-wider">
                    Lesson Materials
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>with <strong>{currentNote.tutorName}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {currentNote.date}</span>
                  {currentNote.updatedAt && (
                    <>
                      <span>·</span>
                      <span className="text-slate-400 text-[11px]">Updated {currentNote.updatedAt}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Tutor switch view/edit tab */}
              {isTutorMode && (
                <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 mr-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('view')}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold transition-all",
                      activeTab === 'view' ? "bg-[#0F5338] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold transition-all",
                      activeTab === 'edit' ? "bg-[#0F5338] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Edit
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'view' ? (
              <>
                {/* 1. Lesson Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0F5338]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Tutor's Lesson Summary
                    </h3>
                  </div>
                  <div className="p-4 bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7] text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {currentNote.summary}
                  </div>
                </div>

                {/* 2. Key Takeaways / Formulas */}
                {currentNote.keyPoints && currentNote.keyPoints.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Key Formulas & Takeaways
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {currentNote.keyPoints.map((pt, i) => (
                        <div 
                          key={i} 
                          className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs font-medium text-emerald-950 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#0F5338] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Homework & Practice Tasks */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0F5338]" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Assigned Homework & Action Items
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {currentNote.homework.filter(h => h.completed).length}/{currentNote.homework.length} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentNote.homework.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No homework assigned for this session.</p>
                    ) : (
                      currentNote.homework.map(hw => (
                        <div
                          key={hw.id}
                          onClick={() => handleToggleHomework(hw.id)}
                          className={cn(
                            "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none",
                            hw.completed
                              ? "bg-slate-50/80 border-slate-200 text-slate-400 line-through"
                              : "bg-white border-[#E8E3D7] hover:border-[#0F5338]/50 text-slate-800 shadow-2xs"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              className={cn(
                                "w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0",
                                hw.completed ? "bg-[#0F5338] text-white" : "border-2 border-slate-300 hover:border-[#0F5338]"
                              )}
                            >
                              {hw.completed && <Check className="w-3.5 h-3.5" />}
                            </button>
                            <span className="text-xs font-semibold leading-normal truncate">{hw.task}</span>
                          </div>

                          {hw.dueDate && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                              Due: {hw.dueDate}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. Attached Files & Downloads */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-[#0F5338]" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Attached Files & Worksheets ({currentNote.attachments.length})
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentNote.attachments.map(att => (
                      <div
                        key={att.id}
                        className="p-3 bg-white rounded-2xl border border-[#E8E3D7] flex items-center justify-between gap-3 shadow-2xs hover:border-[#0F5338]/40 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{att.name}</p>
                            <p className="text-[10px] text-slate-400">{att.size}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerDownload(att.name)}
                          className="p-2 rounded-xl bg-[#EAF5EE] text-[#0F5338] hover:bg-[#0F5338] hover:text-white transition-colors shrink-0"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Tutor Edit Form */
              <form onSubmit={handleSaveTutorNote} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lesson Summary & Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    placeholder="Describe what was covered in this session, formula shortcuts, and areas the student should review..."
                    className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5338]"
                    required
                  />
                </div>

                {/* Key Points */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Key Formulas & Takeaways
                  </label>
                  <div className="space-y-2 mb-2">
                    {editKeyPoints.map((pt, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl text-xs gap-2">
                        <span className="text-slate-800">{pt}</span>
                        <button type="button" onClick={() => handleRemoveKeyPoint(i)} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyPointText}
                      onChange={(e) => setNewKeyPointText(e.target.value)}
                      placeholder="e.g. Formula: E = hf (Planck-Einstein relation)"
                      className="flex-1 bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyPoint}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>

                {/* Homework Checklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Homework Tasks
                  </label>
                  <div className="space-y-2 mb-2">
                    {editHomework.map((hw) => (
                      <div key={hw.id} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl text-xs gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">{hw.task}</p>
                          <p className="text-[10px] text-slate-400">Due: {hw.dueDate}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveHomework(hw.id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newHwTask}
                      onChange={(e) => setNewHwTask(e.target.value)}
                      placeholder="Task description..."
                      className="sm:col-span-2 bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newHwDue}
                        onChange={(e) => setNewHwDue(e.target.value)}
                        placeholder="Due: Friday"
                        className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                      />
                      <button
                        type="button"
                        onClick={handleAddHomework}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Attachments */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attached Files & Worksheets
                  </label>
                  <div className="space-y-2 mb-2">
                    {editAttachments.map((att) => (
                      <div key={att.id} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl text-xs gap-2">
                        <span className="font-semibold text-slate-800 truncate">{att.name} ({att.size})</span>
                        <button type="button" onClick={() => handleRemoveAttachment(att.id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Hidden Native File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleNativeFileUpload}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F5338] border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>Browse Files (.pdf, .png, .doc)</span>
                    </button>

                    <div className="flex flex-1 gap-1.5">
                      <input
                        type="text"
                        value={mockFileName}
                        onChange={(e) => setMockFileName(e.target.value)}
                        placeholder="Or enter title: Mechanics_Worksheet.pdf"
                        className="flex-1 bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAttachment}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTab('view')}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Save & Publish Notes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          {activeTab === 'view' && (
            <div className="bg-[#FBF9F4] border-t border-[#E8E3D7] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/dashboard/messages"
                className="text-xs font-bold text-[#0F5338] hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask {currentNote.tutorName} a question</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerDownload(`${currentNote.sessionTitle}_Materials.zip`)}
                  className="px-4 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Materials</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
