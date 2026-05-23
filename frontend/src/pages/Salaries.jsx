import React, { useEffect, useState } from 'react';
import { fetchSalaries } from '../utils/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, GitCompare, RefreshCw } from 'lucide-react';

export default function Salaries({ setActivePage, setSelectedCompany, setCompareIds }) {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    company: '',
    role: '',
    level: '',
    location: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Selected for comparison
  const [selectedIds, setSelectedIds] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSalaries(filters);
      setSalaries(data.items || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      console.error('Error loading salaries:', err);
      setError('Failed to fetch salary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.page, filters.sortBy, filters.sortOrder]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset page on filter change
    }));
  };

  const triggerSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleSort = (field) => {
    setFilters(prev => {
      const isSameField = prev.sortBy === field;
      const nextOrder = isSameField && prev.sortOrder === 'desc' ? 'asc' : 'desc';
      return {
        ...prev,
        sortBy: field,
        sortOrder: nextOrder,
        page: 1,
      };
    });
  };

  const toggleSelectCompare = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        // Limit to 2 selections
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleCompareTrigger = () => {
    if (selectedIds.length === 2) {
      setCompareIds({ id1: selectedIds[0], id2: selectedIds[1] });
      setActivePage('compare');
    }
  };

  const handleCompanyRedirect = (compName) => {
    setSelectedCompany(compName);
    setActivePage('company');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Compensation Database
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Search peer-submitted salary entries. Filter by levels and roles for exact comps.
          </p>
        </div>

        {selectedIds.length === 2 && (
          <button
            onClick={handleCompareTrigger}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all select-none animate-bounce"
          >
            <GitCompare size={16} />
            Compare Selected ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Advanced Filter Panel */}
      <form onSubmit={triggerSearch} className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <SlidersHorizontal size={14} /> Filter and Search parameters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Company</label>
            <input
              type="text"
              name="company"
              placeholder="e.g. Google"
              value={filters.company}
              onChange={handleFilterChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Role</label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Software Engineer"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Level</label>
            <input
              type="text"
              name="level"
              placeholder="e.g. L4"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Seattle, WA"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-950">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 select-none"
            >
              <Search size={16} /> Search database
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFilters({
                  company: '',
                  role: '',
                  level: '',
                  location: '',
                  sortBy: 'created_at',
                  sortOrder: 'desc',
                  page: 1,
                  limit: 10,
                });
                setSelectedIds([]);
              }}
              className="w-full sm:w-auto border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 select-none"
            >
              <RefreshCw size={14} /> Reset Filters
            </button>
          </div>

          <div className="text-xs font-medium text-slate-500 select-none">
            Found {pagination.total} entry/entries in database
          </div>
        </div>
      </form>

      {/* Salary Data Grid / Table */}
      <div className="glass-panel overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30">
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center select-none w-10">
                  Select
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
                  Company
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
                  Role & Level
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none">
                  Location
                </th>
                <th 
                  onClick={() => handleSort('experience_years')}
                  className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Experience <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none text-right">
                  Base Pay
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none text-right">
                  Bonus
                </th>
                <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest select-none text-right">
                  Stock
                </th>
                <th 
                  onClick={() => handleSort('total_compensation')}
                  className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white select-none text-right whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    Total Comp <ArrowUpDown size={12} />
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-900/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 px-6">
                    <SkeletonLoader type="table" count={5} />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-red-400 font-semibold text-sm">
                    {error}
                  </td>
                </tr>
              ) : salaries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-500 font-semibold text-sm">
                    No compensation records match your search criteria.
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => {
                  const isChecked = selectedIds.includes(salary.id);
                  return (
                    <tr 
                      key={salary.id} 
                      className={`hover:bg-slate-900/40 transition-colors ${
                        isChecked ? 'bg-indigo-600/5' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectCompare(salary.id)}
                          className="h-4.5 w-4.5 rounded border-slate-800 text-brand-500 focus:ring-brand-500/20 focus:ring-offset-slate-950 bg-slate-950 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-100">
                        <button
                          onClick={() => handleCompanyRedirect(salary.companyDisplay)}
                          className="text-left hover:text-brand-400 underline underline-offset-4 decoration-slate-800 hover:decoration-brand-500/50 transition-all font-sans"
                        >
                          {salary.companyDisplay}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-200 text-sm">{salary.role}</div>
                        <div className="inline-flex mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 uppercase">
                          {salary.level}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-400 whitespace-nowrap">
                        {salary.location}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-200">
                        {salary.experienceYears} yr{salary.experienceYears !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-300 text-right whitespace-nowrap">
                        {formatCurrency(salary.baseSalary)}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-400 text-right whitespace-nowrap">
                        {salary.bonus > 0 ? formatCurrency(salary.bonus) : '—'}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-slate-400 text-right whitespace-nowrap">
                        {salary.stock > 0 ? formatCurrency(salary.stock) : '—'}
                      </td>
                      <td className="py-4 px-4 text-sm font-extrabold text-white text-right whitespace-nowrap">
                        <span className="text-brand-400 font-sans">
                          {formatCurrency(salary.totalCompensation)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {!loading && salaries.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-800 bg-slate-900/10">
            <div className="text-xs font-semibold text-slate-500 select-none">
              Showing page {pagination.page} of {pagination.totalPages}
            </div>

            <div className="flex items-center gap-2 select-none">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="text-xs font-bold text-slate-300 px-3">
                {pagination.page} / {pagination.totalPages}
              </div>

              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
