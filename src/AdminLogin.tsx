import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { useI18n } from './shared/i18n';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          t({
            ru: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 email \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c',
            en: 'Invalid email or password',
            ro: 'Email sau parola incorecta'
          })
        );
        return;
      }
      if (data?.token) {
        localStorage.setItem('portalpixel_admin_token', data.token);
        if (data.expiresAt) {
          localStorage.setItem('portalpixel_admin_expires', data.expiresAt);
        }
      }
      setError('');
      navigate('/admin');
    } catch {
      setError(
        t({
          ru: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 email \u0438\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c',
          en: 'Invalid email or password',
          ro: 'Email sau parola incorecta'
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t({ ru: '\u0412\u0445\u043e\u0434 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430', en: 'Admin login', ro: 'Autentificare administrator' })}
              </h1>
              <p className="text-sm text-gray-500">
                {t({
                  ru: '\u0422\u043e\u043b\u044c\u043a\u043e \u0434\u043b\u044f \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0430',
                  en: 'Staff access only',
                  ro: 'Acces doar pentru personal'
                })}
              </p>
            </div>
          </div>
          <LanguageSwitcher className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t({ ru: 'Email', en: 'Email', ro: 'Email' })}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {t({ ru: '\u041f\u0430\u0440\u043e\u043b\u044c', en: 'Password', ro: 'Parola' })}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="w-full bg-gray-900 text-white px-6 py-2 rounded-lg">
            {t({ ru: '\u0412\u043e\u0439\u0442\u0438', en: 'Sign in', ro: 'Autentifica-te' })}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/login/client" className="text-gray-600 hover:underline">
            {t({ ru: '\u0412\u0445\u043e\u0434 \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Client login', ro: 'Autentificare client' })}
          </Link>
          <Link to="/register" className="text-gray-500 hover:underline">
            {t({ ru: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Client registration', ro: 'Inregistrare client' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
