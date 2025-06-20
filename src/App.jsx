import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Sử dụng .jsx
import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import BlogPage from '@pages/Blog/BlogPage';
import MenstrualPredictorPage from '@pages/MenstrualPredictor/MenstrualPredictorPage';
import Question from '@pages/Question/Question';
import Payment from '@pages/PaymentPage/PaymentPage';
import Footer from '@components/Footer/Footer';
import '@styles/reset.css';

// Layout chung cho tất cả trang
const AppLayout = () => {
  const { isLoggedIn, logout } = useAuth(); // Gọi useAuth một lần tại đây
  const [showLogin, setShowLogin] = React.useState(false);
  const location = useLocation();

  // Hàm handleLogout không chứa Hook, chỉ gọi logout từ useAuth
  const handleLogout = () => {
    logout(); // Gọi logout đã được định nghĩa từ useAuth
  };

  // Ẩn Login modal khi thay đổi route
  React.useEffect(() => {
    setShowLogin(false);
  }, [location]);

  return (
    <div className="app-container">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/tai-khoan"
          element={isLoggedIn ? <UserAccount /> : <Navigate to="/login" />}
        />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer" element={<MenstrualPredictorPage />} />
        <Route path="/hoi-dap" element={<Question />} />
      </Routes>
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
      <Footer />
      <div className="footer-spacer" />
      <Payment />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;