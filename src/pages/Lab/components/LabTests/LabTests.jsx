import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LabTests.css';
import { getAllLaboratories } from '@/api/labApi';
import Cookies from 'js-cookie';

const LabTests = () => {
  const navigate = useNavigate();
  const [selectedLabIds, setSelectedLabIds] = useState([]); // array of selected lab_id strings
  const [labSchedule, setLabSchedule] = useState(null);
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    // Get schedule from sessionStorage
    const schedule = sessionStorage.getItem('labSchedule');
    if (schedule) {
      setLabSchedule(JSON.parse(schedule));
    } else {
      // If no schedule, redirect back
      navigate('/dat-lich-xet-nghiem');
    }
    // Lấy danh sách xét nghiệm thực tế
    const token = Cookies.get('accessToken');
    getAllLaboratories(token).then((res) => {
      setLabTests(res.data.result || []);
    });
  }, [navigate]);

  const handleTestToggle = (lab_id) => {
    setSelectedLabIds((prev) => {
      if (prev.includes(lab_id)) {
        return prev.filter((selectedId) => selectedId !== lab_id);
      } else {
        return [...prev, lab_id];
      }
    });
  };

  // Update selectedCombos to use selectedLabIds
  const selectedCombos = labTests.filter((combo) =>
    selectedLabIds.includes(combo.lab_id)
  );
  const calculateTotal = () =>
    selectedCombos.reduce((total, combo) => total + combo.price, 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleContinue = () => {
    if (selectedLabIds.length > 0) {
      // Save selected test objects to sessionStorage
      sessionStorage.setItem(
        'selectedLabTests',
        JSON.stringify(selectedCombos)
      );
      navigate('/thong-tin-xet-nghiem');
    }
  };

  const getTotalDuration = () => {
    const totalMinutes = selectedCombos.reduce((total, combo) => {
      if (!combo.duration) return total;
      const minutes = parseInt(combo.duration.split(' ')[0]);
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
            {Array.isArray(labTests) && labTests.length > 0 ? (
              labTests.map((category, catIdx) => {
                const isSelected = selectedLabIds.includes(category.lab_id);
                return (
                  <div
                    key={category.lab_id || `cat-${catIdx}`}
                    className={`test-item combo ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="test-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleTestToggle(category.lab_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="test-details">
                      <div className="test-main-info">
                        <h4 className="test-name">{category.name}</h4>
                      </div>
                      <p className="test-description">{category.description}</p>
                      <div className="test-meta">
                        <span className="test-duration">
                          ⏱️ {category.duration}
                        </span>
                        <span className="test-price">
                          {formatPrice(category.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-categories">
                Không tìm thấy danh mục xét nghiệm hoặc có lỗi khi tải dữ liệu.
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="summary-sidebar">
          <div className="summary-card">
            <h3>📋 Tóm tắt đơn hàng</h3>

            {selectedCombos.length === 0 ? (
              <p className="empty-selection">Chưa chọn xét nghiệm nào</p>
            ) : (
              <>
                <div className="selected-tests">
                  <h4>Xét nghiệm đã chọn ({selectedCombos.length})</h4>
                  {selectedCombos.map((combo) => (
                    <div key={combo.lab_id} className="selected-test-item">
                      <span className="selected-test-name">{combo.name}</span>
                      <span className="selected-test-price">
                        {formatPrice(combo.price)}
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
