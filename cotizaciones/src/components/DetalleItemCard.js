    import React, { useEffect, useState } from 'react';
    import '../styles/DetalleItemCard.css';

    export default function DetalleItemCard({ item }) {
    const subtotal = parseFloat(item.subtotal) || 0;
    const [producto, setProducto] = useState(null);
    const [categoriasMap, setCategoriasMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductoYCategorias = async () => {
        try {
            const resProd = await fetch(`http://localhost:8000/api/productos/${item.id_producto}/`);
            if (!resProd.ok) throw new Error(`Producto HTTP ${resProd.status}`);
            const dataProd = await resProd.json();
            setProducto(dataProd);

            const resCat = await fetch('http://localhost:8000/api/categorias/');
            if (!resCat.ok) throw new Error(`Categorias HTTP ${resCat.status}`);
            const dataCat = await resCat.json();

            const catMap = {};
            dataCat.forEach(cat => {
            catMap[cat.id] = cat.nombre;
            });
            setCategoriasMap(catMap);
        } catch (err) {
            console.error(`Error al cargar producto/categorías:`, err);
        } finally {
            setLoading(false);
        }
        };

        fetchProductoYCategorias();
    }, [item.id_producto]);

    return (
        <div className="detalle-item-card">
        {loading ? (
            <p>Cargando producto…</p>
        ) : producto ? (
            <>
            {producto.url_imagen && (
                <img
                src={producto.url_imagen}
                alt={producto.nombre}
                className="detalle-item-card-img"
                />
            )}

            <h4>{producto.nombre}</h4>
            <p><strong>Categoría:</strong> {categoriasMap[producto.id_categoria] || 'Sin categoría'}</p>
            <p><strong>Cantidad:</strong> {item.cantidad}</p>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            </>
        ) : (
            <p>Error al cargar producto</p>
        )}
        </div>
    );
    }
