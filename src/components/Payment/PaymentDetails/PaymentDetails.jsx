import React from 'react';
import './PaymentDetails.css';
import { Button, Input } from 'antd';

const PaymentDetails = () => {
  return (
    <div className="payment-details">
      <h3>Chi tiết thanh toán</h3>

      <label>Email</label>
      <Input placeholder="you@example.com" />

      <label>Tên chủ thẻ</label>
      <Input placeholder="Nguyễn Văn A" />

      <label>Địa chỉ thanh toán</label>
      <Input placeholder="Số nhà, đường, phường/xã..." />

      <label>Thành phố</label>
      <Input placeholder="Hồ Chí Minh" />

      <label>Mã bưu chính</label>
      <Input placeholder="700000" />

      <Button type="primary" className="pay-button">
        Thanh toán
      </Button>
    </div>
  );
};

export default PaymentDetails;
