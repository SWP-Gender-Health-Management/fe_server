import React from 'react';
import './SummaryOrder.css';

const SummaryOrder = () => {
  // Giả sử dữ liệu được fetch từ API
  const services = [
    { name: 'Tư vấn sức khỏe tâm lý', price: 500000 },
    { name: 'Khám chuyên khoa giới tính', price: 700000 }
  ];

  return (
    <div className="summary-order">
      <h3>Thông tin dịch vụ</h3>
      {services.map((service, index) => (
        <div className="service-item" key={index}>
          <div>{service.name}</div>
          <div>{service.price.toLocaleString()}đ</div>
        </div>
      ))}
      <div className="total">
        <strong>Tổng cộng: </strong>
        <span>
          {services.reduce((acc, cur) => acc + cur.price, 0).toLocaleString()}đ
        </span>
      </div>
    </div>
  );
};

export default SummaryOrder;
