import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Settings, LogOut, Users, FolderOpen, ClipboardList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt?: string;
};

type ProjectDocument = {
  id: string;
  name: string;
  size?: string;
  date?: string;
  url?: string;
};

type AdminProject = {
  id: string;
  name: string;
  clientId?: string | null;
  status: ProjectStatus | string;
  description?: string;
  documents?: ProjectDocument[];
  createdAt?: string;
};

type Invoice = {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  clientId?: string | null;
  projectId?: string | null;
  projectName?: string;
};

type AuditEntry = {
  id: string;
  ts: string;
  action: string;
  [key: string]: unknown;
};

type AdminSettings = {
  payments: { bpay: boolean; paypal: boolean };
  notifications: { telegram: boolean; email: boolean; projectStatus: boolean };
};

const DEFAULT_SETTINGS: AdminSettings = {
  payments: { bpay: true, paypal: true },
  notifications: { telegram: true, email: true, projectStatus: true }
};

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const invoiceStatusLabels = getInvoiceStatusLabels();
  const projectStatusLabels = getProjectStatusLabels();
  const locale = lang === 'ro' ? 'ro-RO' : lang === 'en' ? 'en-US' : 'ru-RU';
  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString(locale, { maximumFractionDigits: 0 })} L`;

  const adminToken = localStorage.getItem('portalpixel_admin_token') || '';

  const [activeTab, setActiveTab] = useState<'invoices' | 'projects' | 'clients' | 'audit' | 'settings'>('invoices');
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState({ name: '', email: '', phone: '' });

  const [newProject, setNewProject] = useState({
    name: '',
    clientId: '',
    status: 'planning' as ProjectStatus,
    description: ''
  });

  const [newInvoice, setNewInvoice] = useState({
    number: '',
    date: '',
    amount: 0,
    status: 'pending' as InvoiceStatus,
    clientId: '',
    projectId: ''
  });

  const [statusForm, setStatusForm] = useState({
    phone: '',
    projectName: '',
    status: 'planning' as ProjectStatus
  });
  const [statusNotice, setStatusNotice] = useState('');

  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [bpayStatusLoadingId, setBpayStatusLoadingId] = useState<string | null>(null);
  const [bpayStatusById, setBpayStatusById] = useState<Record<string, string>>({});
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  const [docDrafts, setDocDrafts] = useState<Record<string, { name: string; size: string; date: string }>>({});

  useEffect(() => {
    if (!adminToken) {
      navigate('/login/admin');
    }
  }, [adminToken, navigate]);

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (adminToken) {
      headers.set('Authorization', `Bearer ${adminToken}`);
    }
    const res = await fetch(path, { ...options, headers });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new Error(data?.error || text || 'Request failed');
    }
    return data;
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [settingsRes, clientsRes, projectsRes, invoicesRes, auditRes] = await Promise.all([
        apiFetch('/api/admin/settings'),
        apiFetch('/api/admin/clients'),
        apiFetch('/api/admin/projects'),
        apiFetch('/api/admin/invoices'),
        apiFetch('/api/admin/audit')
      ]);
      setSettings(settingsRes || DEFAULT_SETTINGS);
      setClients(clientsRes || []);
      setProjects(projectsRes || []);
      setInvoices(
        (invoicesRes || []).map((inv: Invoice) => ({
          ...inv,
          status: normalizeInvoiceStatus(inv.status)
        }))
      );
      setAuditLog(auditRes || []);
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadAll();
    }
  }, [adminToken]);

  const updateSettings = async (next: AdminSettings) => {
    setSettings(next);
    try {
      await apiFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(next) });
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    try {
      const created = await apiFetch('/api/admin/clients', {
        method: 'POST',
        body: JSON.stringify(newClient)
      });
      setClients(prev => [created, ...prev]);
      setNewClient({ name: '', email: '', phone: '' });
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleUpdateClient = async (id: string) => {
    try {
      const updated = await apiFetch(`/api/admin/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(editingClient)
      });
      setClients(prev => prev.map(item => (item.id === id ? updated : item)));
      setEditingClientId(null);
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await apiFetch(`/api/admin/clients/${id}`, { method: 'DELETE' });
      setClients(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;
    try {
      const created = await apiFetch('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(newProject)
      });
      setProjects(prev => [created, ...prev]);
      setNewProject({ name: '', clientId: '', status: 'planning', description: '' });
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleUpdateProject = async (id: string, patch: Partial<AdminProject>) => {
    try {
      const updated = await apiFetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
      setProjects(prev => prev.map(item => (item.id === id ? updated : item)));
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await apiFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.number || !newInvoice.date || !newInvoice.amount) return;
    const projectName = newInvoice.projectId
      ? projects.find(p => p.id === newInvoice.projectId)?.name || ''
      : '';
    try {
      const created = await apiFetch('/api/admin/invoices', {
        method: 'POST',
        body: JSON.stringify({ ...newInvoice, projectName })
      });
      setInvoices(prev => [{ ...created, status: normalizeInvoiceStatus(created.status) }, ...prev]);
      setNewInvoice({ number: '', date: '', amount: 0, status: 'pending', clientId: '', projectId: '' });
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleUpdateInvoice = async (id: string, patch: Partial<Invoice>) => {
    try {
      const updated = await apiFetch(`/api/admin/invoices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
      setInvoices(prev =>
        prev.map(item => (item.id === id ? { ...updated, status: normalizeInvoiceStatus(updated.status) } : item))
      );
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      await apiFetch(`/api/admin/invoices/${id}`, { method: 'DELETE' });
      setInvoices(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(String((err as Error)?.message || err));
    }
  };

  const handleCheckBpayStatus = async (invoice: Invoice) => {
    setError('');
    setBpayStatusLoadingId(invoice.id);
    try {
      const result = await apiFetch(`/api/bpay/pay-result/${encodeURIComponent(invoice.number)}`);
      const isPaid = Boolean(result?.data?.isPaid);
      const stateTime = result?.data?.stateTime || result?.data?.time || '';
      const statusLabel = isPaid
        ? t({ ru: 'Оплачено', en: 'Paid', ro: 'Platita' })
        : t({ ru: 'Не оплачено', en: 'Not paid', ro: 'Neplatita' });
      setBpayStatusById(prev => ({
        ...prev,
        [invoice.id]: stateTime ? `${statusLabel} · ${stateTime}` : statusLabel
      }));
      if (isPaid && invoice.status !== 'paid') {
        await handleUpdateInvoice(invoice.id, { status: 'paid' });
      }
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setBpayStatusLoadingId(null);
    }
  };

  const handleAddDocument = async (project: AdminProject) => {
    const draft = docDrafts[project.id];
    if (!draft?.name) return;
    const nextDoc: ProjectDocument = {
      id: crypto.randomUUID(),
      name: draft.name,
      size: draft.size || '',
      date: draft.date || new Date().toISOString().slice(0, 10)
    };
    const documents = [...(project.documents || []), nextDoc];
    await handleUpdateProject(project.id, { documents });
    setDocDrafts(prev => ({ ...prev, [project.id]: { name: '', size: '', date: '' } }));
  };

  const handleRemoveDocument = async (project: AdminProject, docId: string) => {
    const documents = (project.documents || []).filter(doc => doc.id !== docId);
    await handleUpdateProject(project.id, { documents });
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusForm.phone || !statusForm.projectName) return;
    try {
      await apiFetch('/api/projects/status', {
        method: 'POST',
        body: JSON.stringify({
          phone: statusForm.phone,
          projectName: statusForm.projectName,
          status: statusForm.status
        })
      });
      setStatusNotice(
        t({
          ru: '\u0421\u0442\u0430\u0442\u0443\u0441 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d \u043a\u043b\u0438\u0435\u043d\u0442\u0443',
          en: 'Status sent to client',
          ro: 'Status trimis clientului'
        })
      );
      setStatusForm({ phone: '', projectName: '', status: 'planning' });
    } catch (err) {
      setStatusNotice(
        t({
          ru: '\u041e\u0448\u0438\u0431\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u0430',
          en: 'Failed to send status',
          ro: 'Eroare la trimiterea statusului'
        })
      );
    }
  };

  const filteredClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(c =>
      [c.name, c.email, c.phone].filter(Boolean).some(val => String(val).toLowerCase().includes(q))
    );
  }, [clients, clientSearch]);

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    return projects.filter(p => {
      if (projectStatusFilter !== 'all' && normalizeProjectStatus(p.status) !== projectStatusFilter) return false;
      if (!q) return true;
      return [p.name, p.description].filter(Boolean).some(val => String(val).toLowerCase().includes(q));
    });
  }, [projects, projectSearch, projectStatusFilter]);

  const filteredInvoices = useMemo(() => {
    const q = invoiceSearch.trim().toLowerCase();
    return invoices.filter(inv => {
      if (invoiceStatusFilter !== 'all' && inv.status !== invoiceStatusFilter) return false;
      if (!q) return true;
      return [inv.number, inv.projectName].filter(Boolean).some(val => String(val).toLowerCase().includes(q));
    });
  }, [invoices, invoiceSearch, invoiceStatusFilter]);

  const filteredAudit = useMemo(() => {
    const q = auditSearch.trim().toLowerCase();
    if (!q) return auditLog;
    return auditLog.filter(entry => JSON.stringify(entry).toLowerCase().includes(q));
  }, [auditLog, auditSearch]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 flex flex-col h-full bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <p className="font-bold text-lg text-gray-800">{t({ ru: '\u0410\u0434\u043c\u0438\u043d', en: 'Admin', ro: 'Admin' })}</p>
          <p className="text-sm text-gray-500">PixelCraft</p>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
              activeTab === 'invoices' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} />
            <span className="font-medium">{t({ ru: '\u0421\u0447\u0435\u0442\u0430', en: 'Invoices', ro: 'Facturi' })}</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
              activeTab === 'projects' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FolderOpen size={20} />
            <span className="font-medium">{t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Projects', ro: 'Proiecte' })}</span>
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
              activeTab === 'clients' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">{t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442\u044b', en: 'Clients', ro: 'Clienti' })}</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
              activeTab === 'audit' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ClipboardList size={20} />
            <span className="font-medium">{t({ ru: '\u041b\u043e\u0433\u0438', en: 'Audit log', ro: 'Jurnal' })}</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left ${
              activeTab === 'settings' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">{t({ ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438', en: 'Settings', ro: 'Setari' })}</span>
          </button>
          <Link
            to="/client"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <span className="font-medium">
              {t({ ru: '\u041a\u0430\u0431\u0438\u043d\u0435\u0442 \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Client dashboard', ro: 'Panou client' })}
            </span>
          </Link>
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={async () => {
              if (adminToken) {
                try {
                  await fetch('/api/admin/logout', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${adminToken}` }
                  });
                } catch {
                  // ignore logout errors
                }
              }
              localStorage.removeItem('portalpixel_admin_token');
              localStorage.removeItem('portalpixel_admin_expires');
              navigate('/login/admin');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            <span className="font-medium">{t({ ru: '\u0412\u044b\u0439\u0442\u0438', en: 'Sign out', ro: 'Iesire' })}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                {activeTab === 'settings'
                  ? t({ ru: '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438', en: 'Settings', ro: 'Setari' })
                  : activeTab === 'clients'
                    ? t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442\u044b', en: 'Clients', ro: 'Clienti' })
                    : activeTab === 'projects'
                      ? t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Projects', ro: 'Proiecte' })
                      : activeTab === 'audit'
                        ? t({ ru: '\u041b\u043e\u0433\u0438', en: 'Audit log', ro: 'Jurnal' })
                        : t({ ru: '\u0421\u0447\u0435\u0442\u0430', en: 'Invoices', ro: 'Facturi' })}
              </h1>
              <span className="text-sm text-gray-500">
                {t({ ru: '\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c', en: 'Admin panel', ro: 'Panou admin' })}
              </span>
            </div>
            <LanguageSwitcher className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {loading && <div className="text-sm text-gray-500">{t({ ru: '\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...', en: 'Loading...', ro: 'Se incarca...' })}</div>}

          {activeTab === 'invoices' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0447\u0435\u0442', en: 'Create invoice', ro: 'Emite factura' })}
                </h2>
                <form onSubmit={handleCreateInvoice} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={newInvoice.number}
                    onChange={e => setNewInvoice({ ...newInvoice, number: e.target.value })}
                    placeholder={t({ ru: '\u041d\u043e\u043c\u0435\u0440', en: 'Number', ro: 'Numar' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    value={newInvoice.date}
                    onChange={e => setNewInvoice({ ...newInvoice, date: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    min="1"
                    value={newInvoice.amount || ''}
                    onChange={e => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    placeholder={t({ ru: '\u0421\u0443\u043c\u043c\u0430', en: 'Amount', ro: 'Suma' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={newInvoice.status}
                    onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value as InvoiceStatus })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">{t(invoiceStatusLabels.pending)}</option>
                    <option value="paid">{t(invoiceStatusLabels.paid)}</option>
                  </select>
                  <select
                    value={newInvoice.clientId}
                    onChange={e => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">{t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442', en: 'Client', ro: 'Client' })}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newInvoice.projectId}
                    onChange={e => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">{t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442', en: 'Project', ro: 'Proiect' })}</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <div className="col-span-4 flex justify-end">
                    <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
                      {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c', en: 'Create', ro: 'Emite' })}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                  <h2 className="text-xl font-bold">{t({ ru: '\u0421\u0447\u0435\u0442\u0430', en: 'Invoices', ro: 'Facturi' })}</h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={invoiceSearch}
                      onChange={e => setInvoiceSearch(e.target.value)}
                      placeholder={t({ ru: '\u041f\u043e\u0438\u0441\u043a', en: 'Search', ro: 'Cauta' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                      value={invoiceStatusFilter}
                      onChange={e => setInvoiceStatusFilter(e.target.value as InvoiceStatus | 'all')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">{t({ ru: '\u0412\u0441\u0435', en: 'All', ro: 'Toate' })}</option>
                      <option value="pending">{t(invoiceStatusLabels.pending)}</option>
                      <option value="paid">{t(invoiceStatusLabels.paid)}</option>
                    </select>
                  </div>
                </div>
                {filteredInvoices.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    {t({ ru: '\u0421\u0447\u0435\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442', en: 'No invoices yet', ro: 'Nu exista facturi inca' })}
                  </div>
                ) : (
                  filteredInvoices.map(inv => (
                    <div key={inv.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between border rounded-lg p-4 mb-3">
                      <div>
                        <h3 className="font-semibold">{inv.number}</h3>
                        <p className="text-sm text-gray-500">{inv.date}</p>
                        {inv.projectName && <p className="text-sm text-gray-500">{inv.projectName}</p>}
                      </div>
                      <div className="mt-3 lg:mt-0 flex flex-wrap items-center gap-3">
                        <p className="text-xl font-bold">{formatCurrency(inv.amount)}</p>
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(inv.status)}`}>
                          {t(invoiceStatusLabels[inv.status])}
                        </span>
                        <select
                          value={inv.status}
                          onChange={e => handleUpdateInvoice(inv.id, { status: e.target.value as InvoiceStatus })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="pending">{t(invoiceStatusLabels.pending)}</option>
                          <option value="paid">{t(invoiceStatusLabels.paid)}</option>
                        </select>
                        <button
                          onClick={() => handleCheckBpayStatus(inv)}
                          disabled={bpayStatusLoadingId === inv.id}
                          className="px-3 py-2 text-sm text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-60"
                        >
                          {bpayStatusLoadingId === inv.id
                            ? t({ ru: 'Проверка...', en: 'Checking...', ro: 'Se verifica...' })
                            : t({ ru: 'Проверить BPay', en: 'Check BPay', ro: 'Verifica BPay' })}
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                        >
                          {t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c', en: 'Delete', ro: 'Sterge' })}
                        </button>
                        {bpayStatusById[inv.id] && (
                          <span className="text-xs text-gray-500">{bpayStatusById[inv.id]}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'projects' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0440\u043e\u0435\u043a\u0442', en: 'Create project', ro: 'Creeaza proiect' })}
                </h2>
                <form onSubmit={handleCreateProject} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder={t({ ru: '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435', en: 'Name', ro: 'Denumire' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={newProject.clientId}
                    onChange={e => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">{t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442', en: 'Client', ro: 'Client' })}</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newProject.status}
                    onChange={e => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="planning">{t(projectStatusLabels.planning)}</option>
                    <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                    <option value="testing">{t(projectStatusLabels.testing)}</option>
                    <option value="done">{t(projectStatusLabels.done)}</option>
                  </select>
                  <input
                    type="text"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder={t({ ru: '\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435', en: 'Description', ro: 'Descriere' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg col-span-4"
                  />
                  <div className="col-span-4 flex justify-end">
                    <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
                      {t({ ru: '\u0421\u043e\u0437\u0434\u0430\u0442\u044c', en: 'Create', ro: 'Creeaza' })}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                  <h2 className="text-xl font-bold">{t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442\u044b', en: 'Projects', ro: 'Proiecte' })}</h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={e => setProjectSearch(e.target.value)}
                      placeholder={t({ ru: '\u041f\u043e\u0438\u0441\u043a', en: 'Search', ro: 'Cauta' })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select
                      value={projectStatusFilter}
                      onChange={e => setProjectStatusFilter(e.target.value as ProjectStatus | 'all')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">{t({ ru: '\u0412\u0441\u0435', en: 'All', ro: 'Toate' })}</option>
                      <option value="planning">{t(projectStatusLabels.planning)}</option>
                      <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                      <option value="testing">{t(projectStatusLabels.testing)}</option>
                      <option value="done">{t(projectStatusLabels.done)}</option>
                    </select>
                  </div>
                </div>
                {filteredProjects.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    {t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442', en: 'No projects yet', ro: 'Nu exista proiecte inca' })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map(project => {
                      const normalizedStatus = normalizeProjectStatus(project.status);
                      const draft = docDrafts[project.id] || { name: '', size: '', date: '' };
                      return (
                        <div key={project.id} className="border rounded-lg p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <h3 className="font-semibold">{project.name}</h3>
                              {project.description && <p className="text-sm text-gray-500">{project.description}</p>}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                                {t(projectStatusLabels[normalizedStatus])}
                              </span>
                              <select
                                value={normalizedStatus}
                                onChange={e => handleUpdateProject(project.id, { status: e.target.value as ProjectStatus })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="planning">{t(projectStatusLabels.planning)}</option>
                                <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                                <option value="testing">{t(projectStatusLabels.testing)}</option>
                                <option value="done">{t(projectStatusLabels.done)}</option>
                              </select>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                              >
                                {t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c', en: 'Delete', ro: 'Sterge' })}
                              </button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              {t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b', en: 'Documents', ro: 'Documente' })}
                            </h4>
                            {(project.documents || []).length === 0 ? (
                              <div className="text-xs text-gray-400">
                                {t({ ru: '\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442', en: 'No documents yet', ro: 'Nu exista documente inca' })}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {(project.documents || []).map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <FileText size={16} className="text-purple-600" />
                                      {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                          {doc.name}
                                        </a>
                                      ) : (
                                        <span>{doc.name}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {doc.size && <span>{doc.size}</span>}
                                      {doc.date && <span>{doc.date}</span>}
                                      <button
                                        onClick={() => handleRemoveDocument(project, doc.id)}
                                        className="text-xs text-red-500 hover:underline"
                                      >
                                        {t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c', en: 'Delete', ro: 'Sterge' })}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-3 grid grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={draft.name}
                                onChange={e => setDocDrafts(prev => ({ ...prev, [project.id]: { ...draft, name: e.target.value } }))}
                                placeholder={t({ ru: '\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435', en: 'Name', ro: 'Denumire' })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="text"
                                value={draft.size}
                                onChange={e => setDocDrafts(prev => ({ ...prev, [project.id]: { ...draft, size: e.target.value } }))}
                                placeholder={t({ ru: '\u0420\u0430\u0437\u043c\u0435\u0440', en: 'Size', ro: 'Dimensiune' })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                              <input
                                type="date"
                                value={draft.date}
                                onChange={e => setDocDrafts(prev => ({ ...prev, [project.id]: { ...draft, date: e.target.value } }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => handleAddDocument(project)}
                                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg"
                              >
                                {t({ ru: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c', en: 'Add', ro: 'Adauga' })}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  {t({
                    ru: '\u0421\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0434\u043b\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0430',
                    en: 'Client project status',
                    ro: 'Status proiect client'
                  })}
                </h2>
                <form onSubmit={handleStatusSubmit} className="grid grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={statusForm.phone}
                    onChange={e => setStatusForm({ ...statusForm, phone: e.target.value })}
                    placeholder={t({ ru: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d', en: 'Phone', ro: 'Telefon' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={statusForm.projectName}
                    onChange={e => setStatusForm({ ...statusForm, projectName: e.target.value })}
                    placeholder={t({ ru: '\u041f\u0440\u043e\u0435\u043a\u0442', en: 'Project', ro: 'Proiect' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={statusForm.status}
                    onChange={e => setStatusForm({ ...statusForm, status: e.target.value as ProjectStatus })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="planning">{t(projectStatusLabels.planning)}</option>
                    <option value="in_progress">{t(projectStatusLabels.in_progress)}</option>
                    <option value="testing">{t(projectStatusLabels.testing)}</option>
                    <option value="done">{t(projectStatusLabels.done)}</option>
                  </select>
                  <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
                    {t({ ru: '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c', en: 'Send', ro: 'Trimite' })}
                  </button>
                </form>
                {statusNotice && <p className="text-sm text-gray-600 mt-3">{statusNotice}</p>}
              </div>
            </>
          )}

          {activeTab === 'clients' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  {t({ ru: '\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Add client', ro: 'Adauga client' })}
                </h2>
                <form onSubmit={handleCreateClient} className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder={t({ ru: '\u0418\u043c\u044f', en: 'Name', ro: 'Nume' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="Email"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder={t({ ru: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d', en: 'Phone', ro: 'Telefon' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="col-span-3 flex justify-end">
                    <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
                      {t({ ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c', en: 'Save', ro: 'Salveaza' })}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                  <h2 className="text-xl font-bold">{t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442\u044b', en: 'Clients', ro: 'Clienti' })}</h2>
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)}
                    placeholder={t({ ru: '\u041f\u043e\u0438\u0441\u043a', en: 'Search', ro: 'Cauta' })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                {filteredClients.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    {t({ ru: '\u041a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442', en: 'No clients yet', ro: 'Nu exista clienti inca' })}
                  </div>
                ) : (
                  filteredClients.map(client => (
                    <div key={client.id} className="border rounded-lg p-4 mb-3">
                      {editingClientId === client.id ? (
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={editingClient.name}
                            onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="email"
                            value={editingClient.email}
                            onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={editingClient.phone}
                            onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <div className="col-span-3 flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdateClient(client.id)}
                              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg"
                            >
                              {t({ ru: '\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c', en: 'Save', ro: 'Salveaza' })}
                            </button>
                            <button
                              onClick={() => setEditingClientId(null)}
                              className="px-4 py-2 text-sm border rounded-lg"
                            >
                              {t({ ru: '\u041e\u0442\u043c\u0435\u043d\u0430', en: 'Cancel', ro: 'Anuleaza' })}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <h3 className="font-semibold">{client.name}</h3>
                            <p className="text-sm text-gray-500">{client.email}</p>
                            <p className="text-sm text-gray-500">{client.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingClientId(client.id);
                                setEditingClient({
                                  name: client.name || '',
                                  email: client.email || '',
                                  phone: client.phone || ''
                                });
                              }}
                              className="px-3 py-2 text-sm border rounded-lg"
                            >
                              {t({ ru: '\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c', en: 'Edit', ro: 'Editeaza' })}
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                            >
                              {t({ ru: '\u0423\u0434\u0430\u043b\u0438\u0442\u044c', en: 'Delete', ro: 'Sterge' })}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-4">
                <h2 className="text-xl font-bold">{t({ ru: '\u041b\u043e\u0433 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439', en: 'Audit log', ro: 'Jurnal actiuni' })}</h2>
                <input
                  type="text"
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  placeholder={t({ ru: '\u041f\u043e\u0438\u0441\u043a', en: 'Search', ro: 'Cauta' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              {filteredAudit.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {t({ ru: '\u0417\u0430\u043f\u0438\u0441\u0435\u0439 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442', en: 'No entries yet', ro: 'Nu exista inregistrari' })}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAudit.map(entry => (
                    <div key={entry.id} className="border rounded-lg p-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">{entry.action}</span>
                        <span>{entry.ts}</span>
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-500">
                        {JSON.stringify(entry, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">{t({ ru: '\u041f\u043b\u0430\u0442\u0435\u0436\u0438', en: 'Payments', ro: 'Plati' })}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>BPay</span>
                    <button
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          payments: { ...settings.payments, bpay: !settings.payments.bpay }
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        settings.payments.bpay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {settings.payments.bpay ? 'on' : 'off'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>PayPal</span>
                    <button
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          payments: { ...settings.payments, paypal: !settings.payments.paypal }
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        settings.payments.paypal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {settings.payments.paypal ? 'on' : 'off'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">{t({ ru: '\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f', en: 'Notifications', ro: 'Notificari' })}</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Telegram</span>
                    <button
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          notifications: { ...settings.notifications, telegram: !settings.notifications.telegram }
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        settings.notifications.telegram ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {settings.notifications.telegram ? 'on' : 'off'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <button
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: !settings.notifications.email }
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        settings.notifications.email ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {settings.notifications.email ? 'on' : 'off'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t({ ru: '\u0421\u0442\u0430\u0442\u0443\u0441\u044b \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432', en: 'Project status', ro: 'Status proiecte' })}</span>
                    <button
                      onClick={() =>
                        updateSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            projectStatus: !settings.notifications.projectStatus
                          }
                        })
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        settings.notifications.projectStatus
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {settings.notifications.projectStatus ? 'on' : 'off'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">{t({ ru: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b', en: 'Contacts', ro: 'Contacte' })}</h2>
                <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
                  <div>
                    <p className="text-gray-400">{t({ ru: '\u0422\u0435\u043b\u0435\u0444\u043e\u043d', en: 'Phone', ro: 'Telefon' })}</p>
                    <p className="font-medium text-gray-800">+373 60 713 252</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium text-gray-800">info@pixelcraft.md</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
