import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import BlogPage from '@pages/Blog/BlogPage';
import MenstrualPredictorPage from '@pages/MenstrualPredictor/MenstrualPredictorPage';
// import BlogPage from './pages/Blog/BlogPage';
import Footer from '@components/Footer/Footer';
import '@styles/reset.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra nếu đã đăng nhập từ session
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('fullname');
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = (userData) => {
    if (!userData || !userData.accessToken) return;

    sessionStorage.setItem('accessToken', userData.accessToken);
    sessionStorage.setItem('refreshToken', userData.refreshToken);
    sessionStorage.setItem('fullname', userData.fullname || 'Người dùng');

    setIsLoggedIn(true);
    setShowLogin(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tai-khoan" element={<UserAccount />} />
          {<Route path="/tin-tuc" element={<BlogPage />} />}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer" element={<MenstrualPredictorPage />} />
          {/* Add more routes as needed */}
        </Routes>

        <Login
          visible={showLogin}
          onCancel={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
      <div class="test">
        <Navbar />
        <LandingPage />
        <UserAccount />
        <Login />
        <AdminDashboard />
        <BlogPage />
        <MenstrualPredictorPage />
      </div>
    </Router>
  );
}

export default App;
