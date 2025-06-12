    import React, { useState, useEffect } from 'react';
    import '../styles/GestionProductos.css';

    export default function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriasMap, setCategoriasMap] = useState({});
    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        id_categoria: '',
        url_imagen: '',
        usuario_creacion: 'dev'
    });
    const [productoEditando, setProductoEditando] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        try {
        const res = await fetch('http://localhost:8000/api/productos/');
        const data = await res.json();
        setProductos(data);
        } catch (err) {
        console.error('Error al cargar productos:', err);
        } finally {
        setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
        const res = await fetch('http://localhost:8000/api/categorias/');
        const data = await res.json();
        setCategorias(data);
        const catMap = {};
        data.forEach(cat => {
            catMap[cat.id] = cat.nombre;
        });
        setCategoriasMap(catMap);
        } catch (err) {
        console.error('Error al cargar categorías:', err);
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
        ...(form.precio && { precio: form.precio }),
        ...(form.id_categoria && { id_categoria: parseInt(form.id_categoria, 10) }),
        ...(form.url_imagen && { url_imagen: form.url_imagen }),
        ...(productoEditando
            ? { usuario_actualizacion: 'dev2' }
            : { usuario_creacion: 'dev' })
        };

        const url = productoEditando
        ? `http://localhost:8000/api/productos/${productoEditando.id}/`
        : 'http://localhost:8000/api/productos/';

        const method = productoEditando ? 'PATCH' : 'POST';

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

        await fetchProductos();

        setForm({ nombre: '', precio: '', id_categoria: '', url_imagen: '', usuario_creacion: 'dev' });
        setProductoEditando(null);
        alert(productoEditando ? 'Producto actualizado ✅' : 'Producto creado ✅');
        } catch (err) {
        console.error('Error al guardar producto:', err);
        alert('Error al guardar producto: ' + err.message);
        }
    };

    const editarProducto = producto => {
        setProductoEditando(producto);
        setForm({
        nombre: producto.nombre || '',
        precio: producto.precio || '',
        id_categoria: producto.id_categoria?.toString() || '',
        url_imagen: producto.url_imagen || '',
        usuario_creacion: producto.usuario_creacion || 'dev'
        });
    };

    const cancelarEdicion = () => {
        setProductoEditando(null);
        setForm({ nombre: '', precio: '', id_categoria: '', url_imagen: '', usuario_creacion: 'dev' });
    };

    const eliminarProducto = async id => {
        if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

        try {
        const res = await fetch(`http://localhost:8000/api/productos/${id}/`, {
            method: 'DELETE'
        });

        const data = await res.json();
        if (!res.ok) {
            return alert(`Error ${res.status}: ${JSON.stringify(data)}`);
        }

        setProductos(prev => prev.filter(p => p.id !== id));
        alert(data.mensaje);
        } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar producto: ' + err.message);
        }
    };

    if (loading) return <p>Cargando productos…</p>;

    return (
        <div className="productos-container">
        <h1 className="productos-title">Gestión de Productos</h1>

        <form onSubmit={submitForm} className="productos-form">
            <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleFormChange}
            required
            />
            <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleFormChange}
            required
            />
            <select
            name="id_categoria"
            value={form.id_categoria}
            onChange={handleFormChange}
            required
            >
            <option value="">Seleccione categoría</option>
            {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                {cat.nombre}
                </option>
            ))}
            </select>
            <input
            type="url"
            name="url_imagen"
            placeholder="URL de imagen"
            value={form.url_imagen}
            onChange={handleFormChange}
            />
            <button type="submit" className="button-primary full-width">
            {productoEditando ? 'Actualizar producto' : 'Guardar producto'}
            </button>
            {productoEditando && (
            <button
                type="button"
                onClick={cancelarEdicion}
                className="button-cancel"
            >
                Cancelar edición
            </button>
            )}
        </form>

        <div className="productos-grid">
            {productos.map(p => (
            <div key={p.id} className="productos-card">
                {p.url_imagen && (
                <img
                    src={p.url_imagen}
                    alt={p.nombre}
                    className="productos-card-img"
                />
                )}
                <h3>{p.nombre}</h3>
                <p>
                <strong>Precio:</strong> ${parseFloat(p.precio).toFixed(2)}
                </p>
                <p>
                <strong>Categoría:</strong> {categoriasMap[p.id_categoria] || 'Sin categoría'}
                </p>
                <div className="productos-buttons">
                <button onClick={() => editarProducto(p)}>Editar</button>
                <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }
