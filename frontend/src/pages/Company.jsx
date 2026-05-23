import React, { useEffect, useState } from 'react';
import { fetchCompanyData } from '../utils/api';
import StatsCard from '../components/StatsCard';
import LevelDistributionChart from '../components/LevelDistributionChart';
import SkeletonLoader from '../components/SkeletonLoader';
import { DollarSign, Landmark, Coins, Briefcase, Award, ArrowLeft, RefreshCw, Search } from 'lucide-react';

export default function Company({ companyName, setSelectedCompany, setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      if (!companyName) return;
      try {
        setLoading(true);
        setError(null);
        const result = await fetchCompanyData(companyName);
        setData(result.data);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(`Could not find metrics for "${companyName}".`);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [companyName]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedCompany(searchInput.trim());
      setSearchInput('');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!companyName) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-white">No Company Selected</h2>
        <p className="text-slate-400 text-sm">Select a company profile from the salary database or search below.</p>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search company (e.g. Google)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-24 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="absolute right-2 bg-brand-500 text-white text-xs px-4 py-2 rounded-lg font-bold">
            Search
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      
      {/* Header with Navigation & Inline Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActivePage('salaries')}
            className="p-2.5 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors select-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-xs font-bold text-brand-400 tracking-wider uppercase">Company Profile</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans mt-0.5">
              {loading ? 'Analyzing...' : data?.companyName || companyName}
            </h2>
          </div>
        </div>

        {/* Inline Search switcher */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full">
          <Search className="absolute left-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Change company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-16 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-bold text-[10px] px-3 py-1 rounded-lg transition-colors border border-brand-500/20"
          >
            Go
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            <SkeletonLoader type="card" count={4} />
          </div>
          <SkeletonLoader type="chart" />
        </div>
      ) : error ? (
        <div className="glass-panel p-16 text-center space-y-6 max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-red-400">Profile Not Found</h3>
          <p className="text-slate-400 text-sm">{error}</p>
          <button
            onClick={() => setActivePage('salaries')}
            className="bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm select-none"
          >
            Back to Database
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Key Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Median Base Salary"
              value={formatCurrency(data.statistics.medianBaseSalary)}
              subtext="Guaranteed base pay"
              icon={Landmark}
              color="indigo"
            />
            <StatsCard
              title="Median Annual Bonus"
              value={formatCurrency(data.statistics.medianBonus)}
              subtext="Performance cash bonus"
              icon={Coins}
              color="amber"
            />
            <StatsCard
              title="Median Annual Stock"
              value={formatCurrency(data.statistics.medianStock)}
              subtext="RSU or equity grants"
              icon={Award}
              color="brand"
            />
            <StatsCard
              title="Median Total Comp"
              value={formatCurrency(data.statistics.medianTotalCompensation)}
              subtext="Combined annual package"
              icon={DollarSign}
              color="emerald"
            />
          </div>

          {/* Level distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LevelDistributionChart
                data={data.levelDistribution}
                title={`Median Compensation by Level at ${data.companyName}`}
              />
            </div>
            
            {/* Level count summary list */}
            <div className="glass-panel p-6 flex flex-col space-y-4 justify-between glow-effect">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white tracking-tight uppercase">Level Breakdown</h3>
                <div className="divide-y divide-slate-800 overflow-y-auto max-h-48 pr-2">
                  {data.levelDistribution.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2.5">
                      <div>
                        <span className="font-bold text-slate-200 text-sm uppercase">{item.level}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase ml-2">({item.count} submission{item.count > 1 ? 's' : ''})</span>
                      </div>
                      <span className="text-sm font-extrabold text-brand-400">{formatCurrency(item.medianTotalCompensation)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-bold border-t border-slate-900 pt-3 flex items-center gap-1.5 uppercase">
                <Briefcase size={12} /> Total listings: {data.totalSubmissions}
              </div>
            </div>
          </div>

          {/* Submissions list for company */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white tracking-tight">Recent Submissions</h3>
            <div className="glass-panel overflow-hidden border border-slate-800/80">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/30">
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Base</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Bonus</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Stock</th>
                      <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total Comp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {data.salaries.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-6 text-sm font-semibold text-slate-200">{s.role}</td>
                        <td className="py-4 px-6">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 uppercase">
                            {s.level}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-400">{s.location}</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-300">{s.experienceYears} yrs</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-400 text-right">{formatCurrency(s.baseSalary)}</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-400 text-right">{s.bonus > 0 ? formatCurrency(s.bonus) : '—'}</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-400 text-right">{s.stock > 0 ? formatCurrency(s.stock) : '—'}</td>
                        <td className="py-4 px-6 text-sm font-extrabold text-brand-400 text-right">{formatCurrency(s.totalCompensation)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
