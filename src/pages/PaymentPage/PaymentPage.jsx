import React from 'react';
import SummaryOrder from '@components/Payment/SummaryOrder/SummaryOrder';
import PaymentDetails from '@components/Payment/PaymentDetails/PaymentDetails';
import './PaymentPage.css';

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <div className="summary-section">
        <SummaryOrder />
      </div>
      <div className="payment-section">
        <PaymentDetails />
      </div>
    </div>
  );
};

export default PaymentPage;
