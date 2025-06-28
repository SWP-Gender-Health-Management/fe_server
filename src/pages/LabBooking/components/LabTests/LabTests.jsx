import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabTests.css';

const LabTests = () => {
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState([]);
  const [scheduleInfo, setScheduleInfo] = useState(null);

  // Mock data cho các loại xét nghiệm
  const labTests = [
    {
      id: 1,
      name: 'Xét nghiệm máu tổng quát',
      description:
        'Kiểm tra các chỉ số máu cơ bản: hồng cầu, bạch cầu, tiểu cầu',
      price: 150000,
      category: 'Xét nghiệm máu',
    },
    {
      id: 2,
      name: 'Xét nghiệm đường huyết',
      description: 'Đo nồng độ glucose trong máu, phát hiện tiểu đường',
      price: 80000,
      category: 'Xét nghiệm máu',
    },
    {
      id: 3,
      name: 'Xét nghiệm cholesterol',
      description: 'Kiểm tra mức cholesterol và lipid trong máu',
      price: 120000,
      category: 'Xét nghiệm máu',
    },
    {
      id: 4,
      name: 'Xét nghiệm chức năng gan',
      description: 'Đánh giá hoạt động của gan qua các enzyme',
      price: 200000,
      category: 'Xét nghiệm chuyên sâu',
    },
    {
      id: 5,
      name: 'Xét nghiệm chức năng thận',
      description: 'Kiểm tra creatinine, urea để đánh giá thận',
      price: 180000,
      category: 'Xét nghiệm chuyên sâu',
    },
    {
      id: 6,
      name: 'Xét nghiệm tầm soát ung thư',
      description: 'Tầm soát các dấu ấn sinh học ung thư phổ biến',
      price: 500000,
      category: 'Xét nghiệm chuyên sâu',
    },
    {
      id: 7,
      name: 'Xét nghiệm nước tiểu',
      description: 'Phân tích thành phần nước tiểu, phát hiện nhiễm trùng',
      price: 60000,
      category: 'Xét nghiệm cơ bản',
    },
    {
      id: 8,
      name: 'Xét nghiệm vi khuẩn HP',
      description: 'Phát hiện vi khuẩn Helicobacter pylori gây loét dạ dày',
      price: 150000,
      category: 'Xét nghiệm chuyên sâu',
    },
  ];

  const categories = [...new Set(labTests.map((test) => test.category))];

  useEffect(() => {
    // Lấy thông tin lịch đã chọn từ sessionStorage
    const storedSchedule = sessionStorage.getItem('selectedSchedule');
    if (storedSchedule) {
      setScheduleInfo(JSON.parse(storedSchedule));
    } else {
      // Nếu không có thông tin lịch, quay về trang chọn lịch
      navigate('/xet-nghiem');
    }
  }, [navigate]);

  const handleTestSelect = (test) => {
    setSelectedTests((prev) => {
      const isSelected = prev.find((t) => t.id === test.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== test.id);
      } else {
        return [...prev, test];
      }
    });
  };

  const getTotalPrice = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleContinue = () => {
    if (selectedTests.length > 0) {
      // Lưu thông tin xét nghiệm đã chọn
      sessionStorage.setItem('selectedTests', JSON.stringify(selectedTests));
      sessionStorage.setItem('totalPrice', getTotalPrice().toString());

      navigate('/thong-tin-xet-nghiem');
    }
  };

  const handleBack = () => {
    navigate('/xet-nghiem');
  };

  if (!scheduleInfo) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="lab-tests">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          ← Quay lại
        </button>
        <h1>Chọn xét nghiệm</h1>
        <p>Hãy chọn các xét nghiệm bạn muốn thực hiện</p>

        <div className="schedule-reminder">
          <strong>Lịch đã chọn:</strong> {scheduleInfo.formattedDate} -
          {scheduleInfo.timeSlot === 'morning'
            ? ' Buổi sáng (7:00-11:00)'
            : ' Buổi chiều (13:00-17:00)'}
        </div>
      </div>

      <div className="tests-container">
        {categories.map((category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="tests-grid">
              {labTests
                .filter((test) => test.category === category)
                .map((test) => (
                  <div
                    key={test.id}
                    className={`test-card ${selectedTests.find((t) => t.id === test.id) ? 'selected' : ''}`}
                    onClick={() => handleTestSelect(test)}
                  >
                    <div className="test-header">
                      <h4 className="test-name">{test.name}</h4>
                      <div className="test-price">
                        {formatPrice(test.price)}
                      </div>
                    </div>
                    <p className="test-description">{test.description}</p>
                    <div className="test-checkbox">
                      {selectedTests.find((t) => t.id === test.id) ? '✓' : '+'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTests.length > 0 && (
        <div className="selection-summary">
          <div className="summary-header">
            <h3>Xét nghiệm đã chọn ({selectedTests.length})</h3>
            <div className="total-price">
              Tổng cộng: {formatPrice(getTotalPrice())}
            </div>
          </div>

          <div className="selected-tests-list">
            {selectedTests.map((test) => (
              <div key={test.id} className="selected-test-item">
                <span className="test-name">{test.name}</span>
                <span className="test-price">{formatPrice(test.price)}</span>
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestSelect(test);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button className="continue-button" onClick={handleContinue}>
            Tiếp tục điền thông tin
          </button>
        </div>
      )}

      {selectedTests.length === 0 && (
        <div className="no-selection">
          <p>Vui lòng chọn ít nhất một xét nghiệm để tiếp tục</p>
        </div>
      )}
    </div>
  );
};

export default LabTests;
