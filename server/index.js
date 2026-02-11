﻿import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const DEFAULT_RATE = Number(process.env.EXCHANGE_RATE_MDL_EUR || 0.05);
const BPAY_API_BASE = 'https://pay.bpay.md';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'selinartiom23@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Zeekler2025$';
const ADMIN_SESSION_TTL_HOURS = Number(process.env.ADMIN_SESSION_TTL_HOURS || 24);
const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID || '';

const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const TELEGRAM_FILE = path.join(DATA_DIR, 'telegram.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'project-status.json');
const ADMIN_SESSIONS_FILE = path.join(DATA_DIR, 'admin-sessions.json');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const ADMIN_PROJECTS_FILE = path.join(DATA_DIR, 'admin-projects.json');
const INVOICES_FILE = path.join(DATA_DIR, 'invoices.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'admin-settings.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit-log.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

app.use('/uploads', express.static(UPLOAD_DIR));

const readJson = (file, fallback) => {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (file, data) => {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const normalizePhone = (phone) => {
  if (!phone) return '';
  let digits = String(phone).replace(/[^\d+]/g, '');
  if (!digits.startsWith('+') && digits.length === 8) {
    digits = `+373${digits}`;
  }
  if (!digits.startsWith('+')) digits = `+${digits}`;
  return digits;
};

const matchClientByContact = (clients, email, phone) => {
  const normalizedEmail = email ? String(email).trim().toLowerCase() : '';
  const normalizedPhone = normalizePhone(phone);
  return clients.find(
    (client) =>
      (normalizedEmail && String(client.email || '').toLowerCase() === normalizedEmail) ||
      (normalizedPhone && normalizePhone(client.phone) === normalizedPhone)
  );
};

const canClientAccessProject = ({ project, email, phone }) => {
  const normalizedEmail = email ? String(email).trim().toLowerCase() : '';
  const normalizedPhone = normalizePhone(phone);
  if (project.clientEmail && normalizedEmail) {
    return String(project.clientEmail).toLowerCase() === normalizedEmail;
  }
  if (project.clientPhone && normalizedPhone) {
    return normalizePhone(project.clientPhone) === normalizedPhone;
  }
  if (project.clientId && (normalizedEmail || normalizedPhone)) {
    const client = matchClientByContact(getClients(), normalizedEmail, normalizedPhone);
    return client ? client.id === project.clientId : false;
  }
  return false;
};

const getTelegramMap = () => readJson(TELEGRAM_FILE, {});
const saveTelegramMap = (data) => writeJson(TELEGRAM_FILE, data);

const getProjectStatuses = () => readJson(PROJECTS_FILE, {});
const saveProjectStatuses = (data) => writeJson(PROJECTS_FILE, data);

const getAdminSessions = () => readJson(ADMIN_SESSIONS_FILE, []);
const saveAdminSessions = (data) => writeJson(ADMIN_SESSIONS_FILE, data);

const getClients = () => readJson(CLIENTS_FILE, []);
const saveClients = (data) => writeJson(CLIENTS_FILE, data);

const getAdminProjects = () => readJson(ADMIN_PROJECTS_FILE, []);
const saveAdminProjects = (data) => writeJson(ADMIN_PROJECTS_FILE, data);

const getInvoices = () => readJson(INVOICES_FILE, []);
const saveInvoices = (data) => writeJson(INVOICES_FILE, data);
const getSubscriptions = () => readJson(SUBSCRIPTIONS_FILE, []);
const saveSubscriptions = (data) => writeJson(SUBSCRIPTIONS_FILE, data);

const getAdminSettings = () =>
  readJson(SETTINGS_FILE, {
    payments: { bpay: true, paypal: true },
    notifications: { telegram: true, email: true, projectStatus: true }
  });
const saveAdminSettings = (data) => writeJson(SETTINGS_FILE, data);

const getAuditLog = () => readJson(AUDIT_FILE, []);
const saveAuditLog = (data) => writeJson(AUDIT_FILE, data);

const logAudit = (entry) => {
  const log = getAuditLog();
  const item = {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    ...entry
  };
  const next = [item, ...log].slice(0, 500);
  saveAuditLog(next);
  return item;
};

const pruneSessions = (sessions) => {
  const now = Date.now();
  return sessions.filter((s) => !s.expiresAt || new Date(s.expiresAt).getTime() > now);
};

const createAdminSession = (email) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_HOURS * 3600 * 1000).toISOString();
  const sessions = pruneSessions(getAdminSessions());
  const next = [...sessions, { token, email, expiresAt }];
  saveAdminSessions(next);
  return { token, expiresAt };
};

const getAdminFromRequest = (req) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  const sessions = pruneSessions(getAdminSessions());
  const session = sessions.find((s) => s.token === token);
  if (!session) {
    saveAdminSessions(sessions);
    return null;
  }
  saveAdminSessions(sessions);
  return session;
};

const requireAdmin = (req, res, next) => {
  const session = getAdminFromRequest(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.adminSession = session;
  next();
};

const sendTelegramMessage = async (chatId, text) => {
  if (!TELEGRAM_BOT_TOKEN || !chatId) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
};

const sendAdminNotification = async (text) => {
  if (!ADMIN_TELEGRAM_CHAT_ID) return;
  await sendTelegramMessage(ADMIN_TELEGRAM_CHAT_ID, text);
};

const sanitizeFilename = (name) =>
  String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 60);

const getExtensionFromMime = (mime) => {
  const map = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/zip': '.zip'
  };
  return map[mime] || '';
};

const isPaymentSuccess = (payload) => {
  const raw = String(
    payload?.status ||
      payload?.payment_status ||
      payload?.state ||
      payload?.result ||
      payload?.paymentState ||
      payload?.paymentStatus ||
      payload?.comand ||
      ''
  ).toLowerCase();
  return ['success', 'paid', 'approved', 'completed', 'ok', 'pay'].some((value) => raw.includes(value));
};

const updateInvoiceByOrderId = (orderId, patch = {}) => {
  if (!orderId) return null;
  const invoices = getInvoices();
  const idx = invoices.findIndex(
    (inv) => String(inv.number) === String(orderId) || String(inv.id) === String(orderId)
  );
  if (idx === -1) return null;
  const updated = {
    ...invoices[idx],
    ...patch
  };
  invoices[idx] = updated;
  saveInvoices(invoices);
  return updated;
};

const updateSubscriptionByOrderId = (orderId, patch = {}) => {
  if (!orderId) return null;
  const subs = getSubscriptions();
  const idx = subs.findIndex((sub) => String(sub.orderId) === String(orderId));
  if (idx === -1) return null;
  const updated = { ...subs[idx], ...patch };
  subs[idx] = updated;
  saveSubscriptions(subs);
  return updated;
};

const SUBSCRIPTION_PLANS = {
  basic: { amount: 1500, title: 'Basic', durationDays: 30 },
  pro: { amount: 4000, title: 'Pro', durationDays: 30 },
  enterprise: { amount: 8000, title: 'Enterprise', durationDays: 30 }
};

const createSubscriptionRecord = ({ planId, email, phone, provider }) => {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return null;
  const now = new Date().toISOString();
  const subscription = {
    id: crypto.randomUUID(),
    planId,
    orderId: `SUB-${crypto.randomUUID()}`,
    status: 'pending',
    amountMDL: plan.amount,
    title: plan.title,
    provider: provider || null,
    email: email || null,
    phone: phone || null,
    createdAt: now,
    updatedAt: now,
    activeUntil: null
  };
  const subs = getSubscriptions();
  subs.unshift(subscription);
  saveSubscriptions(subs);
  return subscription;
};

const extendSubscription = (currentUntil, durationDays) => {
  const now = new Date();
  const base = currentUntil && new Date(currentUntil) > now ? new Date(currentUntil) : now;
  base.setDate(base.getDate() + durationDays);
  return base.toISOString();
};

const markSubscriptionPaid = (orderId, provider, paidAt = new Date().toISOString()) => {
  const subs = getSubscriptions();
  const idx = subs.findIndex((sub) => String(sub.orderId) === String(orderId));
  if (idx === -1) return null;
  const plan = SUBSCRIPTION_PLANS[subs[idx].planId];
  const activeUntil = extendSubscription(subs[idx].activeUntil, plan?.durationDays || 30);
  const updated = {
    ...subs[idx],
    status: 'active',
    provider: provider || subs[idx].provider,
    paidAt,
    activeUntil,
    updatedAt: new Date().toISOString()
  };
  subs[idx] = updated;
  saveSubscriptions(subs);
  return updated;
};

const formatProjectStatusMessage = (projects) => {
  if (!projects.length) {
    return '\u0421\u0442\u0430\u0442\u0443\u0441\u044b \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.';
  }
  return projects
    .map(
      (project) =>
        `• ${project.name || project.id}: ${project.status} (обновлено ${project.updatedAt})`
    )
    .join('\n');
};

const getBpayConfig = () => {
  const merchantId = process.env.BPAY_MERCHANT_ID;
  const secretKey = process.env.BPAY_SECRET_KEY;
  if (!merchantId || !secretKey) {
    throw new Error('Missing BPAY_MERCHANT_ID or BPAY_SECRET_KEY');
  }
  return {
    merchantId,
    secretKey,
    successUrl: process.env.BPAY_SUCCESS_URL || 'https://pixelcraft.md/cabinet/client?payment=success',
    failUrl: process.env.BPAY_FAIL_URL || 'https://pixelcraft.md/cabinet/client?payment=fail',
    callbackUrl: process.env.BPAY_CALLBACK_URL || 'https://pixelcraft.md/api/bpay/callback',
    paymentMethod: process.env.BPAY_PAYMENT_METHOD || 'bpay',
    language: process.env.BPAY_LANGUAGE || 'ru',
    description: process.env.BPAY_DESCRIPTION || 'PortalPixel invoice',
    currency: process.env.BPAY_CURRENCY || 'MDL'
  };
};


const buildBpayRequestKey = (data, secretKey) =>
  crypto.createHash('sha256').update(`${data}${secretKey}`).digest('hex');

const buildBpayCallbackKey = (data, secretKey) => {
  const dataHash = crypto.createHash('sha256').update(String(data)).digest('hex');
  const secretHash = crypto.createHash('sha256').update(String(secretKey)).digest('hex');
  return crypto.createHash('sha256').update(`${dataHash}${secretHash}`).digest('hex');
};

const buildBpayDateTime = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(
    now.getMinutes()
  )}:${pad(now.getSeconds())}`;
};

const requestBpayInvoice = async ({ amountMDL, orderId, description, email, phone }) => {
  const amount = Number(amountMDL);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('amountMDL is required');
  }
  const config = getBpayConfig();
  const orderReference = orderId || crypto.randomUUID();
  const bpayUuid = crypto.randomUUID();
  const payload = {
    uuid: bpayUuid,
    merchantid: config.merchantId,
    amount,
    valute: normalizeBpayCurrency(config.currency),
    order_id: orderReference,
    description: description || config.description,
    dtime: buildBpayDateTime(),
    success_url: config.successUrl,
    fail_url: config.failUrl,
    callback_url: config.callbackUrl,
    method: config.paymentMethod,
    lang: config.language,
    getUrl: '1'
  };

  if (email || phone) {
    payload.params = {
      email: email || undefined,
      phone_number: phone || undefined
    };
  }

  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const key = buildBpayRequestKey(data, config.secretKey);
  const form = new URLSearchParams();
  form.append('data', data);
  form.append('key', key);

  const bpayRes = await fetch(`${BPAY_API_BASE}/merchant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });

  const responseText = await bpayRes.text();
  if (!bpayRes.ok) {
    throw new Error(responseText || 'BPay request failed');
  }
  const url = extractBpayUrl(responseText);
  if (!url) {
    throw new Error('BPay URL not found');
  }
  return { url, orderId: orderReference, uuid: bpayUuid };
};

const extractBpayUrl = (responseText) => {
  try {
    const parsed = JSON.parse(responseText);
    if (parsed?.url) return String(parsed.url);
  } catch {
    // fall back to regex
  }
  const urlMatch = responseText.match(/https?:\/\/[^\s<"]+/);
  return urlMatch ? urlMatch[0] : null;
};

const normalizeBpayCurrency = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const map = {
    MDL: 498,
    RON: 946,
    EUR: 978,
    USD: 840,
    RUB: 643
  };
  const key = String(value || '').trim().toUpperCase();
  return map[key] || 498;
};


const formatBnmDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}.${month}.${year}`;
};

const parseBnmRate = (xml) => {
  const eurBlock = xml.match(
    /<Valute[^>]*>[\s\S]*?<CharCode>\s*EUR\s*<\/CharCode>[\s\S]*?<Value>([^<]+)<\/Value>[\s\S]*?<\/Valute>/i
  );
  if (!eurBlock) throw new Error('EUR rate not found');
  const nominalMatch = xml.match(
    /<Valute[^>]*>[\s\S]*?<CharCode>\s*EUR\s*<\/CharCode>[\s\S]*?<Nominal>([^<]+)<\/Nominal>[\s\S]*?<\/Valute>/i
  );
  const value = Number(String(eurBlock[1]).replace(',', '.'));
  const nominal = Number(String(nominalMatch?.[1] ?? '1').replace(',', '.'));
  if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(nominal) || nominal <= 0) {
    throw new Error('Invalid BNM rate');
  }
  const mdlPerEur = value / nominal;
  return 1 / mdlPerEur;
};

const parseBnmRates = (xml, codes) => {
  const result = {};
  codes.forEach((code) => {
    const block = xml.match(
      new RegExp(
        `<Valute[^>]*>[\\s\\S]*?<CharCode>\\s*${code}\\s*</CharCode>[\\s\\S]*?</Valute>`,
        'i'
      )
    );
    if (!block) return;
    const valueMatch = block[0].match(/<Value>([^<]+)<\/Value>/i);
    const nominalMatch = block[0].match(/<Nominal>([^<]+)<\/Nominal>/i);
    const value = Number(String(valueMatch?.[1] ?? '').replace(',', '.'));
    const nominal = Number(String(nominalMatch?.[1] ?? '1').replace(',', '.'));
    if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(nominal) || nominal <= 0) return;
    result[code] = value / nominal;
  });
  return result;
};

const fetchBnmXmlForDate = async (date) => {
  const dateStr = formatBnmDate(date);
  const res = await fetch(`https://www.bnm.md/ro/official_exchange_rates?get_xml=1&date=${dateStr}`);
  if (!res.ok) throw new Error('BNM rate fetch failed');
  return res.text();
};

const fetchBnmRateForDate = async (date) => {
  const xml = await fetchBnmXmlForDate(date);
  return parseBnmRate(xml);
};

const fetchBnmRatesForDate = async (date, codes) => {
  const xml = await fetchBnmXmlForDate(date);
  return parseBnmRates(xml, codes);
};

const getExchangeRate = async () => {
  try {
    for (let offset = 0; offset <= 7; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      try {
        return await fetchBnmRateForDate(date);
      } catch {
        // Try previous day.
      }
    }
  } catch {
    // fall through
  }
  return DEFAULT_RATE;
};

const getExchangeRates = async (codes) => {
  try {
    for (let offset = 0; offset <= 7; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      try {
        const rates = await fetchBnmRatesForDate(date, codes);
        if (codes.every((code) => Number.isFinite(rates[code]))) {
          return rates;
        }
      } catch {
        // Try previous day.
      }
    }
  } catch {
    // fall through
  }
  return null;
};

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/public/payment-methods', (_req, res) => {
  const settings = getAdminSettings();
  res.json(settings.payments || { bpay: true, paypal: true });
});

app.post('/api/client/uploads', (req, res) => {
  const { name, dataUrl } = req.body || {};
  if (!dataUrl) return res.status(400).json({ error: 'dataUrl is required' });
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return res.status(400).json({ error: 'invalid dataUrl' });
  const mime = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) return res.status(400).json({ error: 'empty file' });

  ensureDataDir();
  const safeName = sanitizeFilename(name);
  const ext = path.extname(safeName) || getExtensionFromMime(mime);
  const filename = `${crypto.randomUUID()}${ext || ''}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const response = {
    id: filename,
    name: safeName || filename,
    size: `${Math.max(1, Math.ceil(buffer.length / 1024))} KB`,
    date: new Date().toISOString().slice(0, 10),
    url: `${baseUrl}/uploads/${filename}`
  };
  res.json(response);
});

app.get('/api/client/projects', (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const phone = normalizePhone(req.query.phone);
  if (!email && !phone) {
    return res.status(400).json({ error: 'email or phone is required' });
  }

  const projects = getAdminProjects().filter((project) =>
    canClientAccessProject({ project, email, phone })
  );

  res.json(projects);
});

app.post('/api/client/projects', (req, res) => {
  const {
    name,
    description,
    status,
    deadline,
    budget,
    documents,
    clientName,
    clientEmail,
    clientPhone
  } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });

  const normalizedPhone = normalizePhone(clientPhone);
  const email = clientEmail ? String(clientEmail).trim() : '';
  const clients = getClients();
  let client = null;
  if (email || normalizedPhone) {
    client = matchClientByContact(clients, email, normalizedPhone);
  }
  if (!client && (clientName || email || normalizedPhone)) {
    client = {
      id: crypto.randomUUID(),
      name: String(clientName || email || normalizedPhone || 'Client'),
      email,
      phone: normalizedPhone,
      createdAt: new Date().toISOString()
    };
    clients.unshift(client);
    saveClients(clients);
    logAudit({ action: 'client_create', clientId: client.id, source: 'client' });
  }

  const project = {
    id: crypto.randomUUID(),
    name: String(name),
    clientId: client?.id || null,
    clientName: client?.name || String(clientName || ''),
    clientEmail: email,
    clientPhone: normalizedPhone,
    status: status || 'planning',
    description: description || '',
    deadline: deadline || '',
    budget: Number(budget) || 0,
    documents: Array.isArray(documents) ? documents : [],
    createdAt: new Date().toISOString()
  };

  const projects = getAdminProjects();
  projects.unshift(project);
  saveAdminProjects(projects);
  logAudit({ action: 'project_create', projectId: project.id, source: 'client' });
  sendAdminNotification(`New client project: ${project.name}`);

  res.json(project);
});

app.patch('/api/client/projects/:id', (req, res) => {
  const { id } = req.params;
  const { email, phone, name, description, status, deadline, budget } = req.body || {};
  if (!email && !phone) return res.status(400).json({ error: 'email or phone is required' });

  const projects = getAdminProjects();
  const idx = projects.findIndex((project) => project.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const project = projects[idx];
  if (!canClientAccessProject({ project, email, phone })) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const updated = {
    ...project,
    name: name !== undefined ? String(name) : project.name,
    description: description !== undefined ? String(description) : project.description,
    status: status !== undefined ? String(status) : project.status,
    deadline: deadline !== undefined ? String(deadline) : project.deadline,
    budget: budget !== undefined ? Number(budget) || 0 : project.budget
  };

  projects[idx] = updated;
  saveAdminProjects(projects);
  logAudit({ action: 'project_update', projectId: id, source: 'client' });
  res.json(updated);
});

app.delete('/api/client/projects/:id', (req, res) => {
  const { id } = req.params;
  const { email, phone } = req.body || {};
  if (!email && !phone) return res.status(400).json({ error: 'email or phone is required' });

  const projects = getAdminProjects();
  const idx = projects.findIndex((project) => project.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const project = projects[idx];
  if (!canClientAccessProject({ project, email, phone })) {
    return res.status(403).json({ error: 'forbidden' });
  }

  projects.splice(idx, 1);
  saveAdminProjects(projects);
  logAudit({ action: 'project_delete', projectId: id, source: 'client' });
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();
  if (normalizedEmail !== ADMIN_EMAIL.toLowerCase() || normalizedPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const session = createAdminSession(normalizedEmail);
  logAudit({ action: 'admin_login', email: normalizedEmail });
  res.json({ token: session.token, expiresAt: session.expiresAt });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) {
    const sessions = pruneSessions(getAdminSessions()).filter((s) => s.token !== token);
    saveAdminSessions(sessions);
  }
  res.json({ ok: true });
});

app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  res.json(getAdminSettings());
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const current = getAdminSettings();
  const next = { ...current, ...(req.body || {}) };
  saveAdminSettings(next);
  logAudit({ action: 'admin_settings_update' });
  res.json(next);
});

app.get('/api/admin/clients', requireAdmin, (_req, res) => {
  res.json(getClients());
});

app.post('/api/admin/clients', requireAdmin, (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const client = {
    id: crypto.randomUUID(),
    name: String(name),
    email: String(email || ''),
    phone: normalizePhone(phone),
    createdAt: new Date().toISOString()
  };
  const clients = getClients();
  const next = [client, ...clients];
  saveClients(next);
  logAudit({ action: 'client_create', clientId: client.id });
  res.json(client);
});

app.patch('/api/admin/clients/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const clients = getClients();
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const updated = {
    ...clients[idx],
    ...req.body
  };
  clients[idx] = updated;
  saveClients(clients);
  logAudit({ action: 'client_update', clientId: id });
  res.json(updated);
});

app.delete('/api/admin/clients/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const clients = getClients();
  const next = clients.filter((c) => c.id !== id);
  if (next.length === clients.length) return res.status(404).json({ error: 'not found' });
  saveClients(next);
  logAudit({ action: 'client_delete', clientId: id });
  res.json({ ok: true });
});

app.get('/api/admin/projects', requireAdmin, (_req, res) => {
  res.json(getAdminProjects());
});

app.post('/api/admin/projects', requireAdmin, (req, res) => {
  const { name, clientId, status, description } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name is required' });
  const project = {
    id: crypto.randomUUID(),
    name: String(name),
    clientId: clientId || null,
    status: status || 'planning',
    description: description || '',
    documents: [],
    createdAt: new Date().toISOString()
  };
  const projects = getAdminProjects();
  const next = [project, ...projects];
  saveAdminProjects(next);
  logAudit({ action: 'project_create', projectId: project.id });
  res.json(project);
});

app.patch('/api/admin/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const projects = getAdminProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const updated = { ...projects[idx], ...req.body };
  projects[idx] = updated;
  saveAdminProjects(projects);
  logAudit({ action: 'project_update', projectId: id });
  res.json(updated);
});

app.delete('/api/admin/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const projects = getAdminProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) return res.status(404).json({ error: 'not found' });
  saveAdminProjects(next);
  logAudit({ action: 'project_delete', projectId: id });
  res.json({ ok: true });
});

app.get('/api/admin/invoices', requireAdmin, (_req, res) => {
  res.json(getInvoices());
});

app.get('/api/subscriptions', (req, res) => {
  const { email, phone } = req.query || {};
  const subs = getSubscriptions();
  if (!email && !phone) return res.json(subs);
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = String(phone || '').trim();
  const filtered = subs.filter((sub) => {
    if (normalizedEmail && String(sub.email || '').toLowerCase() === normalizedEmail) return true;
    return normalizedPhone && String(sub.phone || '') === normalizedPhone;
  });
  res.json(filtered);
});

app.post('/api/subscriptions/start', async (req, res) => {
  try {
    const { planId, provider, email, phone } = req.body || {};
    if (!planId) return res.status(400).json({ error: 'planId is required' });
    if (!provider || !['bpay', 'paypal'].includes(provider))
      return res.status(400).json({ error: 'provider must be bpay or paypal' });
    const subscription = createSubscriptionRecord({ planId, email, phone, provider });
    if (!subscription) return res.status(400).json({ error: 'Invalid subscription plan' });

    if (provider === 'bpay') {
      const { url, uuid } = await requestBpayInvoice({
        amountMDL: subscription.amountMDL,
        orderId: subscription.orderId,
        description: `Subscription ${subscription.title}`,
        email,
        phone
      });
      updateSubscriptionByOrderId(subscription.orderId, {
        bpayUuid: uuid,
        provider: 'bpay'
      });
      return res.json({ url, orderId: subscription.orderId });
    }

    return res.json({
      orderId: subscription.orderId,
      amountMDL: subscription.amountMDL,
      planId: subscription.planId
    });
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/admin/invoices', requireAdmin, (req, res) => {
  const { number, date, amount, status, clientId, projectId, projectName } = req.body || {};
  if (!number || !date || !amount) return res.status(400).json({ error: 'number, date, amount are required' });
  const invoice = {
    id: crypto.randomUUID(),
    number: String(number),
    date: String(date),
    amount: Number(amount),
    status: status || 'pending',
    clientId: clientId || null,
    projectId: projectId || null,
    projectName: projectName || ''
  };
  const invoices = getInvoices();
  const next = [invoice, ...invoices];
  saveInvoices(next);
  logAudit({ action: 'invoice_create', invoiceId: invoice.id });
  res.json(invoice);
});

app.patch('/api/admin/invoices/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const invoices = getInvoices();
  const idx = invoices.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const updated = { ...invoices[idx], ...req.body };
  invoices[idx] = updated;
  saveInvoices(invoices);
  logAudit({ action: 'invoice_update', invoiceId: id });
  res.json(updated);
});

app.delete('/api/admin/invoices/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const invoices = getInvoices();
  const next = invoices.filter((i) => i.id !== id);
  if (next.length === invoices.length) return res.status(404).json({ error: 'not found' });
  saveInvoices(next);
  logAudit({ action: 'invoice_delete', invoiceId: id });
  res.json({ ok: true });
});

app.get('/api/admin/audit', requireAdmin, (_req, res) => {
  res.json(getAuditLog());
});

app.post('/api/telegram/webhook', async (req, res) => {
  try {
    const update = req.body || {};
    const message = update.message || update.edited_message;
    if (!message) return res.json({ ok: true });

    const chatId = message.chat?.id;
    const contact = message.contact;
    const text = String(message.text || '').trim();
    const telegramMap = getTelegramMap();

    if (contact?.phone_number && chatId) {
      const phone = normalizePhone(contact.phone_number);
      telegramMap[phone] = {
        chatId,
        userId: contact.user_id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        username: message.from?.username || ''
      };
      saveTelegramMap(telegramMap);

      const statuses = getProjectStatuses();
      const projects = Object.values(statuses).filter((item) => item.phone === phone);
      const reply = `\u0422\u0435\u043b\u0435\u0444\u043e\u043d ${phone} \u043f\u0440\u0438\u0432\u044f\u0437\u0430\u043d.\n\n${formatProjectStatusMessage(projects)}`;
      await sendTelegramMessage(chatId, reply);
      return res.json({ ok: true });
    }

    if (text && chatId) {
      if (text.startsWith('/start')) {
        await sendTelegramMessage(
          chatId,
          '\u0427\u0442\u043e\u0431\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0442\u044c \u0441\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u043e\u0435\u043a\u0442\u0430, \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0447\u0435\u0440\u0435\u0437 \u043a\u043d\u043e\u043f\u043a\u0443 \u00ab\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043e\u043c\u00bb.'
        );
        return res.json({ ok: true });
      }
      if (text.startsWith('/phone')) {
        const raw = text.replace('/phone', '').trim();
        const phone = normalizePhone(raw);
        if (!phone || phone.length < 6) {
          await sendTelegramMessage(
            chatId,
            '\u041e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u043d\u043e\u043c\u0435\u0440 \u0432 \u0444\u043e\u0440\u043c\u0430\u0442\u0435 /phone +373XXXXXXXX'
          );
          return res.json({ ok: true });
        }
        telegramMap[phone] = {
          chatId,
          userId: message.from?.id,
          firstName: message.from?.first_name || '',
          lastName: message.from?.last_name || '',
          username: message.from?.username || ''
        };
        saveTelegramMap(telegramMap);
        const statuses = getProjectStatuses();
        const projects = Object.values(statuses).filter((item) => item.phone === phone);
        const reply = `\u0422\u0435\u043b\u0435\u0444\u043e\u043d ${phone} \u043f\u0440\u0438\u0432\u044f\u0437\u0430\u043d.\n\n${formatProjectStatusMessage(projects)}`;
        await sendTelegramMessage(chatId, reply);
        return res.json({ ok: true });
      }
      if (text.startsWith('/status')) {
        const statuses = getProjectStatuses();
        const phoneEntry = Object.entries(telegramMap).find(([, value]) => value.chatId === chatId);
        if (!phoneEntry) {
          await sendTelegramMessage(
            chatId,
            '\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u044c\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442 \u0447\u0435\u0440\u0435\u0437 \u043a\u043d\u043e\u043f\u043a\u0443 \u00ab\u041f\u043e\u0434\u0435\u043b\u0438\u0442\u044c\u0441\u044f \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u043e\u043c\u00bb.'
          );
          return res.json({ ok: true });
        }
        const [phone] = phoneEntry;
        const projects = Object.values(statuses).filter((item) => item.phone === phone);
        await sendTelegramMessage(chatId, formatProjectStatusMessage(projects));
        return res.json({ ok: true });
      }
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.json({ ok: true, error: String(error.message || error) });
  }
});

app.get('/api/projects/status', (req, res) => {
  const phone = normalizePhone(req.query.phone);
  if (!phone) return res.status(400).json({ error: 'phone is required' });
  const statuses = getProjectStatuses();
  const projects = Object.values(statuses).filter((item) => item.phone === phone);
  res.json({ projects });
});

app.post('/api/projects/status', requireAdmin, async (req, res) => {
  const { phone, projectId, projectName, status } = req.body || {};
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return res.status(400).json({ error: 'phone is required' });
  if (!projectId && !projectName) return res.status(400).json({ error: 'projectId or projectName is required' });
  if (!status) return res.status(400).json({ error: 'status is required' });

  const statuses = getProjectStatuses();
  const id = projectId || `${normalizedPhone}-${String(projectName).toLowerCase().replace(/\s+/g, '-')}`;
  const updatedAt = new Date().toISOString();
  statuses[id] = {
    id,
    name: projectName || id,
    status: String(status),
    phone: normalizedPhone,
    updatedAt
  };
  saveProjectStatuses(statuses);

  const telegramMap = getTelegramMap();
  const chatEntry = telegramMap[normalizedPhone];
  if (chatEntry?.chatId) {
    const message = `\u0421\u0442\u0430\u0442\u0443\u0441 \u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d:\n\u2022 ${statuses[id].name}: ${statuses[id].status}`;
    await sendTelegramMessage(chatEntry.chatId, message);
  }

  res.json({ ok: true, project: statuses[id] });
});

app.get('/api/rates/mdl-eur', async (_req, res) => {
  const rate = await getExchangeRate();
  res.json({ rate });
});

app.get('/api/rates/mdl', async (_req, res) => {
  const rates = await getExchangeRates(['EUR', 'USD', 'GBP', 'RON']);
  if (!rates) return res.status(500).json({ error: 'Rates not available' });
  res.json({ rates });
});

app.post('/api/bpay/create-invoice', async (req, res) => {
  try {
    const { amountMDL, orderId, description, email, phone } = req.body || {};
    const response = await requestBpayInvoice({ amountMDL, orderId, description, email, phone });
    updateInvoiceByOrderId(response.orderId, { bpayUuid: response.uuid });
    res.json({ url: response.url, orderId: response.orderId, uuid: response.uuid });
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/bpay/callback', (req, res) => {
  try {
    const { data, key } = req.body || {};
    if (!data || !key) {
      return res.status(400).json({ code: 30, text: 'Missing data or key' });
    }

    const config = getBpayConfig();
    const expectedKey = buildBpayCallbackKey(data, config.secretKey);
    if (String(key) !== expectedKey) {
      return res.status(400).json({ code: 30, text: 'Invalid signature' });
    }

    const payload = JSON.parse(Buffer.from(String(data), 'base64').toString('utf8'));
    const orderId = payload?.order_id;
    if (orderId && isPaymentSuccess(payload)) {
      const updated = updateInvoiceByOrderId(orderId, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        bpayUuid: payload?.uuid || undefined
      });
      if (updated) {
        logAudit({ action: 'invoice_paid', invoiceId: updated.id, provider: 'bpay' });
        sendAdminNotification(`BPay: invoice ${updated.number} paid.`);
      }
      const updatedSubscription = markSubscriptionPaid(orderId, 'bpay');
      if (updatedSubscription) {
        logAudit({ action: 'subscription_paid', subscriptionId: updatedSubscription.id, provider: 'bpay' });
      }
    }
    res.json({ code: 100, text: 'success', order_id: orderId });
  } catch (error) {
    res.status(500).json({ code: 30, text: String(error.message || error) });
  }
});

app.get('/api/bpay/pay-result/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });
    const invoices = getInvoices();
    const invoice = invoices.find(
      (inv) => String(inv.number) === String(orderId) || String(inv.id) === String(orderId)
    );
    if (!invoice?.bpayUuid) {
      return res.status(404).json({ error: 'BPay uuid not found for invoice' });
    }
    const config = getBpayConfig();
    const apiRes = await fetch(`${BPAY_API_BASE}/api/pay-result/${config.merchantId}/${invoice.bpayUuid}`);
    const data = await apiRes.json().catch(() => null);
    if (!apiRes.ok) {
      return res.status(500).json({ error: data || 'BPay pay-result request failed' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amountMDL, invoiceNumber } = req.body;
    if (!amountMDL || Number(amountMDL) <= 0) {
      return res.status(400).json({ error: 'amountMDL is required' });
    }
    const rate = await getExchangeRate();
    const amountEUR = (Number(amountMDL) * rate).toFixed(2);
    const token = await getPayPalAccessToken();

    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: amountEUR
            },
            custom_id: invoiceNumber || undefined,
            invoice_id: invoiceNumber || undefined
          }
        ]
      })
    });

    if (!orderRes.ok) {
      const text = await orderRes.text();
      return res.status(500).json({ error: text });
    }

    const order = await orderRes.json();
    res.json({ id: order.id, amountEUR, rate });
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId, invoiceNumber } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }
    const token = await getPayPalAccessToken();
    const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await captureRes.json();
    if (!captureRes.ok) {
      return res.status(500).json({ error: data });
    }
    const status = String(data.status || '').toUpperCase();
    const customId =
      data?.purchase_units?.[0]?.custom_id || data?.purchase_units?.[0]?.invoice_id || invoiceNumber;
    if (status === 'COMPLETED' && customId) {
      const updated = updateInvoiceByOrderId(customId, { status: 'paid', paidAt: new Date().toISOString() });
      if (updated) {
        logAudit({ action: 'invoice_paid', invoiceId: updated.id, provider: 'paypal' });
        sendAdminNotification(`PayPal: invoice ${updated.number} paid.`);
      }
      const updatedSubscription = markSubscriptionPaid(customId, 'paypal');
      if (updatedSubscription) {
        logAudit({ action: 'subscription_paid', subscriptionId: updatedSubscription.id, provider: 'paypal' });
      }
    }
    res.json({ status: data.status, id: data.id });
  } catch (error) {
    res.status(500).json({ error: String(error.message || error) });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});


