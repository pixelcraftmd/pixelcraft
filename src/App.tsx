import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ClientDashboard from './ClientDashboard';
import AdminDashboard from './AdminDashboard';
import ClientRegistration from './ClientRegistration';
import ClientLogin from './ClientLogin';
import AdminLogin from './AdminLogin';

export default function App() {
  return (
    <BrowserRouter basename="/cabinet">
      <Routes>
        <Route path="/" element={<Navigate to="/login/client" replace />} />
        <Route path="/login/client" element={<ClientLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<ClientRegistration />} />
        <Route path="*" element={<Navigate to="/login/client" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

