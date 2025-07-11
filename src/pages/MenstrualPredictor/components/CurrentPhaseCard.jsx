import { Card, Alert } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import './CurrentPhaseCard.css';

const CurrentPhaseCard = ({ phaseInfo, daysUntilNextPeriod }) => {
  return (
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
      {daysUntilNextPeriod && (
        <Alert
          message={`Còn ${daysUntilNextPeriod} ngày đến kỳ kinh tiếp theo`}
          type="info"
          showIcon
          style={{ marginBottom: '12px' }}
        />
      )}
    </Card>
  );
};

export default CurrentPhaseCard;
