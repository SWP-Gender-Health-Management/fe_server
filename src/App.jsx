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
import Footer from '@components/Footer/Footer';
import NotificationToast from '@components/Notification/NotificationToast';
import LandingPage from '@pages/LandingPage/LandingPage';
import ServicePage from '@pages/ServicePage/ServicePage';
import MenstrualPredictorPage from '@pages/MenstrualPredictor/MenstrualPredictorPage';
import BlogPage from '@pages/Blog/BlogPage';
import BlogDetailPage from '@pages/Blog/BlogDetail/BlogDetailPage';
import Question from '@pages/Question/Question';
import AboutUs from '@pages/AboutUs/AboutUs';
import Contact from '@pages/Contact/Contact';
import Login from '@components/Login/Login';
import SessionManager from '@components/SessionManager/SessionManager';
import UserAccount from '@pages/UserAccount/UserAccount';
import AdminDashboard from '@pages/AdminDashboard/AdminDashboard';
import ManagerDashboard from '@pages/ManagerDashboard/ManagerDashboard';
import BookingPage from '@pages/Booking/BookingPage';
import LabSchedule from '@pages/Lab/components/LabSchedule/LabSchedule';
import LabTests from '@pages/Lab/components/LabTests/LabTests';
import LabConfirmation from '@pages/Lab/components/LabConfirmation/LabConfirmation';
import LabSuccess from '@pages/Lab/components/LabConfirmation/LabSuccess';
import Payment from '@pages/PaymentPage/PaymentPage';
import ConsultantDashboard from '@pages/ConsultantDashboard/ConsultantDashboard';
import StaffDashboard from '@pages/StaffDashboard/StaffDashboard';
import NotFound from '@pages/NotFound/NotFound.jsx';
import PaymentSuccess from '@pages/PaymentPage/components/PaymentSuccess/PaymentSuccess';
import PaymentFail from '@pages/PaymentPage/components/PaymentFailed/PaymentFailed';
import '@styles/reset.css';
import Cookies from 'js-cookie';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const AppLayout = () => {
  const { isLoggedIn, logout } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const full_name = Cookies.get('fullname') || '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0); // Cuộn lên đầu mỗi khi pathname thay đổi
    }, [pathname]);

    return null;
  }

  useEffect(() => {
    setShowLogin(false);
  }, [location]);

  const hideNavbarPaths = ['/admin', '/manager', '/consultant', '/staff'];
  const shouldHideNavbar = hideNavbarPaths.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const isNotFoundPage =
    location.pathname !== '/' &&
    ![
      '/',
      '/tai-khoan',
      '/tin-tuc',
      '/ve-chung-toi',
      '/lien-he',
      '/dich-vu',
      '/dat-lich-tu-van',
      '/dat-lich-xet-nghiem',
      '/chon-xet-nghiem',
      '/thong-tin-xet-nghiem',
      '/xac-nhan-xet-nghiem',
      '/admin',
      '/manager',
      '/consultant',
      '/staff',
      '/dich-vu/chu-ky-kinh-nguyet',
      '/hoi-dap',
      '/payment',
    ].some((p) => location.pathname.startsWith(p));

  return (
    <div className="app-container">
      {!shouldHideNavbar && !isNotFoundPage && (
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          isLoggedIn={isLoggedIn}
          full_name={full_name}
          onLogout={handleLogout}
        />
      )}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/tai-khoan"
          element={isLoggedIn ? <UserAccount /> : <Navigate to="/" />}
        />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/tin-tuc/:blog_id" element={<BlogDetailPage />} />
        <Route path="/ve-chung-toi" element={<AboutUs />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/dich-vu" element={<ServicePage />} />
        <Route path="/dat-lich-tu-van" element={<BookingPage />} />
        <Route path="/dat-lich-xet-nghiem" element={<LabSchedule />} />
        <Route path="/chon-xet-nghiem" element={<LabTests />} />
        <Route path="/thong-tin-xet-nghiem" element={<LabConfirmation />} />
        <Route path="/xac-nhan-xet-nghiem" element={<LabSuccess />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultant/*"
          element={
            <ProtectedRoute allowedRoles={['CONSULTANT']}>
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['STAFF']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dich-vu/chu-ky-kinh-nguyet"
          element={<MenstrualPredictorPage />}
        />
        <Route path="/hoi-dap" element={<Question />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!shouldHideNavbar && !isNotFoundPage && (
        <>
          <Login visible={showLogin} onCancel={() => setShowLogin(false)} />
          <SessionManager
            onCancel={() => {
              setShowLogin(false);
            }}
            onLoginClick={() => {
              setShowLogin(true);
            }}
          />
          <Footer />
          <div className="footer-spacer" />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppLayout />
      <NotificationToast />
    </AuthProvider>
  );
}

export default App;
