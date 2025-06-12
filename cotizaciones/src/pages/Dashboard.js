// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import CotizacionCard from '../components/CotizacionCard';

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
        <div style={{ padding: '20px' }}>
            <h1>Panel Principal</h1>
            <p>Bienvenido, {user.nombre}</p>

            {/* Totales */}
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                {['cotizaciones','productos','clientes'].map((key) => (
                    <div
                        key={key}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '16px',
                            flex: 1,
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3 style={{ textTransform: 'capitalize' }}>{key}</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totales[key]}</p>
                    </div>
                ))}
            </div>

            {/* Tarjetas de últimas cotizaciones */}
            <div>
                <h2>Últimas Cotizaciones</h2>
                {ultimasCotizaciones.length === 0 ? (
                    <p>No hay cotizaciones recientes.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '16px'
                    }}>
                        {ultimasCotizaciones.map(cot => (
                            <CotizacionCard key={cot.id} cot={cot} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
