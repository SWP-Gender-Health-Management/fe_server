import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from '@context/AuthContext.jsx';
import Navbar from '@components/Navbar/Navbar';
import LandingPage from '@pages/LandingPage/LandingPage';
import Login from '@pages/Login/Login';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import ManagerDashboard from '@pages/ManagerDashboard/ManagerDashboard';
import BlogPage from '@pages/Blog/BlogPage';
import ServicePage from '@pages/ServicePage/ServicePage';
import BookingPage from '@pages/Booking/BookingPage';
import LabSchedule from '@pages/LabSchedule/LabSchedule';
import LabTests from '@pages/LabTests/LabTests';
import LabConfirmation from '@pages/LabConfirmation/LabConfirmation';
import LabSuccess from '@pages/LabConfirmation/LabSuccess';
import MenstrualPredictorPage from '@pages/MenstrualPredictor/MenstrualPredictorPage';
import Question from '@pages/Question/Question';
import Payment from '@pages/PaymentPage/PaymentPage';
import AboutUs from '@pages/AboutUs/AboutUs';
import Contact from '@pages/Contact/Contact';
import Footer from '@components/Footer/Footer';
import '@styles/reset.css';

// Layout chung cho tất cả trang
const AppLayout = () => {
  const { isLoggedIn, logout } = useAuth(); // Gọi useAuth một lần tại đây
  const [showLogin, setShowLogin] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy fullname từ sessionStorage hoặc mặc định
  const full_name = sessionStorage.getItem('full_name') || 'Người dùng';

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
        full_name={full_name} // Sử dụng fullname từ sessionStorage
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path='/login' element={<login />} />  */}
        <Route
          path="/tai-khoan"
          element={isLoggedIn ? <UserAccount /> : <Navigate to="/" />} // Chuyển hướng về /login
        />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/dich-vu" element={<ServicePage />} />{' '}
        {/* Sửa thành ServicePage */}
        <Route path="/dat-lich-tu-van" element={<BookingPage />} />
        <Route path="/dat-lich-xet-nghiem" element={<LabSchedule />} />
        <Route path="/chon-xet-nghiem" element={<LabTests />} />
        <Route path="/thong-tin-xet-nghiem" element={<LabConfirmation />} />
        <Route path="/xac-nhan-xet-nghiem" element={<LabSuccess />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
        <Route
          path="/dich-vu/chu-ky-kinh-nguyet"
          element={<MenstrualPredictorPage />}
        />
        <Route path="/hoi-dap" element={<Question />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
      <Footer />
      <div className="footer-spacer" />
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
