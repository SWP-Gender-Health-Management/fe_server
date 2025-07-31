import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentFailed.css';

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/dat-lich-tu-van');
  };

  return (
    <div className="payment-failed">
      <div className="failed-container">
        {/* Failed Animation */}
        <div className="failed-animation">
          <div className="crossmark">
            <div className="cross-icon">
              <span className="icon-line line-left"></span>
              <span className="icon-line line-right"></span>
            </div>
          </div>
        </div>

        {/* Failed Message */}
        <div className="failed-content">
          <h1 className="failed-title">Thanh toán không thành công!</h1>
          <p className="failed-subtitle">
            Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
          </p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleTryAgain}>
              <span className="btn-icon">🔄</span>
              Thử lại
            </button>

            <button className="btn btn-secondary" onClick={handleGoHome}>
              <span className="btn-icon">🏠</span>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
