import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Globe, 
  Monitor, 
  Briefcase, 
  Palette,
  Search,
  CheckCircle2,
  X,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subject {
  id: number;
  name: string;
  group: string;
  tutors: number;
  sessions: number;
  active: boolean;
  color: string;
  iconName: string;
}

const initialSubjects: Subject[] = [
  { id: 1, name: 'General Mathematics', group: 'Mathematics', tutors: 45, sessions: 1205, active: true, color: 'bg-blue-100 text-blue-600', iconName: 'Calculator' },
  { id: 2, name: 'Further Mathematics', group: 'Mathematics', tutors: 28, sessions: 840, active: true, color: 'bg-blue-100 text-blue-600', iconName: 'Calculator' },
  { id: 3, name: 'Physics', group: 'Sciences', tutors: 32, sessions: 950, active: true, color: 'bg-indigo-100 text-indigo-600', iconName: 'FlaskConical' },
  { id: 4, name: 'Chemistry', group: 'Sciences', tutors: 30, sessions: 890, active: true, color: 'bg-indigo-100 text-indigo-600', iconName: 'FlaskConical' },
  { id: 5, name: 'Biology', group: 'Sciences', tutors: 35, sessions: 1100, active: true, color: 'bg-indigo-100 text-indigo-600', iconName: 'FlaskConical' },
  { id: 6, name: 'English Language', group: 'Languages', tutors: 50, sessions: 1500, active: true, color: 'bg-emerald-100 text-emerald-600', iconName: 'Globe' },
  { id: 7, name: 'French', group: 'Languages', tutors: 15, sessions: 320, active: true, color: 'bg-emerald-100 text-emerald-600', iconName: 'Globe' },
  { id: 8, name: 'Computer Science', group: 'Technology', tutors: 22, sessions: 650, active: true, color: 'bg-amber-100 text-amber-600', iconName: 'Monitor' },
  { id: 9, name: 'Economics', group: 'Business', tutors: 25, sessions: 720, active: true, color: 'bg-violet-100 text-violet-600', iconName: 'Briefcase' },
  { id: 10, name: 'Fine Arts & Design', group: 'Arts', tutors: 12, sessions: 280, active: true, color: 'bg-rose-100 text-rose-600', iconName: 'Palette' },
];

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newSub, setNewSub] = useState({
    name: '',
    group: 'Mathematics',
    active: true,
  });

  const groups = ['All', 'Mathematics', 'Sciences', 'Languages', 'Technology', 'Business', 'Arts'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'FlaskConical': return FlaskConical;
      case 'Globe': return Globe;
      case 'Monitor': return Monitor;
      case 'Briefcase': return Briefcase;
      case 'Palette': return Palette;
      default: return BookOpen;
    }
  };

  const handleToggleStatus = (id: number) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        const next = !s.active;
        showToast(`Subject "${s.name}" is now ${next ? 'active' : 'archived'}.`);
        return { ...s, active: next };
      }
      return s;
    }));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSub.name.trim()) return;

    const groupColors: Record<string, { color: string; icon: string }> = {
      Mathematics: { color: 'bg-blue-100 text-blue-600', icon: 'Calculator' },
      Sciences: { color: 'bg-indigo-100 text-indigo-600', icon: 'FlaskConical' },
      Languages: { color: 'bg-emerald-100 text-emerald-600', icon: 'Globe' },
      Technology: { color: 'bg-amber-100 text-amber-600', icon: 'Monitor' },
      Business: { color: 'bg-violet-100 text-violet-600', icon: 'Briefcase' },
      Arts: { color: 'bg-rose-100 text-rose-600', icon: 'Palette' },
    };

    const config = groupColors[newSub.group] || { color: 'bg-slate-100 text-slate-600', icon: 'BookOpen' };

    const created: Subject = {
      id: Date.now(),
      name: newSub.name,
      group: newSub.group,
      tutors: 0,
      sessions: 0,
      active: newSub.active,
      color: config.color,
      iconName: config.icon,
    };

    setSubjects([...subjects, created]);
    setShowAddModal(false);
    setNewSub({ name: '', group: 'Mathematics', active: true });
    showToast(`Subject "${created.name}" added to catalogue.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
    setEditingSubject(null);
    showToast(`Subject "${editingSubject.name}" updated.`);
  };

  const handleDeleteSubject = (id: number) => {
    const target = subjects.find(s => s.id === id);
    setSubjects(subjects.filter(s => s.id !== id));
    setEditingSubject(null);
    showToast(`Subject "${target?.name}" deleted.`);
  };

  const filteredSubjects = subjects.filter(s => {
    const matchesFilter = activeFilter === 'All' || s.group === activeFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      {/* Toast */}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subject Catalogue</h1>
          <p className="text-sm text-slate-500 mt-1">Manage academic subjects, categories, and tutor mappings</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm whitespace-nowrap gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => setActiveFilter(group)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
              activeFilter === group
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSubjects.map((subject) => {
          const Icon = getIcon(subject.iconName);
          return (
            <div key={subject.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center font-bold", subject.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <button 
                    onClick={() => setEditingSubject(subject)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="text-base font-bold text-slate-900 mb-1">{subject.name}</h3>
                <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-semibold mb-4">
                  {subject.group}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Tutors</p>
                  <p className="font-bold text-slate-900 text-sm">{subject.tutors}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Sessions</p>
                  <p className="font-bold text-slate-900 text-sm">{subject.sessions}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-slate-500 mb-1 font-medium">{subject.active ? 'Active' : 'Archived'}</p>
                  <button 
                    onClick={() => handleToggleStatus(subject.id)}
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                      subject.active ? "bg-emerald-500" : "bg-slate-300"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                      subject.active ? "translate-x-4" : "translate-x-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Add New Subject</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubject} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Organic Chemistry"
                    value={newSub.name}
                    onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject Category</label>
                  <select 
                    value={newSub.group}
                    onChange={(e) => setNewSub({ ...newSub, group: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Create Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Subject Modal */}
        {editingSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setEditingSubject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Edit Subject: {editingSubject.name}</h3>
                <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject Category</label>
                  <select 
                    value={editingSubject.group}
                    onChange={(e) => setEditingSubject({ ...editingSubject, group: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => handleDeleteSubject(editingSubject.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Subject
                  </button>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setEditingSubject(null)} 
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
