import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Strongly type the expected data shape
interface ChartDataPoint {
  level: string;
  medianTotalCompensation?: number;
  totalCompensation?: number;
  count?: number;
}

interface LevelDistributionChartProps {
  data: ChartDataPoint[];
  title?: string;
}

// Format salary to readable USD
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom high-fidelity tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl transition-all">
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">
          Level: <span className="text-white">{label}</span>
        </p>
        <p className="text-base font-bold text-indigo-400">
          {formatCurrency(payload[0].value)}
        </p>
        {payload[0].payload.count !== undefined && (
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            Based on {payload[0].payload.count} submission(s)
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function LevelDistributionChart({ 
  data, 
  title = "Median Total Compensation by Level" 
}: LevelDistributionChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] text-slate-400 border border-slate-800 rounded-2xl">
        <p className="text-sm">No level data available to plot.</p>
      </div>
    );
  }

  // Map and clean up the data safely
  const chartData = data.map(item => ({
    name: item.level,
    compensation: item.medianTotalCompensation ?? item.totalCompensation ?? 0,
    count: item.count ?? 1,
  }));

  return (
    <div className="bg-slate-950 glass-panel p-6 w-full rounded-2xl border border-slate-800/60 glow-effect">
      <h3 className="text-lg font-bold text-white tracking-tight mb-6">
        {title}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#334155" 
              opacity={0.4} 
              vertical={false} 
            />
            
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              dy={10} 
            />
            
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `$${v / 1000}k`}
              dx={-5}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#1e293b', opacity: 0.2 }} 
            />
            
            <Bar 
              dataKey="compensation" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]} 
              stroke="#8b5cf6" 
              strokeWidth={1}
              maxBarSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  cursor="pointer" 
                  fill="url(#barGradient)"
                  // Adds a subtle hover effect if desired, or leave commented for uniform color
                  // onMouseOver={(e) => { ... }} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
