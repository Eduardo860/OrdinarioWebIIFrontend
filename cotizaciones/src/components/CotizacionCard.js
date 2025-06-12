// src/components/CotizacionCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CotizacionCard({ cot }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cotizaciones/${cot.id}`); // asume que tendrás una ruta así
    };

    const monto = parseFloat(cot.monto_total) || 0;

    return (
        <div
            onClick={handleClick}
            style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                width: '200px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}
        >
            <strong>ID: {cot.id}</strong>
            <span><strong>Fecha:</strong> {cot.fecha}</span>
            <span><strong>Cliente:</strong> {cot.cliente_nombre}</span>
            <span><strong>Monto:</strong> ${monto.toFixed(2)}</span>
        </div>
    );
}
