import React from 'react';
import { CATEGORIES, STATUSES } from '@/types/Resource';

interface FilterCategoryProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewType: 'table' | 'cards';
  onViewTypeChange: (viewType: 'table' | 'cards') => void;
}

export function FilterCategory({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewType,
  onViewTypeChange,
}: FilterCategoryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500">Categoría</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500">Estado</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="">Todos los estados</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500">Ordenar por</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="name_asc">Nombre (A-Z)</option>
              <option value="name_desc">Nombre (Z-A)</option>
              <option value="quantity_desc">Cantidad (Mayor a menor)</option>
              <option value="quantity_asc">Cantidad (Menor a mayor)</option>
              <option value="date_desc">Fecha de registro (Más nuevo)</option>
              <option value="date_asc">Fecha de registro (Más antiguo)</option>
            </select>
          </div>

        </div>

        {/* View Toggle Buttons */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase text-zinc-400 dark:text-zinc-500 sm:text-right">Vista</span>
          <div className="flex items-center rounded-lg border border-zinc-300 bg-zinc-50/50 p-0.5 dark:border-zinc-700 dark:bg-zinc-850">
            {/* Table View button */}
            <button
              type="button"
              onClick={() => onViewTypeChange('table')}
              className={`rounded-md p-1.5 transition ${
                viewType === 'table'
                  ? 'bg-white text-teal-600 shadow-sm dark:bg-zinc-800 dark:text-teal-400'
                  : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
              title="Vista Tabla"
            >
              <svg 
                className="h-4.5 w-4.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" 
                />
              </svg>
            </button>
            {/* Grid View button */}
            <button
              type="button"
              onClick={() => onViewTypeChange('cards')}
              className={`rounded-md p-1.5 transition ${
                viewType === 'cards'
                  ? 'bg-white text-teal-600 shadow-sm dark:bg-zinc-800 dark:text-teal-400'
                  : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
              }`}
              title="Vista Tarjetas"
            >
              <svg 
                className="h-4.5 w-4.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
