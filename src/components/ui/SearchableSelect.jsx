// src/components/ui/SearchableSelect.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export default function SearchableSelect({
  label,
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  required = false,
  error = null,
  disabled = false,
  className = '',
  icon: Icon = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    const text = typeof opt === 'object' ? opt.label || opt.value : opt;
    return String(text).toLowerCase().includes(searchTerm.toLowerCase().trim());
  });

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  // Find label for current value
  const selectedLabel = (() => {
    if (!value) return '';
    const match = options.find((o) => (typeof o === 'object' ? o.value === value : o === value));
    if (match) return typeof match === 'object' ? match.label : match;
    return value;
  })();

  return (
    <div className={`w-full relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
          {Icon && <Icon size={14} className="text-emerald-700" />}
          <span>{label}</span>
          {required && <span className="text-emerald-700">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className={`w-full flex items-center justify-between border rounded-lg px-3.5 py-2.5 text-sm bg-white cursor-pointer transition select-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-slate-50'
            : isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-600/30'
            : error
            ? 'border-rose-400'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={`truncate ${selectedLabel ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {selectedLabel || placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              title="Clear selection"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-700' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-150">
          {/* Search Input Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 focus:border-emerald-600"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <ul className="max-h-56 overflow-y-auto py-1 text-xs divide-y divide-slate-50">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-3 text-center text-slate-400">
                No matching options found
              </li>
            ) : (
              filteredOptions.map((opt, idx) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLbl = typeof opt === 'object' ? opt.label : opt;
                const isSelected = value === optVal;

                return (
                  <li
                    key={optVal || idx}
                    onClick={() => handleSelect(optVal)}
                    className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{optLbl}</span>
                    {isSelected && <Check size={14} className="text-emerald-700 shrink-0 ml-2" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-rose-600 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
