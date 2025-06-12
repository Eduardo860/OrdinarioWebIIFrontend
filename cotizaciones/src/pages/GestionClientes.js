    // src/pages/GestionClientes.jsx
    import React, { useState, useEffect } from 'react';
    import '../styles/GestionClientes.css';

    export default function GestionClientes() {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({
        nombre_contacto: '',
        correo: '',
        telefono: ''
    });
    const [clienteEditando, setClienteEditando] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);
        try {
        const res = await fetch('http://localhost:8000/api/clientes/');
        const data = await res.json();
        setClientes(data);
        } catch (err) {
        console.error('Error al cargar clientes:', err);
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
        nombre_contacto: form.nombre_contacto,
        correo: form.correo,
        telefono: form.telefono,
        ...(clienteEditando
            ? { usuario_actualizacion: 'dev2' }
            : { usuario_creacion: 'dev' })
        };

        try {
        const url = clienteEditando
            ? `http://localhost:8000/api/clientes/${clienteEditando.id}/`
            : 'http://localhost:8000/api/clientes/';

        const method = clienteEditando ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        if (clienteEditando) {
            setClientes(prev =>
            prev.map(c => (c.id === clienteEditando.id ? data : c))
            );
            alert('Cliente actualizado ✅');
        } else {
            setClientes(prev => [data, ...prev]);
            alert('Cliente creado ✅');
        }

        setForm({ nombre_contacto: '', correo: '', telefono: '' });
        setClienteEditando(null);
        } catch (err) {
        console.error('Error al guardar cliente:', err);
        alert('Error al guardar cliente: ' + err.message);
        }
    };

    const eliminarCliente = async id => {
        if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return;

        try {
        const res = await fetch(`http://localhost:8000/api/clientes/${id}/`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        setClientes(prev => prev.filter(c => c.id !== id));
        alert(data.mensaje);
        } catch (err) {
        console.error('Error al eliminar cliente:', err);
        alert('Error al eliminar cliente: ' + err.message);
        }
    };

    const editarCliente = cliente => {
        setClienteEditando(cliente);
        setForm({
        nombre_contacto: cliente.nombre_contacto,
        correo: cliente.correo,
        telefono: cliente.telefono
        });
    };

    const cancelarEdicion = () => {
        setClienteEditando(null);
        setForm({ nombre_contacto: '', correo: '', telefono: '' });
    };

    if (loading) return <p>Cargando clientes…</p>;

    return (
        <div className="clientes-container">
        <h1 className="clientes-title">Gestión de Clientes</h1>

        <form onSubmit={submitForm} className="clientes-form">
            <input
            type="text"
            name="nombre_contacto"
            placeholder="Nombre contacto"
            value={form.nombre_contacto}
            onChange={handleFormChange}
            required
            />
            <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleFormChange}
            required
            />
            <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleFormChange}
            required
            />
            <button type="submit" className="button-primary">
            {clienteEditando ? 'Actualizar cliente' : 'Guardar cliente'}
            </button>
            {clienteEditando && (
            <button
                type="button"
                onClick={cancelarEdicion}
                className="button-cancel"
            >
                Cancelar edición
            </button>
            )}
        </form>

        <div className="clientes-grid">
            {clientes.map(c => (
            <div key={c.id} className="clientes-card">
                <h3>{c.nombre_contacto}</h3>
                <p>
                <strong>Correo:</strong> {c.correo}
                </p>
                <p>
                <strong>Teléfono:</strong> {c.telefono}
                </p>
                <div className="clientes-buttons">
                <button onClick={() => editarCliente(c)}>Editar</button>
                <button onClick={() => eliminarCliente(c.id)}>Eliminar</button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }
