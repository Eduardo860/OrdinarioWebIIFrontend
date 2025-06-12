// src/App.jsx
import React, { useState, useEffect } from 'react';
import AppRouter from './router/router';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Chequeo inicial de sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Vigilar borrado manual de token/user
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = user => {
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
    <AppRouter
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
    />
  );
}

export default App;
