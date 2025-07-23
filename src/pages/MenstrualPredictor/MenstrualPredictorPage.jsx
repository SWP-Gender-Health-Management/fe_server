import { useCallback, useState, useEffect } from 'react';
import { Row, Col, message, Spin, Modal, Button } from 'antd';
import {
  getMenstrualCycleData,
  updateMenstrualCycle,
  predictPeriod,
} from '@/api/customerApi';
import {
  HomeOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CalendarView from './components/CalendarView';
import CycleUpdateModal from './components/CycleUpdateModal';
import DayInfoModal from './components/DayInfoModal';
import './MenstrualPredictorPage.css';
import Cookies from 'js-cookie';
import SetupMenstrualForm from './components/SetupMenstrualForm';
import { useAuth } from '../../context/AuthContext';
import LoginRequiredModal from '../../components/LoginRequiredModal/LoginRequiredModal';

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
  // const [nextStartDate, setNextStartDate] = useState(null); // Xóa nếu không dùng
  const [periodDays, setPeriodDays] = useState({});
  const [ovulationDays, setOvulationDays] = useState({});

  // UI states for tracking setup flow
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showNotFemaleModal, setShowNotFemaleModal] = useState(false);

  // New modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDayInfoModal, setShowDayInfoModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const token = Cookies.get('accessToken');
  const navigate = useNavigate();
  console.log('Token:', token);

  // Lấy accountId từ token
  let accountId = null;
  try {
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      accountId = JSON.parse(jsonPayload).account_id;
    }
  } catch {
    accountId = null;
  }

  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);

  useEffect(() => {
    setShowLoginModal(!isLoggedIn);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <LoginRequiredModal
        visible={showLoginModal}
        onCancel={() => navigate('/')}
        message="Bạn cần đăng nhập để sử dụng tính năng theo dõi chu kỳ kinh nguyệt!"
      />
    );
  }

  useEffect(() => {
    const checkTrackingStatus = async () => {
      try {
        const { data } = await getMenstrualCycleData(token);
        const hasTrackingData = data?.result;
        console.log('hasTrackingData:', hasTrackingData);
        if (hasTrackingData === '11') {
          await getPredictionData();
          return;
        } else if (hasTrackingData === '10') {
          console.log(
            'No tracking data found (result: false), showing setup form'
          );
          setShowSetupForm(true);
          setInitialLoading(false);
          return;
        } else {
          console.log('Customer is not female, showing notification modal');
          setShowNotFemaleModal(true);
          setInitialLoading(false);
          return;
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái theo dõi:', error);
        setShowSetupForm(true);
        setInitialLoading(false);
      }
    };
    checkTrackingStatus();
  }, []);

  const getPredictionData = async () => {
    try {
      const { data: responseData } = await predictPeriod(accountId, token);
      const data = responseData?.result;

      if (!data) {
        console.log('No prediction data available, showing setup form');
        setShowSetupForm(true);
      } else {
        console.log('Complete tracking data found, showing main interface');
        setInitialLoading(false);

        if (data.current_start_date) {
          setLastPeriodStart(data.current_start_date);
        }
        if (data.current_period) {
          setPeriodLength(data.current_period);
        }
        if (data.current_end_date && data.current_start_date) {
          const cycleLength =
            Math.ceil(
              (new Date(data.current_end_date) -
                new Date(data.current_start_date)) /
                (1000 * 60 * 60 * 24)
            ) + 1;
          setCycleLength(cycleLength);
        }

        setPeriodDays(data.periodDaysMap || {});
        setOvulationDays(data.ovulationDaysMap || {});

        if (
          data.current_start_date &&
          data.current_end_date &&
          data.current_period
        ) {
          const currentStart = new Date(data.current_start_date);
          const averageCycleLength = data.current_period;

          const nextPeriodStart = new Date(currentStart);
          nextPeriodStart.setDate(currentStart.getDate() + averageCycleLength);
          // setNextStartDate(nextPeriodStart); // Xóa nếu không dùng

          const ovulationDate = new Date(nextPeriodStart);
          ovulationDate.setDate(nextPeriodStart.getDate() - 14);

          const fertileStart = new Date(ovulationDate);
          fertileStart.setDate(ovulationDate.getDate() - 2);
          const fertileEnd = new Date(ovulationDate);
          fertileEnd.setDate(ovulationDate.getDate() + 2);

          const nextPeriodEnd = new Date(nextPeriodStart);
          nextPeriodEnd.setDate(
            nextPeriodStart.getDate() + (data.current_period - 1)
          );
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu dự đoán:', error);
      setShowSetupForm(true);
    }
  };

  const handleGoHome = () => {
    setShowNotFemaleModal(false);
    navigate('/');
  };

  // Calculate cycle phase
  const getCurrentPhase = () => {
    if (!lastPeriodStart || !cycleLength || !periodLength) return 'unknown';

    const lastPeriod = new Date(lastPeriodStart);
    const daysDiff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysDiff % cycleLength) + 1;

    const estimatedOvulationDay = cycleLength - 14;

    if (cycleDay <= periodLength) return 'menstrual';
    if (
      cycleDay >= estimatedOvulationDay - 2 &&
      cycleDay <= estimatedOvulationDay + 1
    )
      return 'ovulation';
    if (cycleDay < estimatedOvulationDay) return 'follicular';
    if (cycleDay > estimatedOvulationDay) return 'luteal';
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
    if (!lastPeriodStart || !periodLength) {
      message.error('Vui lòng nhập đầy đủ thông tin chu kỳ!');
      return;
    }
    try {
      const startDate = new Date(lastPeriodStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (Number(periodLength) - 1));
      await updateMenstrualCycle({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        note: 'Cập nhật chu kỳ kinh nguyệt từ giao diện người dùng',
      }, token);
      await getPredictionData();
      message.success('Cập nhật thành công!');
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật chu kỳ:', err);
      if (err.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      } else if (err.response?.status === 400) {
        message.error('Thông tin cập nhật không hợp lệ. Vui lòng kiểm tra lại!');
      } else {
        message.error('Không thể cập nhật chu kỳ. Vui lòng thử lại!');
      }
    }
  }, [lastPeriodStart, periodLength, getPredictionData, token]);

  // Handle setup completion
  const handleSetupComplete = () => {
    setShowSetupForm(false);
    getPredictionData();
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (day) {
      setSelectedDay(day);
      setShowDayInfoModal(true);
    }
  };

  // Get day information for modal
  const getDayInfo = (day) => {
    if (!day) return null;
    
    const selectedDate = new Date(year, month, day);
    const isPeriod = periodDays[`${year}-${month}`]?.includes(day);
    const isOvulation = ovulationDays[`${year}-${month}`]?.includes(day);
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    // Calculate cycle day
    let cycleDay = null;
    let phase = null;
    if (lastPeriodStart && cycleLength) {
      const lastPeriod = new Date(lastPeriodStart);
      const daysDiff = Math.floor(
        (selectedDate - lastPeriod) / (1000 * 60 * 60 * 24)
      );
      cycleDay = (daysDiff % cycleLength) + 1;
      phase = getCurrentPhase();
    }

    return {
      date: selectedDate,
      day: day,
      isPeriod,
      isOvulation,
      isToday,
      cycleDay,
      phase,
      phaseInfo: getPhaseInfo(phase),
    };
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
      {/* Main Content - Centered Calendar */}
      <div className="tracker-main-content">
        <div className="calendar-wrapper">
          <CalendarView
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            periodDays={periodDays[`${year}-${month}`] || []}
            ovulationDays={ovulationDays[`${year}-${month}`] || []}
            onDayClick={handleDayClick}
            onUpdateClick={() => setShowUpdateModal(true)}
          />
        </div>
      </div>

      {/* Update Cycle Modal */}
      <CycleUpdateModal
        visible={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        lastPeriodStart={lastPeriodStart}
        setLastPeriodStart={setLastPeriodStart}
        cycleLength={cycleLength}
        setCycleLength={setCycleLength}
        periodLength={periodLength}
        setPeriodLength={setPeriodLength}
        onUpdate={handleUpdate}
      />

      {/* Day Info Modal */}
      <DayInfoModal
        visible={showDayInfoModal}
        onCancel={() => setShowDayInfoModal(false)}
        dayInfo={getDayInfo(selectedDay)}
      />

      {/* Not Female Modal */}
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
