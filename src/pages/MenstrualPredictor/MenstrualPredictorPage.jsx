import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, message, Spin, Modal, Button } from 'antd';
import { HomeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import CurrentPhaseCard from './components/CurrentPhaseCard';
import CycleSettingsCard from './components/CycleSettingsCard';
import PredictionsCard from './components/PredictionsCard';
import HealthTipsCard from './components/HealthTipsCard';
import SetupMenstrualForm from './components/SetupMenstrualForm';
import './MenstrualPredictorPage.css';
import Cookies from 'js-cookie';

const MenstrualPredictorPage = () => {
  console.log('MenstrualPredictorPage component is rendering...');

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // Menstrual cycle data states
  const [cycleLength, setCycleLength] = useState(null);
  const [periodLength, setPeriodLength] = useState(null);
  const [lastPeriodStart, setLastPeriodStart] = useState('');

  // Prediction data states
  const [nextStartDate, setNextStartDate] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [fertileRange, setFertileRange] = useState({ start: null, end: null });
  const [nextEndDate, setNextEndDate] = useState(null);
  const [periodDays, setPeriodDays] = useState({});
  const [ovulationDays, setOvulationDays] = useState({});

  // UI states for tracking setup flow
  const [isTrackingSetup, setIsTrackingSetup] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showNotFemaleModal, setShowNotFemaleModal] = useState(false);

  const token = Cookies.get('accessToken');
  const navigate = useNavigate();
  console.log('Token:', token);

  /**
   * API Flow for checking menstrual tracking status:
   * 1. Check if customer has any menstrual cycle data (/customer/get-menstrual-cycle) - returns true/false
   * 2. If true, fetch prediction data (/customer/predict-period) - returns full cycle data
   * 3. If false, show setup form that calls (/customer/track-period) to create initial data
   * 4. For updates, use (/customer/update-menstrual-cycle)
   */

  // 1. Check if customer has any menstrual cycle data (/customer/get-menstrual-cycle) - returns true/false
  const getMenstrualCycleData = async () => {
    const response = await axios.get(
      `http://localhost:3000/customer/get-menstrual-cycle`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('getMenstrualCycleData response:', response.data);
    const result = response.data?.result;
    return result;
  };

  // 2. If true, fetch prediction data (/customer/predict-period) - returns full cycle data
  const getPredictionData = async () => {
    const response = await axios.get(
      `http://localhost:3000/customer/predict-period`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('getPredictionData response:', response.data);
    const data = response.data?.data;

    if (!data) {
      console.log('No prediction data available, showing setup form');
      setShowSetupForm(true);
      setIsTrackingSetup(false);
    } else {
      console.log('Complete tracking data found, showing main interface');
      setIsTrackingSetup(true);
      setShowSetupForm(false);
      setInitialLoading(false);
      // Set basic cycle information from API response
      if (data.current_start_date) {
        setLastPeriodStart(data.current_start_date);
      }
      if (data.current_period) {
        setPeriodLength(data.current_period);
      }
      if (data.current_end_date && data.current_start_date) {
        // Calculate cycle length from start to end date
        const cycleLength =
          Math.ceil(
            (new Date(data.current_end_date) -
              new Date(data.current_start_date)) /
              (1000 * 60 * 60 * 24)
          ) + 1;
        setCycleLength(cycleLength);
      }

      // Set calendar data from API response
      setPeriodDays(data.periodDaysMap || {});
      setOvulationDays(data.ovulationDaysMap || {});

      // Calculate predictions for next cycle
      if (
        data.current_start_date &&
        data.current_end_date &&
        data.current_period
      ) {
        const currentStart = new Date(data.current_start_date);
        const averageCycleLength = data.current_period;

        // Calculate next period start (current start + cycle length)
        const nextPeriodStart = new Date(currentStart);
        nextPeriodStart.setDate(currentStart.getDate() + averageCycleLength);
        setNextStartDate(nextPeriodStart);

        // Calculate ovulation date (14 days before next period)
        const ovulationDate = new Date(nextPeriodStart);
        ovulationDate.setDate(nextPeriodStart.getDate() - 14);
        setOvulationDate(ovulationDate);

        // Calculate fertile window (2 days before to 2 days after ovulation)
        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(ovulationDate.getDate() - 2);
        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(ovulationDate.getDate() + 2);
        setFertileRange({ start: fertileStart, end: fertileEnd });

        // Calculate next period end date
        const nextPeriodEnd = new Date(nextPeriodStart);
        nextPeriodEnd.setDate(
          nextPeriodStart.getDate() + (data.current_period - 1)
        );
        setNextEndDate(nextPeriodEnd);
      }
    }
  };

  const handleGoHome = () => {
    setShowNotFemaleModal(false);
    navigate('/');
  };

  useEffect(() => {
    const checkTrackingStatus = async () => {
      // console.assert('useEffect triggered, calling fetchCheckTrackingStatus');
      try {
        const hasTrackingData = await getMenstrualCycleData();
        console.log('hasTrackingData:', hasTrackingData);
        if (hasTrackingData === '11') {
          await getPredictionData();
        } else if (hasTrackingData === '10') {
          console.log(
            'No tracking data found (result: false), showing setup form'
          );
          setShowSetupForm(true);
          setIsTrackingSetup(false);
          setInitialLoading(false);
          return;
        } else if (hasTrackingData === '01') {
          console.log('Customer is not female, showing notification modal');
          setShowNotFemaleModal(true);
          setInitialLoading(false);
          return;
        } else {
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái theo dõi:', error);
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      }
    };
    checkTrackingStatus();
  }, []);

  // Calculate cycle phase
  const getCurrentPhase = () => {
    if (!lastPeriodStart || !cycleLength || !periodLength) return 'unknown';

    const lastPeriod = new Date(lastPeriodStart);
    const daysDiff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysDiff % cycleLength) + 1;

    // Ước tính ngày rụng trứng bằng cách lấy độ dài chu kỳ trừ đi 14 ngày
    const estimatedOvulationDay = cycleLength - 14;

    if (cycleDay <= periodLength) return 'menstrual'; // Giai đoạn hành kinh
    // Ngày rụng trứng thực tế là một khoảng ngắn xung quanh ngày dự kiến
    if (
      cycleDay >= estimatedOvulationDay - 2 &&
      cycleDay <= estimatedOvulationDay + 1
    )
      return 'ovulation'; // Cửa sổ rụng trứng
    if (cycleDay < estimatedOvulationDay) return 'follicular'; // Trước khi rụng trứng là giai đoạn nang noãn
    if (cycleDay > estimatedOvulationDay) return 'luteal'; // Sau khi rụng trứng là giai đoạn hoàng thể
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

  const handleUpdate = useCallback(async () => {
    const token = Cookies.get('accessToken');

    if (!token) {
      message.error('Vui lòng đăng nhập để cập nhật thông tin!');
      return;
    }

    if (!lastPeriodStart || !periodLength) {
      message.error('Vui lòng nhập đầy đủ thông tin chu kỳ!');
      return;
    }

    try {
      // Calculate end date from start date and period length
      const startDate = new Date(lastPeriodStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (Number(periodLength) - 1));

      // Update menstrual cycle information using update API
      const response = await axios.post(
        'http://localhost:3000/customer/update-menstrual-cycle',
        {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          note: 'Cập nhật chu kỳ kinh nguyệt từ giao diện người dùng',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Refresh data after successful update
      await getPredictionData();
      message.success('Cập nhật thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật chu kỳ:', err);
      if (err.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (err.response?.status === 400) {
        message.error(
          'Thông tin cập nhật không hợp lệ. Vui lòng kiểm tra lại!'
        );
      } else {
        message.error('Không thể cập nhật chu kỳ. Vui lòng thử lại!');
      }
    }
  }, [lastPeriodStart, periodLength, getPredictionData]);

  // Handle setup completion
  const handleSetupComplete = () => {
    setShowSetupForm(false);
    setIsTrackingSetup(true);
    // Fetch the updated data
    getPredictionData();
  };

  const currentPhase = getCurrentPhase();
  const phaseInfo = getPhaseInfo(currentPhase);

  // Calculate days until next period
  const daysUntilNextPeriod = () => {
    if (!nextStartDate) return null;
    const diffTime = nextStartDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Show loading spinner during initial check
  if (initialLoading) {
    console.log('Still loading initial status...');
    return (
      <div className="menstrual-tracker-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Spin size="large" />
            <h3
              style={{ marginTop: '24px', color: '#262626', fontSize: '18px' }}
            >
              Đang kiểm tra dữ liệu theo dõi...
            </h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '0' }}>
              Vui lòng chờ trong giây lát
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show setup form if customer hasn't registered for tracking
  if (showSetupForm) {
    console.log('Showing setup form...');
    return <SetupMenstrualForm onSetupComplete={handleSetupComplete} />;
  }

  // Show main tracking interface
  console.log('Showing main interface...');
  return (
    <div className="menstrual-tracker-container">
      <Row gutter={[24, 24]} style={{ minHeight: '100vh', padding: '20px' }}>
        {/* Left Side - Calendar */}
        <Col xs={24} lg={12}>
          <CalendarView
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            periodDays={periodDays[`${year}-${month}`] || []}
            ovulationDays={ovulationDays[`${year}-${month}`] || []}
          />
        </Col>

        {/* Right Side - Information Panels */}
        <Col xs={24} lg={12}>
          <div className="info-panels">
            <CurrentPhaseCard
              phaseInfo={phaseInfo}
              daysUntilNextPeriod={daysUntilNextPeriod()}
            />

            <CycleSettingsCard
              lastPeriodStart={lastPeriodStart}
              setLastPeriodStart={setLastPeriodStart}
              cycleLength={cycleLength}
              setCycleLength={setCycleLength}
              periodLength={periodLength}
              setPeriodLength={setPeriodLength}
              handleUpdate={handleUpdate}
            />

            <PredictionsCard
              nextStartDate={nextStartDate}
              ovulationDate={ovulationDate}
              fertileRange={fertileRange}
            />

            <HealthTipsCard phaseInfo={phaseInfo} />
          </div>
        </Col>
      </Row>

      <Modal
        title={
          <div style={{ textAlign: 'center', color: '#faad14' }}>
            <ExclamationCircleOutlined
              style={{ marginRight: '8px', fontSize: '20px' }}
            />
            Thông Báo Quan Trọng
          </div>
        }
        open={showNotFemaleModal}
        onCancel={handleGoHome}
        footer={[
          <Button
            key="home"
            type="primary"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
            }}
          >
            Quay Về Trang Chủ
          </Button>,
        ]}
        width={500}
        centered
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(250, 173, 20, 0.3)',
            }}
          >
            <ExclamationCircleOutlined
              style={{
                fontSize: '40px',
                color: '#ffffff',
              }}
            />
          </div>

          <h3
            style={{ color: '#262626', marginBottom: '12px', fontSize: '18px' }}
          >
            Tính Năng Không Khả Dụng
          </h3>

          <p
            style={{
              color: '#666',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '16px',
            }}
          >
            Tính năng theo dõi chu kỳ kinh nguyệt chỉ dành cho người nữ.
          </p>

          <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.5' }}>
            Vui lòng quay về trang chủ để sử dụng các tính năng khác phù hợp với
            bạn.
          </p>

          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              background: '#fff7e6',
              borderRadius: '8px',
              border: '1px solid #ffd591',
            }}
          >
            <p
              style={{
                color: '#faad14',
                fontSize: '12px',
                margin: '0',
                fontWeight: '500',
              }}
            >
              💡 Gợi ý: Bạn có thể khám phá các dịch vụ khác như đặt lịch khám,
              tư vấn sức khỏe, hoặc xem thông tin bệnh viện
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenstrualPredictorPage;
