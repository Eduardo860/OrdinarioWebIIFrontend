    // src/components/Navbar.jsx
    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import '../styles/Navbar.css'

    export default function Navbar({ onLogout }) {
    return (
        <nav className="navbar">
        <div className="navbar-left">
            <span className="navbar-brand">Pixova Light</span>
            <NavLink to="/" className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            Dashboard
            </NavLink>
            <NavLink to="/cotizaciones" className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            Cotizaciones
            </NavLink>
            <NavLink to="/clientes" className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            Clientes
            </NavLink>
            <NavLink to="/productos" className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            Productos
            </NavLink>
            <NavLink to="/salones" className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>
            Salones
            </NavLink>
        </div>
        <button onClick={onLogout} className="button-logout">
            Cerrar sesión
        </button>
        </nav>
    );
    }
