import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

const MemeFilters = ({ search, setSearch, statusFilter, setStatusFilter, dropdownOpen, setDropdownOpen, dropdownRef, statusOptions }) => (
  <div className="flex flex-col md:flex-row gap-2">
    <div className="flex-1 relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search memes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition"
      />
    </div>
    <div className="relative w-full md:w-44" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-left flex items-center justify-between text-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
      >
        <span className="text-gray-700">{statusFilter}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      {dropdownOpen && (
        <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-xl py-1.5">
          {statusOptions.map((opt) => (
            <button key={opt} onClick={() => { setStatusFilter(opt); setDropdownOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${statusFilter === opt ? 'text-orange-600 bg-orange-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
              {opt}
              {statusFilter === opt && <Check size={13} className="text-orange-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default MemeFilters;
