// src/router/router.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import CotizacionDetalle from '../pages/CotizacionDetalle';  // aquí importas tu page

export default function AppRouter({
  isLoggedIn,
  currentUser,
  handleLogin,
  handleLogout
}) {
  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <>
          <Navbar onLogout={handleLogout} />
          <Routes>
            {/* Panel */}
            <Route path="/" element={<Dashboard user={currentUser} />} />

            {/* Detalle de cotización */}
            <Route path="/cotizaciones/:id" element={<CotizacionDetalle />} />

            {/* Resto de rutas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
