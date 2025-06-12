    // src/pages/GestionSalones.jsx
    import React, { useState, useEffect } from 'react';
    import '../styles/GestionSalones.css'

    export default function GestionSalones() {
    const [salones, setSalones] = useState([]);
    const [form, setForm] = useState({
        nombre: '',
        direccion: '',
        capacidad: ''
    });
    const [salonEditando, setSalonEditando] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carga inicial
    useEffect(() => {
        fetchSalones();
    }, []);

    const fetchSalones = async () => {
        setLoading(true);
        try {
        const res = await fetch('http://localhost:8000/api/cotizaciones/salones/');
        const data = await res.json();
        setSalones(data);
        } catch (err) {
        console.error('Error al cargar salones:', err);
        } finally {
        setLoading(false);
        }
    };

    const handleFormChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submitForm = async e => {
        e.preventDefault();
        const payload = {
        ...(form.nombre && { nombre: form.nombre }),
        ...(form.direccion && { direccion: form.direccion }),
        ...(form.capacidad && { capacidad: parseInt(form.capacidad, 10) }),
        ...(salonEditando
            ? { usuario_actualizacion: 'dev2' }
            : { usuario_creacion: 'dev' })
        };

        const url = salonEditando
        ? `http://localhost:8000/api/cotizaciones/salones/${salonEditando.id}/`
        : 'http://localhost:8000/api/cotizaciones/salones/';

        const method = salonEditando ? 'PATCH' : 'POST';

        try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        await fetchSalones();
        setForm({ nombre: '', direccion: '', capacidad: '' });
        setSalonEditando(null);
        alert(salonEditando ? 'Salón actualizado ✅' : 'Salón creado ✅');
        } catch (err) {
        console.error('Error al guardar salón:', err);
        alert('Error al guardar salón: ' + err.message);
        }
    };

    const editarSalon = salon => {
        setSalonEditando(salon);
        setForm({
        nombre: salon.nombre || '',
        direccion: salon.direccion || '',
        capacidad: salon.capacidad?.toString() || ''
        });
    };

    const cancelarEdicion = () => {
        setSalonEditando(null);
        setForm({ nombre: '', direccion: '', capacidad: '' });
    };

    const eliminarSalon = async id => {
        if (!window.confirm('¿Seguro que deseas eliminar este salón?')) return;

        try {
        const res = await fetch(`http://localhost:8000/api/cotizaciones/salones/${id}/`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        setSalones(prev => prev.filter(s => s.id !== id));
        alert(data.mensaje);
        } catch (err) {
        console.error('Error al eliminar salón:', err);
        alert('Error al eliminar salón: ' + err.message);
        }
    };

    if (loading) return <p>Cargando salones…</p>;

    return (
    <div className="salones-container">
        <h1 className="salones-title">Gestión de Salones</h1>

        <form onSubmit={submitForm} className="salones-form">
        <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleFormChange}
            required
        />
        <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleFormChange}
            required
        />
        <input
            type="number"
            name="capacidad"
            placeholder="Capacidad"
            value={form.capacidad}
            onChange={handleFormChange}
            required
        />
        <button type="submit">
            {salonEditando ? 'Actualizar salón' : 'Guardar salón'}
        </button>
        {salonEditando && (
            <button
            type="button"
            onClick={cancelarEdicion}
            className="button-cancel"
            >
            Cancelar edición
            </button>
        )}
        </form>

        <div className="salones-grid">
        {salones.map(s => (
            <div key={s.id} className="salones-card">
            <h3>{s.nombre}</h3>
            <p><strong>Dirección:</strong> {s.direccion}</p>
            <p><strong>Capacidad:</strong> {s.capacidad}</p>
            <div className="salones-buttons">
                <button onClick={() => editarSalon(s)}>Editar</button>
                <button onClick={() => eliminarSalon(s.id)}>Eliminar</button>
            </div>
            </div>
        ))}
        </div>
    </div>
    );
        
    }
