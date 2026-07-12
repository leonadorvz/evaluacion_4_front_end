# Sistema de Gestión de Recursos para Laboratorio - Evaluación 4

Este es nuestro proyecto para la Evaluación Práctica N.º 4 de Desarrollo de Aplicaciones Web SPA. Es un sistema para administrar los equipos y materiales de un laboratorio tecnológico (como routers, notebooks, filamentos, etc.), permitiendo hacer un CRUD completo (crear, listar, editar y eliminar recursos).

El objetivo principal es aplicar y demostrar el uso correcto de **localStorage**, **sessionStorage** y **Cookies** en una app hecha con React y Next.js.

---

## 👥 Integrantes
- **Leonardo R.**
- **Nicolás F**

---

## 🛠️ Tecnologías que usamos
- **Next.js 16** con **React 19**
- **TypeScript**
- **Tailwind CSS v4** para los estilos
- **Cookies**, **localStorage** y **sessionStorage** del navegador

---

## 💾 ¿Cómo usamos el almacenamiento del navegador?

Para cumplir con las instrucciones del profesor, dividimos los datos de esta forma:

1. **Local Storage (Clave: `lab_resources`):** Aquí se guarda la base de datos principal de los recursos del laboratorio (la lista del CRUD). Los datos no se borran al cerrar el navegador.
2. **Session Storage (Claves: `lab_resource_draft` y `lab_filter_*`):**
   - El borrador del formulario para que si escribes algo y recargas la página (F5) no se pierda.
   - El texto que escribes en la barra de búsqueda y los filtros seleccionados. Todo esto es temporal y se borra al cerrar la pestaña.
3. **Cookies (Claves: `lab_theme`, `lab_user_preferences` y `lab_view`):**
   - El tema de la página (Modo Claro u Oscuro).
   - El nombre del responsable que aparece en el encabezado.
   - El tipo de vista preferido (Tabla o Tarjetas).

---

## ⚙️ Cómo instalar y ejecutar el proyecto

1. **Clonar este repositorio:**
   ```bash
   git clone https://github.com/leonadorvz/evaluacion_4_front_end.git
   cd evaluacion_4_front_end
   ```

2. **Instalar los paquetes de node:**
   ```bash
   npm install
   ```

3. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Ver en el navegador:**
   Entra a [http://localhost:3000](http://localhost:3000)

---

## 📂 Carpetas del proyecto

Organizamos el código separando las responsabilidades en carpetas:
- **`app/`**: Contiene la página principal (`page.tsx`) y los estilos globales (`globals.css`).
- **`components/`**: Los componentes visuales de la interfaz como el formulario, el listado, las tarjetas, la tabla, el encabezado, el interruptor de tema y el modal de confirmación.
- **`hooks/`**: Nuestros hooks personalizados para interactuar de forma segura con el almacenamiento (`useLocalStorage`, `useSessionStorage` y `useCookie`).
- **`types/`**: Los tipados de TypeScript para los recursos.
- **`utils/`**: La lógica de validaciones de los campos del formulario.

---

## 📝 Validaciones del Formulario
El formulario no te dejará guardar un recurso si no cumple con lo siguiente:
- El **Nombre** es obligatorio y debe tener al menos 3 letras.
- La **Categoría** y el **Estado** se deben seleccionar de una lista.
- La **Cantidad** es obligatoria, tiene que ser un número entero y no puede ser negativa.
- La **Ubicación** y la **Fecha de registro** son obligatorios.

---

## 🤖 Función "Sugerencia IA"
Agregamos una sección en el formulario que simula recomendaciones inteligentes. Según la categoría que elijas para el recurso, la app te da un consejo técnico automático. Por ejemplo, si seleccionas la categoría *Redes*, te sugiere revisar que no haya bucles en la topología antes de encender los equipos.

---

## 💡 Conclusión
Este trabajo nos ayudó a entender cómo pasar de una aplicación donde todo está en un solo archivo a una arquitectura más ordenada con componentes reutilizables y hooks. También aprendimos a manejar los diferentes tipos de almacenamiento que ofrece el navegador web y cómo evitar problemas de carga (hydration mismatches) en Next.js.
