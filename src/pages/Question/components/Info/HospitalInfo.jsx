import React from 'react';
import './HospitalInfo.css';

const HospitalInfo = () => {
  return (
    <div className="hospital-info">
      <h3>🏥 Thông tin bệnh viện</h3>
      <p><strong>Điện thoại:</strong> 090 630 4988 (BS.Minh)</p>
      <p><strong>Hotline:</strong> 090 630 4988 (BS.Minh)</p>
      <p><strong>Email:</strong> nhatminhvo2311@@gmail.com</p>
      <p><strong>Thời gian làm việc:</strong></p>
      <ul>
        <li>Thứ 2 đến Thứ 6: 7h00 - 16h00</li>
        <li>Thứ 7 (sáng): 7h00 - 11h30</li>
      </ul>
      <p><strong>Địa chỉ:</strong></p>
      <ul>
        <li>418/34B Lê Văn Quới P.Bình Hưng Hòa A Q. Bình Tân</li>
      </ul>
      <p><strong>CSKH:</strong> 090 630 4988 (BS.Minh) </p>
    </div>
  );
};

export default HospitalInfo;
