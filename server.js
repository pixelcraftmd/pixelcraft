require('./env-loader');

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const CABINET_DIR = path.join(PUBLIC_DIR, 'cabinet');
const API_TARGET = process.env.API_TARGET || 'http://127.0.0.1:8080';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeTg(str) {
  return String(str).replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function sendTelegram(name, email, message) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) return;

  const text =
    '*PixelCraft*\\n\\n' +
    `*\u0418\u043c\u044f:* ${escapeTg(name)}\\n` +
    `*Email:* ${escapeTg(email)}\\n` +
    `*\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435:*\\n${escapeTg(message)}`;

  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT,
    text,
    parse_mode: 'MarkdownV2'
  });

  return new Promise(resolve => {
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      },
      res => {
        let d = '';
        res.on('data', c => (d += c));
        res.on('end', () => {
          console.log('[Telegram]', res.statusCode === 200 ? 'ok' : `error ${d}`);
          resolve(res.statusCode === 200);
        });
      }
    );
    req.on('error', e => {
      console.error('[Telegram] error:', e.message);
      resolve(false);
    });
    req.write(body);
    req.end();
  });
}

async function sendEmail(name, email, message) {
  if (!SMTP_HOST || !SMTP_USER || !NOTIFY_EMAIL) return;

  try {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    await transport.sendMail({
      from: `"PixelCraft" <${SMTP_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `[PixelCraft] \u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442 ${name}`,
      html:
        `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">` +
        `<h2 style="color:#6366f1;margin-top:0;">\u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430</h2>` +
        `<table style="width:100%;border-collapse:collapse;">` +
        `<tr><td style="padding:8px 0;font-weight:600;color:#64748b;width:80px;">\u0418\u043c\u044f</td>` +
        `<td style="padding:8px 0;">${escapeHtml(name)}</td></tr>` +
        `<tr><td style="padding:8px 0;font-weight:600;color:#64748b;">Email</td>` +
        `<td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#6366f1;">${escapeHtml(email)}</a></td></tr>` +
        `</table>` +
        `<div style="margin-top:16px;">` +
        `<p style="font-weight:600;color:#64748b;margin-bottom:6px;">\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435:</p>` +
        `<div style="background:#f1f5f9;border-left:3px solid #6366f1;padding:12px 16px;border-radius:0 8px 8px 0;white-space:pre-wrap;">${escapeHtml(message)}</div>` +
        `</div>` +
        `<p style="margin-top:24px;color:#94a3b8;font-size:12px;">PixelCraft</p>` +
        `</div>`
    });

    console.log('[Email] sent to', NOTIFY_EMAIL);
  } catch (e) {
    console.error('[Email] error:', e.message);
  }
}

async function handleContact(req, res) {
  let body;
  try {
    body = JSON.parse(await readBody(req));
  } catch {
    return jsonRes(res, 400, { ok: false, error: '\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441' });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || name.length < 2)
    return jsonRes(res, 400, { ok: false, error: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f (\u043c\u0438\u043d\u0438\u043c\u0443\u043c 2 \u0441\u0438\u043c\u0432\u043e\u043b\u0430)' });
  if (!isValidEmail(email))
    return jsonRes(res, 400, { ok: false, error: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 email' });
  if (!message || message.length < 10)
    return jsonRes(res, 400, { ok: false, error: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u043a\u043e\u0440\u043e\u0442\u043a\u043e\u0435 (\u043c\u0438\u043d\u0438\u043c\u0443\u043c 10 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432)' });
  if (message.length > 2000)
    return jsonRes(res, 400, { ok: false, error: '\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u0434\u043b\u0438\u043d\u043d\u043e\u0435 (\u043c\u0430\u043a\u0441\u0438\u043c\u0443\u043c 2000 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432)' });

  await Promise.all([sendTelegram(name, email, message), sendEmail(name, email, message)]);

  return jsonRes(res, 200, { ok: true });
}

function jsonRes(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    res.writeHead(500);
    res.end();
  });
}

function proxyApi(req, res) {
  const targetUrl = new URL(API_TARGET);
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port || 80,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', err => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Bad Gateway: ${err.message}`);
  });

  req.pipe(proxyReq, { end: true });
}

function serveSpa(req, res, baseDir, urlPath) {
  let pathname = urlPath;
  if (!pathname || pathname === '/') pathname = '/index.html';

  const fullPath = path.resolve(baseDir, pathname.slice(1));
  if (!fullPath.startsWith(baseDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return serveFile(res, path.join(baseDir, 'index.html'));
    }
    serveFile(res, fullPath);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/api/contact' && req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return handleContact(req, res);
  }
  if (req.method === 'OPTIONS' && pathname === '/api/contact') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    return proxyApi(req, res);
  }

  if (pathname.startsWith('/cabinet')) {
    if (!fs.existsSync(CABINET_DIR)) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Cabinet build not found.');
    }
    const cabinetPath = pathname.replace(/^\/cabinet/, '') || '/';
    return serveSpa(req, res, CABINET_DIR, cabinetPath);
  }

  if (pathname === '/') {
    return serveSpa(req, res, PUBLIC_DIR, '/');
  }

  return serveSpa(req, res, PUBLIC_DIR, pathname);
});

server.listen(PORT, () => {
  console.log('------------------------------------------');
  console.log('PixelCraft server started');
  console.log(`PORT: ${PORT}`);
  console.log(`Telegram: ${TELEGRAM_TOKEN ? 'enabled' : 'disabled'}`);
  console.log(`Email: ${SMTP_HOST ? 'enabled' : 'disabled'}`);
  console.log('------------------------------------------');
});
