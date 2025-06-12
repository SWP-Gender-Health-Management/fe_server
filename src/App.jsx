import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import '@styles/reset.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="app-container">
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tai-khoan" element={<UserAccount />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <Login
        visible={showLogin}
        onCancel={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setShowLogin(false);
        }}
      />
    </div>
  );
}

export default App;