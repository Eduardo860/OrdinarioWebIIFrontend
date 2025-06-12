// src/pages/CotizacionDetalle.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function CotizacionDetalle() {
  const { id } = useParams();
  const [cotizacion, setCotizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/api/cotizaciones/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            // si tu API exige token para este endpoint:
            'Authorization': 'Bearer ' + token
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCotizacion(data);
      } catch (err) {
        console.error('Error al obtener detalle:', err);
        setError('No se pudo cargar la cotización.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id]);

  if (loading) return <p>Cargando detalle...</p>;
  if (error)   return <p>{error}</p>;

  // parse monto_total (viene como string)
  const monto = parseFloat(cotizacion.monto_total) || 0;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Detalle de Cotización #{cotizacion.id}</h1>

      <div style={{ margin: '20px 0', lineHeight: 1.6 }}>
        <p><strong>Fecha:</strong> {cotizacion.fecha}</p>
        <p><strong>Cliente:</strong> {cotizacion.cliente_nombre}</p>
        <p><strong>Salón:</strong> {cotizacion.salon_nombre}</p>
        <p><strong>Estatus:</strong> {cotizacion.estatus_nombre}</p>
        <p><strong>Método de Pago:</strong> {cotizacion.metodo_pago_nombre}</p>
        <p><strong>Monto Total:</strong> ${monto.toFixed(2)}</p>
        <p><strong>Notas:</strong> {cotizacion.notas}</p>
      </div>

      {/* Aquí podrías agregar botones de acción, por ejemplo: */}
      {/* <button onClick={() => editarCotizacion(cotizacion.id)}>Editar</button> */}
      {/* <button onClick={() => imprimirCotizacion(cotizacion.id)}>Imprimir</button> */}
    </div>
  );
}
