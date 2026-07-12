# LabResource - Sistema de Gestión de Recursos Tecnológicos de Laboratorio

**LabResource** es una aplicación web tipo SPA (Single Page Application) desarrollada con **React** y **Next.js**. Su objetivo principal es resolver los problemas comunes en la administración física de recursos tecnológicos en laboratorios académicos o corporativos (tales como notebooks, routers, switches, impresoras 3D y componentes de electrónica), eliminando planillas manuales y previniendo la pérdida de datos o duplicidades.

Esta solución implementa mecanismos avanzados de almacenamiento persistente y temporal del navegador (Local Storage, Session Storage y Cookies), organizados a través de componentes reutilizables y hooks personalizados.

---

## 👥 Integrantes de la Pareja de Trabajo
- **Leonardo R.** (GitHub: [@leonadorvz](https://github.com/leonadorvz))
- **Nicolás** (Compañero de equipo)

---

## 🎯 Objetivo del Proyecto
Desarrollar una interfaz moderna y eficiente para el control de inventario de recursos tecnológicos que permita realizar operaciones CRUD (Creación, Lectura, Actualización y Eliminación) en tiempo real, garantizando la persistencia y personalización mediante el almacenamiento local del cliente y ofreciendo sugerencias contextuales inteligentes apoyadas en lógica de asistencia técnica.

---

## 🛠️ Tecnologías Utilizadas
- **Next.js 16** (Framework de React con compilación ultra-rápida y soporte SSR/Hydration)
- **React 19** (Uso intensivo de Hooks de estado, efectos y hooks personalizados)
- **TypeScript 5** (Tipado estricto y seguro para evitar errores en producción)
- **Tailwind CSS v4** (Estilos premium, soporte nativo de variables CSS y diseño totalmente responsivo)
- **Local Storage** (Almacenamiento permanente en cliente para el catálogo de recursos)
- **Session Storage** (Almacenamiento temporal para filtros de búsqueda y borradores del formulario)
- **Cookies** (Preferencias visuales ligeras: Tema Oscuro, vista de tarjetas/tabla y nombre de responsable)

---

## 🚀 Instalación y Ejecución Local

Para ejecutar el proyecto en su computadora local, siga los siguientes pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/leonadorvz/evaluacion_4_front_end.git
   cd evaluacion_4_front_end
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```

4. **Abrir en su navegador favorito:**
   Acceda a [http://localhost:3000](http://localhost:3000) para ver la aplicación funcionando.

5. **Compilar y auditar código (Opcional):**
   ```bash
   npm run build  # Verifica la compilación de producción de Next.js
   npm run lint   # Ejecuta el análisis de linter ESLint en busca de advertencias
   ```

---

## 📂 Estructura de Carpetas del Proyecto

El código fuente está estructurado de manera modular y limpia en el directorio raíz de la aplicación:

```text
├── app/
│   ├── favicon.ico          # Icono de la pestaña del sitio
│   ├── globals.css          # Estilos globales y configuraciones de Tailwind CSS v4
│   ├── layout.tsx           # Configuración del layout base y metadatos SEO
│   └── page.tsx             # Componente y controlador principal de la SPA
├── components/
│   ├── AISuggestion.tsx     # Caja de consejos contextuales simulando IA por categoría
│   ├── ConfirmDeleteModal.tsx # Modal de confirmación con backdrop-blur para eliminación segura
│   ├── FilterCategory.tsx   # Panel de filtrado por categoría, estado, orden y alternancia de vistas
│   ├── Header.tsx           # Encabezado del sistema con responsable editable y ThemeToggle
│   ├── ResourceCard.tsx     # Tarjeta interactiva para renderizado en cuadrícula (grid)
│   ├── ResourceForm.tsx     # Formulario de alta y edición con borrador e inputs validados
│   ├── ResourceList.tsx     # Contenedor encargado de switchear la vista entre tabla y tarjetas
│   ├── ResourceTable.tsx    # Fila y encabezados de tabla para la visualización clásica estructurada
│   └── ThemeToggle.tsx      # Switch interactivo animado para alternar tema claro/oscuro
├── hooks/
│   ├── useCookie.ts         # Hook personalizado para guardar preferencias en cookies
│   ├── useLocalStorage.ts   # Hook personalizado seguro para leer/guardar datos en Local Storage
│   └── useSessionStorage.ts # Hook personalizado para almacenar borradores y búsquedas temporales
├── public/                  # Elementos gráficos e iconos estáticos SVG
├── types/
│   └── Resource.ts          # Interfaces de datos y arrays fijos de categorías y estados
└── utils/
    └── validations.ts       # Funciones auxiliares de validación de campos obligatorios
```

---

## 🧩 Componentes Principales y su Responsabilidad

1. **Header:** Muestra el logotipo de la aplicación, un input inline para editar dinámicamente el nombre del responsable del laboratorio (guardado en cookies) y el switch del tema.
2. **ThemeToggle:** Botón deslizable con micro-animaciones y cambio de iconos Sun/Moon para alternar el aspecto visual global.
3. **ResourceForm:** Recopila información mediante inputs controlados. Implementa el rellenado de campos al editar y despliega mensajes de error en tiempo real debajo de cada input correspondiente.
4. **AISuggestion:** Módulo inteligente que reacciona instantáneamente a la categoría seleccionada en el formulario y provee un aviso de recomendación técnica detallado (ej. Spanning Tree para *Redes*, voltajes de entrada para *IoT/Electrónica*).
5. **ConfirmDeleteModal:** Cuadro de diálogo modal que se superpone a la pantalla con un fondo difuminado. Requiere confirmación explícita para evitar que un usuario elimine un recurso por error.
6. **SearchBar:** Campo de búsqueda por texto que filtra inmediatamente por coincidencia de nombre, ubicación o encargado.
7. **FilterCategory:** Filtra los datos por categorías, estado actual y permite ordenar los resultados en base a múltiples criterios (Nombre A-Z, Cantidad, Fecha de registro). Incluye el selector de diseño (Tabla / Tarjetas).
8. **ResourceList:** Administra el flujo del listado y renderiza el componente `ResourceTable` o la cuadrícula de `ResourceCard` según la cookie de preferencia del usuario. Gestiona la vista informativa de "cero resultados".

---

## 🪝 Hooks Utilizados

### Hooks Estándar de React
- `useState`: Gestión del ID en edición, errores del formulario y estado de apertura de diálogos flotantes.
- `useEffect`: Utilizado para sincronizar de forma reactiva la clase `dark` en el DOM (`document.documentElement`) según cambie el tema del usuario.
- `useMemo`: Cálculos de rendimiento para realizar el filtrado y ordenamiento de recursos y para computar las estadísticas en tiempo real (Dashboard superior).

### Hooks Personalizados (Requisito Obligatorio)
Para abstraer el acceso al Web Storage evitando errores de desajuste de hidratación (hydration mismatches) en Next.js, implementamos:
- **`useLocalStorage<T>(key, initialValue)`**: Lee el almacenamiento permanente de forma segura en el montaje del cliente y expone un setter idéntico a `useState` que sincroniza automáticamente con Local Storage en formato JSON.
- **`useSessionStorage<T>(key, initialValue)`**: Controla el estado efímero del borrador y filtros de búsqueda a nivel de pestaña.
- **`useCookie<T>(name, initialValue)`**: Gestiona la creación de cookies persistentes con codificación URI, fechas de expiración optimizadas y bandera de seguridad `SameSite=Lax`.

*Nota técnica:* Para asegurar el cumplimiento estricto con las reglas de rendimiento del ciclo de vida de React, todas las escrituras y lecturas iniciales de estado en los hooks personalizados se programan asíncronamente mediante `queueMicrotask` para evitar renders en cascada innecesarios durante el montaje.

---

## 💾 Persistencia de Datos en el Navegador

| Almacenamiento | Clave / Cookie | Datos Guardados | Comportamiento |
| :--- | :--- | :--- | :--- |
| **Local Storage** | `lab_resources` | Array JSON con todos los recursos tecnológicos. | Persiste de forma indefinida, incluso si el navegador se cierra. |
| **Session Storage** | `lab_resource_draft` | Borrador del formulario a medio completar. | Permite recargar la página (F5) sin perder lo escrito. Se borra al cerrar la pestaña. |
| **Session Storage** | `lab_filter_*` | Búsqueda escrita, categoría y estado seleccionados. | Mantiene los filtros activos durante la recarga de la pestaña de trabajo actual. |
| **Cookies** | `lab_theme` | Tema de aspecto seleccionado (`light` o `dark`). | Persiste por 45 días y se aplica en el render inicial para evitar parpadeos de luz. |
| **Cookies** | `lab_user_preferences` | Nombre visible del responsable a cargo del inventario. | Permite que el responsable sea recordado en futuras sesiones de uso del sistema. |
| **Cookies** | `lab_view` | Vista seleccionada (`table` o `cards`). | Almacena si el usuario prefiere ver el inventario como tabla clásica o en formato rejilla. |

---

## 🛑 Validaciones del Formulario
El sistema valida estrictamente la consistencia lógica de los datos antes de guardarlos. Si hay un error, el campo se pinta de rojo y muestra un texto de ayuda:
- **Nombre del recurso:** Obligatorio. Debe poseer una longitud mínima de 3 caracteres.
- **Categoría:** Obligatorio. Debe corresponder a una categoría válida de la lista permitida.
- **Cantidad:** Obligatorio. Debe ser un valor numérico entero y estrictamente mayor o igual a 0.
- **Estado:** Obligatorio. Debe ser uno de los estados oficiales (`Disponible`, `En uso`, `En mantención`).
- **Ubicación:** Obligatorio. Debe ingresar el aula, taller o laboratorio físico asignado al recurso.
- **Fecha de registro:** Obligatorio. Debe ser una fecha válida con formato coherente.

---

## 🤖 Uso de Inteligencia Artificial (IA) en el Desarrollo

Para el desarrollo del proyecto, se utilizó una Inteligencia Artificial como asistente técnico de la siguiente manera:
1. **Modelado y Refactorización:** Apoyo en la separación de un archivo monolítico a una arquitectura desacoplada de componentes independientes en TypeScript.
2. **Robustez en Hydration (Next.js):** Sugerencia de estructurar los hooks personalizados con estados diferidos de carga (`isLoaded`) y el uso de `queueMicrotask` para evitar discrepancias entre el HTML generado en servidor (SSR) y el DOM cliente.
3. **Validación Segura:** Diseño del archivo de validaciones auxiliares desacoplado de la interfaz de React para permitir pruebas unitarias limpias.
4. **Diseño de Sugerencias de IA Contextuales:** Implementación de la sección "Sugerencia Inteligente de IA" en el formulario, simulando asistencia inteligente en tiempo real según el recurso seleccionado.

---

## 📸 Evidencia Visual (Capturas de Pantalla)

*(Nota: Agregue sus capturas de pantalla del proyecto ejecutándose aquí cuando lo monte en su PC local)*

### 1. Vista General del Inventario (Modo Claro - Tabla)
![Claro Tabla](public/window.svg) *(Alineación clara, filtros activos y panel de estadísticas en la zona superior)*

### 2. Formulario y Sugerencias de IA (Modo Oscuro - Tarjetas)
![Oscuro Tarjetas](public/file.svg) *(Visualización de modo oscuro habilitado y badges con colores adaptativos)*

---

## 💡 Conclusión Técnica
La realización de este proyecto permitió afianzar conceptos clave en el desarrollo moderno de Front-End, tales como la arquitectura basada en componentes reutilizables, la sincronización segura del estado de React con el almacenamiento nativo del navegador, y la importancia de estructurar interfaces dinámicas de alto impacto visual sin comprometer la accesibilidad y el rendimiento de carga.
