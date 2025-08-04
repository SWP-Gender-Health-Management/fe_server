import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="payment-success">
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-content">
          <h1 className="success-title">Thanh toán thành công!</h1>
          <p className="success-subtitle">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
          </p>

          {/* Action Button */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleGoHome}>
              <span className="btn-icon">🏠</span>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
