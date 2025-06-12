    // src/pages/CotizacionDetalle.jsx
    import React, { useEffect, useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import DetalleItemCard from '../components/DetalleItemCard';
    import '../styles/CotizacionDetalle.css';

    export default function CotizacionDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cabecera, setCabecera] = useState(null);
    const [lineas, setLineas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editNotas, setEditNotas] = useState('');

    useEffect(() => {
        const fetchDetalle = async () => {
        try {
            const resCab = await fetch(`http://localhost:8000/api/cotizaciones/${id}/`);
            if (!resCab.ok) throw new Error(`Cabecera HTTP ${resCab.status}`);
            const dataCab = await resCab.json();
            setCabecera(dataCab);
            setEditNotas(dataCab.notas || '');

            const resLin = await fetch(`http://localhost:8000/api/cotizaciones/detalle-cotizacion/?id_cotizacion=${id}`);
            if (!resLin.ok) throw new Error(`Líneas HTTP ${resLin.status}`);
            const dataLin = await resLin.json();
            setLineas(dataLin);
        } catch (err) {
            console.error('Error al cargar detalle:', err);
            setError('No se pudo cargar la cotización.');
        } finally {
            setLoading(false);
        }
        };

        fetchDetalle();
    }, [id]);

    const handleUpdateNotas = async () => {
        try {
        const res = await fetch(`http://localhost:8000/api/cotizaciones/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            notas: editNotas,
            usuario_actualizacion: 'dev2'
            })
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        setCabecera(prev => ({ ...prev, notas: editNotas }));
        alert('Notas actualizadas ✅');
        } catch (err) {
        console.error('Error al actualizar notas:', err);
        alert('Error al actualizar notas: ' + err.message);
        }
    };

    const handleDeleteCotizacion = async () => {
        if (!window.confirm('¿Seguro que deseas eliminar esta cotización?')) return;

        try {
        const res = await fetch(`http://localhost:8000/api/cotizaciones/${id}/`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        alert(data.mensaje);
        navigate('/cotizaciones');
        } catch (err) {
        console.error('Error al eliminar cotización:', err);
        alert('Error al eliminar cotización: ' + err.message);
        }
    };

    if (loading) return <p>Cargando cotización…</p>;
    if (error) return <p>{error}</p>;

    const montoTotal = parseFloat(cabecera.monto_total) || 0;

    return (
        <div className="cotizacion-detalle-container">
        <h1 className="cotizacion-detalle-title">Detalle de Cotización #{cabecera.id}</h1>

        <div className="cotizacion-detalle-info">
            <p><strong>Fecha:</strong> {cabecera.fecha}</p>
            <p><strong>Cliente:</strong> {cabecera.cliente_nombre}</p>
            <p><strong>Salón:</strong> {cabecera.salon_nombre}</p>
            <p><strong>Estatus:</strong> {cabecera.estatus_nombre}</p>
            <p><strong>Método de Pago:</strong> {cabecera.metodo_pago_nombre}</p>
            <p><strong>Total:</strong> ${montoTotal.toFixed(2)}</p>
            <div className="cotizacion-notas-edit">
            <label><strong>Notas:</strong></label>
            <textarea
                value={editNotas}
                onChange={e => setEditNotas(e.target.value)}
                rows="3"
            ></textarea>
            <button onClick={handleUpdateNotas}>Guardar Notas</button>
            </div>
            <button className="button-cancel" onClick={handleDeleteCotizacion}>Eliminar cotización</button>
        </div>

        <h2 className="cotizacion-detalle-subtitle">Ítems</h2>
        {lineas.length === 0 ? (
            <p>No hay ítems en esta cotización.</p>
        ) : (
            <div className="cotizacion-detalle-items-grid">
            {lineas.map(item => (
                <DetalleItemCard key={item.id} item={item} />
            ))}
            </div>
        )}
        </div>
    );
    }
