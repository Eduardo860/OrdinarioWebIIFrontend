    // src/pages/Dashboard.jsx
    import React, { useEffect, useState } from 'react';
    import CotizacionCard from '../components/CotizacionCard';
    import '../styles/Dashboard.css'

    export default function Dashboard({ user }) {
    const [totales, setTotales] = useState({ cotizaciones: 0, productos: 0, clientes: 0 });
    const [ultimasCotizaciones, setUltimasCotizaciones] = useState([]);

    useEffect(() => {
        const fetchTotales = async () => {
        try {
            const [cot, prod, cli] = await Promise.all([
            fetch('http://localhost:8000/api/cotizaciones/count/').then(r => r.json()),
            fetch('http://localhost:8000/api/productos/count/').then(r => r.json()),
            fetch('http://localhost:8000/api/clientes/count/').then(r => r.json()),
            ]);
            setTotales({ cotizaciones: cot.total, productos: prod.total, clientes: cli.total });
        } catch (error) {
            console.error('Error al obtener totales:', error);
        }
        };

        const fetchUltimasCotizaciones = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/cotizaciones/ultimas/');
            const data = await res.json();
            setUltimasCotizaciones(data);
        } catch (error) {
            console.error('Error al obtener últimas cotizaciones:', error);
        }
        };

        fetchTotales();
        fetchUltimasCotizaciones();
    }, []);

    return (
        <div className="dashboard-container">
        <h1 className="dashboard-title">Panel Principal</h1>
        <p className="dashboard-welcome">Bienvenido, {user.nombre}</p>

        {/* Totales */}
        <div className="dashboard-totales">
            {['cotizaciones','productos','clientes'].map((key) => (
            <div key={key} className="dashboard-total-card">
                <h3 className="dashboard-total-title">{key}</h3>
                <p className="dashboard-total-number">{totales[key]}</p>
            </div>
            ))}
        </div>

        <div>
            <h2 className="dashboard-subtitle">Últimas Cotizaciones</h2>
            {ultimasCotizaciones.length === 0 ? (
            <p>No hay cotizaciones recientes.</p>
            ) : (
            <div className="dashboard-cotizaciones-grid">
                {ultimasCotizaciones.map(cot => (
                <CotizacionCard key={cot.id} cot={cot} />
                ))}
            </div>
            )}
        </div>
        </div>
    );
    }
