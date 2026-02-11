import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './shared/LanguageSwitcher';
import { useI18n } from './shared/i18n';

export default function ClientRegistration() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    // Validation
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    try {
      localStorage.setItem('portalpixel_client_profile', JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company
      }));
    } catch {
      // Ignore storage errors.
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t({ ru: 'Регистрация клиента', en: 'Client registration', ro: 'Înregistrare client' })}</h1>
            <p className="text-gray-500 mt-1">
              {t({
                ru: 'Создайте учетную запись для доступа к панели',
                en: 'Create an account to access the dashboard',
                ro: 'Creați un cont pentru acces la panou'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/client" className="text-sm text-purple-600 hover:underline">
              {t({ ru: 'Вернуться на панель', en: 'Back to dashboard', ro: 'Înapoi la panou' })}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-12 text-green-600">
            <UserPlus size={48} className="mx-auto mb-4" />
            <p className="text-lg font-medium">Заявка отправлена</p>
            <p className="text-sm mt-2 text-gray-500">Мы свяжемся с вами для подтверждения</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Имя</label>
              <input
                type="text"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Фамилия</label>
              <input
                type="text"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Телефон</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-1">Компания</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Пароль</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Подтверждение пароля</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
            {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
              <div className="col-span-2 text-sm text-red-600">Пароли не совпадают</div>
            )}
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg"
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
