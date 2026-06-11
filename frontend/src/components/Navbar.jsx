import React, { useState } from 'react';
import { TrendingUp, Table, GitCompare, PlusCircle, Menu, X } from 'lucide-react';

interface NavItem {
  id: 'home' | 'salaries' | 'compare';
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavbarProps {
  activePage: string;
  setActivePage: (page: 'home' | 'salaries' | 'compare' | 'company') => void;
  onOpenIngest: () => void;
}

export default function Navbar({ activePage, setActivePage, onOpenIngest }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: TrendingUp },
    { id: 'salaries', label: 'Salary Table', icon: Table },
    { id: 'compare', label: 'Compare Tool', icon: GitCompare },
  ];

  const handleNavClick = (id: NavItem['id']) => {
    setActivePage(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-slate-900 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Platform Title */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="bg-gradient-to-tr from-brand-600 to-brand-400 text-white p-2 rounded-xl shadow-md shadow-brand-500/10 group-hover:scale-105 active:scale-95 transition-all duration-200">
            <TrendingUp size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-sans text-white">
              Comp<span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">Intel</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
              Levels Matter More
            </p>
          </div>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/40 p-1 rounded-2xl border border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'salaries' && activePage === 'company');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-slate-900 text-brand-400 border border-slate-800 shadow-sm shadow-slate-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 border border-transparent'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-brand-400' : 'text-slate-500'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={onOpenIngest}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 active:scale-[0.98] text-white px-4.5 py-2 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/10 transition-all duration-200 select-none"
          >
            <PlusCircle size={15} />
            Submit Salary
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-900 px-4 py-4 flex flex-col gap-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id || (item.id === 'salaries' && activePage === 'company');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
          
          <div className="border-t border-slate-900 pt-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenIngest();
              }}
              className="flex items-center justify-center gap-2 w-full bg-brand-500 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/10"
            >
              <PlusCircle size={16} />
              Submit Salary
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
