import React, { useEffect, useState } from 'react';
import { fetchComparison, fetchSalaries } from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { GitCompare, Landmark, Coins, Award, DollarSign, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';

export default function Compare({ compareIds, setCompareIds }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selector choices list
  const [choices, setChoices] = useState([]);
  const [selId1, setSelId1] = useState('');
  const [selId2, setSelId2] = useState('');

  // Load choices for dropdown selection
  useEffect(() => {
    const loadChoices = async () => {
      try {
        const result = await fetchSalaries({ limit: 200 }); // fetch top 200 records to select from
        setChoices(result.items || []);
      } catch (err) {
        console.error('Error fetching compare choices:', err);
      }
    };
    loadChoices();
  }, []);

  // Pre-fill dropdown selections if compareIds props are passed
  useEffect(() => {
    if (compareIds?.id1 && compareIds?.id2) {
      setSelId1(compareIds.id1);
      setSelId2(compareIds.id2);
      triggerCompare(compareIds.id1, compareIds.id2);
    }
  }, [compareIds]);

  const triggerCompare = async (id1, id2) => {
    if (!id1 || !id2) return;
    try {
      setLoading(true);
      setError(null);
      const result = await fetchComparison(id1, id2);
      setComparison(result.data);
    } catch (err) {
      console.error('Error fetching side-by-side comparison:', err);
      setError('Failed to fetch comparison details. Try again.');
      setComparison(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareClick = () => {
    if (selId1 === selId2) {
      setError("Cannot compare the exact same salary entry.");
      return;
    }
    setCompareIds({ id1: selId1, id2: selId2 });
    triggerCompare(selId1, selId2);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const renderDelta = (deltaField) => {
    if (!deltaField) return null;
    const { difference, percentage } = deltaField;
    const isPositive = difference >= 0;

    return (
      <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-lg ml-2 select-none ${
        isPositive 
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
      }`}>
        {isPositive ? '+' : ''}
        {formatCurrency(difference)} ({isPositive ? '+' : ''}
        {percentage}%)
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-900 pb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
          Side-by-Side Comparison
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          Select two peer salary records below to analyze the direct structural compensation variance.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <GitCompare size={14} /> Select Entries to Compare
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entry 1 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Primary Offer (A)</label>
            <select
              value={selId1}
              onChange={(e) => setSelId1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-300 focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="">-- Choose first offer --</option>
              {choices.map(c => (
                <option key={c.id} value={c.id}>
                  {c.companyDisplay} ({c.level}) - {c.role} in {c.location} (${(c.totalCompensation/1000).toFixed(0)}k)
                </option>
              ))}
            </select>
          </div>

          {/* Entry 2 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Comparison Offer (B)</label>
            <select
              value={selId2}
              onChange={(e) => setSelId2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-slate-300 focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="">-- Choose second offer --</option>
              {choices.map(c => (
                <option key={c.id} value={c.id}>
                  {c.companyDisplay} ({c.level}) - {c.role} in {c.location} (${(c.totalCompensation/1000).toFixed(0)}k)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-950">
          {error && (
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          
          <button
            disabled={!selId1 || !selId2}
            onClick={handleCompareClick}
            className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold text-sm px-8 py-3 rounded-xl disabled:opacity-30 disabled:hover:bg-brand-500 transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 select-none"
          >
            <ArrowLeftRight size={14} /> Run Comparison Matrix
          </button>
        </div>
      </div>

      {/* Comparison Matrix Results */}
      {loading ? (
        <div className="space-y-6">
          <SkeletonLoader type="card" count={1} />
        </div>
      ) : comparison ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Main Visual Side-by-Side Card */}
          <div className="md:col-span-2 glass-panel p-8 glow-effect space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Comparison Summary</span>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {comparison.salary1.company} <span className="text-slate-500 text-xs font-normal">({comparison.salary1.level})</span> 
                  <span className="text-slate-500 text-sm font-semibold">vs</span> 
                  {comparison.salary2.company} <span className="text-slate-500 text-xs font-normal">({comparison.salary2.level})</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-bold block uppercase">Delta Total comp</span>
                <div className="mt-1">
                  {renderDelta(comparison.deltas.totalCompensation)}
                </div>
              </div>
            </div>

            {/* Structured Fields Grid */}
            <div className="space-y-6">
              
              {/* Total Comp */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-brand-500/5 border border-brand-500/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Total Compensation</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Full annual consolidated value</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer A</span>
                    <span className="font-extrabold text-white text-base">{formatCurrency(comparison.salary1.totalCompensation)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer B</span>
                    <span className="font-extrabold text-slate-300 text-base">{formatCurrency(comparison.salary2.totalCompensation)}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    {renderDelta(comparison.deltas.totalCompensation)}
                  </div>
                </div>
              </div>

              {/* Base Salary */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Base Salary</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Guaranteed monthly cash component</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer A</span>
                    <span className="font-extrabold text-white text-sm">{formatCurrency(comparison.salary1.baseSalary)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer B</span>
                    <span className="font-extrabold text-slate-300 text-sm">{formatCurrency(comparison.salary2.baseSalary)}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    {renderDelta(comparison.deltas.baseSalary)}
                  </div>
                </div>
              </div>

              {/* Annual Bonus */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Coins size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Annual Cash Bonus</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Target cash performance rewards</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer A</span>
                    <span className="font-extrabold text-white text-sm">{formatCurrency(comparison.salary1.bonus)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer B</span>
                    <span className="font-extrabold text-slate-300 text-sm">{formatCurrency(comparison.salary2.bonus)}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    {renderDelta(comparison.deltas.bonus)}
                  </div>
                </div>
              </div>

              {/* Stock Grant */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Annual Equity / Stock</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Estimated annual stock vesting value</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer A</span>
                    <span className="font-extrabold text-white text-sm">{formatCurrency(comparison.salary1.stock)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Offer B</span>
                    <span className="font-extrabold text-slate-300 text-sm">{formatCurrency(comparison.salary2.stock)}</span>
                  </div>
                  <div className="border-l border-slate-800 pl-4">
                    {renderDelta(comparison.deltas.stock)}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Individual Offer Details Card A */}
          <div className="glass-panel p-6 space-y-4">
            <div className="inline-flex text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 uppercase select-none">
              Primary Offer A
            </div>
            <h4 className="text-2xl font-extrabold text-white font-sans">{comparison.salary1.company}</h4>
            <div className="divide-y divide-slate-900 text-sm space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Role</span>
                <span className="font-bold text-slate-200">{comparison.salary1.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Standard Level</span>
                <span className="font-bold text-slate-200 uppercase">{comparison.salary1.level}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Location</span>
                <span className="font-bold text-slate-200">{comparison.salary1.location}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Experience</span>
                <span className="font-bold text-slate-200">{comparison.salary1.experienceYears} yr(s)</span>
              </div>
            </div>
          </div>

          {/* Individual Offer Details Card B */}
          <div className="glass-panel p-6 space-y-4">
            <div className="inline-flex text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase select-none">
              Comparison Offer B
            </div>
            <h4 className="text-2xl font-extrabold text-slate-300 font-sans">{comparison.salary2.company}</h4>
            <div className="divide-y divide-slate-900 text-sm space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Role</span>
                <span className="font-bold text-slate-300">{comparison.salary2.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Standard Level</span>
                <span className="font-bold text-slate-300 uppercase">{comparison.salary2.level}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Location</span>
                <span className="font-bold text-slate-300">{comparison.salary2.location}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 font-semibold uppercase text-xs">Experience</span>
                <span className="font-bold text-slate-300">{comparison.salary2.experienceYears} yr(s)</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-panel p-16 text-center text-slate-500 font-medium text-sm flex flex-col items-center justify-center gap-3">
          <GitCompare size={40} className="text-slate-700 animate-pulse" />
          Please select two compensation records above to run the side-by-side delta pricing model.
        </div>
      )}

    </div>
  );
}
