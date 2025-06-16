import React from 'react';
import './Footer.css';
import Logo from '@assets/Logo-full.svg?react'; // Import logo if needed

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Logo className="footer-image" />
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4>Dịch vụ</h4>
            <ul>
              <li>Dịch vụ 1</li>
              <li>Dịch vụ 2</li>
              <li>Dịch vụ 3</li>
              <li>Dịch vụ 4</li>
              <li>Dịch vụ 5</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Liên hệ</h4>
            <ul>
              <li>Liên hệ 1</li>
              <li>Liên hệ 2</li>
              <li>Liên hệ 3</li>
              <li>Liên hệ 4</li>
              <li>Liên hệ 5</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Các chi nhánh</h4>
            <ul>
              <li>Chi nhánh HCM</li>
              <li>Chi nhánh Sao Hỏa</li>
              <li>Chi nhánh Mặt Trăng</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Các đối tác</h4>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 SWP391 Group5
      </div>
    </footer>
  );
};

export default Footer;
