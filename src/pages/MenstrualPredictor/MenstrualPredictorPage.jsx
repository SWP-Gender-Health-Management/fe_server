import { useCallback, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Card,
  Row,
  Col,
  Divider,
  Progress,
  Alert,
  Tooltip,
  message,
} from 'antd';
import {
  HeartOutlined,
  CalendarOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import './MenstrualPredictorPage.css';

const MenstrualPredictorPage = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [cycleLength, setCycleLength] = useState(null);
  const [periodLength, setPeriodLength] = useState(null);
  const [lastPeriodStart, setLastPeriodStart] = useState('');

  const [nextStartDate, setNextStartDate] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileRange, setFertileRange] = useState({ start: null, end: null });
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const idFromToken = getAccountIdFromToken();
    if (idFromToken) {
      setAccountId(idFromToken);
    } else {
      message.warning(
        'Không thể tìm thấy account_id từ token. Vui lòng đăng nhập lại.'
      );
    }
  }, []);

  const token =
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken');

  // Calculate cycle phase
  const getCurrentPhase = () => {
    if (!lastPeriodStart || !cycleLength || !periodLength) return 'unknown';

    const lastPeriod = new Date(lastPeriodStart);
    const daysDiff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysDiff % cycleLength) + 1;

    if (cycleDay <= periodLength) return 'menstrual';
    if (cycleDay <= 9) return 'follicular';
    if (cycleDay >= 10 && cycleDay <= 16) return 'ovulation';
    return 'luteal';
  };

  const getPhaseInfo = (phase) => {
    const phases = {
      menstrual: {
        name: 'Kỳ hành kinh',
        color: '#ff4d4f',
        description:
          'Giai đoạn hành kinh, cơ thể đang loại bỏ lớp nội mạc tử cung',
        tips: [
          'Nghỉ ngơi đầy đủ',
          'Uống nhiều nước',
          'Tránh căng thẳng',
          'Có thể dùng túi chườm ấm',
        ],
      },
      follicular: {
        name: 'Kỳ nang trứng',
        color: '#52c41a',
        description: 'Nang trứng phát triển, hormone estrogen tăng',
        tips: [
          'Tăng cường tập thể dục',
          'Ăn nhiều protein',
          'Tâm trạng tích cực',
          'Làn da sáng khỏe',
        ],
      },
      ovulation: {
        name: 'Kỳ rụng trứng',
        color: '#faad14',
        description: 'Thời kỳ dễ thụ thai nhất trong chu kỳ',
        tips: [
          'Theo dõi nhiệt độ cơ thể',
          'Quan sát chất nhầy cổ tử cung',
          'Tăng cường canxi',
          'Uống đủ nước',
        ],
      },
      luteal: {
        name: 'Kỳ hoàng thể',
        color: '#722ed1',
        description: 'Cơ thể chuẩn bị cho kỳ kinh tiếp theo',
        tips: [
          'Giảm caffeine',
          'Ăn nhiều magie',
          'Quản lý stress',
          'Ngủ đủ giấc',
        ],
      },
    };
    return (
      phases[phase] || {
        name: 'Không xác định',
        color: '#d9d9d9',
        description: '',
        tips: [],
      }
    );
  };

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const fetchLastPeriodData = useCallback(async () => {
    const api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!accountId || !token) return;

    try {
      const res = await api.get('/customer/get-period', {
        params: { account_id: accountId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;
      if (!data?.start_date) {
        console.log('Người dùng chưa có dữ liệu kỳ kinh');
        return;
      }
      setLastPeriodStart(data.start_date);
      setPeriodLength(data.period);
      setCycleLength(data.cycle_length);
    } catch (err) {
      console.error('Không thể lấy thông tin kỳ kinh:', err);
      message.error('Lỗi tải dữ liệu, thử lại sau!');
    }
  }, [accountId, token]);

  const getAccountIdFromToken = () => {
    const token =
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.account_id;
    } catch (err) {
      console.error('Không thể giải mã token:', err);
      return null;
    }
  };

  const calculatePeriodDays = () => {
    if (!lastPeriodStart || !cycleLength || !periodLength) return {};
    const periodDaysMap = {};
    const start = new Date(lastPeriodStart);
    const end = new Date(year + 1, 11, 31);
    let current = new Date(start);

    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
      for (let i = 0; i < periodLength; i++) {
        const day = new Date(current);
        day.setDate(current.getDate() + i);
        if (day.getMonth() === current.getMonth()) {
          if (!periodDaysMap[monthKey]) periodDaysMap[monthKey] = [];
          periodDaysMap[monthKey].push(day.getDate());
        }
      }
      current.setDate(current.getDate() + cycleLength);
    }
    return periodDaysMap;
  };

  const calculateOvulationDays = () => {
    if (!lastPeriodStart || !cycleLength) return {};
    const ovulationDaysMap = {};
    const start = new Date(lastPeriodStart);
    const end = new Date(year + 1, 11, 31);
    let current = new Date(start);

    while (current <= end) {
      const ovulationDay = new Date(current);
      ovulationDay.setDate(current.getDate() + cycleLength - 14);

      if (
        ovulationDay.getFullYear() === year ||
        ovulationDay.getFullYear() === year + 1
      ) {
        const monthKey = `${ovulationDay.getFullYear()}-${ovulationDay.getMonth()}`;
        if (!ovulationDaysMap[monthKey]) ovulationDaysMap[monthKey] = [];
        ovulationDaysMap[monthKey].push(ovulationDay.getDate());
      }
      current.setDate(current.getDate() + cycleLength);
    }
    return ovulationDaysMap;
  };

  const periodDaysMap = calculatePeriodDays();
  const ovulationDaysMap = calculateOvulationDays();
  const key = `${year}-${month}`;
  const periodDays = periodDaysMap[key] || [];
  const ovulationDays = ovulationDaysMap[key] || [];

  const numDays = daysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);

  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: numDays }, (_, i) => i + 1)
  );

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleUpdate = useCallback(async () => {
    const token =
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('accessToken');

    const api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Kiểm tra hợp lệ trước khi gọi API
    if (
      !accountId ||
      !lastPeriodStart ||
      !cycleLength ||
      !periodLength ||
      isNaN(+cycleLength) ||
      isNaN(+periodLength) ||
      isNaN(new Date(lastPeriodStart).getTime())
    ) {
      return alert('Vui lòng nhập đầy đủ và hợp lệ!');
    }

    try {
      // Gửi thông tin chu kỳ
      await api.post('/customer/track-period', {
        account_id: accountId,
        period: Number(periodLength),
        cycle_length: Number(cycleLength),
        start_date: new Date(lastPeriodStart).toISOString(),
        end_date: new Date(lastPeriodStart).toISOString(),
        note: 'Nhập kỳ kinh lần đầu',
      });

      // Gọi API dự đoán
      const res = await api.get('/customer/predict-period', {
        params: { account_id: accountId },
      });

      const { next_start_date } = res.data.data;

      const nextDate = new Date(next_start_date);
      const ovulation = new Date(nextDate);
      ovulation.setDate(ovulation.getDate() - 14);
      const fertileStart = new Date(ovulation);
      fertileStart.setDate(fertileStart.getDate() - 2);
      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(fertileEnd.getDate() + 2);

      setNextStartDate(nextDate);
      setOvulationDate(ovulation);
      setFertileRange({ start: fertileStart, end: fertileEnd });

      message.success('Cập nhật thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật chu kỳ:', err);
      message.error('Không thể cập nhật chu kỳ!');
    }
  }, [accountId, lastPeriodStart, cycleLength, periodLength]);

  useEffect(() => {
    if (accountId) {
      fetchLastPeriodData();
    }
  }, [accountId, fetchLastPeriodData]);

  const currentPhase = getCurrentPhase();
  const phaseInfo = getPhaseInfo(currentPhase);

  // Calculate days until next period
  const daysUntilNextPeriod = () => {
    if (!nextStartDate) return null;
    const diffTime = nextStartDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const getDayClass = (day) => {
    if (!day) return '';
    let classes = 'calendar-day normal';

    if (periodDays.includes(day)) classes += ' period';
    if (ovulationDays.includes(day)) classes += ' ovulation';

    // Highlight today
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    if (isToday) classes += ' today';

    return classes;
  };

  return (
    <div className="menstrual-tracker-container">
      <Row gutter={[24, 24]} style={{ minHeight: '100vh', padding: '20px' }}>
        {/* Left Side - Calendar */}
        <Col xs={24} lg={12}>
          <Card
            className="calendar-card"
            title={
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Lịch Kinh Nguyệt
              </div>
            }
          >
            <div className="menstrual-calendar">
              <div className="menstrual-nav">
                <button onClick={prevMonth} className="menstrual-button">
                  ◀
                </button>
                <h2 className="menstrual-header">
                  Tháng {month + 1} {year}
                </h2>
                <button onClick={nextMonth} className="menstrual-button">
                  ▶
                </button>
              </div>

              <div className="calendar-grid">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                  <div key={d} className="calendar-day calendar-header">
                    {d}
                  </div>
                ))}
                {days.map((day, idx) => (
                  <Tooltip
                    key={idx}
                    title={
                      day && periodDays.includes(day)
                        ? 'Ngày hành kinh'
                        : day && ovulationDays.includes(day)
                          ? 'Ngày rụng trứng'
                          : day
                            ? `${day}/${month + 1}/${year}`
                            : ''
                    }
                  >
                    <div className={getDayClass(day)}>{day || ''}</div>
                  </Tooltip>
                ))}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color period"></div>
                  <span>Kỳ hành kinh</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color ovulation"></div>
                  <span>Ngày rụng trứng</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color today"></div>
                  <span>Hôm nay</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Side - Information Panels */}
        <Col xs={24} lg={12}>
          <div className="info-panels">
            {/* Current Phase Info */}
            <Card
              className="phase-card"
              style={{
                marginBottom: '16px',
                borderLeft: `4px solid ${phaseInfo.color}`,
              }}
              title={
                <div style={{ color: phaseInfo.color }}>
                  <HeartOutlined style={{ marginRight: '8px' }} />
                  {phaseInfo.name}
                </div>
              }
            >
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>
                {phaseInfo.description}
              </p>
              {daysUntilNextPeriod() && (
                <Alert
                  message={`Còn ${daysUntilNextPeriod()} ngày đến kỳ kinh tiếp theo`}
                  type="info"
                  showIcon
                  style={{ marginBottom: '12px' }}
                />
              )}
            </Card>

            {/* Cycle Settings */}
            <Card title="Cài Đặt Chu Kỳ" style={{ marginBottom: '16px' }}>
              <div className="setting-item">
                <label>Ngày đầu kỳ kinh gần nhất:</label>
                <input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="setting-item">
                <label>Độ dài chu kỳ (ngày):</label>
                <input
                  type="number"
                  value={cycleLength || ''}
                  onChange={(e) =>
                    setCycleLength(
                      e.target.value ? parseInt(e.target.value) : ''
                    )
                  }
                  min={20}
                  max={40}
                  className="number-input"
                />
              </div>
              <div className="setting-item">
                <label>Số ngày hành kinh:</label>
                <input
                  type="number"
                  value={periodLength || ''}
                  onChange={(e) =>
                    setPeriodLength(
                      e.target.value ? parseInt(e.target.value) : ''
                    )
                  }
                  min={1}
                  max={10}
                  className="number-input"
                />
              </div>
            </Card>
            <button onClick={handleUpdate} className="update-button">
              Cập nhật kỳ kinh
            </button>
            {/* Predictions */}
            <Card title="Dự Báo" style={{ marginBottom: '16px' }}>
              <div className="prediction-item">
                <ThunderboltOutlined
                  style={{ color: '#ff4d4f', marginRight: '8px' }}
                />
                <strong>Kỳ kinh tiếp theo:</strong>{' '}
                {nextStartDate
                  ? nextStartDate.toLocaleDateString('vi-VN')
                  : 'Đang tính toán...'}
              </div>
              {ovulationDate && (
                <div className="prediction-item">
                  <ThunderboltOutlined
                    style={{ color: '#faad14', marginRight: '8px' }}
                  />
                  <strong>Ngày rụng trứng:</strong>{' '}
                  {ovulationDate.toLocaleDateString('vi-VN')}
                </div>
              )}
              {fertileRange.start && (
                <div className="prediction-item">
                  <ThunderboltOutlined
                    style={{ color: '#52c41a', marginRight: '8px' }}
                  />
                  <strong>Thời kỳ dễ thụ thai:</strong>{' '}
                  {fertileRange.start.toLocaleDateString('vi-VN')} -{' '}
                  {fertileRange.end.toLocaleDateString('vi-VN')}
                </div>
              )}
            </Card>

            {/* Health Tips */}
            <Card
              title={
                <div>
                  <BulbOutlined style={{ marginRight: '8px' }} />
                  Lời Khuyên Sức Khỏe
                </div>
              }
            >
              <div className="tips-container">
                {phaseInfo.tips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <InfoCircleOutlined
                      style={{ color: phaseInfo.color, marginRight: '8px' }}
                    />
                    {tip}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MenstrualPredictorPage;
