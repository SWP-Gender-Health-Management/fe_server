import React from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryOrder from '@components/Payment/SummaryOrder/SummaryOrder';
import PaymentDetails from '@components/Payment/PaymentDetails/PaymentDetails';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handleTestSuccess = () => {
    // Demo: Chuyển đến trang thanh toán thành công với dữ liệu mẫu
    navigate('/payment-success?amount=500000&service=Khám tư vấn sức khỏe');
  };

  const handleTestFailed = () => {
    // Demo: Chuyển đến trang thanh toán không thành công
    navigate('/payment-failed');
  };

  return (
    <div className="payment-page">
      <div className="summary-section">
        <SummaryOrder />
      </div>
      <div className="payment-section">
        <PaymentDetails />
      </div>

      {/* Demo buttons - có thể xóa sau khi test */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <button
          onClick={handleTestSuccess}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          🧪 Test Thanh toán thành công
        </button>

        <button
          onClick={handleTestFailed}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          }}
        >
          🧪 Test Thanh toán thất bại
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
