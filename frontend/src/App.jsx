import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/auth" element={!isAuth ? <Auth setIsAuth={setIsAuth} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/auth" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
