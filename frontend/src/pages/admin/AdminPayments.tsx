import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  Download, 
  Plus, 
  Settings2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Building2,
  RotateCcw,
  Lock,
  Zap,
  ShieldAlert,
  History,
  FileText,
  Activity,
  UserCheck,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import InitiateRefundModal from '@/components/modals/InitiateRefundModal';
import SuperAdminAuthModal from '@/components/modals/SuperAdminAuthModal';
import { dispatchPayoutPush } from '@/lib/websocketPushEngine';

interface Gateway {
  id: string;
  name: string;
  slug: string;
  provider: string;
  isActive: boolean;
  isDefault: boolean;
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  description: string;
  letter: string;
  color: string;
  bg: string;
}

interface Transaction {
  id: string;
  student: string;
  tutor: string;
  amt: number;
  comm: number;
  gw: string;
  status: 'Success' | 'Failed' | 'Pending' | 'Refunded' | 'Partially Refunded';
  date: string;
}

export interface PaymentDispute {
  id: string;
  complainantName: string;
  complainantRole: 'Student' | 'Tutor';
  counterpartName: string;
  claimType: 'Tutor No-Show' | 'Student Overcharge' | 'Deposit Uncredited' | 'Payout Bank Delay';
  amount: number;
  sessionId?: string;
  date: string;
  status: 'Open' | 'Under Review' | 'Refunded' | 'Released' | 'Rejected';
  description: string;
  resolutionNote?: string;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  role: 'Super Admin' | 'Finance Admin' | 'Support Admin';
  action: string;
  category: 'Gateway Configuration' | 'Dispute Resolution' | 'Security & 2FA' | 'Refund Desk' | 'Commission & Payout';
  details: string;
  ipAddress: string;
  status: 'Authorized' | 'Completed' | 'Flagged';
  timestamp: string;
}

const initialAuditLogs: AdminAuditLog[] = [
  {
    id: 'LOG-9401',
    adminName: 'Chiamaka Eze',
    adminEmail: 'superadmin@akademi.com',
    role: 'Super Admin',
    action: 'Payment Gateway Default Changed',
    category: 'Gateway Configuration',
    details: 'Changed platform default payment provider to Paystack (Live Production mode)',
    ipAddress: '197.210.64.12 (Lagos, NG)',
    status: 'Authorized',
    timestamp: 'Today, 4:32 PM'
  },
  {
    id: 'LOG-9402',
    adminName: 'Dr. Funmilayo Adeyemi',
    adminEmail: 'finance@akademi.com',
    role: 'Finance Admin',
    action: 'Direct Wallet Refund Dispatched',
    category: 'Refund Desk',
    details: 'Initiated 100% full refund of ₦3,500 for student transaction TX-892144',
    ipAddress: '102.89.43.201 (Abuja, NG)',
    status: 'Completed',
    timestamp: 'Today, 2:15 PM'
  },
  {
    id: 'LOG-9403',
    adminName: 'Chiamaka Eze',
    adminEmail: 'superadmin@akademi.com',
    role: 'Super Admin',
    action: 'Payment 2FA Security Enforced',
    category: 'Security & 2FA',
    details: 'Enacted mandatory 6-digit OTP verification policy across all payment checkouts',
    ipAddress: '197.210.64.12 (Lagos, NG)',
    status: 'Authorized',
    timestamp: 'Yesterday, 6:50 PM'
  },
  {
    id: 'LOG-9404',
    adminName: 'Babatunde Lawal',
    adminEmail: 'support@akademi.com',
    role: 'Support Admin',
    action: 'Payment Dispute Resolved',
    category: 'Dispute Resolution',
    details: 'Approved Claim DSP-8821 (Tutor No-Show) and credited ₦35,000 to student wallet',
    ipAddress: '105.112.98.54 (Port Harcourt, NG)',
    status: 'Completed',
    timestamp: 'Yesterday, 11:05 AM'
  },
  {
    id: 'LOG-9405',
    adminName: 'Chiamaka Eze',
    adminEmail: 'superadmin@akademi.com',
    role: 'Super Admin',
    action: 'Platform Commission Policy Updated',
    category: 'Commission & Payout',
    details: 'Adjusted platform tutoring session commission rate to 10%',
    ipAddress: '197.210.64.12 (Lagos, NG)',
    status: 'Authorized',
    timestamp: 'Aug 18, 2026, 3:20 PM'
  }
];

const initialDisputes: PaymentDispute[] = [
  {
    id: 'DSP-8821',
    complainantName: 'Chiamaka Ada',
    complainantRole: 'Student',
    counterpartName: 'Dr. Chiamaka Eze',
    claimType: 'Tutor No-Show',
    amount: 35000,
    sessionId: 'Session #101 · Calculus',
    date: 'Today, 11:20 AM',
    status: 'Open',
    description: 'Tutor experienced internet power outage and requested a reschedule. Student requested full wallet credit.'
  },
  {
    id: 'DSP-8822',
    complainantName: 'Dr. Ibrahim Sanni',
    complainantRole: 'Tutor',
    counterpartName: 'Akademi Treasury',
    claimType: 'Payout Bank Delay',
    amount: 50000,
    date: 'Yesterday, 4:15 PM',
    status: 'Under Review',
    description: 'Weekly payout batch initiated to GTBank account was delayed due to NIBSS interbank processing.'
  },
  {
    id: 'DSP-8823',
    complainantName: 'Oluwaseun Ojo',
    complainantRole: 'Student',
    counterpartName: 'Paystack Gateway',
    claimType: 'Deposit Uncredited',
    amount: 10000,
    date: 'May 18, 2026',
    status: 'Refunded',
    description: 'Card charged twice on top-up. Duplicate charge confirmed and auto-refunded to student wallet.'
  }
];

const initialGateways: Gateway[] = [
  {
    id: 'gw-1',
    name: 'Paystack',
    slug: 'paystack',
    provider: 'Paystack',
    isActive: true,
    isDefault: true,
    publicKey: 'pk_live_890a8e9f01bc234d5678',
    secretKey: 'sk_live_123456789abcdef01234',
    webhookUrl: 'https://api.akademi.com/webhooks/paystack',
    description: 'Accepts cards, bank transfers, USSD across Africa',
    letter: 'P',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  {
    id: 'gw-2',
    name: 'Flutterwave',
    slug: 'flutterwave',
    provider: 'Flutterwave',
    isActive: true,
    isDefault: false,
    publicKey: 'FLWPUBK_test_0192837465',
    secretKey: 'FLWSECK_test_9876543210',
    webhookUrl: 'https://api.akademi.com/webhooks/flutterwave',
    description: 'Pan-African payments with mobile money support',
    letter: 'F',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    id: 'gw-3',
    name: 'Stripe',
    slug: 'stripe',
    provider: 'Stripe',
    isActive: false,
    isDefault: false,
    publicKey: '',
    secretKey: '',
    webhookUrl: 'https://api.akademi.com/webhooks/stripe',
    description: 'Global card payments with advanced fraud protection',
    letter: 'S',
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
];

const initialTransactions: Transaction[] = [
  { id: 'TX-893012', student: 'Chioma Adeyemi', tutor: 'Dr. Ibrahim Musa', amt: 5000, comm: 500, gw: 'Paystack', status: 'Success', date: 'Today, 1:45 PM' },
  { id: 'TX-893011', student: 'Oluwaseun Ojo', tutor: 'Sarah Okafor', amt: 4500, comm: 450, gw: 'Paystack', status: 'Success', date: 'Today, 11:20 AM' },
  { id: 'TX-893010', student: 'Emeka Uzo', tutor: 'David Osei', amt: 6000, comm: 600, gw: 'Flutterwave', status: 'Failed', date: 'Yesterday, 4:10 PM' },
  { id: 'TX-893009', student: 'Aisha Bello', tutor: 'Marie Claire', amt: 3500, comm: 350, gw: 'Paystack', status: 'Success', date: 'Yesterday, 2:00 PM' },
  { id: 'TX-893008', student: 'Tobi Bakre', tutor: 'Dr. Ibrahim Musa', amt: 5000, comm: 500, gw: 'Paystack', status: 'Success', date: 'Oct 24, 6:30 PM' },
  { id: 'TX-893007', student: 'Ngozi Okoro', tutor: 'Grace Etim', amt: 4000, comm: 400, gw: 'Paystack', status: 'Pending', date: 'Oct 24, 3:15 PM' },
];

export default function AdminPayments() {
  const [gateways, setGateways] = useState<Gateway[]>(() => {
    const saved = localStorage.getItem('akademi_admin_gateways');
    return saved ? JSON.parse(saved) : initialGateways;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const dynamic: Transaction[] = [];
    try {
      const savedUserTx = localStorage.getItem('akademi_user_transactions');
      if (savedUserTx) {
        const list = JSON.parse(savedUserTx);
        list.forEach((tx: any, i: number) => {
          const rawAmt = Number(String(tx.amount).replace(/[^0-9]/g, '')) || 5000;
          dynamic.push({
            id: tx.id || `TX-${893100 + i}`,
            student: 'Chiamaka Adeyemi',
            tutor: tx.description?.includes('with') ? tx.description.split('with')[1].trim().split('(')[0].trim() : 'Dr. Ibrahim Musa',
            amt: rawAmt,
            comm: Math.round(rawAmt * 0.1),
            gw: tx.description?.includes('Paystack') ? 'Paystack' : 'Paystack (Default)',
            status: tx.status === 'Completed' || tx.status === 'Success' ? 'Success' : 'Pending',
            date: tx.date || 'Today, Just now'
          });
        });
      }
    } catch (e) {}
    return [...dynamic, ...initialTransactions];
  });

  useEffect(() => {
    const syncAdminTx = () => {
      try {
        const savedUserTx = localStorage.getItem('akademi_user_transactions');
        if (savedUserTx) {
          const list = JSON.parse(savedUserTx);
          const dynamic: Transaction[] = list.map((tx: any, i: number) => {
            const rawAmt = Number(String(tx.amount).replace(/[^0-9]/g, '')) || 5000;
            return {
              id: tx.id || `TX-${893100 + i}`,
              student: 'Chiamaka Adeyemi',
              tutor: tx.description?.includes('with') ? tx.description.split('with')[1].trim().split('(')[0].trim() : 'Dr. Ibrahim Musa',
              amt: rawAmt,
              comm: Math.round(rawAmt * 0.1),
              gw: tx.description?.includes('Paystack') ? 'Paystack' : 'Paystack (Default)',
              status: tx.status === 'Completed' || tx.status === 'Success' ? 'Success' : 'Pending',
              date: tx.date || 'Today, Just now'
            };
          });
          setTransactions([...dynamic, ...initialTransactions]);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', syncAdminTx);
    return () => window.removeEventListener('storage', syncAdminTx);
  }, []);

  const [txSearch, setTxSearch] = useState('');
  const [txFilterGw, setTxFilterGw] = useState('All');
  const [txFilterStatus, setTxFilterStatus] = useState('All');

  const [currentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { role: 'super_admin', name: 'Super Admin' };
  });

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Payment Disputes Hub State (Managed by both Standard Admin and Super Admin)
  const [disputes, setDisputes] = useState<PaymentDispute[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_payment_disputes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialDisputes;
  });

  const [selectedDispute, setSelectedDispute] = useState<PaymentDispute | null>(null);
  const [disputeFilter, setDisputeFilter] = useState<'All' | 'Open' | 'Under Review' | 'Resolved'>('All');
  const [activeMainTab, setActiveMainTab] = useState<'gateways' | 'disputes' | 'transactions' | 'audit_logs'>('gateways');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_admin_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAuditLogs;
  });
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('All');
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('All');

  const logAdminActivity = (
    action: string,
    category: AdminAuditLog['category'],
    details: string,
    status: 'Authorized' | 'Completed' | 'Flagged' = 'Authorized'
  ) => {
    const newLog: AdminAuditLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      adminName: 'Chiamaka Eze',
      adminEmail: 'superadmin@akademi.com',
      role: 'Super Admin',
      action,
      category,
      details,
      ipAddress: '197.210.64.12 (Lagos, NG)',
      status,
      timestamp: 'Today, Just now'
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    try {
      localStorage.setItem('akademi_admin_audit_logs', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  // Super Admin Password Protection Gate
  const [superAdminAuth, setSuperAdminAuth] = useState<{
    isOpen: boolean;
    actionTitle: string;
    actionDescription?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    actionTitle: '',
    actionDescription: '',
    onConfirm: () => {}
  });

  const requestSuperAdminAuth = (actionTitle: string, actionDescription: string, onConfirm: () => void) => {
    setSuperAdminAuth({
      isOpen: true,
      actionTitle,
      actionDescription,
      onConfirm: () => {
        setSuperAdminAuth(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      }
    });
  };

  const defaultGateway = gateways.find(g => g.isDefault) || gateways[0];
  const defaultGatewayName = defaultGateway?.name || 'Paystack';

  const openDisputeCount = disputes.filter(d => d.status === 'Open' || d.status === 'Under Review').length;

  const saveDisputes = (updated: PaymentDispute[]) => {
    setDisputes(updated);
    try {
      localStorage.setItem('akademi_payment_disputes', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleResolveDispute = (id: string, action: 'refund' | 'release' | 'reject') => {
    const target = disputes.find(d => d.id === id);
    if (!target) return;

    let newStatus: 'Refunded' | 'Released' | 'Rejected' = 'Resolved' as any;
    let toast = '';

    if (action === 'refund') {
      newStatus = 'Refunded';
      toast = `✓ Claim Approved: ₦${target.amount.toLocaleString()} refunded to ${target.complainantName}'s wallet.`;
      
      // Credit student wallet
      try {
        const curBal = Number(localStorage.getItem('akademi_wallet_balance_ngn') || 142500);
        localStorage.setItem('akademi_wallet_balance_ngn', String(curBal + target.amount));
        
        // Log transaction
        const savedTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
        const refundTx = {
          id: `REF-${Date.now().toString().slice(-6)}`,
          type: 'Dispute Refund',
          description: `Dispute ${target.id} Resolution: ${target.claimType}`,
          amount: `+₦${target.amount.toLocaleString()}`,
          status: 'Completed',
          date: 'Today, Just now'
        };
        localStorage.setItem('akademi_user_transactions', JSON.stringify([refundTx, ...savedTx]));
      } catch (e) {}
    } else if (action === 'release') {
      newStatus = 'Released';
      toast = `✓ Payout of ₦${target.amount.toLocaleString()} released to ${target.counterpartName}.`;
      dispatchPayoutPush(`₦${target.amount.toLocaleString()}`, 'Approved');
    } else {
      newStatus = 'Rejected';
      toast = `Dispute ${target.id} closed and marked as rejected.`;
    }

    const updated = disputes.map(d => d.id === id ? { ...d, status: newStatus } : d);
    saveDisputes(updated);
    setSelectedDispute(null);
    showToast(toast);
  };

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDefaultModal, setShowDefaultModal] = useState(false);
  const [pendingDefaultId, setPendingDefaultId] = useState<string | null>(null);
  
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Transaction for Direct Refund from Live Ledger
  const [selectedRefundTx, setSelectedRefundTx] = useState<any | null>(null);

  // 2FA Payment Requirement Setting (Governed by Super Admin)
  const [requirePayment2FA, setRequirePayment2FA] = useState(() => {
    const saved = localStorage.getItem('akademi_require_payment_2fa');
    return saved !== null ? saved === 'true' : true;
  });

  const handleTogglePayment2FA = () => {
    const nextVal = !requirePayment2FA;
    requestSuperAdminAuth(
      nextVal ? 'Enforce Mandatory Payment 2FA' : 'Disable Payment 2FA Requirement',
      nextVal 
        ? 'Requires all students to complete 6-digit OTP verification before making wallet deposits or booking lessons.'
        : 'Disables mandatory OTP verification on payment checkouts.',
      () => {
        setRequirePayment2FA(nextVal);
        localStorage.setItem('akademi_require_payment_2fa', String(nextVal));
        window.dispatchEvent(new Event('storage'));
        logAdminActivity(
          'Payment 2FA Policy Modified',
          'Security & 2FA',
          `Super Admin ${nextVal ? 'ENFORCED' : 'DISABLED'} platform-wide 2FA requirement for checkout transactions`
        );
        showToast(nextVal ? '✓ Mandatory 2FA Security enabled for all checkout transactions.' : 'Payment 2FA authorization disabled.');
      }
    );
  };

  const handleExecuteDirectRefund = (amount: number, reason: string, refundType: 'Full' | 'Partial') => {
    if (!selectedRefundTx) return;

    const tx = selectedRefundTx;
    // Credit student wallet
    try {
      const curBal = Number(localStorage.getItem('akademi_wallet_balance_ngn') || 142500);
      localStorage.setItem('akademi_wallet_balance_ngn', String(curBal + amount));

      // Record refund transaction in student history
      const savedTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const refundRecord = {
        id: `RFD-${Date.now().toString().slice(-6)}`,
        type: 'Refund',
        description: `Direct Refund for ${tx.id}: ${reason}`,
        amount: `+₦${amount.toLocaleString()}`,
        status: 'Completed',
        date: 'Today, Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([refundRecord, ...savedTx]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    // Update transactions list status
    const updatedTx = transactions.map(t => {
      if (t.id === tx.id) {
        return {
          ...t,
          status: refundType === 'Full' ? 'Refunded' : 'Partially Refunded'
        };
      }
      return t;
    });
    setTransactions(updatedTx as any);
    setSelectedRefundTx(null);

    // Record in Audit Trail
    logAdminActivity(
      'Direct Payment Refund Dispatched',
      'Refund Desk',
      `Dispatched ${refundType} refund of ₦${amount.toLocaleString()} for transaction ${tx.id} to ${tx.student} (${reason})`
    );

    showToast(`✓ Gateway Refund of ₦${amount.toLocaleString()} processed for ${tx.student} (${reason}).`);
  };

  const handleProbeGateway = (gw: Gateway) => {
    showToast(`⏳ Probing ${gw.name} API endpoint connection...`);
    setTimeout(() => {
      showToast(`✓ Health Probe Passed: ${gw.name} integration is live & auto-configured (Ping: 138ms)!`);
    }, 800);
  };

  // New Gateway form state
  const [newGw, setNewGw] = useState({
    name: '',
    provider: 'Paystack',
    publicKey: '',
    secretKey: '',
    webhookUrl: 'https://api.akademi.com/webhooks/payments',
    description: '',
  });

  // Commission state
  const [commissionRate, setCommissionRate] = useState(() => {
    return Number(localStorage.getItem('akademi_commission_rate') || 10);
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveGateways = (updated: Gateway[]) => {
    setGateways(updated);
    try {
      localStorage.setItem('akademi_admin_gateways', JSON.stringify(updated));
      const activeDef = updated.find(g => g.isDefault) || updated[0];
      if (activeDef) {
        localStorage.setItem('akademi_default_gateway_name', activeDef.name);
      }
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleSetDefaultConfirm = () => {
    if (!pendingDefaultId) return;
    const target = gateways.find(g => g.id === pendingDefaultId);
    const currentDef = gateways.find(g => g.isDefault);
    setShowDefaultModal(false);

    requestSuperAdminAuth(
      `Switch Default Gateway to ${target?.name}`,
      `All incoming student lesson payments and top-ups will immediately route through ${target?.name}.`,
      () => {
        const updated = gateways.map(g => ({
          ...g,
          isDefault: g.id === pendingDefaultId,
          isActive: g.id === pendingDefaultId ? true : g.isActive,
        }));
        saveGateways(updated);
        logAdminActivity(
          'Payment Gateway Default Changed',
          'Gateway Configuration',
          `Changed default payment gateway from ${currentDef?.name || 'Previous'} to ${target?.name} (Production Active)`
        );
        showToast(`✓ "${target?.name}" has been set as the default payment gateway.`);
        setPendingDefaultId(null);
      }
    );
  };

  const handleToggleActive = (id: string) => {
    const target = gateways.find(g => g.id === id);
    if (target?.isDefault) {
      showToast('Cannot disable the default gateway. Set another gateway as default first.');
      return;
    }
    const updated = gateways.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g);
    saveGateways(updated);
    logAdminActivity(
      'Gateway Status Toggled',
      'Gateway Configuration',
      `Toggled status of ${target?.name} to ${!target?.isActive ? 'Active' : 'Inactive'}`
    );
    showToast(`${target?.name} is now ${!target?.isActive ? 'active' : 'inactive'}.`);
  };

  const handleAddGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGw.name.trim()) return;

    setShowAddModal(false);
    requestSuperAdminAuth(
      `Register New Gateway: ${newGw.name}`,
      `Connecting ${newGw.provider} payment gateway with provided API credentials.`,
      () => {
        const colors = [
          { color: 'text-purple-600', bg: 'bg-purple-100' },
          { color: 'text-cyan-600', bg: 'bg-cyan-100' },
          { color: 'text-rose-600', bg: 'bg-rose-100' },
        ];
        const picked = colors[gateways.length % colors.length];

        const created: Gateway = {
          id: `gw-${Date.now()}`,
          name: newGw.name,
          slug: newGw.name.toLowerCase().replace(/\s+/g, '-'),
          provider: newGw.provider,
          isActive: true,
          isDefault: gateways.length === 0,
          publicKey: newGw.publicKey,
          secretKey: newGw.secretKey,
          webhookUrl: newGw.webhookUrl,
          description: newGw.description || `${newGw.provider} payment gateway integration`,
          letter: newGw.name[0].toUpperCase(),
          color: picked.color,
          bg: picked.bg,
        };

        const updated = [...gateways, created];
        saveGateways(updated);
        logAdminActivity(
          'Payment Gateway Added',
          'Gateway Configuration',
          `Registered new ${created.provider} gateway: ${created.name} (${created.publicKey.includes('test') ? 'Sandbox' : 'Live'})`
        );
        setNewGw({
          name: '',
          provider: 'Paystack',
          publicKey: '',
          secretKey: '',
          webhookUrl: 'https://api.akademi.com/webhooks/payments',
          description: '',
        });
        showToast(`✓ Gateway "${created.name}" added successfully.`);
      }
    );
  };

  const handleSaveEditedKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGateway) return;

    const targetGw = editingGateway;
    setEditingGateway(null);

    requestSuperAdminAuth(
      `Update API Keys for ${targetGw.name}`,
      `Modifying sensitive public and secret API credentials for ${targetGw.provider}.`,
      () => {
        const updated = gateways.map(g => g.id === targetGw.id ? targetGw : g);
        saveGateways(updated);
        logAdminActivity(
          'API Credentials Updated',
          'Gateway Configuration',
          `Updated secret API keys and webhook configuration for ${targetGw.name}`
        );
        showToast(`✓ API keys for "${targetGw.name}" updated successfully.`);
      }
    );
  };

  const handleSaveCommission = () => {
    localStorage.setItem('akademi_commission_rate', String(commissionRate));
    showToast(`Platform commission updated to ${commissionRate}%.`);
  };

  // Tutor Minimum Payout Balance & Platform Payout Schedule Settings
  const [platformPayoutSchedule, setPlatformPayoutSchedule] = useState(() => {
    return localStorage.getItem('akademi_platform_payout_schedule') || 'Weekly (Every Friday at 4:00 PM)';
  });
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(() => {
    return Number(localStorage.getItem('akademi_min_payout_threshold') || 5000);
  });

  const handleSaveMinPayout = () => {
    localStorage.setItem('akademi_min_payout_threshold', String(minPayoutThreshold));
    localStorage.setItem('akademi_platform_payout_schedule', platformPayoutSchedule);
    window.dispatchEvent(new Event('storage'));
    showToast(`✓ Payout policy updated: ${platformPayoutSchedule} (Min ₦${minPayoutThreshold.toLocaleString()})`);
  };

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Student', 'Tutor', 'Amount (NGN)', 'Platform Fee (NGN)', 'Gateway', 'Status', 'Date'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.student,
      t.tutor,
      t.amt,
      t.comm,
      t.gw,
      t.status,
      `"${t.date}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akademi_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Transaction report exported to CSV.');
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.student.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.tutor.toLowerCase().includes(txSearch.toLowerCase());
    const matchesGw = txFilterGw === 'All' || t.gw === txFilterGw;
    const matchesStatus = txFilterStatus === 'All' || t.status === txFilterStatus;
    return matchesSearch && matchesGw && matchesStatus;
  });

  const exportAuditCSV = () => {
    const headers = ['Log ID', 'Admin Name', 'Email', 'Role', 'Action', 'Category', 'Details', 'IP Address', 'Status', 'Timestamp'];
    const rows = filteredAuditLogs.map(l => [
      l.id,
      `"${l.adminName}"`,
      `"${l.adminEmail}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.details}"`,
      `"${l.ipAddress}"`,
      l.status,
      `"${l.timestamp}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `akademi_admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Admin Audit Logs exported to CSV.');
  };

  const filteredAuditLogs = auditLogs.filter(l => {
    const matchesSearch =
      l.id.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.adminName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.details.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesCat = auditCategoryFilter === 'All' || l.category === auditCategoryFilter;
    const matchesRole = auditRoleFilter === 'All' || l.role === auditRoleFilter;
    return matchesSearch && matchesCat && matchesRole;
  });

  const maskKey = (key: string) => {
    if (!key) return 'Not configured';
    if (key.length <= 8) return '********';
    return `${key.slice(0, 7)}********${key.slice(-3)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
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

      {/* Role Restriction Banner for Non-Super Admins */}
      {!isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <p className="text-xs font-bold">Super Admin Privileged Gateway Management</p>
              <p className="text-[11px] text-amber-800">
                You are currently signed in as an Administrator (Tutor & Student operations). Modifying live API keys, Webhooks, and default gateway configurations requires Super Admin privileges.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full mb-1 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Super Admin & Payment Gateway Console</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment & Gateway Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure default payment gateways ({defaultGatewayName} is active default), add alternative providers, and manage commission fees.</p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" /> Add Payment Gateway
          </button>
        )}
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Platform Revenue', value: '₦4,820,500', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Commission Earned', value: `₦${(4820500 * (commissionRate / 100)).toLocaleString()}`, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Completed Payouts', value: '₦4,678,200', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
          { label: 'Pending Payouts', value: '₦142,300', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-lg", stat.bg, stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Management Main Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveMainTab('gateways')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
            activeMainTab === 'gateways'
              ? "bg-[#0F5338] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          )}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Gateways & Policy</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs ml-1",
            activeMainTab === 'gateways'
              ? "bg-white/20 text-white border border-white/30"
              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
          )}>
            <CreditCard className="w-2.5 h-2.5" /> {defaultGatewayName} Default Active
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('disputes')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative",
            activeMainTab === 'disputes'
              ? "bg-[#0F5338] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Payment Disputes & Claims Hub</span>
          {openDisputeCount > 0 && (
            <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[9px] font-black animate-pulse">
              {openDisputeCount} Open
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('transactions')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
            activeMainTab === 'transactions'
              ? "bg-[#0F5338] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          )}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Live Transactions Ledger</span>
        </button>

        <button
          onClick={() => setActiveMainTab('audit_logs')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
            activeMainTab === 'audit_logs'
              ? "bg-[#0F5338] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          )}
        >
          <History className="w-3.5 h-3.5" />
          <span>Admin Activity & Audit Logs</span>
          <span className={cn(
            "px-1.5 py-0.2 rounded-full text-[9px] font-black",
            activeMainTab === 'audit_logs' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
          )}>
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: GATEWAYS & POLICIES */}
      {activeMainTab === 'gateways' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Gateways Grid */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Configured Gateways</h2>
                  <p className="text-sm text-slate-500">{defaultGatewayName} is pre-selected as the platform default gateway. You can add, test, or switch defaults anytime.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gateways.map((gw) => (
                  <div 
                    key={gw.id} 
                    className={cn(
                      "bg-white rounded-xl p-5 shadow-sm relative overflow-hidden transition-all flex flex-col justify-between border-2",
                      gw.isDefault ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200"
                    )}
                  >
                    {gw.isDefault && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg flex items-center gap-1 shadow-sm">
                        <Check className="h-3 w-3" /> Default Gateway
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xl", gw.bg, gw.color)}>
                          {gw.letter}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{gw.name}</h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={cn("h-2 w-2 rounded-full", gw.isActive ? "bg-emerald-500" : "bg-slate-300")}></span>
                            <span className={cn("text-xs font-medium", gw.isActive ? "text-emerald-700" : "text-slate-500")}>
                              {gw.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 min-h-[40px]">{gw.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Public Key</span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 truncate max-w-[180px]">
                            {maskKey(gw.publicKey)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">Secret Key</span>
                          <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 truncate max-w-[180px]">
                            {maskKey(gw.secretKey)}
                          </span>
                        </div>
                      </div>

                      {/* Auto-Configuration Summary Badge */}
                      <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" /> Auto-Configured:
                          </span>
                          <span className={cn(
                            "px-1.5 py-0.2 rounded font-black text-[9px] uppercase",
                            gw.publicKey.includes('test') ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          )}>
                            {gw.publicKey.includes('test') ? 'Sandbox Mode' : 'Live Production'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[10px]">
                          Channels: Cards (Verve/Visa/MC), Bank Transfer, USSD, Apple Pay
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 mt-auto">
                      <button 
                        onClick={() => setEditingGateway(gw)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Settings2 className="h-3 w-3" /> Keys
                      </button>

                      <button
                        onClick={() => handleProbeGateway(gw)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" /> Probe
                      </button>

                      {!gw.isDefault ? (
                        <>
                          <button 
                            onClick={() => handleToggleActive(gw.id)}
                            className={cn(
                              "px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors",
                              gw.isActive 
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            )}
                          >
                            {gw.isActive ? 'Disable' : 'Enable'}
                          </button>

                          <button 
                            onClick={() => {
                              setPendingDefaultId(gw.id);
                              setShowDefaultModal(true);
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 text-xs font-semibold rounded-lg transition-colors text-center"
                          >
                            Set Default
                          </button>
                        </>
                      ) : (
                        <span className="flex-1 text-center py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg flex items-center justify-center">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Gateway Card */}
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-5 flex flex-col items-center justify-center min-h-[240px] transition-all group text-slate-500 hover:text-emerald-600 hover:border-emerald-400 shadow-sm"
                >
                  <div className="h-12 w-12 rounded-full bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center mb-3 shadow-sm group-hover:shadow text-slate-400 group-hover:text-emerald-500 transition-all">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Add Another Gateway</h3>
                  <p className="text-xs text-center text-slate-500 px-4">Connect Flutterwave, Stripe, Interswitch, Remita or custom provider</p>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar: Commission Settings & Payout Policy */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Platform Commission</h3>
              <p className="text-xs text-slate-500 mb-5">Percentage automatically deducted from each session payment as platform operational fee.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Commission Rate (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="1"
                      max="50"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 font-bold">
                      %
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Live Fee Simulator:</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Sample Session Price:</span>
                    <span className="font-medium text-slate-900">₦5,000</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Platform Fee ({commissionRate}%):</span>
                    <span className="font-semibold text-emerald-600">-₦{(5000 * (commissionRate / 100)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold border-t border-slate-200 pt-2">
                    <span className="text-slate-900">Tutor Net Earning:</span>
                    <span className="text-slate-900">₦{(5000 * (1 - commissionRate / 100)).toLocaleString()}</span>
                  </div>
                </div>
                
                {isSuperAdmin ? (
                  <button 
                    onClick={handleSaveCommission}
                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                  >
                    Save Commission Rate
                  </button>
                ) : (
                  <div className="p-2.5 bg-slate-100 rounded-lg text-center text-xs font-semibold text-slate-500 border border-slate-200">
                    👑 Super Admin Access Required to Modify Commission
                  </div>
                )}
              </div>
            </div>

            {/* Tutor Payout & Minimum Balance Threshold Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Platform Payout & Disbursement Policy</h3>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Centrally configure automated withdrawal schedules and minimum thresholds for all platform tutors.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Automated Payout Frequency
                  </label>
                  <select
                    disabled={!isSuperAdmin}
                    value={platformPayoutSchedule}
                    onChange={(e) => setPlatformPayoutSchedule(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50"
                  >
                    <option value="Weekly (Every Friday at 4:00 PM)">Weekly (Every Friday at 4:00 PM)</option>
                    <option value="Bi-Weekly (1st & 15th of the month)">Bi-Weekly (1st & 15th of the month)</option>
                    <option value="Monthly (Last working day of the month)">Monthly (Last working day of the month)</option>
                    <option value="Instant (Within 2 hrs of lesson completion)">Instant (Within 2 hrs of lesson completion)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Schedule when Paystack transfers are automatically executed to tutor bank accounts.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum Account Balance (₦ NGN)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 font-bold">
                      ₦
                    </div>
                    <input 
                      type="number" 
                      min="1000"
                      step="500"
                      disabled={!isSuperAdmin}
                      value={minPayoutThreshold}
                      onChange={(e) => setMinPayoutThreshold(Number(e.target.value))}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-xs disabled:bg-slate-50"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tutors cannot request a withdrawal for an amount below this threshold.
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Active Platform Policy:
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    {platformPayoutSchedule} · Minimum <strong>₦{minPayoutThreshold.toLocaleString()}</strong>.
                  </p>
                </div>

                {isSuperAdmin ? (
                  <button 
                    onClick={handleSaveMinPayout}
                    className="w-full h-10 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-lg font-bold text-xs transition-colors shadow-sm active:scale-98"
                  >
                    Save Platform Payout Policy
                  </button>
                ) : (
                  <div className="p-2.5 bg-slate-100 rounded-lg text-center text-xs font-semibold text-slate-500 border border-slate-200">
                    👑 Super Admin Access Required to Modify Payout Policy
                  </div>
                )}
              </div>
            </div>

            {/* Payment Security & 2FA Guard Card (Super Admin) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Payment Security & 2FA Guard</h3>
                </div>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                  requirePayment2FA ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-600"
                )}>
                  {requirePayment2FA ? 'Enforced' : 'Optional'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Require 2-Factor Authentication (OTP verification) before students or tutors can process wallet top-ups and bookings.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Mandatory Payment 2FA</p>
                    <p className="text-[11px] text-slate-500">6-digit verification code required at checkout</p>
                  </div>
                  <button
                    type="button"
                    disabled={!isSuperAdmin}
                    onClick={handleTogglePayment2FA}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5",
                      requirePayment2FA ? "bg-emerald-600" : "bg-slate-300",
                      !isSuperAdmin && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                      requirePayment2FA ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    When enabled, students must enter a 6-digit OTP code before any financial charge is dispatched to Paystack or deducted from wallet.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT DISPUTES & CLAIMS HUB (ADMIN & SUPER ADMIN) */}
      {activeMainTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Payment Disputes & Claims Resolution</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    {openDisputeCount} Active Claims
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect reported billing complaints, tutor payout queries, and student refund requests.
                </p>
              </div>

              {/* Dispute Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                {(['All', 'Open', 'Under Review', 'Resolved'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDisputeFilter(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-all",
                      disputeFilter === tab ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Disputes Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs">
                  <tr>
                    <th className="px-4 py-3">Dispute Ref</th>
                    <th className="px-4 py-3">Complainant</th>
                    <th className="px-4 py-3">Claim Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes
                    .filter(d => {
                      if (disputeFilter === 'All') return true;
                      if (disputeFilter === 'Resolved') return d.status === 'Refunded' || d.status === 'Released' || d.status === 'Rejected';
                      return d.status === disputeFilter;
                    })
                    .map((dispute) => (
                      <tr key={dispute.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-700">
                          {dispute.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-black uppercase",
                              dispute.complainantRole === 'Student' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-800"
                            )}>
                              {dispute.complainantRole}
                            </span>
                            <span className="font-bold text-slate-900">{dispute.complainantName}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">vs {dispute.counterpartName}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-slate-800 text-xs">{dispute.claimType}</span>
                          {dispute.sessionId && (
                            <p className="text-[10px] text-slate-400">{dispute.sessionId}</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          ₦{dispute.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold",
                            dispute.status === 'Open' ? "bg-red-100 text-red-800 border border-red-200 animate-pulse" :
                            dispute.status === 'Under Review' ? "bg-amber-100 text-amber-800 border border-amber-200" :
                            dispute.status === 'Refunded' ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                            dispute.status === 'Released' ? "bg-blue-100 text-blue-800 border border-blue-200" :
                            "bg-slate-100 text-slate-700"
                          )}>
                            {dispute.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {dispute.date}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="px-3 py-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                          >
                            Inspect Claim
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE TRANSACTION HISTORY LEDGER */}
      {activeMainTab === 'transactions' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Transaction History</h2>
              <p className="text-sm text-slate-500">Live feed of student lesson payments, payouts, and gateway charges.</p>
            </div>
            <button 
              onClick={exportCSV}
              className="flex items-center text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Download className="h-4 w-4 mr-2 text-slate-500" /> Export CSV
            </button>
          </div>

          {/* Filter bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search student, tutor or Ref..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select 
                value={txFilterGw}
                onChange={(e) => setTxFilterGw(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Gateways</option>
                {gateways.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>

            <div>
              <select 
                value={txFilterStatus}
                onChange={(e) => setTxFilterStatus(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Ref ID</th>
                    <th className="px-5 py-3">Participants</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Gateway</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                        No transactions match your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{tx.id}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-900">{tx.student}</div>
                          <div className="text-xs text-slate-500">to {tx.tutor}</div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-900">₦{tx.amt.toLocaleString()}</div>
                          <div className="text-[10px] text-emerald-600 font-medium">+₦{tx.comm.toLocaleString()} fee</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {tx.gw}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            tx.status === 'Success' ? "bg-emerald-100 text-emerald-700" : 
                            tx.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                            tx.status === 'Refunded' ? "bg-purple-100 text-purple-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{tx.date}</td>
                        <td className="px-5 py-3 text-right">
                          {tx.status === 'Refunded' || tx.status === 'Partially Refunded' ? (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              Refunded
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedRefundTx(tx)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95"
                            >
                              <RotateCcw className="w-3 h-3 text-amber-700" />
                              <span>Initiate Refund</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: ADMIN ACTIVITY & AUDIT TRAILS HUB */}
      {activeMainTab === 'audit_logs' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Admin Activity & Audit Trails Ledger</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {auditLogs.length} Verified Entries
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Track, inspect, and verify all administrative operations, payment gateway modifications, refund disbursements, and security policy changes.
              </p>
            </div>
            <button 
              onClick={exportAuditCSV}
              className="flex items-center text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Download className="h-4 w-4 mr-2 text-slate-500" /> Export Audit Log (CSV)
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search operator, action or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select 
                value={auditCategoryFilter}
                onChange={(e) => setAuditCategoryFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Audit Categories</option>
                <option value="Gateway Configuration">Gateway Configuration</option>
                <option value="Dispute Resolution">Dispute Resolution</option>
                <option value="Security & 2FA">Security & 2FA</option>
                <option value="Refund Desk">Refund Desk</option>
                <option value="Commission & Payout">Commission & Payout</option>
              </select>
            </div>

            <div>
              <select 
                value={auditRoleFilter}
                onChange={(e) => setAuditRoleFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Admin Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Finance Admin">Finance Admin</option>
                <option value="Support Admin">Support Admin</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Log ID</th>
                    <th className="px-5 py-3">Admin Operator</th>
                    <th className="px-5 py-3">Action & Category</th>
                    <th className="px-5 py-3">Audit Details</th>
                    <th className="px-5 py-3">IP & Location</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                        No audit logs match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-slate-600">
                          {log.id}
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {log.adminName}
                          </div>
                          <div className="text-[11px] text-slate-400">{log.adminEmail}</div>
                          <span className={cn(
                            "inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black uppercase",
                            log.role === 'Super Admin' ? "bg-amber-100 text-amber-900 border border-amber-300" :
                            log.role === 'Finance Admin' ? "bg-blue-100 text-blue-900 border border-blue-300" :
                            "bg-slate-100 text-slate-700 border border-slate-200"
                          )}>
                            {log.role}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-bold text-slate-900 block">{log.action}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200">
                            {log.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 max-w-xs text-slate-700 font-medium">
                          {log.details}
                        </td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">
                          <div className="flex items-center gap-1">
                            <Fingerprint className="w-3 h-3 text-slate-400" />
                            {log.ipAddress}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px]",
                            log.status === 'Authorized' ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                            log.status === 'Completed' ? "bg-blue-100 text-blue-800 border border-blue-300" :
                            "bg-amber-100 text-amber-800 border border-amber-300"
                          )}>
                            <CheckCircle2 className="w-3 h-3" /> {log.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
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
                <h3 className="text-lg font-bold text-slate-900">Add Payment Gateway</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddGateway} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Provider Type</label>
                  <select 
                    value={newGw.provider}
                    onChange={(e) => setNewGw({ ...newGw, provider: e.target.value, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Paystack">Paystack</option>
                    <option value="Flutterwave">Flutterwave</option>
                    <option value="Stripe">Stripe</option>
                    <option value="Interswitch">Interswitch WebPAY</option>
                    <option value="Remita">Remita</option>
                    <option value="Custom Webhook">Custom Gateway</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Display Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Primary Paystack / Backup Gateway" 
                    value={newGw.name}
                    onChange={(e) => setNewGw({ ...newGw, name: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Public / API Key</label>
                  <input 
                    type="text" 
                    placeholder="pk_live_..." 
                    value={newGw.publicKey}
                    onChange={(e) => setNewGw({ ...newGw, publicKey: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Secret Key</label>
                  <input 
                    type="password" 
                    placeholder="sk_live_..." 
                    value={newGw.secretKey}
                    onChange={(e) => setNewGw({ ...newGw, secretKey: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                  <input 
                    type="text" 
                    placeholder="Short description for admin reference" 
                    value={newGw.description}
                    onChange={(e) => setNewGw({ ...newGw, description: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
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
                    Save Gateway
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Keys Modal */}
        {editingGateway && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setEditingGateway(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Edit Keys: {editingGateway.name}</h3>
                <button onClick={() => setEditingGateway(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedKeys} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Public Key</label>
                  <input 
                    type="text" 
                    value={editingGateway.publicKey}
                    onChange={(e) => setEditingGateway({ ...editingGateway, publicKey: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Secret Key</label>
                  <input 
                    type="text" 
                    value={editingGateway.secretKey}
                    onChange={(e) => setEditingGateway({ ...editingGateway, secretKey: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Webhook URL</label>
                  <input 
                    type="text" 
                    value={editingGateway.webhookUrl}
                    onChange={(e) => setEditingGateway({ ...editingGateway, webhookUrl: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setEditingGateway(null)} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Update Keys
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Set Default Gateway Confirmation Modal */}
        {showDefaultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowDefaultModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-6 border border-slate-200"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4 text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Switch Default Gateway?</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                All future student checkout and booking charges will be routed through <strong>{gateways.find(g => g.id === pendingDefaultId)?.name}</strong>.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDefaultModal(false)} 
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSetDefaultConfirm} 
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Confirm Default
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Inspect Dispute Claim Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedDispute(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-xs">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      Dispute Investigation · {selectedDispute.id}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Logged on {selectedDispute.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Dispute Summary Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Complainant</p>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedDispute.complainantName}</p>
                    <span className={cn(
                      "inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black uppercase",
                      selectedDispute.complainantRole === 'Student' ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-800"
                    )}>
                      {selectedDispute.complainantRole}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Respondent / Counterpart</p>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedDispute.counterpartName}</p>
                    <p className="text-[11px] text-slate-500">Platform Transaction</p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Disputed Amount</p>
                    <p className="font-extrabold text-base text-[#0F5338] mt-0.5">
                      ₦{selectedDispute.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Claim Category</p>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedDispute.claimType}</p>
                    {selectedDispute.sessionId && (
                      <p className="text-[10px] text-slate-400">{selectedDispute.sessionId}</p>
                    )}
                  </div>
                </div>

                {/* Complaint Statement */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    📝 Complainant's Submitted Details:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{selectedDispute.description}"
                  </p>
                </div>

                {/* Investigation Guidance Card */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900">Admin Audit Protocol:</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-normal">
                      Approving a refund will automatically credit <strong>₦{selectedDispute.amount.toLocaleString()}</strong> back to the student's wallet and update transaction ledgers.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResolveDispute(selectedDispute.id, 'refund')}
                      className="w-full py-2.5 px-3 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Refund Student (₦{selectedDispute.amount.toLocaleString()})
                    </button>

                    <button
                      onClick={() => handleResolveDispute(selectedDispute.id, 'release')}
                      className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      Release to Tutor
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveDispute(selectedDispute.id, 'reject')}
                      className="flex-1 py-2 px-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-semibold transition-all"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => setSelectedDispute(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Payment Refund Modal from Live Ledger */}
      <InitiateRefundModal
        isOpen={Boolean(selectedRefundTx)}
        onClose={() => setSelectedRefundTx(null)}
        onConfirmRefund={handleExecuteDirectRefund}
        transaction={selectedRefundTx}
      />

      {/* Super Admin Password Authorization Modal */}
      <SuperAdminAuthModal
        isOpen={superAdminAuth.isOpen}
        onClose={() => setSuperAdminAuth(prev => ({ ...prev, isOpen: false }))}
        onConfirm={superAdminAuth.onConfirm}
        actionTitle={superAdminAuth.actionTitle}
        actionDescription={superAdminAuth.actionDescription}
      />
    </motion.div>
  );
}
