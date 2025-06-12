import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Verificar sesión al iniciar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    // Revisar cada segundo si el token sigue presente
    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (!token || !user) {
                // Si falta el token o el user, cerrar sesión
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        }, 1000); // cada 1 segundo

        return () => clearInterval(interval); // limpiar intervalo al desmontar
    }, []);

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    return (
        <>
            {isLoggedIn ? (
                <>
                    <Navbar onLogout={handleLogout} />
                    <Dashboard user={currentUser} />
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </>
    );
}

export default App;
