    // src/pages/Cotizaciones.jsx
    import React, { useState, useEffect } from 'react';
    import CotizacionCard from '../components/CotizacionCard';
    import '../styles/Cotizaciones.css';

    export default function Cotizaciones() {
    const [allCotizaciones, setAllCotizaciones] = useState([]);
    const [cotizaciones, setCotizaciones] = useState([]);
    const [catalogos, setCatalogos] = useState({
        clientes: [], salones: [], estatus: [], metodosPago: [], productos: []
    });
    const [filtros, setFiltros] = useState({
        id_cliente: '', id_salon: '', id_estatus: '', fecha: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        id_cliente: '', id_salon: '', id_estatus: '',
        id_metodo_pago: '', fecha: '', notas: '', productos: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
        try {
            const [
            cotRes, cliRes, salRes,
            estRes, metRes, prodRes
            ] = await Promise.all([
            fetch('http://localhost:8000/api/cotizaciones/').then(r => r.json()),
            fetch('http://localhost:8000/api/clientes/').then(r => r.json()),
            fetch('http://localhost:8000/api/cotizaciones/salones/').then(r => r.json()),
            fetch('http://localhost:8000/api/cotizaciones/estatus-cotizacion/').then(r => r.json()),
            fetch('http://localhost:8000/api/cotizaciones/metodos-pago/').then(r => r.json()),
            fetch('http://localhost:8000/api/productos/').then(r => r.json()),
            ]);
            setAllCotizaciones(cotRes);
            setCotizaciones(cotRes);
            setCatalogos({
            clientes: cliRes,
            salones: salRes,
            estatus: estRes,
            metodosPago: metRes,
            productos: prodRes
            });
        } catch (err) {
            console.error('Error cargando datos:', err);
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    const aplicarFiltros = () => {
        let lista = allCotizaciones;
        if (filtros.id_cliente) {
        const sel = catalogos.clientes.find(c => c.id.toString() === filtros.id_cliente);
        if (sel) lista = lista.filter(c => c.cliente_nombre === sel.nombre_contacto);
        }
        if (filtros.id_salon) {
        const sel = catalogos.salones.find(s => s.id.toString() === filtros.id_salon);
        if (sel) lista = lista.filter(c => c.salon_nombre === sel.nombre);
        }
        if (filtros.id_estatus) {
        const sel = catalogos.estatus.find(e => e.id.toString() === filtros.id_estatus);
        if (sel) lista = lista.filter(c => c.estatus_nombre === sel.nombre);
        }
        if (filtros.fecha) {
        lista = lista.filter(c => c.fecha === filtros.fecha);
        }
        setCotizaciones(lista);
    };

    const handleFiltroChange = e => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const toggleForm = () => setShowForm(prev => !prev);

    const handleFormChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProductoChange = (idx, field, value) => {
        setForm(prev => {
        const copia = [...prev.productos];
        copia[idx] = {
            ...copia[idx],
            [field]: value,
            subtotal: (field === 'cantidad' || field === 'precio')
            ? (
                (parseFloat(field === 'precio' ? value : copia[idx].precio) || 0) *
                (parseInt(field === 'cantidad' ? value : copia[idx].cantidad, 10) || 0)
                ).toFixed(2)
            : copia[idx].subtotal
        };
        return { ...prev, productos: copia };
        });
    };

    const addProducto = () => {
        setForm(prev => ({
        ...prev,
        productos: [...prev.productos, { id_producto: '', cantidad: 1, precio: '0.00', subtotal: '0.00' }]
        }));
    };

    const removeProducto = idx => {
        setForm(prev => ({
        ...prev,
        productos: prev.productos.filter((_, i) => i !== idx)
        }));
    };

    const submitForm = async e => {
        e.preventDefault();

        const payload = {
        id_cliente:     parseInt(form.id_cliente, 10),
        id_salon:       parseInt(form.id_salon, 10),
        id_estatus:     parseInt(form.id_estatus, 10),
        id_metodo_pago: parseInt(form.id_metodo_pago, 10),
        fecha:          form.fecha,
        notas:          form.notas,
        usuario_creacion: 'dev',
        productos:      form.productos.map(p => ({
            id_producto: parseInt(p.id_producto, 10),
            cantidad:    parseInt(p.cantidad, 10)
        }))
        };

        try {
        const res = await fetch('http://localhost:8000/api/cotizaciones/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Respuesta no JSON:', text);
            throw new Error('Respuesta inesperada del servidor');
        }

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        setAllCotizaciones(prev => [data, ...prev]);
        setCotizaciones(prev => [data, ...prev]);
        setShowForm(false);
        setForm({
            id_cliente: '', id_salon: '', id_estatus: '',
            id_metodo_pago: '', fecha: '', notas: '', productos: []
        });

        alert('Cotización creada con éxito ✅');
        } catch (err) {
        console.error('Error al crear cotización:', err);
        alert('Error al crear cotización: ' + err.message);
        }
    };

    if (loading) return <p>Cargando cotizaciones…</p>;

    return (
        <div className="cotizaciones-container">
        <h1 className="cotizaciones-title">Gestión de Cotizaciones</h1>

        <div className="cotizaciones-filtros">
            <select name="id_cliente" value={filtros.id_cliente} onChange={handleFiltroChange}>
            <option value="">Todos los clientes</option>
            {catalogos.clientes.map(c =>
                <option key={c.id} value={c.id}>{c.nombre_contacto}</option>
            )}
            </select>
            <select name="id_salon" value={filtros.id_salon} onChange={handleFiltroChange}>
            <option value="">Todos los salones</option>
            {catalogos.salones.map(s =>
                <option key={s.id} value={s.id}>{s.nombre}</option>
            )}
            </select>
            <select name="id_estatus" value={filtros.id_estatus} onChange={handleFiltroChange}>
            <option value="">Todos los estatus</option>
            {catalogos.estatus.map(es =>
                <option key={es.id} value={es.id}>{es.nombre}</option>
            )}
            </select>
            <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltroChange} />
            <button className="button-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
            <button className="button-primary" onClick={toggleForm}>{showForm ? 'Cancelar' : 'Nueva cotización'}</button>
        </div>

        {showForm && (
            <form onSubmit={submitForm} className="cotizaciones-form">
            <h2>Crear nueva cotización</h2>
            <div className="cotizaciones-form-grid" style={{display:'flex',flexDirection:'column'}}>
                <select name="id_cliente" value={form.id_cliente} onChange={handleFormChange} required>
                <option value="">Cliente</option>
                {catalogos.clientes.map(c =>
                    <option key={c.id} value={c.id}>{c.nombre_contacto}</option>
                )}
                </select>
                <select name="id_salon" value={form.id_salon} onChange={handleFormChange} required>
                <option value="">Salón</option>
                {catalogos.salones.map(s =>
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                )}
                </select>
                <select name="id_estatus" value={form.id_estatus} onChange={handleFormChange} required>
                <option value="">Estatus</option>
                {catalogos.estatus.map(es =>
                    <option key={es.id} value={es.id}>{es.nombre}</option>
                )}
                </select>
                <select name="id_metodo_pago" value={form.id_metodo_pago} onChange={handleFormChange} required>
                <option value="">Método de pago</option>
                {catalogos.metodosPago.map(m =>
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                )}
                </select>
                <input type="date" name="fecha" value={form.fecha} onChange={handleFormChange} required  style={{width:'99%'}}/>
                <input type="text" name="notas" placeholder="Notas" value={form.notas} onChange={handleFormChange} style={{width:'99%'}}/>
            </div>

            <div className="cotizaciones-productos">
                <h3>Productos</h3>
                {form.productos.map((p, idx) => (
                <div key={idx} className="cotizaciones-producto-item">
                    <select
                    value={p.id_producto}
                    onChange={e => {
                        const sel = catalogos.productos.find(x => x.id === parseInt(e.target.value, 10));
                        handleProductoChange(idx, 'id_producto', e.target.value);
                        handleProductoChange(idx, 'precio', sel?.precio || '0.00');
                    }}
                    required
                    >
                    <option value="">Producto</option>
                    {catalogos.productos.map(prod =>
                        <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                    )}
                    </select>
                    <input type="number" min="1" value={p.cantidad} onChange={e => handleProductoChange(idx, 'cantidad', e.target.value)} required />
                    <span>Subtotal: ${p.subtotal}</span>
                    <button type="button" onClick={() => removeProducto(idx)}>❌</button>
                </div>
                ))}
                <button type="button" className="button-secondary" style={{ marginBottom: '10px' }} onClick={addProducto}>+ Agregar producto</button>
            </div>

            <button type="submit" className="button-primary">Guardar cotización</button>
            </form>
        )}

        <div className="cotizaciones-grid">
            {cotizaciones.map(c => (
            <CotizacionCard key={c.id} cot={c} />
            ))}
        </div>
        </div>
    );
    }
