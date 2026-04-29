import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MemePagination = ({ totalItems, currentPage, setCurrentPage, totalPages, itemsPerPage, getPageNumbers }) => {
  if (totalItems === 0) return null;
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-500 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</span>–
        <span className="font-semibold text-gray-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalItems}</span>
      </p>
      <nav className="flex items-center gap-1 order-1 sm:order-2">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
          <ChevronLeft size={14} />
        </button>
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
          ) : (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center text-xs rounded-lg transition ${currentPage === page ? 'bg-orange-500 text-white font-semibold shadow-sm' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
              {page}
            </button>
          )
        )}
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
};

export default MemePagination;
