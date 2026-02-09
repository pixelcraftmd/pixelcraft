import React from 'react';
import { useI18n, type Lang } from './i18n';

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ro', label: 'Română' },
  { value: 'ru', label: 'Русский' }
];

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value as Lang)}
      className={
        className ||
        'px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
      }
      aria-label="Language"
    >
      {LANG_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
