import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { useI18n } from './shared/i18n';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      localStorage.setItem(
        'portalpixel_client_profile',
        JSON.stringify({ email: email.trim() })
      );
    } catch {
      // Ignore storage errors.
    }
    navigate('/client');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <LogIn size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {t({ ru: '\u0412\u0445\u043e\u0434 \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Client login', ro: 'Autentificare client' })}
              </h1>
              <p className="text-sm text-gray-500">
                {t({
                  ru: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0434\u043b\u044f \u0432\u0445\u043e\u0434\u0430',
                  en: 'Enter your login details',
                  ro: 'Introduceti datele de autentificare'
                })}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              {t({ ru: 'Email', en: 'Email', ro: 'Email' })}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            {t({ ru: '\u0412\u043e\u0439\u0442\u0438', en: 'Sign in', ro: 'Autentifica-te' })}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/register" className="text-purple-600 hover:underline">
            {t({ ru: '\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0430', en: 'Client registration', ro: 'Inregistrare client' })}
          </Link>
          <Link to="/login/admin" className="text-gray-500 hover:underline">
            {t({ ru: '\u0412\u0445\u043e\u0434 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430', en: 'Admin login', ro: 'Autentificare admin' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
