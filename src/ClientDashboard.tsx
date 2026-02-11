﻿﻿import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  Home,
  Folder,
  CheckSquare,
  MessageSquare,
  FileText,
  DollarSign,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Plus,
  Upload,
  Download,
  Calendar,
  TrendingUp,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjectsState } from './shared/projects';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { useI18n } from './shared/i18n';
import {
  getInvoiceStatusLabels,
  getProjectStatusLabels,
  matchInvoiceStatus,
  matchProjectStatus,
  normalizeInvoiceStatus,
  normalizeProjectStatus,
  type InvoiceStatus,
  type ProjectStatus
} from './shared/status';

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
      }) => { render: (selector: string) => void };
    };
  }
}

type IconType = React.ComponentType<{ size?: number; className?: string }>;

type MenuItemProps = {
  icon: IconType;
  label: string;
  tab: string;
  isActive: boolean;
  onClick: (tab: string) => void;
};

type SubscriptionRecord = {
  id: string;
  planId: string;
  status?: string;
  activeUntil?: string | null;
  orderId?: string;
};

type CurrencyCode = 'MDL' | 'USD' | 'EUR';

type Task = {
  id: string;
  title: string;
  project: string;
  status: string;
};

type Message = {
  id: string;
  from: string;
  role: string;
  time: string;
  text: string;
  unread: boolean;
};

type DocumentItem = {
  id: string;
  name: string;
  size: string;
  date: string;
};

type Invoice = {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  projectId?: string;
  projectName?: string;
};

type ClientProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
};

const CLIENT_PROFILE_KEY = 'portalpixel_client_profile';

const loadClientProfile = (): ClientProfile | null => {
  try {
    const raw = localStorage.getItem(CLIENT_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as ClientProfile;
  } catch {
    // Ignore storage errors.
  }
  return null;
};

const buildClientDisplayName = (profile: ClientProfile | null) => {
  if (!profile) return '';
  const full = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
  if (full) return full;
  return String(profile.email || profile.phone || '').trim();
};

const mapServerProject = (project: any) => ({
  id: project.id || `proj-${Date.now()}`,
  name: project.name || '',
  status: normalizeProjectStatus(project.status),
  deadline: project.deadline || '',
  description: project.description || '',
  progress: Number(project.progress) || 0,
  spent: Number(project.spent) || 0,
  budget: Number(project.budget) || 0,
  documents: Array.isArray(project.documents) ? project.documents : []
});

const DEFAULT_INVOICES: Invoice[] = [
  { id: 'inv-001', number: 'INV-001', date: '2026-02-01', amount: 2500, status: 'pending' },
  { id: 'inv-002', number: 'INV-002', date: '2026-01-15', amount: 1200, status: 'paid' }
];

const loadInvoices = (): Invoice[] => {
  try {
    const raw = localStorage.getItem('portalpixel_invoices');
    if (raw) {
      const parsed = JSON.parse(raw) as Invoice[];
      if (Array.isArray(parsed)) {
        return parsed.map(inv => ({ ...inv, status: normalizeInvoiceStatus(inv.status) }));
      }
    }
  } catch {
    // Ignore storage errors and fall back to defaults.
  }
  return DEFAULT_INVOICES;
};

const useInvoicesState = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadInvoices());

  useEffect(() => {
    try {
      localStorage.setItem('portalpixel_invoices', JSON.stringify(invoices));
    } catch {
      // Ignore storage errors.
    }
  }, [invoices]);

  return { invoices, setInvoices };
};

const MenuItem = ({ icon: Icon, label, tab, isActive, onClick }: MenuItemProps) => (
  <button
    onClick={() => onClick(tab)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const invoiceStatusLabels = getInvoiceStatusLabels();
  const projectStatusLabels = getProjectStatusLabels();
  const locale = lang === 'ro' ? 'ro-RO' : lang === 'en' ? 'en-US' : 'ru-RU';
  const [clientProfile] = useState(() => loadClientProfile());
  const fallbackUserName = t({
    ru: '\u0418\u0432\u0430\u043d \u041f\u0435\u0442\u0440\u043e\u0432',
    en: 'Ivan Petrov',
    ro: 'Ivan Petrov'
  });
  const displayName = buildClientDisplayName(clientProfile) || fallbackUserName;
  const userInitial = displayName ? displayName.trim().charAt(0).toUpperCase() : 'I';
  const userName = displayName;
  const clientEmail = String(clientProfile?.email || '').trim();
  const clientPhone = String(clientProfile?.phone || '').trim();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('MDL');
  const { invoices, setInvoices } = useInvoicesState();
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);
  const [paypalError, setPaypalError] = useState('');
  const [paypalRenderedFor, setPaypalRenderedFor] = useState<string | null>(null);
  const [paypalVisibleFor, setPaypalVisibleFor] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState('');
  const [bpayLoading, setBpayLoading] = useState(false);
  const [bpayError, setBpayError] = useState('');
  const isMountedRef = useRef(true);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState('');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [subscriptionsError, setSubscriptionsError] = useState('');
  const [subscriptionPayPal, setSubscriptionPayPal] = useState<{
    planId: string;
    orderId: string;
    amountMDL: number;
  } | null>(null);
  const [subscriptionPayPalRenderedFor, setSubscriptionPayPalRenderedFor] = useState<string | null>(null);
  const [subscriptionPayingPlan, setSubscriptionPayingPlan] = useState<string | null>(null);

  const loadPayPalScript = () =>
    new Promise<void>((resolve, reject) => {
      if (window.paypal) {
        resolve();
        return;
      }
      if (!paypalClientId || paypalClientId === 'your_paypal_client_id') {
        reject(new Error('PayPal Client ID not configured'));
        return;
      }
      const existing = document.getElementById('paypal-sdk');
      if (existing) {
        existing.remove();
      }
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR&components=buttons`;
      script.async = true;
      const timeoutId = setTimeout(() => {
        reject(new Error('PayPal SDK load timed out'));
      }, 8000);
      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('PayPal SDK load failed'));
      };
      document.body.appendChild(script);
    });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const initPayPalButtons = async () => {
      if (!paymentInvoiceId || paypalVisibleFor !== paymentInvoiceId || paypalRenderedFor === paymentInvoiceId) return;
      const invoice = invoices.find(item => item.id === paymentInvoiceId);
      if (!invoice || invoice.status === 'paid') return;
      try {
        if (!isMountedRef.current) return;
        setPaypalError('');
        await loadPayPalScript();
        if (!isMountedRef.current || !isActive) return;
        const containerId = `paypal-buttons-${invoice.id}`;
        timeoutId = setTimeout(() => {
          if (!isMountedRef.current || !isActive) return;
          window.paypal
            ?.Buttons({
              createOrder: async () => {
                const res = await fetch('/api/paypal/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amountMDL: invoice.amount, invoiceNumber: invoice.number })
                });
                const text = await res.text();
                const data = text ? JSON.parse(text) : null;
                if (!res.ok) throw new Error(data?.error || text || 'Create order failed');
                if (!data?.id) throw new Error('PayPal order id missing');
                return data.id;
              },
              onApprove: async data => {
                const res = await fetch('/api/paypal/capture-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: data.orderID, invoiceNumber: invoice.number })
                });
                const text = await res.text();
                if (!res.ok) throw new Error(text || 'Capture failed');
                if (isMountedRef.current) {
                  setInvoices(prev =>
                    prev.map(item => (item.id === invoice.id ? { ...item, status: 'paid' } : item))
                  );
                  setPaymentInvoiceId(null);
                }
              },
              onError: err => {
                if (isMountedRef.current) {
                  setPaypalError(String(err));
                }
              }
            })
            .render(`#${containerId}`);
          if (isMountedRef.current) {
            setPaypalRenderedFor(invoice.id);
          }
        }, 0);
      } catch (err) {
        if (isMountedRef.current) {
          setPaypalError(String(err));
        }
      }
    };

    initPayPalButtons();
    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [paymentInvoiceId, paypalVisibleFor, paypalRenderedFor, invoices, paypalClientId]);

  useEffect(() => {
    let isActive = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const initSubscriptionPayPal = async () => {
      if (!subscriptionPayPal || subscriptionPayPalRenderedFor === subscriptionPayPal.planId) return;
      try {
        if (!isMountedRef.current) return;
        setSubscriptionsError('');
        await loadPayPalScript();
        if (!isMountedRef.current || !isActive) return;
        const containerId = `paypal-subscription-${subscriptionPayPal.planId}`;
        timeoutId = setTimeout(() => {
          if (!isMountedRef.current || !isActive) return;
          window.paypal
            ?.Buttons({
              createOrder: async () => {
                const res = await fetch('/api/paypal/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    amountMDL: subscriptionPayPal.amountMDL,
                    invoiceNumber: subscriptionPayPal.orderId
                  })
                });
                const text = await res.text();
                const data = text ? JSON.parse(text) : null;
                if (!res.ok) throw new Error(data?.error || text || 'Create order failed');
                if (!data?.id) throw new Error('PayPal order id missing');
                return data.id;
              },
              onApprove: async data => {
                const res = await fetch('/api/paypal/capture-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderId: data.orderID, invoiceNumber: subscriptionPayPal.orderId })
                });
                const text = await res.text();
                const payload = text ? JSON.parse(text) : null;
                if (!res.ok) throw new Error(payload?.error || text || 'Capture failed');
                if (isMountedRef.current) {
                  setSubscriptionPayPal(null);
                  setSubscriptionPayPalRenderedFor(null);
                  loadSubscriptions();
                }
              },
              onError: err => {
                if (isMountedRef.current) {
                  setSubscriptionsError(String(err));
                }
              }
            })
            .render(`#${containerId}`);
          if (isMountedRef.current) {
            setSubscriptionPayPalRenderedFor(subscriptionPayPal.planId);
          }
        }, 0);
      } catch (err) {
        if (isMountedRef.current) {
          setSubscriptionsError(String((err as Error)?.message || err));
        }
      }
    };

    initSubscriptionPayPal();
    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [subscriptionPayPal, subscriptionPayPalRenderedFor, paypalClientId]);

  useEffect(() => {
    loadSubscriptions();
  }, [clientEmail, clientPhone]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setPaymentNotice(
        t({
          ru: 'Оплата прошла успешно',
          en: 'Payment completed successfully',
          ro: 'Plata a fost efectuata cu succes'
        })
      );
    } else if (paymentStatus === 'fail') {
      setPaymentNotice(
        t({
          ru: 'Оплата не прошла. Попробуйте еще раз',
          en: 'Payment failed. Please try again',
          ro: 'Plata a esuat. Incercati din nou'
        })
      );
    }
    if (paymentStatus) {
      params.delete('payment');
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', nextUrl);
    }
  }, [t]);

  useEffect(() => {
    let isActive = true;
    const loadRates = async () => {
      setRatesLoading(true);
      setRatesError('');
      try {
        const res = await fetch('/api/rates/mdl');
        const text = await res.text();
        let data: any;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        if (!res.ok) {
          if (isActive) setRatesError(String(data?.error || text || 'Rates request failed'));
          return;
        }
        if (!data?.rates) {
          if (isActive) setRatesError('Rates not available');
          return;
        }
        if (isActive) setRates(data.rates);
      } catch (err) {
        if (isActive) setRatesError(String((err as Error)?.message || err));
      } finally {
        if (isActive) setRatesLoading(false);
      }
    };
    loadRates();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setTasks([]);
    setMessages([]);
    setDocuments([]);
  }, []);

  const handleBpayPayment = async (invoice: Invoice) => {
    setBpayLoading(true);
    setBpayError('');
    try {
      const res = await fetch('/api/bpay/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountMDL: invoice.amount,
          orderId: invoice.number,
          description: `Invoice ${invoice.number}`
        })
      });
      const text = await res.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        setBpayError(String(data?.error || text || 'BPay request failed'));
        return;
      }
      if (!data?.url) {
        setBpayError('BPay URL missing');
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setBpayError(String((err as Error)?.message || err));
    } finally {
      setBpayLoading(false);
    }
  };

  const currencies: Record<CurrencyCode, { symbol: string; rate: number }> = {
    MDL: { symbol: 'L', rate: 1 },
    USD: { symbol: '$', rate: 0.055 },
    EUR: { symbol: '\u20ac', rate: 0.050 }
  };

  const formatCurrency = (amount: number) => {
    const converted = amount * currencies[currency].rate;
    return `${converted.toLocaleString(locale, { maximumFractionDigits: 0 })} ${currencies[currency].symbol}`;
  };

  const formatRate = (value: number) =>
    value.toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

  const { projects, setProjects } = useProjectsState();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'in_progress' as ProjectStatus,
    deadline: '',
    budget: 0,
    files: [] as File[],
    contactEmail: clientEmail,
    contactPhone: clientPhone
  });
  const [projectNotice, setProjectNotice] = useState('');
  const [projectsNotice, setProjectsNotice] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectActionNotice, setProjectActionNotice] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState({
    name: '',
    description: '',
    deadline: '',
    budget: 0,
    status: 'planning' as ProjectStatus
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const activeProjectsCount = projects.filter(project => {
    const status = normalizeProjectStatus(project.status);
    return status === 'planning' || status === 'in_progress' || status === 'testing';
  }).length;
  const tasksInProgressCount = projects.filter(project => {
    const status = normalizeProjectStatus(project.status);
    return status === 'in_progress' || status === 'testing';
  }).length;
  const messagesCount = messages.filter(msg => msg.unread).length || messages.length;
  const dueAmount = invoices
    .filter(inv => normalizeInvoiceStatus(inv.status) === 'pending')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  const getStatusColor = (status: string) => {
    const invoiceStatus = matchInvoiceStatus(status);
    const projectStatus = matchProjectStatus(status);
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-red-100 text-red-800',
      planning: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      testing: 'bg-yellow-100 text-yellow-800',
      done: 'bg-green-100 text-green-800'
    };
    const key = invoiceStatus || projectStatus || status;
    return colors[key] || 'bg-gray-100 text-gray-800';
  };

  const handleMenuSelect = (tab: string) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const subscriptionPlans = [
    {
      id: 'basic',
      badge: t({ ru: 'Для стартапов', en: 'For startups', ro: 'Pentru startup' }),
      title: 'Basic',
      hours: t({ ru: 'До 5 часов', en: 'Up to 5 hours', ro: 'Pina la 5 ore' }),
      price: t({ ru: '1,500 MDL/мес', en: '1,500 MDL/mo', ro: '1,500 MDL/luna' }),
      priceUsd: t({ ru: '($82/мес)', en: '($82/mo)', ro: '($82/luna)' }),
      features: [
        t({ ru: 'Поддержка сайта', en: 'Website support', ro: 'Suport site' }),
        t({ ru: 'Исправление ошибок', en: 'Bug fixes', ro: 'Corectare erori' }),
        t({ ru: 'Мелкие правки', en: 'Small edits', ro: 'Modificari mici' }),
        t({ ru: 'Email поддержка', en: 'Email support', ro: 'Suport email' })
      ]
    },
    {
      id: 'pro',
      badge: t({ ru: 'Популярный', en: 'Popular', ro: 'Popular' }),
      title: 'Pro',
      hours: t({ ru: 'До 15 часов', en: 'Up to 15 hours', ro: 'Pina la 15 ore' }),
      price: t({ ru: '4,000 MDL/мес', en: '4,000 MDL/mo', ro: '4,000 MDL/luna' }),
      priceUsd: t({ ru: '($220/мес)', en: '($220/mo)', ro: '($220/luna)' }),
      features: [
        t({ ru: 'Все из Basic', en: 'Everything in Basic', ro: 'Tot din Basic' }),
        t({ ru: 'Развитие функционала', en: 'Feature development', ro: 'Dezvoltare functionalitati' }),
        t({ ru: 'Новые фичи', en: 'New features', ro: 'Functionalitati noi' }),
        t({ ru: 'Приоритетная поддержка', en: 'Priority support', ro: 'Suport prioritar' })
      ]
    },
    {
      id: 'enterprise',
      badge: t({ ru: 'Для крупного бизнеса', en: 'For enterprise', ro: 'Pentru business mare' }),
      title: 'Enterprise',
      hours: t({ ru: 'Безлимит', en: 'Unlimited', ro: 'Nelimitat' }),
      price: t({ ru: '8,000 MDL/мес', en: '8,000 MDL/mo', ro: '8,000 MDL/luna' }),
      priceUsd: t({ ru: '($440/мес)', en: '($440/mo)', ro: '($440/luna)' }),
      features: [
        t({ ru: 'Все из Pro', en: 'Everything in Pro', ro: 'Tot din Pro' }),
        t({ ru: 'Выделенный разработчик', en: 'Dedicated developer', ro: 'Dezvoltator dedicat' }),
        t({ ru: 'Консультации по развитию', en: 'Growth consulting', ro: 'Consultanta dezvoltare' }),
        t({ ru: 'Поддержка 24/7', en: '24/7 support', ro: 'Suport 24/7' })
      ]
    }
  ];

  const formatSubscriptionDate = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getActiveSubscription = (planId: string) => {
    const matches = subscriptions.filter(sub => sub.planId === planId && sub.activeUntil);
    if (!matches.length) return null;
    return matches.sort((a, b) => String(b.activeUntil).localeCompare(String(a.activeUntil)))[0];
  };

  const loadSubscriptions = async () => {
    if (!clientEmail && !clientPhone) return;
    setSubscriptionsLoading(true);
    setSubscriptionsError('');
    try {
      const params = new URLSearchParams();
      if (clientEmail) params.set('email', clientEmail);
      if (clientPhone) params.set('phone', clientPhone);
      const res = await fetch(`/api/subscriptions?${params.toString()}`);
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      if (!res.ok) {
        setSubscriptionsError(String(data?.error || text || 'Subscriptions request failed'));
        return;
      }
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSubscriptionsError(errorMessage);
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  const startSubscriptionPayment = async (planId: string, provider: 'bpay' | 'paypal') => {
    if (!clientEmail && !clientPhone) {
      setSubscriptionsError(
        t({
          ru: 'Укажите email или телефон в профиле',
          en: 'Add email or phone in profile',
          ro: 'Adauga email sau telefon in profil'
        })
      );
      return;
    }
    setSubscriptionsError('');
    setSubscriptionPayingPlan(planId);
    try {
      const res = await fetch('/api/subscriptions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          provider,
          email: clientEmail || undefined,
          phone: clientPhone || undefined
        })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        setSubscriptionsError(data?.error || text || 'Subscription request failed');
        return;
      }
      if (provider === 'bpay') {
        if (!data?.url) {
          setSubscriptionsError('BPay URL missing');
          return;
        }
        window.location.href = data.url;
        return;
      }
      if (!data?.orderId || !data?.amountMDL) {
        setSubscriptionsError('PayPal order data missing');
        return;
      }
      setSubscriptionPayPal({
        planId,
        orderId: data.orderId,
        amountMDL: Number(data.amountMDL)
      });
      setSubscriptionPayPalRenderedFor(null);
    } catch (err) {
      setSubscriptionsError(String((err as Error)?.message || err));
    } finally {
      setSubscriptionPayingPlan(null);
    }
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (!clientEmail && !clientPhone) return;
    setProjectsLoading(true);
    setProjectsNotice('');
    const params = new URLSearchParams();
    if (clientEmail) params.set('email', clientEmail);
    if (clientPhone) params.set('phone', clientPhone);
    fetch(`/api/client/projects?${params.toString()}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load projects');
        if (Array.isArray(data)) {
          setProjects(data.map(mapServerProject));
        }
      })
      .catch(err => {
        setProjectsNotice(String((err as Error)?.message || err));
      })
      .finally(() => setProjectsLoading(false));
  }, [clientEmail, clientPhone, setProjects]);

  useEffect(() => {
    if (!clientEmail && !clientPhone) return;
    setNewProject(prev => ({
      ...prev,
      contactEmail: prev.contactEmail || clientEmail,
      contactPhone: prev.contactPhone || clientPhone
    }));
  }, [clientEmail, clientPhone]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.deadline || !newProject.budget) return;
    const contactEmail = String(newProject.contactEmail || '').trim();
    const contactPhone = String(newProject.contactPhone || '').trim();
    if (!contactEmail && !contactPhone) {
      setProjectNotice(
        t({
          ru: '\u0423\u043a\u0430\u0436\u0438\u0442\u0435 email \u0438\u043b\u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d',
          en: 'Provide email or phone',
          ro: 'Introduceti email sau telefon'
        })
      );
      return;
    }
    let uploadNotice = '';
    let uploadedDocs: Array<{ id: string; name: string; size: string; date: string; url?: string }> = [];
    try {
      uploadedDocs = await Promise.all(
        newProject.files.map(async (file) => {
          const dataUrl = await readFileAsDataUrl(file);
          const res = await fetch('/api/client/uploads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: file.name, dataUrl })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || 'Upload failed');
          return data;
        })
      );
    } catch {
      uploadNotice = t({
        ru: 'Файлы не удалось загрузить, проект создан без документов',
        en: 'Files upload failed, project created without documents',
        ro: 'Fisierle nu s-au incarcat, proiectul a fost creat fara documente'
      });
    }
    const projectDocuments =
      uploadedDocs.length > 0
        ? uploadedDocs
        : newProject.files.map(file => ({
            id: `doc-${Date.now()}-${file.name}`,
            name: file.name,
            size: `${Math.max(1, Math.ceil(file.size / 1024))} KB`,
            date: new Date().toLocaleDateString(locale)
          }));
    setProjectNotice('');
    try {
      const res = await fetch('/api/client/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProject.name,
          status: newProject.status,
          deadline: newProject.deadline,
          budget: newProject.budget,
          description: newProject.description || '',
          documents: projectDocuments,
          clientName: userName,
          clientEmail: contactEmail,
          clientPhone: contactPhone
        })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setProjectNotice(
          t({
            ru: 'Не удалось отправить проект администратору',
            en: 'Failed to send project to admin',
            ro: 'Nu s-a putut trimite proiectul'
          })
        );
        return;
      }
      setProjects(prev => [mapServerProject({ ...data, documents: projectDocuments }), ...prev]);
      setProjectNotice(
        t({
          ru: 'Проект отправлен администратору',
          en: 'Project sent to admin',
          ro: 'Proiect trimis administratorului'
        })
      );
    } catch {
      setProjectNotice(
        t({
          ru: 'Не удалось отправить проект администратору',
          en: 'Failed to send project to admin',
          ro: 'Nu s-a putut trimite proiectul'
        })
      );
    }
    if (uploadNotice) {
      setProjectNotice(prev => (prev ? `${prev}. ${uploadNotice}` : uploadNotice));
    }
    setNewProject({
      name: '',
      description: '',
      status: 'in_progress',
      deadline: '',
      budget: 0,
      files: [],
      contactEmail,
      contactPhone
    });
    setShowProjectForm(false);
  };

  const startEditProject = (project: typeof projects[number]) => {
    setProjectActionNotice('');
    setEditingProjectId(project.id);
    setEditProject({
      name: project.name,
      description: project.description || '',
      deadline: project.deadline || '',
      budget: project.budget || 0,
      status: normalizeProjectStatus(project.status)
    });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setProjectActionNotice('');
  };

  const saveEditProject = async (projectId: string) => {
    if (!clientEmail && !clientPhone) {
      setProjectActionNotice(
        t({
          ru: '\u041d\u0435\u0442 email \u0438\u043b\u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 \u0434\u043b\u044f \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f',
          en: 'Missing email or phone to update',
          ro: 'Lipseste email sau telefon pentru actualizare'
        })
      );
      return;
    }
    try {
      const res = await fetch(`/api/client/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientEmail,
          phone: clientPhone,
          name: editProject.name,
          description: editProject.description,
          deadline: editProject.deadline,
          budget: editProject.budget,
          status: editProject.status
        })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setProjectActionNotice(String(data?.error || text || 'Update failed'));
        return;
      }
      setProjects(prev => prev.map(item => (item.id === projectId ? mapServerProject(data) : item)));
      setEditingProjectId(null);
      setProjectActionNotice(
        t({
          ru: '\u041f\u0440\u043e\u0435\u043a\u0442 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d',
          en: 'Project updated',
          ro: 'Proiect actualizat'
        })
      );
    } catch (err) {
      setProjectActionNotice(String((err as Error)?.message || err));
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!clientEmail && !clientPhone) {
      setProjectActionNotice(
        t({
          ru: '\u041d\u0435\u0442 email \u0438\u043b\u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f',
          en: 'Missing email or phone to delete',
          ro: 'Lipseste email sau telefon pentru stergere'
        })
      );
      return;
    }
    if (!window.confirm(t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442?', en: 'Delete project?', ro: 'Stergeti proiectul?' }))) {
      return;
    }
    try {
      const res = await fetch(`/api/client/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clientEmail, phone: clientPhone })
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) {
        setProjectActionNotice(String(data?.error || text || 'Delete failed'));
        return;
      }
      setProjects(prev => prev.filter(item => item.id !== projectId));
      setProjectActionNotice(
        t({
          ru: '\u041f\u0440\u043e\u0435\u043a\u0442 \u0443\u0434\u0430\u043b\u0435\u043d',
          en: 'Project deleted',
          ro: 'Proiect sters'
        })
      );
    } catch (err) {
      setProjectActionNotice(String((err as Error)?.message || err));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`${
          sidebarOpen ? 'lg:w-64' : 'lg:w-20'
        } w-64 flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 fixed inset-y-0 left-0 z-40 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto ease-out`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-semibold text-gray-800">PixelCraft</span>
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
          )}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg hidden lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <MenuItem icon={Home} label={t({ ru: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', en: 'Dashboard', ro: 'Principal' })} tab="dashboard" isActive={activeTab === 'dashboard'} onClick={handleMenuSelect} />
          <MenuItem icon={Folder} label={t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Projects', ro: 'Proiecte' })} tab="projects" isActive={activeTab === 'projects'} onClick={handleMenuSelect} />
          <MenuItem icon={CheckSquare} label={t({ ru: '\u0417\u0430\u0434\u0430\u0447\u0438', en: 'Tasks', ro: 'Sarcini' })} tab="tasks" isActive={activeTab === 'tasks'} onClick={handleMenuSelect} />
          <MenuItem icon={MessageSquare} label={t({ ru: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f', en: 'Messages', ro: 'Mesaje' })} tab="messages" isActive={activeTab === 'messages'} onClick={handleMenuSelect} />
          <MenuItem icon={FileText} label={t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b', en: 'Documents', ro: 'Documente' })} tab="documents" isActive={activeTab === 'documents'} onClick={handleMenuSelect} />
          <MenuItem icon={DollarSign} label={t({ ru: '\u0424\u0438\u043d\u0430\u043d\u0441\u044b', en: 'Finances', ro: 'Finante' })} tab="finances" isActive={activeTab === 'finances'} onClick={handleMenuSelect} />
          <MenuItem icon={CreditCard} label={t({ ru: '\u041f\u043e\u0434\u043f\u0438\u0441\u043a\u0438', en: 'Subscriptions', ro: 'Abonamente' })} tab="subscriptions" isActive={activeTab === 'subscriptions'} onClick={handleMenuSelect} />
          <MenuItem icon={Settings} label={t({ ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438', en: 'Settings', ro: 'Setari' })} tab="settings" isActive={activeTab === 'settings'} onClick={handleMenuSelect} />
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              navigate('/login/client');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">{t({ ru: '\u0412\u044b\u0439\u0442\u0438', en: 'Sign out', ro: 'Iesire' })}</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full max-w-xs sm:max-w-sm">
                <Search className="text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={t({ ru: '\u041f\u043e\u0438\u0441\u043a...', en: 'Search...', ro: 'Cautare...' })}
                  className="border-none outline-none text-gray-600 bg-transparent w-full hidden sm:block"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as CurrencyCode)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm sm:text-base"
              >
                <option value="MDL">{t({ ru: 'L MDL - \u041b\u0435\u0439', en: 'L MDL - Leu', ro: 'L MDL - Leu' })}</option>
                <option value="USD">{t({ ru: '$ USD - \u0414\u043e\u043b\u043b\u0430\u0440', en: '$ USD - Dollar', ro: '$ USD - Dolar' })}</option>
                <option value="EUR">{t({ ru: '\u20ac EUR - \u0415\u0432\u0440\u043e', en: '\u20ac EUR - Euro', ro: '\u20ac EUR - Euro' })}</option>
              </select>
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500">{t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442', en: 'Client', ro: 'Client' })}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">
                {t({ ru: '\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c, \u0418\u0432\u0430\u043d!', en: 'Welcome, Ivan!', ro: 'Bine ai venit, Ivan!' })}
              </h1>

              <div className="grid grid-cols-4 gap-6">
                {[
                  {
                    label: t({ ru: '\u0410\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Active projects', ro: 'Proiecte active' }),
                    value: String(activeProjectsCount),
                    icon: Folder,
                    bgColor: 'bg-blue-100',
                    iconColor: 'text-blue-600'
                  },
                  {
                    label: t({ ru: '\u0417\u0430\u0434\u0430\u0447\u0438 \u0432 \u0440\u0430\u0431\u043e\u0442\u0435', en: 'Tasks in progress', ro: 'Sarcini in lucru' }),
                    value: String(tasksInProgressCount),
                    icon: CheckSquare,
                    bgColor: 'bg-green-100',
                    iconColor: 'text-green-600'
                  },
                  {
                    label: t({ ru: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f', en: 'Messages', ro: 'Mesaje' }),
                    value: String(messagesCount),
                    icon: MessageSquare,
                    bgColor: 'bg-purple-100',
                    iconColor: 'text-purple-600'
                  },
                  {
                    label: t({ ru: '\u041a \u043e\u043f\u043b\u0430\u0442\u0435', en: 'Due', ro: 'De plata' }),
                    value: formatCurrency(dueAmount),
                    icon: DollarSign,
                    bgColor: 'bg-red-100',
                    iconColor: 'text-red-600'
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <stat.icon className={stat.iconColor} size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  {t({ ru: '\u0422\u0435\u043a\u0443\u0449\u0438\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Current projects', ro: 'Proiecte curente' })}
                </h2>
                {projects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Folder size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {t({ ru: '\u041f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432', en: 'No projects yet', ro: 'Inca nu exista proiecte' })}
                    </p>
                    <p className="text-sm mt-2">
                      {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043f\u0435\u0440\u0432\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0447\u0430\u0442\u044c', en: 'Create your first project to get started', ro: 'Creati primul proiect pentru a incepe' })}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map(p => (
                      <div key={p.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{p.name}</h3>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${getStatusColor(
                                normalizeProjectStatus(p.status)
                              )}`}
                            >
                              {t(projectStatusLabels[normalizeProjectStatus(p.status)])}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{t({ ru: '\u0421\u0440\u043e\u043a', en: 'Deadline', ro: 'Termen' })}</p>
                            <p className="font-medium">{p.deadline}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>{t({ ru: '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441', en: 'Progress', ro: 'Progres' })}: {p.progress}%</span>
                          <span>{formatCurrency(p.spent)} / {formatCurrency(p.budget)}</span>
                        </div>
                        {p.documents.length > 0 && (
                          <div className="mt-4 border-t pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b', en: 'Documents', ro: 'Documente' })}
                            </p>
                            <div className="space-y-2">
                              {p.documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FileText size={16} className="text-purple-600" />
                                    <span>{doc.name}</span>
                                  </div>
                                  <span>{doc.size}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                  {t({ ru: '\u041c\u043e\u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'My projects', ro: 'Proiectele mele' })}
                </h1>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  {t({ ru: '\u041d\u043e\u0432\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442', en: 'New project', ro: 'Proiect nou' })}
                </button>
              </div>
              {showProjectForm && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442', en: 'Create project', ro: 'Creeaza proiect' })}
                  </h2>
                  <form onSubmit={handleCreateProject} className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435', en: 'Name', ro: 'Nume' })}
                      </label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0421\u0440\u043e\u043a', en: 'Deadline', ro: 'Termen' })}
                      </label>
                      <input
                        type="date"
                        value={newProject.deadline}
                        onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0411\u044e\u0434\u0436\u0435\u0442', en: 'Budget', ro: 'Buget' })}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newProject.budget || ''}
                        onChange={e => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={newProject.contactEmail}
                        onChange={e => setNewProject({ ...newProject, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d', en: 'Phone', ro: 'Telefon' })}
                      </label>
                      <input
                        type="tel"
                        value={newProject.contactPhone}
                        onChange={e => setNewProject({ ...newProject, contactPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435', en: 'Description', ro: 'Descriere' })}
                      </label>
                      <textarea
                        value={newProject.description}
                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b', en: 'Documents', ro: 'Documente' })}
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <Upload size={18} />
                          <span className="text-sm">
                            {t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0444\u0430\u0439\u043b\u044b', en: 'Upload files', ro: 'Incarca fisiere' })}
                          </span>
                          <input
                            type="file"
                            multiple
                            onChange={e =>
                              setNewProject({
                                ...newProject,
                                files: e.target.files ? Array.from(e.target.files) : []
                              })
                            }
                            className="hidden"
                          />
                        </label>
                        {newProject.files.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {t({ ru: '\u0412\u044b\u0431\u0440\u0430\u043d\u043e \u0444\u0430\u0439\u043b\u043e\u0432', en: 'Files selected', ro: 'Fisiere selectate' })}: {newProject.files.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0421\u0442\u0430\u0442\u0443\u0441', en: 'Status', ro: 'Stare' })}
                      </label>
                      <select
                        value={newProject.status}
                        onChange={e => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="planning">{t(projectStatusLabels.planning)}</option>
                        <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                        <option value="testing">{t(projectStatusLabels.testing)}</option>
                        <option value="done">{t(projectStatusLabels.done)}</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowProjectForm(false)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700"
                      >
                        {t({ ru: '\u041e\u0442\u043c\u0435\u043d\u0430', en: 'Cancel', ro: 'Anuleaza' })}
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg"
                      >
                        {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c', en: 'Create', ro: 'Creeaza' })}
                      </button>
                    </div>
                  </form>
                  {projectNotice && (
                    <p className="mt-3 text-sm text-gray-600">{projectNotice}</p>
                  )}
                </div>
              )}
              {projectsLoading && (
                <p className="text-sm text-gray-500">
                  {t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432...', en: 'Loading projects...', ro: 'Se incarca proiectele...' })}
                </p>
              )}
              {projectsNotice && (
                <p className="text-sm text-red-600">
                  {projectsNotice}
                </p>
              )}
              {projectActionNotice && (
                <p className="text-sm text-gray-600">
                  {projectActionNotice}
                </p>
              )}
              {projects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Folder size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {t({ ru: '\u041d\u0435\u0442 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432', en: 'No projects', ro: 'Fara proiecte' })}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u043f\u0435\u0440\u0432\u044b\u0439 \u043f\u0440\u043e\u0435\u043a\u0442, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0447\u0430\u0442\u044c', en: 'Create your first project to get started', ro: 'Creati primul proiect pentru a incepe' })}
                  </p>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={20} />
                    {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442', en: 'Create project', ro: 'Creeaza proiect' })}
                  </button>
                </div>
              ) : (
                projects.map(p => (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{p.name}</h2>
                        <span className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs ${getStatusColor(p.status)}`}>
                          {t(projectStatusLabels[normalizeProjectStatus(p.status)])}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {editingProjectId === p.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEditProject(p.id)}
                              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm"
                            >
                              {t({ ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c', en: 'Save', ro: 'Salveaza' })}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditProject}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
                            >
                              {t({ ru: '\u041e\u0442\u043c\u0435\u043d\u0430', en: 'Cancel', ro: 'Anuleaza' })}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditProject(p)}
                              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
                            >
                              {t({ ru: '\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c', en: 'Edit', ro: 'Editeaza' })}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProject(p.id)}
                              className="px-4 py-2 rounded-lg border border-red-200 text-sm text-red-600"
                            >
                              {t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c', en: 'Delete', ro: 'Sterge' })}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingProjectId === p.id ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-500 mb-1">
                            {t({ ru: '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435', en: 'Name', ro: 'Nume' })}
                          </label>
                          <input
                            type="text"
                            value={editProject.name}
                            onChange={e => setEditProject({ ...editProject, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            {t({ ru: '\u0421\u0440\u043e\u043a', en: 'Deadline', ro: 'Termen' })}
                          </label>
                          <input
                            type="date"
                            value={editProject.deadline}
                            onChange={e => setEditProject({ ...editProject, deadline: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            {t({ ru: '\u0411\u044e\u0434\u0436\u0435\u0442', en: 'Budget', ro: 'Buget' })}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editProject.budget || ''}
                            onChange={e => setEditProject({ ...editProject, budget: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            {t({ ru: '\u0421\u0442\u0430\u0442\u0443\u0441', en: 'Status', ro: 'Stare' })}
                          </label>
                          <select
                            value={editProject.status}
                            onChange={e => setEditProject({ ...editProject, status: e.target.value as ProjectStatus })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="planning">{t(projectStatusLabels.planning)}</option>
                            <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                            <option value="testing">{t(projectStatusLabels.testing)}</option>
                            <option value="done">{t(projectStatusLabels.done)}</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm text-gray-500 mb-1">
                            {t({ ru: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435', en: 'Description', ro: 'Descriere' })}
                          </label>
                          <textarea
                            value={editProject.description}
                            onChange={e => setEditProject({ ...editProject, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {p.description && (
                          <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                        )}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex gap-3">
                            <Calendar size={20} className="text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{t({ ru: '\u0421\u0440\u043e\u043a', en: 'Deadline', ro: 'Termen' })}</p>
                              <p className="font-medium">{p.deadline}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <DollarSign size={20} className="text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{t({ ru: '\u0411\u044e\u0434\u0436\u0435\u0442', en: 'Budget', ro: 'Buget' })}</p>
                              <p className="font-medium">{formatCurrency(p.budget)}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <TrendingUp size={20} className="text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">{t({ ru: '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441', en: 'Progress', ro: 'Progres' })}</p>
                              <p className="font-medium">{p.progress}%</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{t({ ru: '\u0417\u0430\u0434\u0430\u0447\u0438', en: 'Tasks', ro: 'Sarcini' })}</h1>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {t({ ru: '\u041d\u0435\u0442 \u0437\u0430\u0434\u0430\u0447', en: 'No tasks', ro: 'Nu exista sarcini' })}
                    </p>
                    <p className="text-sm mt-2">
                      {t({ ru: '\u0417\u0430\u0434\u0430\u0447\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432', en: 'Tasks will appear after projects are created', ro: 'Sarcinile vor aparea dupa crearea proiectelor' })}
                    </p>
                  </div>
                ) : (
                  tasks.map(task => {
                    const taskStatus = matchProjectStatus(task.status) || matchInvoiceStatus(task.status);
                    const label = taskStatus
                      ? t(projectStatusLabels[normalizeProjectStatus(taskStatus)])
                      : task.status;
                    return (
                      <div key={task.id} className="border rounded-lg p-4 mb-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-500">{task.project}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                            {label}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{t({ ru: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f', en: 'Messages', ro: 'Mesaje' })}</h1>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {t({ ru: '\u041d\u0435\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439', en: 'No messages', ro: 'Nu exista mesaje' })}
                    </p>
                    <p className="text-sm mt-2">
                      {t({ ru: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c', en: 'Team messages will appear here', ro: 'Aici vor aparea mesajele echipei' })}
                    </p>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`p-4 rounded-lg mb-3 ${m.unread ? 'bg-purple-50' : 'bg-gray-50'}`}>
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {m.from[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-semibold">{m.from}</p>
                            <span className="text-sm text-gray-500">{m.time}</span>
                          </div>
                          <p className="text-sm text-gray-500">{m.role}</p>
                          <p className="text-sm mt-1">{m.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b', en: 'Documents', ro: 'Documente' })}</h1>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                  <Upload size={20} />
                  {t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c', en: 'Upload', ro: 'Incarca' })}
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      {t({ ru: '\u041d\u0435\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432', en: 'No documents', ro: 'Nu exista documente' })}
                    </p>
                    <p className="text-sm mt-2">
                      {t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u043f\u0435\u0440\u0432\u044b\u0439 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442', en: 'Upload your first document', ro: 'Incarcati primul document' })}
                    </p>
                  </div>
                ) : (
                  documents.map(d => (
                    <div key={d.id} className="flex justify-between items-center border rounded-lg p-4 mb-3">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{d.name}</h3>
                          <p className="text-sm text-gray-500">
                            {d.size} - {d.date}
                          </p>
                        </div>
                      </div>
                      <button className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Download size={18} />
                        {t({ ru: '\u0421\u043a\u0430\u0447\u0430\u0442\u044c', en: 'Download', ro: 'Descarca' })}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'finances' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{t({ ru: '\u0424\u0438\u043d\u0430\u043d\u0441\u044b', en: 'Finances', ro: 'Finante' })}</h1>
              {paymentNotice && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {paymentNotice}
                </div>
              )}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">{t({ ru: '\u041e\u0431\u0449\u0438\u0439 \u0431\u044e\u0434\u0436\u0435\u0442', en: 'Total budget', ro: 'Buget total' })}</p>
                  <p className="text-3xl font-bold mt-2">{formatCurrency(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">{t({ ru: '\u041f\u043e\u0442\u0440\u0430\u0447\u0435\u043d\u043e', en: 'Spent', ro: 'Cheltuit' })}</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm">{t({ ru: '\u041a \u043e\u043f\u043b\u0430\u0442\u0435', en: 'Due', ro: 'De plata' })}</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(0)}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">{t({ ru: '\u0421\u0447\u0435\u0442\u0430', en: 'Invoices', ro: 'Facturi' })}</h2>
                {invoices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">{t({ ru: '\u041d\u0435\u0442 \u0441\u0447\u0435\u0442\u043e\u0432', en: 'No invoices', ro: 'Nu exista facturi' })}</p>
                    <p className="text-sm mt-2">
                      {t({ ru: '\u0421\u0447\u0435\u0442\u0430 \u043a \u043e\u043f\u043b\u0430\u0442\u0435 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c', en: 'Invoices to pay will appear here', ro: 'Facturile de plata vor aparea aici' })}
                    </p>
                  </div>
                ) : (
                  invoices.map(inv => (
                    <div key={inv.id} className="mb-3">
                      <div className="flex justify-between items-center border rounded-lg p-4">
                        <div>
                          <h3 className="font-semibold">{inv.number}</h3>
                          <p className="text-sm text-gray-500">{inv.date}</p>
                          {inv.projectName && (
                            <p className="text-sm text-gray-500">
                              {t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442', en: 'Project', ro: 'Proiect' })}: {inv.projectName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold">{formatCurrency(inv.amount)}</p>
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(inv.status)}`}>
                            {t(invoiceStatusLabels[inv.status])}
                          </span>
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => setPaymentInvoiceId(inv.id)}
                              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              {t({ ru: '\u041e\u043f\u043b\u0430\u0442\u0438\u0442\u044c', en: 'Pay', ro: 'Plateste' })}
                            </button>
                          )}
                        </div>
                      </div>
                      {paymentInvoiceId === inv.id && inv.status !== 'paid' && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            {t({ ru: '\u0421\u043f\u043e\u0441\u043e\u0431 \u043e\u043f\u043b\u0430\u0442\u044b', en: 'Payment method', ro: 'Metoda de plata' })}
                          </p>
                          <div className="grid grid-cols-4 gap-3">
                            <button
                              onClick={() => handleBpayPayment(inv)}
                              disabled={bpayLoading}
                              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 px-5 py-3 rounded-xl cursor-pointer text-[15px] font-semibold transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
                              aria-label="BPay MIA"
                            >
                              <img src={`${import.meta.env.BASE_URL}mia.png`} alt="MIA" className="h-8" />
                              <img src={`${import.meta.env.BASE_URL}bpay.png`} alt="BPay" className="h-8" />
                            </button>
                            <button
                              onClick={() => {
                                setPaypalVisibleFor(inv.id);
                                setPaypalRenderedFor(null);
                              }}
                              className="px-4 py-3 rounded-lg border border-[#ffc439] bg-[#ffc439] hover:bg-[#f7b600] text-[15px] font-semibold shadow-sm"
                            >
                              <span className="text-[#003087] text-[17px]">Pay</span>
                              <span className="text-[#009cde] text-[17px]">Pal</span>
                            </button>
                          </div>
                          {paypalVisibleFor === inv.id && (
                            <div className="mt-4">
                              <div id={`paypal-buttons-${inv.id}`} />
                            </div>
                          )}
                          {bpayError && <div className="mt-2 text-sm text-red-600">{bpayError}</div>}
                          {paypalError && <div className="mt-2 text-sm text-red-600">{paypalError}</div>}
                          <div className="mt-3 text-right">
                            <button
                              onClick={() => {
                                setPaymentInvoiceId(null);
                                setPaypalError('');
                                setPaypalRenderedFor(null);
                                setPaypalVisibleFor(null);
                                setBpayError('');
                              }}
                              className="text-sm text-gray-500 hover:underline"
                            >
                              {t({ ru: '\u041e\u0442\u043c\u0435\u043d\u0430', en: 'Cancel', ro: 'Anuleaza' })}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{t({ ru: '\u041a\u0443\u0440\u0441\u044b \u0432\u0430\u043b\u044e\u0442', en: 'Exchange rates', ro: 'Curs valutar' })}</h2>
                  <span className="text-xs text-gray-400">BNM</span>
                </div>
                {ratesLoading && (
                  <div className="text-sm text-gray-500">
                    {t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...', en: 'Loading...', ro: 'Se incarca...' })}
                  </div>
                )}
                {ratesError && <div className="text-sm text-red-600">{ratesError}</div>}
                {!ratesLoading && !ratesError && rates && (
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    {(['EUR', 'USD', 'GBP', 'RON'] as const).map(code => (
                      <div key={code} className="border rounded-lg p-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`${import.meta.env.BASE_URL}currency-${code.toLowerCase()}.svg`}
                            alt={code}
                            className="w-8 h-8"
                          />
                          <span className="text-xs text-gray-600">{code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t({ ru: '\u041a\u0443\u043f\u043b\u044f', en: 'Buy', ro: 'Cumparare' })}</span>
                          <span className="font-semibold">{formatRate(rates[code])}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t({ ru: '\u041f\u0440\u043e\u0434\u0430\u0436\u0430', en: 'Sell', ro: 'Vanzare' })}</span>
                          <span className="font-semibold">{formatRate(rates[code])}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold">{t({ ru: 'Подписки', en: 'Subscriptions', ro: 'Abonamente' })}</h1>
                <span className="text-sm text-gray-500">
                  {t({ ru: 'Выберите план обслуживания', en: 'Choose a service plan', ro: 'Alege planul de suport' })}
                </span>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {subscriptionPlans.map(plan => {
                  const activeSub = getActiveSubscription(plan.id);
                  const activeUntil = activeSub?.activeUntil ? formatSubscriptionDate(activeSub.activeUntil) : '';
                  const isPayPalLoading =
                    subscriptionPayPal?.planId === plan.id && subscriptionPayPalRenderedFor !== plan.id;
                  return (
                  <div key={plan.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="text-xs font-semibold text-purple-600 bg-purple-50 inline-flex px-3 py-1 rounded-full">
                      {plan.badge}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">{plan.title}</h2>
                    <div className="mt-2 text-gray-700 font-semibold">{plan.hours}</div>
                    <div className="mt-4 text-2xl font-bold text-gray-900">{plan.price}</div>
                    <div className="text-sm text-gray-500">{plan.priceUsd}</div>
                    {activeUntil && (
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        {t({ ru: 'Активна до', en: 'Active until', ro: 'Activ pina la' })} {activeUntil}
                      </div>
                    )}
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 grid gap-2">
                      <button
                        onClick={() => startSubscriptionPayment(plan.id, 'bpay')}
                        disabled={subscriptionPayingPlan === plan.id}
                        className="w-full rounded-xl bg-purple-600 text-white py-2.5 font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                      >
                        {activeUntil
                          ? t({ ru: 'Продлить (BPay)', en: 'Renew (BPay)', ro: 'Prelungeste (BPay)' })
                          : t({ ru: 'Оплатить (BPay)', en: 'Pay (BPay)', ro: 'Plateste (BPay)' })}
                      </button>
                      <button
                        onClick={() => startSubscriptionPayment(plan.id, 'paypal')}
                        disabled={subscriptionPayingPlan === plan.id}
                        className="w-full rounded-xl border border-[#ffc439] bg-[#ffc439] py-2.5 font-semibold text-[#111] hover:bg-[#f7b600] transition disabled:opacity-60"
                      >
                        {activeUntil
                          ? t({ ru: 'Продлить (PayPal)', en: 'Renew (PayPal)', ro: 'Prelungeste (PayPal)' })
                          : t({ ru: 'Оплатить (PayPal)', en: 'Pay (PayPal)', ro: 'Plateste (PayPal)' })}
                      </button>
                    </div>
                    {subscriptionPayPal?.planId === plan.id && (
                      <div className="mt-4">
                        {isPayPalLoading && (
                          <div className="text-sm text-gray-500">
                            {t({
                              ru: 'Загружаем PayPal...',
                              en: 'Loading PayPal...',
                              ro: 'Se incarca PayPal...'
                            })}
                          </div>
                        )}
                        <div id={`paypal-subscription-${plan.id}`} />
                        {subscriptionsError && (
                          <div className="mt-2 text-sm text-red-600">{subscriptionsError}</div>
                        )}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
              {subscriptionsLoading && (
                <div className="text-sm text-gray-500">{t({ ru: 'Загрузка подписок...', en: 'Loading subscriptions...', ro: 'Se incarca abonamentele...' })}</div>
              )}
              {subscriptionsError && <div className="text-sm text-red-600">{subscriptionsError}</div>}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{t({ ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438', en: 'Settings', ro: 'Setari' })}</h1>
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                    {t({ ru: '\u041f\u0440\u043e\u0444\u0438\u043b\u044c', en: 'Profile', ro: 'Profil' })}
                  </h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {userInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-sm text-gray-500">ivan.petrov@email.com</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0418\u043c\u044f', en: 'First name', ro: 'Prenume' })}
                      </label>
                      <input
                        type="text"
                        defaultValue={t({ ru: '\u0418\u0432\u0430\u043d', en: 'Ivan', ro: 'Ivan' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0424\u0430\u043c\u0438\u043b\u0438\u044f', en: 'Last name', ro: 'Nume' })}
                      </label>
                      <input
                        type="text"
                        defaultValue={t({ ru: '\u041f\u0435\u0442\u0440\u043e\u0432', en: 'Petrov', ro: 'Petrov' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="ivan.petrov@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        {t({ ru: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d', en: 'Phone', ro: 'Telefon' })}
                      </label>
                      <input
                        type="tel"
                        defaultValue="+373 xx xxx xxx"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                    {t({ ru: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f', en: 'Notifications', ro: 'Notificari' })}
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        label: t({ ru: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e \u043d\u043e\u0432\u044b\u0445 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f\u0445', en: 'Notifications about new messages', ro: 'Notificari despre mesaje noi' }),
                        enabled: true
                      },
                      {
                        label: t({ ru: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e \u0441\u0442\u0430\u0442\u0443\u0441\u0435 \u0437\u0430\u0434\u0430\u0447', en: 'Notifications about task status', ro: 'Notificari despre starea sarcinilor' }),
                        enabled: true
                      },
                      {
                        label: t({ ru: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043e \u0441\u0447\u0435\u0442\u0430\u0445 \u0438 \u043e\u043f\u043b\u0430\u0442\u0435', en: 'Notifications about invoices and payments', ro: 'Notificari despre facturi si plati' }),
                        enabled: false
                      },
                      {
                        label: t({ ru: 'Email-\u0440\u0430\u0441\u0441\u044b\u043b\u043a\u0438', en: 'Email newsletters', ro: 'Newslettere email' }),
                        enabled: false
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <span className="text-gray-700">{item.label}</span>
                        <div
                          className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                            item.enabled ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-transform ${
                              item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-2.5 rounded-lg font-medium hover:opacity-90 transition">
                    {t({ ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f', en: 'Save changes', ro: 'Salveaza modificarile' })}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}







