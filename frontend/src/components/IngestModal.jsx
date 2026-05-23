import React, { useState } from 'react';
import { ingestSalary } from '../utils/api';
import { X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function IngestModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    level: '',
    location: '',
    experienceYears: '',
    baseSalary: '',
    bonus: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalMessage, setGlobalMessage] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error as user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGlobalMessage(null);

    // Format numbers
    const payload = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      level: formData.level.trim(),
      location: formData.location.trim(),
      experienceYears: parseFloat(formData.experienceYears),
      baseSalary: parseFloat(formData.baseSalary),
      bonus: formData.bonus !== '' ? parseFloat(formData.bonus) : undefined,
      stock: formData.stock !== '' ? parseFloat(formData.stock) : undefined,
    };

    try {
      const response = await ingestSalary(payload);
      
      setGlobalMessage({
        type: response.isDuplicate ? 'warning' : 'success',
        text: response.isDuplicate 
          ? "Gracefully resolved: An identical record already exists in the database." 
          : "Compensation data successfully recorded!",
      });

      // Clear form
      setFormData({
        company: '',
        role: '',
        level: '',
        location: '',
        experienceYears: '',
        baseSalary: '',
        bonus: '',
        stock: '',
      });

      // Wait a bit to let the user read success, then close and trigger success refresh
      setTimeout(() => {
        setGlobalMessage(null);
        onSuccess();
        onClose();
      }, 3000);

    } catch (err) {
      console.error('Ingestion submission error:', err);
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setGlobalMessage({
          type: 'error',
          text: err.message || 'An unexpected error occurred during submission.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
      <div 
        className="glass-panel w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col scale-100 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Submit Compensation Details</h3>
            <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Contribute to transparent pricing</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 border border-transparent rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Notifications */}
          {globalMessage && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              globalMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : globalMessage.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {globalMessage.type === 'error' ? <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />}
              <span className="text-sm font-semibold">{globalMessage.text}</span>
            </div>
          )}

          {/* Grid Layout fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Company Display Name <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                name="company"
                placeholder="e.g. Google"
                value={formData.company}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.company ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.company && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.company[0]}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Role / Job Title <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                name="role"
                placeholder="e.g. Software Engineer"
                value={formData.role}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.role ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.role && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.role[0]}</p>}
            </div>

            {/* Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Standard Level <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                name="level"
                placeholder="e.g. L4 or Senior"
                value={formData.level}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.level ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.level && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.level[0]}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Location <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                name="location"
                placeholder="e.g. Mountain View, CA"
                value={formData.location}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.location ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.location && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.location[0]}</p>}
            </div>

            {/* Experience Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Years of Experience <span className="text-rose-500">*</span></label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                name="experienceYears"
                placeholder="e.g. 3.5"
                value={formData.experienceYears}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.experienceYears ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.experienceYears && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.experienceYears[0]}</p>}
            </div>

            {/* Base Salary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Annual Base Salary (USD) <span className="text-rose-500">*</span></label>
              <input
                required
                type="number"
                min="0"
                name="baseSalary"
                placeholder="e.g. 150000"
                value={formData.baseSalary}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.baseSalary ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.baseSalary && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.baseSalary[0]}</p>}
            </div>

            {/* Bonus */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Annual Cash Bonus (USD) <span className="text-slate-500 font-medium">(Optional)</span></label>
              <input
                type="number"
                min="0"
                name="bonus"
                placeholder="e.g. 25000"
                value={formData.bonus}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.bonus ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.bonus && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.bonus[0]}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Annual Stock Grant (USD) <span className="text-slate-500 font-medium">(Optional)</span></label>
              <input
                type="number"
                min="0"
                name="stock"
                placeholder="e.g. 50000"
                value={formData.stock}
                onChange={handleChange}
                className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-650 focus:outline-none transition-colors ${
                  fieldErrors.stock ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-brand-500'
                }`}
              />
              {fieldErrors.stock && <p className="text-[11px] font-semibold text-rose-400">{fieldErrors.stock[0]}</p>}
            </div>

          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white font-semibold text-sm rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              {loading ? 'Submitting offer...' : 'Submit compensation'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
