import React from 'react';
import { ResourceFormState, CATEGORIES, STATUSES } from '@/types/Resource';
import { ValidationErrors } from '@/utils/validations';
import { AISuggestion } from './AISuggestion';

interface ResourceFormProps {
  formState: ResourceFormState;
  onFormChange: (field: keyof ResourceFormState, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingId: string | null;
  errors: ValidationErrors;
}

export function ResourceForm({
  formState,
  onFormChange,
  onSubmit,
  onCancel,
  editingId,
  errors,
}: ResourceFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors"
    >
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {editingId ? 'Editar Recurso' : 'Registrar Nuevo Recurso'}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Complete los detalles técnicos del recurso a continuación.
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Nombre del Recurso *
          </label>
          <input
            type="text"
            value={formState.name}
            onChange={(e) => onFormChange('name', e.target.value)}
            placeholder="Ej. Router Cisco 2901"
            className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-4 ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800'
            }`}
          />
          {errors.name && (
            <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
              {errors.name}
            </span>
          )}
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Categoría *
            </label>
            <select
              value={formState.category}
              onChange={(e) => onFormChange('category', e.target.value)}
              className={`rounded-lg border px-3 py-2 text-sm outline-none bg-white transition focus:ring-4 dark:bg-zinc-800 ${
                errors.category
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700'
              }`}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                {errors.category}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Estado *
            </label>
            <select
              value={formState.status}
              onChange={(e) => onFormChange('status', e.target.value)}
              className={`rounded-lg border px-3 py-2 text-sm outline-none bg-white transition focus:ring-4 dark:bg-zinc-800 ${
                errors.status
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700'
              }`}
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.status && (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                {errors.status}
              </span>
            )}
          </div>

        </div>

        {/* Quantity & Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Cantidad *
            </label>
            <input
              type="number"
              min="0"
              value={formState.quantity}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                onFormChange('quantity', val);
              }}
              placeholder="Ej. 5"
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                errors.quantity
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800'
              }`}
            />
            {errors.quantity && (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Ubicación *
            </label>
            <input
              type="text"
              value={formState.location}
              onChange={(e) => onFormChange('location', e.target.value)}
              placeholder="Ej. Laboratorio 3"
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-4 ${
                errors.location
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800'
              }`}
            />
            {errors.location && (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                {errors.location}
              </span>
            )}
          </div>

        </div>

        {/* Responsible & Registration Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Responsible */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Responsable (Opcional)
            </label>
            <input
              type="text"
              value={formState.responsible || ''}
              onChange={(e) => onFormChange('responsible', e.target.value)}
              placeholder="Ej. Encargado TIC"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none bg-white transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Fecha de Registro *
            </label>
            <input
              type="date"
              value={formState.registrationDate}
              onChange={(e) => onFormChange('registrationDate', e.target.value)}
              className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-4 dark:bg-zinc-800 ${
                errors.registrationDate
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15 dark:border-red-900/60'
                  : 'border-zinc-300 focus:border-teal-500 focus:ring-teal-500/10 dark:border-zinc-700'
              }`}
            />
            {errors.registrationDate && (
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                {errors.registrationDate}
              </span>
            )}
          </div>

        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Descripción (Opcional)
          </label>
          <textarea
            value={formState.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            placeholder="Ingrese observaciones sobre el recurso..."
            rows={2}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none bg-white transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* AISuggestion context-aware box */}
        <AISuggestion 
          category={formState.category} 
          resourceName={formState.name} 
        />

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 active:bg-teal-800 transition shadow-sm"
        >
          {editingId ? 'Guardar Cambios' : 'Registrar Recurso'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
