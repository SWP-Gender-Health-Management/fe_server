import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabTests.css';

const LabTests = () => {
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState([]);
  const [labSchedule, setLabSchedule] = useState(null);

  // Lab test data organized by categories
  const labTestCategories = [
    {
      id: 1,
      name: 'Xét nghiệm máu cơ bản',
      icon: '🩸',
      description: 'Các xét nghiệm máu thường quy, cơ bản',
      tests: [
        {
          id: 'blood_basic',
          name: 'Công thức máu toàn phần',
          description: 'Đếm tế bào máu trắng, đỏ, tiểu cầu',
          price: 120000,
          duration: '30 phút',
        },
        {
          id: 'blood_sugar',
          name: 'Đường huyết lúc đói',
          description: 'Kiểm tra mức đường trong máu',
          price: 80000,
          duration: '15 phút',
        },
        {
          id: 'blood_lipid',
          name: 'Mỡ máu (Lipid)',
          description: 'Cholesterol, triglyceride, HDL, LDL',
          price: 200000,
          duration: '45 phút',
        },
        {
          id: 'hba1c',
          name: 'HbA1c',
          description: 'Đường huyết trung bình 3 tháng',
          price: 250000,
          duration: '30 phút',
        },
      ],
    },
    {
      id: 2,
      name: 'Xét nghiệm chức năng gan',
      icon: '🫀',
      description: 'Đánh giá tình trạng và chức năng gan',
      tests: [
        {
          id: 'liver_alt',
          name: 'ALT (SGPT)',
          description: 'Enzyme gan, đánh giá chức năng gan',
          price: 60000,
          duration: '20 phút',
        },
        {
          id: 'liver_ast',
          name: 'AST (SGOT)',
          description: 'Enzyme gan và tim',
          price: 60000,
          duration: '20 phút',
        },
      ],
    },
    {
      id: 3,
      name: 'Xét nghiệm chức năng thận',
      icon: '🫘',
      description: 'Đánh giá tình trạng và chức năng thận',
      tests: [
        {
          id: 'kidney_creatinine',
          name: 'Creatinine máu',
          description: 'Đánh giá chức năng thận',
          price: 80000,
          duration: '20 phút',
        },
        {
          id: 'kidney_urea',
          name: 'Urea máu',
          description: 'Sản phẩm chuyển hóa protein',
          price: 70000,
          duration: '20 phút',
        },
        {
          id: 'urine_basic',
          name: 'Tổng phân tích nước tiểu',
          description: 'Protein, glucose, bạch cầu trong nước tiểu',
          price: 100000,
          duration: '25 phút',
        },
      ],
    },
    {
      id: 4,
      name: 'Xét nghiệm chuyên sâu',
      icon: '🔬',
      description: 'Các xét nghiệm hormone và vitamin',
      tests: [
        {
          id: 'thyroid_tsh',
          name: 'TSH (Hormone tuyến giáp)',
          description: 'Đánh giá chức năng tuyến giáp',
          price: 300000,
          duration: '60 phút',
        },
        {
          id: 'vitamin_d',
          name: 'Vitamin D',
          description: 'Mức độ Vitamin D trong cơ thể',
          price: 500000,
          duration: '90 phút',
        },
        {
          id: 'hepatitis_b',
          name: 'Xét nghiệm Hepatitis B',
          description: 'HBsAg, Anti-HBs, Anti-HBc',
          price: 180000,
          duration: '40 phút',
        },
      ],
    },
  ];

  useEffect(() => {
    // Get schedule from sessionStorage
    const schedule = sessionStorage.getItem('labSchedule');
    if (schedule) {
      setLabSchedule(JSON.parse(schedule));
    } else {
      // If no schedule, redirect back
      navigate('/dat-lich-xet-nghiem');
    }
  }, [navigate]);

  const handleTestToggle = (test) => {
    setSelectedTests((prev) => {
      const isSelected = prev.find((t) => t.id === test.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== test.id);
      } else {
        return [...prev, test];
      }
    });
  };

  const calculateTotal = () => {
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
      // Save selected tests to sessionStorage
      sessionStorage.setItem('selectedLabTests', JSON.stringify(selectedTests));
      navigate('/thong-tin-xet-nghiem');
    }
  };

  const getTotalDuration = () => {
    const totalMinutes = selectedTests.reduce((total, test) => {
      const minutes = parseInt(test.duration.split(' ')[0]);
      return total + minutes;
    }, 0);

    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`;
    }
    return `${totalMinutes} phút`;
  };

  return (
    <div className="lab-tests">
      <div className="lab-tests-header">
        <button
          className="back-button"
          onClick={() => navigate('/dat-lich-xet-nghiem')}
        >
          ← Quay lại chọn lịch
        </button>
        <h1>Chọn xét nghiệm</h1>
        <p>Lựa chọn các xét nghiệm phù hợp với nhu cầu sức khỏe của bạn</p>
      </div>

      <div className="tests-container">
        <div className="tests-content">
          {/* Schedule Info */}
          {labSchedule && (
            <div className="schedule-info">
              <h3>📅 Lịch đã chọn</h3>
              <div className="schedule-details">
                <p>
                  <strong>Ngày:</strong> {labSchedule.dateString}
                </p>
                <p>
                  <strong>Ca:</strong> {labSchedule.sessionName} (
                  {labSchedule.sessionTime})
                </p>
              </div>
            </div>
          )}

          {/* Test Categories */}
          <div className="test-categories">
            {labTestCategories.map((category) => (
              <div key={category.id} className="test-category">
                <div className="category-header">
                  <div className="category-title">
                    <span className="category-icon">{category.icon}</span>
                    <div className="category-text">
                      <h3>{category.name}</h3>
                      <p className="category-description">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="category-tests">
                  {category.tests.map((test) => {
                    const isSelected = selectedTests.find(
                      (t) => t.id === test.id
                    );

                    return (
                      <div
                        key={test.id}
                        className={`test-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleTestToggle(test)}
                      >
                        <div className="test-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleTestToggle(test)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div className="test-details">
                          <div className="test-main-info">
                            <h4 className="test-name">{test.name}</h4>
                          </div>
                          <p className="test-description">{test.description}</p>
                          <div className="test-meta">
                            <span className="test-duration">
                              ⏱️ {test.duration}
                            </span>
                            <span className="test-price">
                              {formatPrice(test.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="summary-sidebar">
          <div className="summary-card">
            <h3>📋 Tóm tắt đơn hàng</h3>

            {selectedTests.length === 0 ? (
              <p className="empty-selection">Chưa chọn xét nghiệm nào</p>
            ) : (
              <>
                <div className="selected-tests">
                  <h4>Xét nghiệm đã chọn ({selectedTests.length})</h4>
                  {selectedTests.map((test) => (
                    <div key={test.id} className="selected-test-item">
                      <span className="selected-test-name">{test.name}</span>
                      <span className="selected-test-price">
                        {formatPrice(test.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="total-duration">
                    <span>Tổng thời gian:</span>
                    <span>{getTotalDuration()}</span>
                  </div>
                  <div className="total-price">
                    <span>Tổng chi phí:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>

                <button className="continue-button" onClick={handleContinue}>
                  Tiếp tục đặt lịch →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTests;
