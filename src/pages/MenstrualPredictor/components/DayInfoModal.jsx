import React from 'react';
import { Modal, Card, Tag, Divider, List } from 'antd';
import {
  CalendarOutlined,
  HeartOutlined,
  FireOutlined,
  StarOutlined,
  InfoCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './DayInfoModal.css';

const DayInfoModal = ({ visible, onCancel, dayInfo }) => {
  if (!dayInfo) return null;

  const {
    date,
    day,
    isPeriod,
    isOvulation,
    isToday,
    cycleDay,
    phase,
    phaseInfo,
  } = dayInfo;

  const getDayType = () => {
    if (isPeriod)
      return {
        type: 'period',
        icon: <HeartOutlined />,
        color: '#ff6b9d',
        text: 'Ngày hành kinh',
      };
    if (isOvulation)
      return {
        type: 'ovulation',
        icon: <FireOutlined />,
        color: '#ffa726',
        text: 'Ngày rụng trứng',
      };
    if (isToday)
      return {
        type: 'today',
        icon: <StarOutlined />,
        color: '#52c41a',
        text: 'Hôm nay',
      };
    return {
      type: 'normal',
      icon: <CalendarOutlined />,
      color: '#666',
      text: 'Ngày bình thường',
    };
  };

  const dayType = getDayType();

  const getPhaseColor = (phase) => {
    const colors = {
      menstrual: '#ff4d4f',
      follicular: '#52c41a',
      ovulation: '#faad14',
      luteal: '#722ed1',
      unknown: '#d9d9d9',
    };
    return colors[phase] || colors.unknown;
  };

  return (
    <Modal
      title={
        <div className="day-modal-title">
          <CalendarOutlined className="day-modal-icon" />
          <span>Thông Tin Ngày {moment(date).format('DD/MM/YYYY')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      className="day-info-modal"
    >
      <div className="day-modal-content">
        {/* Day Type Card */}
        <Card className="day-type-card">
          <div className="day-type-header">
            <div className="day-type-icon" style={{ color: dayType.color }}>
              {dayType.icon}
            </div>
            <div className="day-type-info">
              <h3 className="day-type-title">{dayType.text}</h3>
              <p className="day-type-date">
                {moment(date).format('dddd, DD/MM/YYYY')}
              </p>
            </div>
          </div>
        </Card>

        {/* Cycle Information */}
        {cycleDay && (
          <Card className="cycle-info-card">
            <div className="cycle-info-header">
              <InfoCircleOutlined className="cycle-info-icon" />
              <h4>Thông Tin Chu Kỳ</h4>
            </div>
            <div className="cycle-info-content">
              <div className="cycle-day-info">
                <span className="cycle-day-label">Ngày thứ:</span>
                <Tag color="blue" className="cycle-day-tag">
                  {cycleDay}
                </Tag>
              </div>
              {phase && phaseInfo && (
                <div className="phase-info">
                  <span className="phase-label">Giai đoạn:</span>
                  <Tag color={getPhaseColor(phase)} className="phase-tag">
                    {phaseInfo.name}
                  </Tag>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Phase Information */}
        {phaseInfo && (
          <Card className="phase-card">
            <div className="phase-header">
              <BulbOutlined className="phase-icon" />
              <h4>Giai Đoạn Hiện Tại</h4>
            </div>
            <div className="phase-content">
              <p className="phase-description">{phaseInfo.description}</p>

              <Divider orientation="left">Lời Khuyên Sức Khỏe</Divider>

              <List
                size="small"
                dataSource={phaseInfo.tips}
                renderItem={(tip, index) => (
                  <List.Item className="health-tip-item">
                    <div className="tip-number">{index + 1}</div>
                    <div className="tip-text">{tip}</div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        )}

        {/* Special Day Information */}
        {(isPeriod || isOvulation) && (
          <Card className="special-day-card">
            <div className="special-day-header">
              {isPeriod ? (
                <>
                  <HeartOutlined className="special-day-icon period" />
                  <h4>Thông Tin Kỳ Hành Kinh</h4>
                </>
              ) : (
                <>
                  <FireOutlined className="special-day-icon ovulation" />
                  <h4>Thông Tin Rụng Trứng</h4>
                </>
              )}
            </div>
            <div className="special-day-content">
              {isPeriod && (
                <div className="period-info">
                  <p>• Đây là ngày trong kỳ hành kinh</p>
                  <p>• Nên nghỉ ngơi đầy đủ và uống nhiều nước</p>
                  <p>• Có thể sử dụng túi chườm ấm để giảm đau</p>
                  <p>• Tránh các hoạt động mạnh</p>
                </div>
              )}
              {isOvulation && (
                <div className="ovulation-info">
                  <p>• Đây là ngày rụng trứng</p>
                  <p>• Thời kỳ dễ thụ thai nhất trong chu kỳ</p>
                  <p>• Nên theo dõi nhiệt độ cơ thể</p>
                  <p>• Quan sát chất nhầy cổ tử cung</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default DayInfoModal;
