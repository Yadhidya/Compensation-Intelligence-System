import React, { useEffect, useState } from 'react';
import { fetchSalaries } from '../utils/api';
import StatsCard from '../components/StatsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { DollarSign, Award, MapPin, Search, ArrowRight, Sparkles, Server } from 'lucide-react';

export default function Home({ setActivePage, setSelectedCompany, onOpenIngest }) {
  const [stats, setStats] = useState({
    totalCount: 0,
    medianCompensation: 0,
    topPayingCompany: '',
    topPayingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchSalaries({ limit: 1000 }); // fetch up to 1000 entries to compute high fidelity metrics
        const items = data.items || [];
        
        if (items.length > 0) {
          const totalCount = items.length;
          
          // Median Total Comp
          const comps = items.map(s => s.totalCompensation).sort((a, b) => a - b);
          const mid = Math.floor(comps.length / 2);
          const medianCompensation = comps.length % 2 !== 0 ? comps[mid] : (comps[mid - 1] + comps[mid]) / 2;

          // Find top-paying company
          const companyMap = {};
          items.forEach(s => {
            const compName = s.companyDisplay;
            if (!companyMap[compName]) {
              companyMap[compName] = [];
            }
            companyMap[compName].push(s.totalCompensation);
          });

          let topPayingCompany = '';
          let maxMedian = 0;

          Object.entries(companyMap).forEach(([company, salaries]) => {
            const sortedSalaries = [...salaries].sort((a, b) => a - b);
            const mIdx = Math.floor(sortedSalaries.length / 2);
            const companyMedian = sortedSalaries.length % 2 !== 0 
              ? sortedSalaries[mIdx] 
              : (sortedSalaries[mIdx - 1] + sortedSalaries[mIdx]) / 2;

            if (companyMedian > maxMedian) {
              maxMedian = companyMedian;
              topPayingCompany = company;
            }
          });

          setStats({
            totalCount,
            medianCompensation,
            topPayingCompany,
            topPayingAmount: maxMedian,
          });

          // Unique company names for search suggestions
          const uniqueCompanies = Array.from(new Set(items.map(s => s.companyDisplay)));
          setSuggestions(uniqueCompanies);
        }
      } catch (error) {
        console.error('Error calculating home stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCompany(searchQuery.trim());
      setActivePage('company');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredSuggestions = searchQuery.trim() === ''
    ? []
    : suggestions.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-400 border border-brand-500/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider select-none animate-pulse">
          <Sparkles size={12} />
          Level-Driven Market Pricing
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-sans">
          Compare salaries based on <span className="gradient-text">levels, not titles.</span>
        </h2>
        <p className="text-lg text-slate-400 font-medium leading-relaxed">
          Title inflation is real. Standardize and evaluate your software engineering offers side-by-side using high-fidelity peer compensation data.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search companies (e.g. Google, Meta)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-32 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300"
            >
              Analyze Company
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-50 text-left">
              {filteredSuggestions.map((company, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCompany(company);
                    setActivePage('company');
                  }}
                  className="px-4 py-3 hover:bg-slate-800/80 cursor-pointer text-sm text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>{company}</span>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">View profile</span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Platform Statistics */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Platform Insights</h3>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <Server size={12} /> Live telemetry
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Data Ingested"
              value={stats.totalCount}
              subtext="Verified software engineering entries"
              icon={Award}
              color="emerald"
            />
            <StatsCard
              title="Global Median TC"
              value={formatCurrency(stats.medianCompensation)}
              subtext="Overall base + bonus + stock median"
              icon={DollarSign}
              color="brand"
            />
            <StatsCard
              title="Top Paying Firm"
              value={stats.topPayingCompany || 'N/A'}
              subtext={`Median compensation: ${formatCurrency(stats.topPayingAmount)}`}
              icon={MapPin}
              color="amber"
            />
          </div>
        )}
      </div>

      {/* Navigation shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div 
          onClick={() => setActivePage('salaries')}
          className="glass-panel glass-panel-hover p-8 cursor-pointer flex flex-col justify-between min-h-[180px] group"
        >
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
              Advanced Salary Table
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Query, filter, and sort peer compensation data by role, level, location, and total comp. Standardize your search parameters instantly.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-brand-400 mt-6 select-none">
            Browse Salaries <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActivePage('compare')}
          className="glass-panel glass-panel-hover p-8 cursor-pointer flex flex-col justify-between min-h-[180px] group"
        >
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
              Side-by-Side Compare Tool
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Select any two verified salary entries and evaluate the detailed differences in base pay, bonus structures, and stock grants with +/- metrics.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-brand-400 mt-6 select-none">
            Compare Offers <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </div>
  );
}
