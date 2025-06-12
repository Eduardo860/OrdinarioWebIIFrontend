// src/pages/Dashboard.jsx
import React from 'react';

export default function Dashboard({ user }) {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Panel Principal</h1>
            {user ? (
                <p>Bienvenido, {user.nombre}</p>
            ) : (
                <p>Cargando usuario...</p>
            )}
        </div>
    );
}
