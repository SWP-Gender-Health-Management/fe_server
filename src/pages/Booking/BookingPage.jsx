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

const accessToken = await Cookies.get('accessToken');

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // Nếu chưa đăng nhập, hiện modal và không cho thao tác
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
    }
  }, [isLoggedIn]);

  // Nhận data từ LandingPage và fill vào BookingForm
  useEffect(() => {
    if (location.state && location.state.consultationData) {
      // Lưu vào sessionStorage để BookingForm lấy được
      const { fullName, phone, email } = location.state.consultationData;
      sessionStorage.setItem('full_name', fullName || '');
      sessionStorage.setItem('phone', phone || '');
      sessionStorage.setItem('email', email || '');
      // Có thể lưu thêm service nếu BookingForm cần
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
    console.log("handleBookingSubmit data.totalAmount: ", data.totalAmount, " ", typeof data.totalAmount)
    setBookingData(data);
    try {
      const response = await axios.post(
        'http://localhost:3000/consult-appointment/create-consult-appointment',
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
        alert('Booking success');
        console.log("Booking success: ", response.data)
        const { savedConsultAppointment } = response.data.result;
        const app = savedConsultAppointment.app_id;

        // setCurrentStep(4);

        // 2. Tạo giao dịch
        const transactionRes = await createConAppTransaction(
          {
            app_id: app,
            amount: data.totalAmount.toString(),
            description: 'thử nghiệm',
            date: new Date().toISOString().split('T')[0],
          },
          accessToken
        );

        console.log(
          '[ConAppConfirmation] createLabTransaction response: ',
          transactionRes.data.data
        );

        const orderCode = transactionRes.data.data.order_code;
        console.log('orderCode:', orderCode);
        // 3. Tạo payment url
        const paymentRes = await createPaymentUrl({ orderCode }, accessToken);
        console.log(
          '[ConAppConfirmation] createPaymentUrl response:',
          paymentRes.data
        );
        const paymentUrl = paymentRes.data.data.checkoutUrl;
        console.log('paymentUrl:', paymentUrl);
        // 4. Điều hướng sang trang thanh toán
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
        {/* Progress Steps */}
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

        {/* Content */}
        <div className="booking-content">{isLoggedIn ? renderCurrentStep() : null}</div>
      </div>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onOk={() => {
          setIsLoginModalVisible(false);
          navigate('/login');
        }}
        onCancel={() => {
          setIsLoginModalVisible(false);
          navigate('/');
        }}
        message="Bạn cần đăng nhập để đặt lịch tư vấn!"
      />
    </div>
  );
};

export default BookingPage;
