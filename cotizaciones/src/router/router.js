    import React from 'react';
    import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

    import Navbar from '../components/Navbar';
    import Login from '../components/Login';
    import Dashboard from '../pages/Dashboard';
    import Cotizaciones from '../pages/Cotizaciones';       
    import CotizacionDetalle from '../pages/CotizacionDetalle';
    import GestionClientes from '../pages/GestionClientes'
    import GestionProductos from '../pages/GestionProductos';
    import GestionSalones from '../pages/GestionSalones';

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

    +           {/* Gestión de cotizaciones */}
    +           <Route path="/cotizaciones" element={<Cotizaciones />} />

                {/* Detalle de cotización */}
                <Route path="/cotizaciones/:id" element={<CotizacionDetalle />} />

                {/* Gestión de clientes */}
                <Route path="/clientes" element={<GestionClientes />} />

                {/* Gestión de productos */}
                <Route path="/productos" element={<GestionProductos />} />

                {/* Gestión de Salones */}
                <Route path="/salones" element={<GestionSalones />} />


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