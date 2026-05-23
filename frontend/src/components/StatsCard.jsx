import React from 'react';

export default function StatsCard({ title, value, subtext, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20 shadow-brand-500/5',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
  };

  return (
    <div className="glass-panel glass-panel-hover glow-effect p-6 flex items-start justify-between gap-4">
      <div className="space-y-2">
        <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs font-medium text-slate-400">
            {subtext}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.brand} flex-shrink-0 shadow-md`}>
          <Icon size={20} className="stroke-[2]" />
        </div>
      )}
    </div>
  );
}
