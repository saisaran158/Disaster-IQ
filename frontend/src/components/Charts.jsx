import React from 'react';

export const LineChart = ({ data, height = 220, color = "#8b5cf6" }) => {
  if (!data || data.length === 0) return null;
  
  const width = 500;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minVal = Math.min(...data.map(d => d.value)) - 10;
  const maxVal = Math.max(...data.map(d => d.value)) + 10;
  const range = maxVal - minVal || 1;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length > 1 ? data.length - 1 : 1)) * chartWidth;
    const y = height - padding - ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id={`lineGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * chartHeight;
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#8b5cf6"
              strokeOpacity="0.15"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#lineGradient-${color.replace('#', '')})`} />

        {/* Smooth line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2.5" className="shadow-lg shadow-purple-500/50" />
            
            {/* Label below point */}
            <text
              x={p.x}
              y={height - 12}
              fill="#c4b5fd"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
              className="opacity-80"
            >
              {p.label}
            </text>
            
            {/* Score percentage above point */}
            <text
              x={p.x}
              y={p.y - 12}
              fill="#e9d5ff"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
            >
              {p.value}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// Custom SVG Donut Chart Component
export const DonutChart = ({ items, size = 180, strokeWidth = 22, centerTitle = "", centerSubtitle = "" }) => {
  const total = items.reduce((acc, item) => acc + item.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#8b5cf6"
          strokeOpacity="0.1"
          strokeWidth={strokeWidth}
        />

        {items.map((item, index) => {
          const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativeAngle * circumference;
          cumulativeAngle += item.value / total;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-2xl font-black text-white tracking-tight">{centerTitle}</span>
        {centerSubtitle && <span className="text-xs text-purple-300 font-bold mt-0.5">{centerSubtitle}</span>}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span>{item.label}: <strong className="text-white font-black">{item.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Preparedness Circular Gauge Component
export const PreparednessGauge = ({ score = 82, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#a855f7';
  let label = 'Excellent';
  if (score < 60) {
    color = '#f59e0b';
    label = 'Needs Work';
  } else if (score < 80) {
    color = '#38bdf8';
    label = 'Good';
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        <path
          d={`M 10,${size / 2 + 10} A ${radius},${radius} 0 0,1 ${size - 10},${size / 2 + 10}`}
          fill="none"
          stroke="#8b5cf6"
          strokeOpacity="0.15"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d={`M 10,${size / 2 + 10} A ${radius},${radius} 0 0,1 ${size - 10},${size / 2 + 10}`}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute bottom-2 flex flex-col items-center text-center">
        <span className="text-3xl font-black text-white">{score}%</span>
        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// SVG Bar Chart Component for District/Admin Dashboards
export const BarChart = ({ data, height = 220 }) => {
  if (!data || data.length === 0) return null;
  const width = 500;
  const padding = 40;
  const maxVal = Math.max(...data.map(d => d.value)) || 100;
  const barWidth = (width - padding * 2) / data.length - 12;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const barH = (d.value / maxVal) * (height - padding * 2);
          const x = padding + i * (barWidth + 12);
          const y = height - padding - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                fill={d.color || "#8b5cf6"}
                className="transition-all duration-500 hover:opacity-85"
              />
              <text
                x={x + barWidth / 2}
                y={height - 12}
                fill="#c4b5fd"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                className="opacity-80"
              >
                {d.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 6}
                fill="#e9d5ff"
                fontSize="11"
                fontWeight="900"
                textAnchor="middle"
              >
                {d.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
