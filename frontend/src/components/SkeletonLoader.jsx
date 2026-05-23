import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-10 bg-slate-800/80 rounded-xl w-full" />
        {items.map((_, idx) => (
          <div key={idx} className="flex gap-4 items-center py-3 border-b border-slate-900">
            <div className="h-6 bg-slate-800 rounded w-1/6" />
            <div className="h-6 bg-slate-800 rounded w-1/6" />
            <div className="h-6 bg-slate-800 rounded w-1/12" />
            <div className="h-6 bg-slate-800 rounded w-1/6" />
            <div className="h-6 bg-slate-800 rounded w-1/12" />
            <div className="h-6 bg-slate-800 rounded w-1/6" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-panel p-6 w-full h-80 flex flex-col justify-end gap-3 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/4 self-start mb-6" />
        <div className="flex items-end justify-between gap-4 h-48 px-4">
          <div className="bg-slate-800/80 rounded-t-lg w-full h-1/3" />
          <div className="bg-slate-800/80 rounded-t-lg w-full h-2/3" />
          <div className="bg-slate-800/80 rounded-t-lg w-full h-1/2" />
          <div className="bg-slate-800/80 rounded-t-lg w-full h-4/5" />
          <div className="bg-slate-800/80 rounded-t-lg w-full h-1/4" />
        </div>
        <div className="h-3 bg-slate-800 rounded w-full" />
      </div>
    );
  }

  return (
    <>
      {items.map((_, idx) => (
        <div key={idx} className="glass-panel p-6 space-y-4 w-full animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-800 rounded w-1/3" />
            <div className="h-8 bg-slate-800 rounded w-10" />
          </div>
          <div className="h-8 bg-slate-800 rounded w-1/2" />
          <div className="h-4 bg-slate-800 rounded w-3/4" />
        </div>
      ))}
    </>
  );
}
