import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DoctorList from './components/DoctorList/DoctorList';
import DoctorSchedule from './components/DoctorScheDule/DoctorSchedule';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSuccess from './components/BookingSuccess/BookingSuccess';
import './BookingPage.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import LoginRequiredModal from '../../components/LoginRequiredModal/LoginRequiredModal';
import { createConAppTransaction, createPaymentUrl } from '../../api/conApi';


const API_URL = 'http://localhost:3000';

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Hiển thị modal login khi chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
    } else {
      setIsLoginModalVisible(false);
    }
  }, [isLoggedIn]);

  // Khôi phục trạng thái từ sessionStorage khi vào trang
  useEffect(() => {
    const savedStep = sessionStorage.getItem('bookingStep');
    const savedDoctor = sessionStorage.getItem('selectedDoctor');
    const savedSlot = sessionStorage.getItem('selectedSlot');
    const savedBookingData = sessionStorage.getItem('bookingData');

    if (savedStep && savedDoctor && savedSlot && savedBookingData) {
      setCurrentStep(parseInt(savedStep));
      setSelectedDoctor(JSON.parse(savedDoctor));
      setSelectedSlot(JSON.parse(savedSlot));
      setBookingData(JSON.parse(savedBookingData));
    }

    // Xóa sessionStorage sau khi khôi phục để tránh lặp lại
    sessionStorage.removeItem('bookingStep');
    sessionStorage.removeItem('selectedDoctor');
    sessionStorage.removeItem('selectedSlot');
    sessionStorage.removeItem('bookingData');
  }, []);

  // Nhận data từ LandingPage và fill vào BookingForm
  useEffect(() => {
    if (location.state && location.state.consultationData) {
      const { fullName, phone, email } = location.state.consultationData;
      sessionStorage.setItem('full_name', fullName || '');
      sessionStorage.setItem('phone', phone || '');
      sessionStorage.setItem('email', email || '');
    }
  }, [location.state]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handleBookingSubmit = async (data) => {
    setBookingData(data);
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.post(
        `${API_URL}/consult-appointment/create-consult-appointment`,
        {
          pattern_id: data.pattern_id,
          customer_id: data.customer_id,
          description: data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data && response.data.result) {
        const { savedConsultAppointment } = response.data.result;
        const app = savedConsultAppointment.app_id;

        // Tạo giao dịch
        const transactionRes = await createConAppTransaction(
          {
            app_id: app,
            amount: data.totalAmount.toString(),
            description: 'thử nghiệm',
            date: new Date().toISOString().split('T')[0],
          },
          accessToken
        );

        const orderCode = transactionRes.data.data.order_code;
        const paymentRes = await createPaymentUrl({ orderCode }, accessToken);
        const paymentUrl = paymentRes.data.data.checkoutUrl;

        // Lưu trạng thái vào sessionStorage trước khi chuyển hướng
        sessionStorage.setItem('bookingStep', 3);
        sessionStorage.setItem(
          'selectedDoctor',
          JSON.stringify(selectedDoctor)
        );
        sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot));
        sessionStorage.setItem('bookingData', JSON.stringify(data));

        // Chuyển hướng sang trang thanh toán
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response) {
        console.error('Lỗi chi tiết từ backend:', error.response.data);
        alert('Lỗi chi tiết từ backend:', error.response.data?.message);
      }
    }
  };

  const handleBackToStep = (step) => {
    setCurrentStep(step);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DoctorList onDoctorSelect={handleDoctorSelect} />;
      case 2:
        return (
          <DoctorSchedule
            doctor={selectedDoctor}
            onSlotSelect={handleSlotSelect}
            onBack={() => handleBackToStep(1)}
          />
        );
      case 3:
        return (
          <BookingForm
            doctor={selectedDoctor}
            slot={selectedSlot}
            onSubmit={handleBookingSubmit}
            onBack={() => handleBackToStep(2)}
            initialData={bookingData} // Truyền dữ liệu ban đầu
          />
        );
      case 4:
        return (
          <BookingSuccess
            doctor={selectedDoctor}
            slot={selectedSlot}
            bookingData={bookingData}
            onBackToHome={() => handleBackToStep(1)}
          />
        );
      default:
        return <DoctorList onDoctorSelect={handleDoctorSelect} />;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-progress">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-title">Chọn Bác Sĩ</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-title">Chọn Lịch</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-title">Thông Tin</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-title">Hoàn Thành</span>
          </div>
        </div>
        <div className="booking-content">
          {isLoggedIn ? renderCurrentStep() : null}
        </div>
      </div>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onCancel={() => {
          setIsLoginModalVisible(false);
          navigate('/');
        }}
        onLoginSuccess={() => {
          setIsLoginModalVisible(false);
          // Reload trang sau khi đăng nhập thành công
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
        message="Bạn cần đăng nhập để đặt lịch tư vấn!"
      />
    </div>
  );
};

export default BookingPage;