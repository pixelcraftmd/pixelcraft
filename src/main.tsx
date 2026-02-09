import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './shared/i18n';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
