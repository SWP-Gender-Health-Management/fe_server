import React from 'react';

const PieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">Không có dữ liệu</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const radius = 80;
  const center = 100;

  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle += angle;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    const color = `hsl(${index * (360 / data.length)}, 70%, 50%)`;

    return {
      pathData,
      color,
      percentage: percentage.toFixed(1),
      label: item.label || item.name,
      value: item.value,
    };
  });

  return (
    <div className="pie-chart">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.pathData}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="pie-chart-center">
        <span className="total-label">Tổng</span>
        <span className="total-value">{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PieChart;
