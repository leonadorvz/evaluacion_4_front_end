import React from 'react';
import { Resource } from '@/types/Resource';

interface ResourceTableProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDeleteClick: (id: string, name: string) => void;
}

export function ResourceTable({
  resources,
  onEdit,
  onDeleteClick,
}: ResourceTableProps) {
  // Format dates for display
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: Resource['status']) => {
    switch (status) {
      case 'Disponible':
        return (
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
            Disponible
          </span>
        );
      case 'En uso':
        return (
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-sky-400">
            En uso
          </span>
        );
      case 'En mantención':
        return (
          <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400">
            En mantención
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors">
      <table className="w-full min-w-[900px] border-collapse text-left text-zinc-950 dark:text-zinc-100">
        <thead className="bg-zinc-50/70 border-b border-zinc-200 text-xs font-bold uppercase text-zinc-500 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-450">
          <tr>
            <th className="px-6 py-4">Recurso / ID</th>
            <th className="px-6 py-4">Categoría</th>
            <th className="px-6 py-4">Cantidad</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Ubicación</th>
            <th className="px-6 py-4">Responsable</th>
            <th className="px-6 py-4">F. Registro</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {resources.map((resource) => (
            <tr 
              key={resource.id}
              className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/35 transition align-middle"
            >
              {/* Name & ID */}
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {resource.name}
                  </span>
                  {resource.description && (
                    <span className="text-xs text-zinc-450 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-[250px]">
                      {resource.description}
                    </span>
                  )}
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-400">
                  {resource.category}
                </span>
              </td>

              {/* Quantity */}
              <td className="px-6 py-4 font-semibold text-zinc-800 dark:text-zinc-200">
                {resource.quantity}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {getStatusBadge(resource.status)}
              </td>

              {/* Location */}
              <td className="px-6 py-4 text-zinc-650 dark:text-zinc-350">
                {resource.location}
              </td>

              {/* Responsible */}
              <td className="px-6 py-4 text-zinc-650 dark:text-zinc-350">
                {resource.responsible || <span className="text-zinc-400 dark:text-zinc-600">—</span>}
              </td>

              {/* Registration Date */}
              <td className="px-6 py-4 text-zinc-650 dark:text-zinc-350">
                {formatDate(resource.registrationDate)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(resource)}
                    className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-indigo-50/50 hover:text-indigo-600 hover:border-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 dark:hover:border-indigo-900/50 transition-all"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClick(resource.id, resource.name)}
                    className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-650 hover:bg-red-50 dark:border-red-950/30 dark:bg-zinc-800 dark:text-red-400 dark:hover:bg-red-950/20 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
