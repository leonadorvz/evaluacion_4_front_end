# CRUD con localStorage, cookies y sessionStorage

Proyecto de ejemplo hecho con Next.js para mostrar, en una pantalla simple, tres formas comunes de guardar datos en el navegador.

## Objetivo

La aplicacion simula un CRUD de productos y usa cada almacenamiento segun un caso de uso distinto:

- `localStorage`: guarda el listado de productos del CRUD. Los datos siguen disponibles despues de cerrar y abrir el navegador.
- `cookies`: guarda preferencias livianas del usuario, como nombre, color de la interfaz y vista compacta.
- `sessionStorage`: guarda estado temporal de la pestana, como el borrador del formulario y el filtro de busqueda.

## Como ejecutar

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la aplicacion:

```text
http://localhost:3000
```

## Como probar el ejemplo

1. Crear, editar o eliminar productos.
2. Recargar la pagina.
3. Verificar que los productos siguen ahi porque se guardan en `localStorage`.
4. Cambiar el nombre de usuario, color o vista compacta.
5. Recargar y verificar que las preferencias siguen ahi porque se guardan en cookies.
6. Escribir algo en el formulario o en el filtro.
7. Recargar la pagina y comprobar que se conserva dentro de la misma pestana por `sessionStorage`.
8. Cerrar la pestana y abrir una nueva para ver que el estado de sesion ya no se conserva.

## Estructura principal

```text
app/
  globals.css   Estilos globales y ajuste visual de inputs numericos.
  layout.tsx    Metadata, idioma y layout base de Next.js.
  page.tsx      Componente principal con el CRUD y la logica de storage.
```

## Flujo de datos

### Productos

Los productos se guardan como arreglo JSON bajo la clave:

```text
crud-demo:products
```

Cada vez que cambia el estado `products`, la aplicacion actualiza `localStorage`.

### Preferencias

Las preferencias se guardan como JSON en la cookie:

```text
crud_demo_preferences
```

La cookie usa `SameSite=Lax`, `path=/` y una expiracion de 45 dias.

### Estado temporal

El borrador del formulario y el filtro se guardan en:

```text
crud-demo:draft
crud-demo:filter
```

Ambos viven en `sessionStorage`, asi que pertenecen solo a la pestana actual.

## Scripts disponibles

```bash
npm run dev
```

Levanta el servidor local de desarrollo.

```bash
npm run build
```

Compila la aplicacion para produccion.

```bash
npm run lint
```

Ejecuta ESLint para revisar el codigo.

## Archivos importantes

- `app/page.tsx`: contiene tipos, helpers de cookies, helpers de JSON, efectos de sincronizacion con storage y operaciones CRUD.
- `app/globals.css`: contiene Tailwind y el ajuste para ocultar los controles nativos de inputs numericos.
- `app/layout.tsx`: define metadata del sitio y `lang="es"`.

## Notas de aprendizaje

- `localStorage` y `sessionStorage` solo existen en el navegador. Por eso se leen dentro de `useEffect`, despues de que el componente se monta en el cliente.
- Los datos complejos se guardan usando `JSON.stringify` y se recuperan con `JSON.parse`.
- Conviene envolver `JSON.parse` en un `try/catch`, porque el usuario puede modificar el storage desde DevTools y dejar valores invalidos.
- No se deben guardar secretos en `localStorage`, `sessionStorage` ni cookies accesibles desde JavaScript.
