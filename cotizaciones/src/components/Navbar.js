// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ onLogout }) {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#333', color: '#fff' }}>
            <div>Mi App</div>
            <div>
                <button onClick={onLogout} style={{ background: '#555', color: '#fff', border: 'none', padding: '5px 10px' }}>
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}
