import { Card } from 'antd';
import { BulbOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './HealthTipsCard.css';

const HealthTipsCard = ({ phaseInfo }) => {
  return (
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
  );
};

export default HealthTipsCard;
