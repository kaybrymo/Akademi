import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Trash2, 
  ShieldCheck, 
  Ban, 
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: 'Student' | 'Tutor' | 'Admin' | 'Super Admin';
  joined: string;
  sessions: number;
  status: 'Active' | 'Suspended';
  bg: string;
}

const initialUsers: User[] = [
  { id: 1, name: 'Chioma Adeyemi', email: 'chioma.a@example.com', initials: 'CA', role: 'Student', joined: 'Oct 12, 2025', sessions: 14, status: 'Active', bg: 'bg-blue-100 text-blue-700' },
  { id: 2, name: 'Daniel Okafor', email: 'daniel.o@example.com', initials: 'DO', role: 'Tutor', joined: 'Sep 05, 2025', sessions: 312, status: 'Active', bg: 'bg-emerald-100 text-emerald-700' },
  { id: 3, name: 'Oluwaseun Ojo', email: 'oluwaseun@example.com', initials: 'OO', role: 'Student', joined: 'Oct 18, 2025', sessions: 3, status: 'Active', bg: 'bg-indigo-100 text-indigo-700' },
  { id: 4, name: 'Adaeze Nwosu', email: 'adaeze.n@example.com', initials: 'AN', role: 'Tutor', joined: 'Aug 22, 2025', sessions: 204, status: 'Active', bg: 'bg-amber-100 text-amber-700' },
  { id: 5, name: 'Super Admin', email: 'superadmin@akademi.dev', initials: 'SA', role: 'Super Admin', joined: 'Jan 01, 2025', sessions: 0, status: 'Active', bg: 'bg-amber-600 text-white font-bold' },
  { id: 6, name: 'Admin User', email: 'admin@akademi.dev', initials: 'AD', role: 'Admin', joined: 'Jan 05, 2025', sessions: 0, status: 'Active', bg: 'bg-slate-800 text-slate-100' },
  { id: 7, name: 'Emeka Uzo', email: 'emeka.u@example.com', initials: 'EU', role: 'Student', joined: 'Oct 20, 2025', sessions: 1, status: 'Active', bg: 'bg-rose-100 text-rose-700' },
  { id: 8, name: 'Grace Etim', email: 'grace.e@example.com', initials: 'GE', role: 'Tutor', joined: 'Jul 14, 2025', sessions: 198, status: 'Suspended', bg: 'bg-violet-100 text-violet-700' },
  { id: 9, name: 'Aisha Bello', email: 'aisha.b@example.com', initials: 'AB', role: 'Student', joined: 'Oct 22, 2025', sessions: 0, status: 'Active', bg: 'bg-cyan-100 text-cyan-700' },
  { id: 10, name: 'Dr. Ibrahim Sanni', email: 'ibrahim.s@example.com', initials: 'IS', role: 'Tutor', joined: 'Jun 10, 2025', sessions: 428, status: 'Active', bg: 'bg-emerald-100 text-emerald-700' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_admin_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialUsers;
  });

  const [currentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { role: 'super_admin', name: 'Super Admin' };
  });

  const isSuperAdmin = currentUser.role === 'super_admin';

  const [activeTab, setActiveTab] = useState<'All' | 'Students' | 'Tutors' | 'Admins' | 'Super Admins'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student' as 'Student' | 'Tutor' | 'Admin' | 'Super Admin',
    status: 'Active' as 'Active' | 'Suspended',
  });

  const saveUsers = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('akademi_admin_users', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const initials = newUser.name
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const roleBgs = {
      Student: 'bg-blue-100 text-blue-700',
      Tutor: 'bg-emerald-100 text-emerald-700',
      Admin: 'bg-slate-800 text-slate-100',
      'Super Admin': 'bg-amber-600 text-white font-bold',
    };

    const userToAdd: User = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      initials: initials || 'U',
      role: newUser.role,
      joined: 'Just now',
      sessions: 0,
      status: newUser.status,
      bg: roleBgs[newUser.role],
    };

    const updated = [userToAdd, ...users];
    saveUsers(updated);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Student', status: 'Active' });
    showToast(`User "${userToAdd.name}" added successfully.`);
  };

  const handleToggleStatus = (id: number) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus: 'Active' | 'Suspended' = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User "${u.name}" is now ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
    setActionMenuOpen(null);
  };

  const handleDeleteUser = (id: number) => {
    const target = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
    setActionMenuOpen(null);
    showToast(`User "${target?.name}" removed.`);
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = 
      activeTab === 'All' ? true :
      activeTab === 'Students' ? user.role === 'Student' :
      activeTab === 'Tutors' ? user.role === 'Tutor' :
      activeTab === 'Admins' ? user.role === 'Admin' :
      user.role === 'Super Admin';

    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    All: users.length,
    Students: users.filter(u => u.role === 'Student').length,
    Tutors: users.filter(u => u.role === 'Tutor').length,
    Admins: users.filter(u => u.role === 'Admin').length,
    'Super Admins': users.filter(u => u.role === 'Super Admin').length,
  };

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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1.5 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Super Admin & Administrator Privileged Console</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management (All Users)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage students, tutors, administrators, and super admin privileges</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="px-3 pt-3 border-b border-slate-200 overflow-x-auto">
          <div className="flex space-x-1">
            {(['All', 'Students', 'Tutors', 'Admins', 'Super Admins'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap",
                  activeTab === tab
                    ? "text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-b-2 border-transparent"
                )}
              >
                {tab}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  activeTab === tab ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                )}>
                  {tabCounts[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Sessions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm", user.bg)}>
                          {user.initials}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.role === 'Super Admin' ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold" :
                        user.role === 'Student' ? "bg-blue-100 text-blue-800" :
                        user.role === 'Tutor' ? "bg-emerald-100 text-emerald-800" :
                        "bg-purple-100 text-purple-800"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {user.sessions}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        user.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", user.status === 'Active' ? "bg-emerald-500" : "bg-red-500")} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1",
                            user.status === 'Active'
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          )}
                          title={user.status === 'Active' ? "Suspend account" : "Re-activate account"}
                        >
                          {user.status === 'Active' ? (
                            <>
                              <Ban className="h-3.5 w-3.5" /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" /> Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
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
              <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Babatunde Fashola"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="babatunde@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Account Role</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Tutor">Tutor</option>
                    {isSuperAdmin && <option value="Admin">Admin (Operations Staff)</option>}
                    {isSuperAdmin && <option value="Super Admin">Super Admin (Platform Owner)</option>}
                  </select>
                  {!isSuperAdmin && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      👑 Admin staff accounts can only be provisioned by the Super Admin.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
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
                  Create User
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
