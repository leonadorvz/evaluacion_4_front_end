import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  resourceName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  resourceName,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md transform rounded-xl border border-zinc-200 bg-white p-6 shadow-xl transition-all dark:border-zinc-800 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">¿Confirmar eliminación?</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ¿Está seguro de que desea eliminar el recurso tecnológico <strong className="text-zinc-800 dark:text-zinc-200">"{resourceName}"</strong>? Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 active:bg-red-800 transition"
          >
            Eliminar recurso
          </button>
        </div>
      </div>
    </div>
  );
}
