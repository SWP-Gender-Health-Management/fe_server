import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, message, Spin } from 'antd';
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

  const token = Cookies.get('accessToken');
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
    return response.data?.result;
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

  const fetchCheckTrackingStatus = useCallback(async () => {
    console.log('fetchCheckTrackingStatus called...');

    if (!token) {
      console.log('No token found, showing setup form');
      setShowSetupForm(false);
      setIsTrackingSetup(false);
      setInitialLoading(false);
      return;
    }

    try {
      console.log('Making API call to check tracking status...');

      // Step 1: Check if customer has menstrual cycle data
      const checkResponse = await axios.get(
        `http://localhost:3000/customer/get-menstrual-cycle`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Check API response:', checkResponse.data);
      const hasTrackingData = checkResponse.data?.result || false;

      // If no tracking data exists, show setup form
      if (!hasTrackingData) {
        console.log(
          'No tracking data found (result: false), showing setup form'
        );
        setShowSetupForm(true);
        setIsTrackingSetup(false);
        setInitialLoading(false);
        return;
      }

      // Step 2: If tracking data exists, get prediction data
      console.log(
        'Tracking data exists (result: true), fetching predictions...'
      );
      const predictionResponse = await axios.get(
        `http://localhost:3000/customer/predict-period`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Prediction API response:', predictionResponse.data);
      const data = predictionResponse.data?.data;

      if (!data) {
        console.log('No prediction data available, showing setup form');
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      } else {
        console.log('Complete tracking data found, showing main interface');
        setIsTrackingSetup(true);
        setShowSetupForm(false);

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
        if (data.current_start_date && data.current_period) {
          const currentStart = new Date(data.current_start_date);
          const averageCycleLength = 28; // Default cycle length for predictions

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
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái theo dõi:', error);

      // Handle different error cases
      if (error.response?.status === 404) {
        console.log(
          'API returned 404 - No tracking data exists, showing setup form'
        );
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      } else if (error.response?.status === 400) {
        console.log('API returned 400 - Bad request, showing setup form');
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      } else if (error.response?.status === 401) {
        console.log('API returned 401 - Unauthorized');
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      } else if (error.code === 'ECONNREFUSED' || !error.response) {
        console.log('API connection failed');
        message.error(
          'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!'
        );
      } else {
        console.log('Other API error:', error.response?.status);
        message.error('Có lỗi xảy ra khi kiểm tra dữ liệu. Vui lòng thử lại!');
        // Show setup form as fallback
        setShowSetupForm(true);
        setIsTrackingSetup(false);
      }
    } finally {
      console.log('Setting initial loading to false');
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    console.assert('useEffect triggered, calling fetchCheckTrackingStatus');
    try {
      const hasTrackingData = getMenstrualCycleData();
      console.log('hasTrackingData:', hasTrackingData);
      if (hasTrackingData) {
        getPredictionData();
      } else {
        console.log(
          'No tracking data found (result: false), showing setup form'
        );
        setShowSetupForm(true);
        setIsTrackingSetup(false);
        setInitialLoading(false);
        return;
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái theo dõi:', error);
      setShowSetupForm(true);
      setIsTrackingSetup(false);
    }
  }, [fetchCheckTrackingStatus]);

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

    const api = axios.create({
      baseURL: 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      // Calculate end date from start date and period length
      const startDate = new Date(lastPeriodStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (Number(periodLength) - 1));

      // Update menstrual cycle information using update API
      await api.post('/customer/update-menstrual-cycle', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        note: 'Cập nhật chu kỳ kinh nguyệt từ giao diện người dùng',
      });

      // Refresh data after successful update
      await fetchCheckTrackingStatus();
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
  }, [lastPeriodStart, periodLength, fetchCheckTrackingStatus]);

  // Handle setup completion
  const handleSetupComplete = () => {
    setShowSetupForm(false);
    setIsTrackingSetup(true);
    // Fetch the updated data
    fetchCheckTrackingStatus();
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
    </div>
  );
};

export default MenstrualPredictorPage;
