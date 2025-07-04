import React, { useState, useRef, useEffect } from 'react';

const LineChart = ({ data }) => {
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: '',
  });
  const svgRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#718096',
        }}
      >
        Đang tải dữ liệu...
      </div>
    );
  }

  const width = 800;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const maxUsers = Math.max(...data.map((d) => d.users));
  const minUsers = Math.min(...data.map((d) => d.users));
  const padding = (maxUsers - minUsers) * 0.1;

  const xScale = (index) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value) =>
    chartHeight -
    ((value - minUsers + padding) / (maxUsers - minUsers + 2 * padding)) *
      chartHeight;

  // Generate path for the line
  const pathData = data
    .map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.users);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate area path
  const areaData = `${pathData} L ${xScale(data.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;

  // Generate grid lines
  const yGridLines = [];
  const gridCount = 5;
  for (let i = 0; i <= gridCount; i++) {
    const y = (i / gridCount) * chartHeight;
    const value =
      maxUsers +
      padding -
      (i / gridCount) * (maxUsers - minUsers + 2 * padding);
    yGridLines.push({ y, value: Math.round(value) });
  }

  const handleMouseMove = (event, dataPoint, index) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setTooltip({
        show: true,
        x: x + 10,
        y: y - 10,
        content: `${dataPoint.label}: ${dataPoint.users} người dùng`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#667eea" stopOpacity="0.05" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#667eea"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {yGridLines.map((line, i) => (
            <g key={i}>
              <line
                x1="0"
                y1={line.y}
                x2={chartWidth}
                y2={line.y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text
                x="-10"
                y={line.y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#718096"
              >
                {line.value}
              </text>
            </g>
          ))}

          {/* X-axis */}
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Y-axis */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={chartHeight}
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Area under curve */}
          <path d={areaData} fill="url(#chartGradient)" />

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#667eea"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.users)}
              r="5"
              fill="#667eea"
              stroke="#ffffff"
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              onMouseMove={(e) => handleMouseMove(e, d, i)}
              onMouseLeave={handleMouseLeave}
            />
          ))}

          {/* X-axis labels */}
          {data.map((d, i) => {
            if (i % Math.ceil(data.length / 6) === 0) {
              return (
                <text
                  key={i}
                  x={xScale(i)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#718096"
                >
                  {d.label}
                </text>
              );
            }
            return null;
          })}

          {/* Y-axis label */}
          <text
            x={-35}
            y={chartHeight / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#718096"
            transform={`rotate(-90, -35, ${chartHeight / 2})`}
          >
            Số người dùng
          </text>

          {/* X-axis label */}
          <text
            x={chartWidth / 2}
            y={chartHeight + 35}
            textAnchor="middle"
            fontSize="12"
            fill="#718096"
          >
            Ngày trong tháng
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
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
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default LineChart;
