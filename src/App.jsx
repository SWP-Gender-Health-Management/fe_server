import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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
import AboutUs from '@pages/AboutUs/AboutUs';
import Contact from '@pages/Contact/Contact';
import Footer from '@components/Footer/Footer';
import Services from '@pages/Services/Services';
import '@styles/reset.css';

// Layout chung cho tất cả trang
const AppLayout = () => {
  const { isLoggedIn, logout } = useAuth(); // Gọi useAuth một lần tại đây
  const [showLogin, setShowLogin] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm handleLogout sử dụng navigate thay vì window.location.href
  const handleLogout = () => {
    logout(); // Gọi logout từ useAuth để cập nhật trạng thái
    navigate('/'); // Điều hướng về trang chủ
  };

  // Ẩn Login modal khi thay đổi route
  useEffect(() => {
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
          element={isLoggedIn ? <UserAccount /> : <Navigate to="/" />}
        />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/dich-vu" element={<Services />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer" element={<MenstrualPredictorPage />} />
        <Route path="/hoi-dap" element={<Question />} />
        {/* Thêm route cho Payment nếu cần */}
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
      <Footer />
      <div className="footer-spacer" />
      {/* Loại bỏ Payment khỏi layout cố định, thay bằng route */}
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
