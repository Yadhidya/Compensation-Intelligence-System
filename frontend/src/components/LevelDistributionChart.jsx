import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LevelDistributionChart({ data, title = "Median Total Compensation by Level" }) {
  
  // Format salary to readable USD
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom high-fidelity tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">
            Level: <span className="text-white">{label}</span>
          </p>
          <p className="text-base font-bold text-brand-400">
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

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        No level data available to plot.
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.level,
    compensation: item.medianTotalCompensation || item.totalCompensation || 0,
    count: item.count || 1,
  }));

  return (
    <div className="glass-panel p-6 w-full glow-effect">
      <h3 className="text-lg font-bold text-white tracking-tight mb-6">
        {title}
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.2 }} />
            <Bar 
              dataKey="compensation" 
              fill="url(#barGradient)" 
              radius={[6, 6, 0, 0]} 
              stroke="#8b5cf6"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
