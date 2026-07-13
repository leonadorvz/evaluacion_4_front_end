"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Resource, ResourceFormState } from "@/types/Resource";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useCookie } from "@/hooks/useCookie";
import { validateResourceForm, ValidationErrors } from "@/utils/validations";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterCategory } from "@/components/FilterCategory";
import { ResourceForm } from "@/components/ResourceForm";
import { ResourceList } from "@/components/ResourceList";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";

// Keys for browser storages
const RESOURCES_STORAGE_KEY = "lab_resources";
const DRAFT_SESSION_KEY = "lab_resource_draft";
const FILTER_SEARCH_KEY = "lab_filter_search";
const FILTER_CATEGORY_KEY = "lab_filter_category";
const FILTER_STATUS_KEY = "lab_filter_status";
const FILTER_SORT_KEY = "lab_filter_sort";
const PREF_THEME_COOKIE = "lab_theme";
const PREF_USER_COOKIE = "lab_user_preferences";
const PREF_VIEW_COOKIE = "lab_view";

const demoResources: Resource[] = [
  {
    id: "rec-001",
    name: "Router Cisco 2901",
    category: "Redes",
    quantity: 4,
    status: "Disponible",
    location: "Laboratorio 3",
    responsible: "Encargado TIC",
    registrationDate: "2026-07-09",
    description: "Router modular con interfaces WAN Gigabit Ethernet, utilizado para prácticas de configuración CLI."
  },
  {
    id: "rec-002",
    name: "Notebook HP ProBook",
    category: "Computación",
    quantity: 12,
    status: "En uso",
    location: "Sala de Computación A",
    responsible: "Prof. Martínez",
    registrationDate: "2026-06-15",
    description: "Notebooks para desarrollo de software e interfaces IDE, equipados con 16GB RAM y SSD de 512GB."
  },
  {
    id: "rec-003",
    name: "Osciloscopio Digital Rigol",
    category: "Electrónica/IoT",
    quantity: 2,
    status: "En mantención",
    location: "Taller de Electrónica",
    responsible: "Téc. Villagrán",
    registrationDate: "2026-07-02",
    description: "Osciloscopio de 4 canales y 100 MHz. Bajo revisión por fallas de calibración en canal 2."
  },
  {
    id: "rec-004",
    name: "Cautín Regulable TS100",
    category: "Herramientas",
    quantity: 8,
    status: "Disponible",
    location: "Taller de Electrónica",
    responsible: "Téc. Villagrán",
    registrationDate: "2026-07-05",
    description: "Cautín inteligente de soldadura con control de temperatura digital OLED."
  },
  {
    id: "rec-005",
    name: "Filamento PLA 1.75mm (1kg)",
    category: "Insumos",
    quantity: 15,
    status: "Disponible",
    location: "Laboratorio 3D",
    responsible: "Ayudante Soto",
    registrationDate: "2026-07-10",
    description: "Insumo de bobinas de filamento PLA color negro y azul para impresora Creality Ender 3."
  }
];

const getTodayString = () => new Date().toISOString().split('T')[0];

const emptyForm: ResourceFormState = {
  name: "",
  category: "",
  quantity: 1,
  status: "Disponible",
  location: "",
  responsible: "",
  registrationDate: getTodayString(),
  description: "",
};

export default function Home() {
  // --- Hooks personalizados (almacenamiento del navegador) ---
  const [resources, setResources, isResourcesLoaded] = useLocalStorage<Resource[]>(
    RESOURCES_STORAGE_KEY,
    demoResources
  );

  const [formDraft, setFormDraft, isDraftLoaded] = useSessionStorage<ResourceFormState>(
    DRAFT_SESSION_KEY,
    emptyForm
  );

  const [searchQuery, setSearchQuery, isSearchLoaded] = useSessionStorage<string>(
    FILTER_SEARCH_KEY,
    ""
  );

  const [categoryFilter, setCategoryFilter, isCategoryFilterLoaded] = useSessionStorage<string>(
    FILTER_CATEGORY_KEY,
    ""
  );

  const [statusFilter, setStatusFilter, isStatusFilterLoaded] = useSessionStorage<string>(
    FILTER_STATUS_KEY,
    ""
  );

  const [sortBy, setSortBy, isSortLoaded] = useSessionStorage<string>(
    FILTER_SORT_KEY,
    "name_asc"
  );

  const [theme, setTheme, isThemeLoaded] = useCookie<'light' | 'dark'>(
    PREF_THEME_COOKIE,
    "light"
  );

  const [responsibleName, setResponsibleName, isUserLoaded] = useCookie<string>(
    PREF_USER_COOKIE,
    "Encargado Lab"
  );

  const [viewType, setViewType, isViewLoaded] = useCookie<'table' | 'cards'>(
    PREF_VIEW_COOKIE,
    "table"
  );

  // --- Estados locales del componente ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  
  // Estado para el modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // --- Sincronizar tema oscuro ---
  useEffect(() => {
    if (isThemeLoaded) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isThemeLoaded]);

  // --- Cargar borrador de edición al iniciar si corresponde ---
  // Nota: Si el usuario estaba editando y refresca, sessionStorage conserva el borrador,
  // pero el editingId (en memoria de React) se pierde. Así que si hay un borrador con datos
  // pero sin ID activo, lo tratamos como creación de nuevo elemento.
  
  // --- Manejo del Formulario ---
  const handleFormChange = (field: keyof ResourceFormState, value: string | number) => {
    setFormDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar el error específico del campo al editarlo
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleEditClick = (resource: Resource) => {
    setEditingId(resource.id);
    setFormDraft({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity,
      status: resource.status,
      location: resource.location,
      responsible: resource.responsible || "",
      registrationDate: resource.registrationDate,
      description: resource.description || "",
    });
    setFormErrors({});
    
    // Hacer scroll suave hacia el formulario en móviles
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormDraft(emptyForm);
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateResourceForm(formDraft);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    if (editingId) {
      // Modificar recurso existente
      setResources((current) =>
        current.map((res) =>
          res.id === editingId
            ? {
                ...res,
                name: formDraft.name.trim(),
                category: formDraft.category,
                quantity: Number(formDraft.quantity),
                status: formDraft.status,
                location: formDraft.location.trim(),
                responsible: formDraft.responsible?.trim() || undefined,
                registrationDate: formDraft.registrationDate,
                description: formDraft.description?.trim() || undefined,
              }
            : res
        )
      );
      setEditingId(null);
    } else {
      // Crear nuevo recurso
      const newResource: Resource = {
        id: `rec-${Date.now().toString().slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
        name: formDraft.name.trim(),
        category: formDraft.category,
        quantity: Number(formDraft.quantity),
        status: formDraft.status,
        location: formDraft.location.trim(),
        responsible: formDraft.responsible?.trim() || undefined,
        registrationDate: formDraft.registrationDate,
        description: formDraft.description?.trim() || undefined,
      };
      setResources((current) => [newResource, ...current]);
    }

    // Resetear formulario y borrar borrador temporal
    setFormDraft(emptyForm);
    setFormErrors({});
  };

  // --- Manejo de la Eliminación con Modal ---
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setResources((current) => current.filter((res) => res.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) {
        handleCancelEdit();
      }
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  // --- Restaurar datos de prueba ---
  const handleResetDemo = () => {
    setResources(demoResources);
    setSearchQuery("");
    setCategoryFilter("");
    setStatusFilter("");
    setSortBy("name_asc");
    handleCancelEdit();
  };

  // --- Filtrado y Ordenación de Recursos ---
  const filteredAndSortedResources = useMemo(() => {
    let result = [...resources];

    // 1. Filtrar por búsqueda de texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (res) =>
          res.name.toLowerCase().includes(q) ||
          res.location.toLowerCase().includes(q) ||
          (res.responsible && res.responsible.toLowerCase().includes(q)) ||
          (res.description && res.description.toLowerCase().includes(q))
      );
    }

    // 2. Filtrar por categoría
    if (categoryFilter) {
      result = result.filter((res) => res.category === categoryFilter);
    }

    // 3. Filtrar por estado
    if (statusFilter) {
      result = result.filter((res) => res.status === statusFilter);
    }

    // 4. Ordenar resultados
    result.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "quantity_desc":
          return b.quantity - a.quantity;
        case "quantity_asc":
          return a.quantity - b.quantity;
        case "date_desc":
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case "date_asc":
          return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [resources, searchQuery, categoryFilter, statusFilter, sortBy]);

  // --- Estadísticas en tiempo real ---
  const stats = useMemo(() => {
    const totalItems = resources.length;
    const totalQuantity = resources.reduce((acc, curr) => acc + curr.quantity, 0);
    const availableQuantity = resources
      .filter((res) => res.status === "Disponible")
      .reduce((acc, curr) => acc + curr.quantity, 0);
    const maintenanceQuantity = resources
      .filter((res) => res.status === "En mantención")
      .reduce((acc, curr) => acc + curr.quantity, 0);

    return {
      totalItems,
      totalQuantity,
      availableQuantity,
      maintenanceQuantity,
    };
  }, [resources]);

  // Evitar desajustes visuales durante la carga de hidratación de Next.js
  const isLoaded = 
    isResourcesLoaded && 
    isDraftLoaded && 
    isSearchLoaded && 
    isCategoryFilterLoaded && 
    isStatusFilterLoaded && 
    isSortLoaded && 
    isThemeLoaded && 
    isUserLoaded && 
    isViewLoaded;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-teal-600 dark:border-zinc-800 dark:border-t-teal-500" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Cargando sistema de inventario...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-250">
      
      {/* Encabezado */}
      <Header
        userName={responsibleName}
        onUserNameChange={setResponsibleName}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />

      {/* Cuerpo Principal */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 sm:px-8">
        
        {/* Fila de Estadísticas (Dashboard Panel) */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-4.5 mb-6">
          
          {/* Card 1: Recursos */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 transition-all border-b-4 border-b-indigo-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Recursos Registrados</span>
                <span className="mt-2 block text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {stats.totalItems} <span className="text-xs font-normal text-zinc-500">tipos</span>
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Stock Total */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 transition-all border-b-4 border-b-violet-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Stock Total</span>
                <span className="mt-2 block text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  {stats.totalQuantity} <span className="text-xs font-normal text-zinc-500">unidades</span>
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500 dark:bg-violet-950/30 dark:text-violet-400">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Disponible */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 transition-all border-b-4 border-b-emerald-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Stock Disponible</span>
                <span className="mt-2 block text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-450">
                  {stats.availableQuantity} <span className="text-xs font-normal text-zinc-500">disp.</span>
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-450">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: En Mantención */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 transition-all border-b-4 border-b-amber-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">En Mantención</span>
                <span className="mt-2 block text-2xl font-extrabold tracking-tight text-amber-600 dark:text-amber-450">
                  {stats.maintenanceQuantity} <span className="text-xs font-normal text-zinc-500">manten.</span>
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-450">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

        </section>

        {/* Layout en dos columnas */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          
          {/* Columna Izquierda: Formulario y Preferencias de Almacenamiento */}
          <aside className="space-y-6">
            <ResourceForm
              formState={formDraft}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              editingId={editingId}
              errors={formErrors}
            />

            {/* Panel Informativo de Almacenamiento */}
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 transition-colors">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">Estado del Almacenamiento</h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                Uso de almacenamiento del navegador para este laboratorio:
              </p>
              
              <div className="mt-4 space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="inline-flex h-4.5 w-18 shrink-0 items-center justify-center rounded bg-indigo-100 text-[10px] font-bold text-indigo-850 dark:bg-indigo-950/45 dark:text-indigo-400">
                    Local Storage
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">lab_resources</span>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Guarda la lista del CRUD ({resources.length} recursos). Persiste al reiniciar navegador.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="inline-flex h-4.5 w-18 shrink-0 items-center justify-center rounded bg-sky-100 text-[10px] font-bold text-sky-850 dark:bg-sky-950/45 dark:text-sky-400">
                    Session Storage
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">lab_resource_draft / lab_filter_*</span>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Guarda temporalmente el borrador e inputs de búsqueda. Se destruye al cerrar la pestaña.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="inline-flex h-4.5 w-18 shrink-0 items-center justify-center rounded bg-amber-100 text-[10px] font-bold text-amber-850 dark:bg-amber-950/45 dark:text-amber-400">
                    Cookies
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">lab_theme / lab_user_preferences</span>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">Guarda las preferencias visuales (modo oscuro, nombre, vista) y viaja en las peticiones HTTP.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-zinc-150 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2 text-xs font-semibold text-zinc-700 hover:bg-indigo-50/50 hover:text-indigo-650 hover:border-indigo-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-305 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400 transition-all duration-200"
                >
                  Restaurar Datos de Prueba
                </button>
              </div>
            </section>
          </aside>

          {/* Columna Derecha: Búsqueda, Filtros y Lista */}
          <section className="space-y-4">
            
            {/* Buscador de Recursos */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {/* Filtros de Categorías, Estados y Ordenamiento */}
            <FilterCategory
              selectedCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewType={viewType}
              onViewTypeChange={setViewType}
            />

            {/* Listado de Recursos (Cards o Tabla) */}
            <div className="pt-2">
              <ResourceList
                resources={filteredAndSortedResources}
                viewType={viewType}
                onEdit={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            </div>

            {/* Mensaje de resultados filtrados */}
            {filteredAndSortedResources.length > 0 && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-right">
                Mostrando {filteredAndSortedResources.length} de {resources.length} recursos registrados en el inventario.
              </p>
            )}

          </section>

        </div>

      </main>

      {/* ConfirmDeleteModal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        resourceName={deleteTarget?.name || ""}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />

      {/* Pie de Página */}
      <footer className="border-t border-zinc-200/80 bg-zinc-50/50 py-6 dark:border-zinc-800 dark:bg-zinc-950 transition-colors mt-12">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Desarrollo de Aplicaciones Web SPA con React e Integración de IA — Evaluación Práctica N.º 4
          </p>
          <p className="mt-1.5 text-[10px] text-zinc-400/80 dark:text-zinc-650">
            Persistencia garantizada localmente a nivel de cliente. Diseño enfocado en experiencia de usuario accesible y moderna.
          </p>
        </div>
      </footer>

    </div>
  );
}
