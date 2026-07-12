import React from 'react';

interface AISuggestionProps {
  category: string;
  resourceName?: string;
}

export function AISuggestion({ category, resourceName }: AISuggestionProps) {
  if (!category) return null;

  let suggestion = "";
  let title = "Recomendación del Laboratorio";

  switch (category) {
    case 'Redes':
      suggestion = `Para recursos de Redes (como ${resourceName || 'switches/routers'}), asegúrese de etiquetar cada cable ethernet y configurar las VLANs correspondientes. Se recomienda validar la tabla de enrutamiento y verificar que no existan bucles en la topología (Spanning Tree Protocol) antes de energizar.`;
      break;
    case 'Computación':
      suggestion = `Para equipos de Computación (como ${resourceName || 'notebooks/PCs'}), verifique la instalación de un software de congelamiento de disco (Deep Freeze o equivalente) y que la contraseña de BIOS esté establecida. Recuerde registrar el número de serie único en la base de datos corporativa.`;
      break;
    case 'Electrónica/IoT':
      suggestion = `Para módulos de Electrónica e IoT (como ${resourceName || 'Kits Arduino/Sensores'}), valide siempre los voltajes nominales de entrada (3.3V o 5V) antes de encender. Evite cortocircuitos revisando el circuito con un multímetro y asegúrese de que los estudiantes utilicen pulseras antiestáticas.`;
      break;
    case 'Herramientas':
      suggestion = `Para herramientas físicas del laboratorio, compruebe que se encuentren limpias y sin rastros de desgaste. Recuerde que el préstamo de herramientas peligrosas o pesadas requiere la supervisión constante de un tutor técnico en el laboratorio.`;
      break;
    case 'Insumos':
      suggestion = `Para insumos y materiales técnicos (como filamentos 3D o soldadura), mantenga un registro exacto del peso o cantidad consumida. Guarde los filamentos en contenedores herméticos con desecante para prevenir la absorción de humedad ambiental.`;
      break;
    default:
      suggestion = `Registre el recurso tecnológico con una descripción detallada. Recuerde coordinar su disponibilidad en el calendario interno del laboratorio para evitar la duplicación de reservas entre estudiantes de distintos niveles.`;
      title = "Consejo de Gestión de Inventario";
  }

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900/40 dark:bg-teal-950/20 text-zinc-900 dark:text-zinc-200 transition">
      <div className="flex gap-2.5">
        {/* Magic/AI SVG Icon */}
        <svg 
          className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
        <div>
          <h4 className="text-sm font-semibold text-teal-800 dark:text-teal-400">
            Sugerencia Inteligente de IA: {title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-teal-950 dark:text-teal-300">
            {suggestion}
          </p>
        </div>
      </div>
    </div>
  );
}
