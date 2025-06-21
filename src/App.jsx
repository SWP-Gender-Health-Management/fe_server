import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import BlogPage from '@pages/Blog/BlogPage';
import ServicePage from '@pages/ServicePage/ServicePage';
import MenstrualPredictorPage from '@pages/MenstrualPredictor/MenstrualPredictorPage';
import Footer from '@components/Footer/Footer';
import ProtectedRoute from '@components/libs/ProtectedRoute';

import '@styles/reset.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullname, setFullname] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token =
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('accessToken');

    if (token) {
      setIsLoggedIn(true);
      const storedName =
        sessionStorage.getItem('fullname') || localStorage.getItem('fullname');
      setFullname(storedName || 'Người dùng');
    } else {
      setIsLoggedIn(false);
      setFullname('');
    }
  }, []);

  useEffect(() => {
    if (location.state?.showLogin) {
      setShowLogin(true);
      // xoá flag để tránh mở lại khi back
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.showLogin, location.pathname, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setFullname('');
  };

  const handleLoginSuccess = ({ accessToken, refreshToken, fullname }) => {
    if (!accessToken) return;

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('fullname', fullname || 'Người dùng');

    setIsLoggedIn(true);
    setFullname(fullname || 'Người dùng');
    setShowLogin(false);
  };

  return (
    <div className="app-container">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        isLoggedIn={isLoggedIn}
        fullname={fullname}
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tai-khoan" element={<UserAccount />} />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/dich-vu" element={<ServicePage />} />
        <Route
          path="/dich-vu/chu-ky-kinh-nguyet"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MenstrualPredictorPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Login
        visible={showLogin}
        onCancel={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Footer />
    </div>
  );
}

export default App;
