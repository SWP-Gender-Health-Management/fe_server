import { Card } from 'antd';
import './CycleSettingsCard.css';

const CycleSettingsCard = ({
  lastPeriodStart,
  setLastPeriodStart,
  cycleLength,
  setCycleLength,
  periodLength,
  setPeriodLength,
  handleUpdate,
}) => {
  return (
    <>
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
              setCycleLength(e.target.value ? parseInt(e.target.value) : '')
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
              setPeriodLength(e.target.value ? parseInt(e.target.value) : '')
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
    </>
  );
};

export default CycleSettingsCard;
