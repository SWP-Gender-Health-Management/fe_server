import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicePage.css';

const ServicePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/dich-vu/chu-ky-kinh-nguyet');
  };

  return (
    <div className="service-page">
      <h1>Dịch Vụ Sức Khỏe</h1>
      <p>Chọn một dịch vụ bên dưới:</p>
      <button className="cycle-button" onClick={handleNavigate}>
        Theo dõi chu kỳ kinh nguyệt
      </button>
    </div>
  );
};

export default ServicePage;
