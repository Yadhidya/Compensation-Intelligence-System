import React from 'react';
import { TrendingUp, Table, Building2, GitCompare, PlusCircle } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenIngest }) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: TrendingUp },
    { id: 'salaries', label: 'Salary Table', icon: Table },
    { id: 'compare', label: 'Compare Tool', icon: GitCompare },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Platform Title */}
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="bg-brand-500 text-white p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-sans">
              Comp<span className="text-brand-500">Intel</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Levels Matter More
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'salaries' && activePage === 'company');
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 select-none ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Call to action (Add Salary) */}
        <div>
          <button
            onClick={onOpenIngest}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-300 hover:translate-y-[-1px] select-none"
          >
            <PlusCircle size={16} />
            Submit Salary
          </button>
        </div>

      </div>
    </nav>
  );
}
