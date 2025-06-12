    // src/components/CotizacionCard.jsx
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import '../styles/CotizacionCard.css'

    export default function CotizacionCard({ cot }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/cotizaciones/${cot.id}`);
    };

    const monto = parseFloat(cot.monto_total) || 0;

    return (
        <div onClick={handleClick} className="cotizacion-card">
        <strong>Cotización #{cot.id}</strong>
        <span><strong>Fecha:</strong> {cot.fecha}</span>
        <span><strong>Cliente:</strong> {cot.cliente_nombre}</span>
        <span><strong>Monto:</strong> ${monto.toFixed(2)}</span>
        </div>
    );
    }
