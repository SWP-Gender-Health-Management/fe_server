import React, { useState } from 'react';

const PieChart = ({ data }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
        }}
      >
        Không có dữ liệu
      </div>
    );
  }

  const size = 200;
  const radius = 80;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate angles for each segment
  let currentAngle = -90; // Start from top
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const segmentAngle = (item.value / total) * 360;

    const startAngle = currentAngle;
    const endAngle = currentAngle + segmentAngle;

    // Calculate path coordinates
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    const startX = centerX + radius * Math.cos(startAngleRad);
    const startY = centerY + radius * Math.sin(startAngleRad);
    const endX = centerX + radius * Math.cos(endAngleRad);
    const endY = centerY + radius * Math.sin(endAngleRad);

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      'Z',
    ].join(' ');

    // Calculate label position
    const labelAngle = (startAngle + endAngle) / 2;
    const labelAngleRad = (labelAngle * Math.PI) / 180;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos(labelAngleRad);
    const labelY = centerY + labelRadius * Math.sin(labelAngleRad);

    currentAngle = endAngle;

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      labelX,
      labelY,
      startAngle,
      endAngle,
    };
  });

  const handleMouseEnter = (index) => {
    setHoveredSegment(index);
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {segments.map((segment, index) => (
            <filter
              key={index}
              id={`shadow-${index}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor={segment.color}
                floodOpacity="0.3"
              />
            </filter>
          ))}
        </defs>

        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.pathData}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform:
                  hoveredSegment === index ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`,
                filter:
                  hoveredSegment === index ? `url(#shadow-${index})` : 'none',
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            />

            {/* Percentage labels */}
            <text
              x={segment.labelX}
              y={segment.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="14"
              fontWeight="600"
              style={{ pointerEvents: 'none' }}
            >
              {segment.percentage}%
            </text>
          </g>
        ))}

        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={30}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Total in center */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1a202c"
          fontSize="16"
          fontWeight="700"
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize="10"
          fontWeight="500"
        >
          Tổng cộng
        </text>
      </svg>

      {/* Tooltip */}
      {hoveredSegment !== null && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a202c',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {segments[hoveredSegment].label}: {segments[hoveredSegment].value}{' '}
          lịch hẹn ({segments[hoveredSegment].percentage}%)
        </div>
      )}
    </div>
  );
};

export default PieChart;
