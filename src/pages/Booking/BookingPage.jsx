import React, { useState } from 'react';
import DoctorList from './components/DoctorList/DoctorList';
import DoctorSchedule from './components/DoctorScheDule/DoctorSchedule';
import BookingForm from './components/BookingForm/BookingForm';
import BookingSuccess from './components/BookingSuccess/BookingSuccess';
import './BookingPage.css';

const BookingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handleBookingSubmit = (data) => {
    setBookingData(data);
    setCurrentStep(4);
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
        <div className="booking-content">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default BookingPage;
