import React from 'react';
import { Resource } from '@/types/Resource';
import { ResourceCard } from './ResourceCard';
import { ResourceTable } from './ResourceTable';

interface ResourceListProps {
  resources: Resource[];
  viewType: 'table' | 'cards';
  onEdit: (resource: Resource) => void;
  onDeleteClick: (id: string, name: string) => void;
}

export function ResourceList({
  resources,
  viewType,
  onEdit,
  onDeleteClick,
}: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800 transition">
        {/* Empty Box SVG Icon */}
        <div className="rounded-full bg-zinc-150 p-3 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          No hay recursos registrados
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-450 max-w-sm">
          No se encontraron recursos que coincidan con los filtros de búsqueda actuales. Registre un nuevo recurso o ajuste la búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div>
      {viewType === 'table' ? (
        <ResourceTable
          resources={resources}
          onEdit={onEdit}
          onDeleteClick={onDeleteClick}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={onEdit}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
