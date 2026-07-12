import React from 'react';
import { Resource } from '@/types/Resource';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDeleteClick: (id: string, name: string) => void;
}

export function ResourceCard({
  resource,
  onEdit,
  onDeleteClick,
}: ResourceCardProps) {
  // Setup color tags for status
  let statusBadgeClass = "";
  switch (resource.status) {
    case 'Disponible':
      statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/40";
      break;
    case 'En uso':
      statusBadgeClass = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-450 dark:border-sky-900/40";
      break;
    case 'En mantención':
      statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/40";
      break;
    default:
      statusBadgeClass = "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800";
  }

  // Formatting date for es-CL style
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition dark:border-zinc-800 dark:bg-zinc-900/70 text-zinc-950 dark:text-zinc-50">
      
      <div>
        {/* Header inside Card */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-400">
            {resource.category}
          </span>
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass}`}>
            {resource.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-base font-bold text-zinc-900 group-hover:text-teal-600 dark:text-zinc-100 dark:group-hover:text-teal-400 transition-colors">
          {resource.name}
        </h3>

        {/* Description */}
        {resource.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            {resource.description}
          </p>
        )}

        {/* Specs list */}
        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2.5 border-t border-zinc-100 pt-3 text-[11px] dark:border-zinc-800">
          <div>
            <span className="block font-medium text-zinc-400 dark:text-zinc-500">Cantidad</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{resource.quantity} unidades</span>
          </div>
          <div>
            <span className="block font-medium text-zinc-400 dark:text-zinc-500">Ubicación</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block" title={resource.location}>
              {resource.location}
            </span>
          </div>
          <div>
            <span className="block font-medium text-zinc-400 dark:text-zinc-500">Registrado</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatDate(resource.registrationDate)}</span>
          </div>
          <div>
            <span className="block font-medium text-zinc-400 dark:text-zinc-500">Responsable</span>
            <span className="font-semibold text-zinc-850 dark:text-zinc-250 truncate block" title={resource.responsible || 'No asignado'}>
              {resource.responsible || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => onEdit(resource)}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDeleteClick(resource.id, resource.name)}
          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-950/30 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-950/20 transition"
        >
          Eliminar
        </button>
      </div>

    </div>
  );
}
