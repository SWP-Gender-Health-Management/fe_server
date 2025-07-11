import { Card } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import './PredictionsCard.css';

const PredictionsCard = ({ nextStartDate, ovulationDate, fertileRange }) => {
  return (
    <Card title="Dự Báo" style={{ marginBottom: '16px' }}>
      <div className="prediction-item">
        <ThunderboltOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
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
  );
};

export default PredictionsCard;
