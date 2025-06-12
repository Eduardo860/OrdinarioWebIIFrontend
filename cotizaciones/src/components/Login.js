    // src/components/Login.jsx
    import React, { useState } from 'react';
    import '../styles/Login.css';

    export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        });

        const data = await response.json();
        console.log('Respuesta del login:', data);

        if (response.ok && data.access) {
            localStorage.setItem('token', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('user', JSON.stringify(data.usuario));

            onLogin(data.usuario);
        } else {
            const message = data.detail || 'Credenciales incorrectas';
            alert(message);
        }

        } catch (error) {
        console.error('Error al intentar login:', error);
        alert(`Error al conectar con el servidor: ${error.message}`);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-title">Iniciar Sesión</h2>
            <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
            </button>
        </form>
        </div>
    );
    }
