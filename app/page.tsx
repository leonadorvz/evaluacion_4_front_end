"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type ProductForm = {
  name: string;
  category: string;
  price: string;
  stock: string;
};

type Preferences = {
  userName: string;
  accent: "teal" | "rose" | "amber";
  compact: boolean;
};

const PRODUCTS_KEY = "crud-demo:products";
const DRAFT_KEY = "crud-demo:draft";
const FILTER_KEY = "crud-demo:filter";
const PREF_COOKIE = "crud_demo_preferences";

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
};

const demoProducts: Product[] = [
  {
    id: "demo-1",
    name: "Notebook de proyecto",
    category: "Papeleria",
    price: 5490,
    stock: 12,
  },
  {
    id: "demo-2",
    name: "Cafe de especialidad",
    category: "Cocina",
    price: 11990,
    stock: 8,
  },
  {
    id: "demo-3",
    name: "Cable USB-C",
    category: "Tecnologia",
    price: 7990,
    stock: 25,
  },
];

const defaultPreferences: Preferences = {
  userName: "Invitado",
  accent: "teal",
  compact: false,
};

const accentClasses = {
  teal: {
    button: "bg-teal-700 hover:bg-teal-800 focus-visible:outline-teal-600",
    soft: "bg-teal-50 text-teal-900 border-teal-200",
    ring: "focus:border-teal-600 focus:ring-teal-600/20",
    text: "text-teal-700",
  },
  rose: {
    button: "bg-rose-700 hover:bg-rose-800 focus-visible:outline-rose-600",
    soft: "bg-rose-50 text-rose-900 border-rose-200",
    ring: "focus:border-rose-600 focus:ring-rose-600/20",
    text: "text-rose-700",
  },
  amber: {
    button: "bg-amber-600 hover:bg-amber-700 focus-visible:outline-amber-500",
    soft: "bg-amber-50 text-amber-950 border-amber-200",
    ring: "focus:border-amber-600 focus:ring-amber-600/20",
    text: "text-amber-700",
  },
};

function getCookie(name: string) {
  // Las cookies se leen desde document.cookie en el cliente.
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  // SameSite=Lax evita enviar la cookie en varios contextos de terceros.
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function readPreferences(): Preferences {
  const stored = getCookie(PREF_COOKIE);

  if (!stored) {
    return defaultPreferences;
  }

  return { ...defaultPreferences, ...parseJson(stored, defaultPreferences) };
}

function parseJson<T>(value: string | null, fallback: T): T {
  // Si el usuario edita el storage manualmente y rompe el JSON, usamos un valor seguro.
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function money(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  const accent = accentClasses[preferences.accent];

  useEffect(() => {
    // El storage del navegador solo existe en el cliente, por eso se lee despues del montaje.
    queueMicrotask(() => {
      const storedProducts = window.localStorage.getItem(PRODUCTS_KEY);
      const storedDraft = window.sessionStorage.getItem(DRAFT_KEY);
      const storedFilter = window.sessionStorage.getItem(FILTER_KEY);

      setProducts(parseJson(storedProducts, demoProducts));
      setForm(parseJson(storedDraft, emptyForm));
      setFilter(storedFilter ?? "");
      setPreferences(readPreferences());
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    // localStorage persiste incluso al cerrar y abrir de nuevo el navegador.
    if (loaded) {
      window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [loaded, products]);

  useEffect(() => {
    // sessionStorage es ideal para borradores temporales de la pestana actual.
    if (loaded) {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }
  }, [form, loaded]);

  useEffect(() => {
    // El filtro tambien es estado temporal: se mantiene al recargar, pero no entre sesiones.
    if (loaded) {
      window.sessionStorage.setItem(FILTER_KEY, filter);
    }
  }, [filter, loaded]);

  useEffect(() => {
    // Las preferencias quedan en cookie para simular configuracion liviana del usuario.
    if (loaded) {
      setCookie(PREF_COOKIE, JSON.stringify(preferences), 45);
    }
  }, [loaded, preferences]);

  const filteredProducts = useMemo(() => {
    const value = filter.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.category].some((field) =>
        field.toLowerCase().includes(value),
      ),
    );
  }, [filter, products]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );

  function updateForm(field: keyof ProductForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    window.sessionStorage.removeItem(DRAFT_KEY);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Los inputs entregan texto; aqui normalizamos antes de guardar.
    const cleanName = form.name.trim();
    const cleanCategory = form.category.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!cleanName || !cleanCategory || price <= 0 || stock < 0) {
      return;
    }

    // Si hay un id en edicion actualizamos; si no, creamos un nuevo registro.
    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: cleanName,
                category: cleanCategory,
                price,
                stock,
              }
            : product,
        ),
      );
    } else {
      setProducts((current) => [
        {
          id: crypto.randomUUID(),
          name: cleanName,
          category: cleanCategory,
          price,
          stock,
        },
        ...current,
      ]);
    }

    resetForm();
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
  }

  function deleteProduct(id: string) {
    setProducts((current) => current.filter((product) => product.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  function resetDemo() {
    // Permite volver al estado inicial y limpiar datos temporales de sessionStorage.
    setProducts(demoProducts);
    setFilter("");
    resetForm();
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(demoProducts));
    window.sessionStorage.removeItem(FILTER_KEY);
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className={`text-sm font-semibold uppercase ${accent.text}`}>
              Next.js + Web Storage
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">
              CRUD de productos con almacenamiento del navegador
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              La lista vive en localStorage, las preferencias quedan en cookies
              y el borrador del formulario se conserva en sessionStorage solo
              durante esta pestaña.
            </p>
          </div>

          <div
            className={`grid gap-3 rounded-lg border p-4 sm:grid-cols-3 ${accent.soft}`}
          >
            <StorageBadge title="localStorage" value={`${products.length} items`} />
            <StorageBadge title="cookies" value={preferences.userName} />
            <StorageBadge
              title="sessionStorage"
              value={form.name ? "borrador activo" : "sin borrador"}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <form
            onSubmit={saveProduct}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Editar producto" : "Nuevo producto"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Persistido como arreglo JSON en localStorage.
                </p>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                  Cancelar
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4">
              <TextInput
                label="Nombre"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="Ej: Teclado mecanico"
                accent={accent.ring}
              />
              <TextInput
                label="Categoria"
                value={form.category}
                onChange={(value) => updateForm("category", value)}
                placeholder="Ej: Tecnologia"
                accent={accent.ring}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextInput
                  label="Precio"
                  type="number"
                  value={form.price}
                  onChange={(value) => updateForm("price", value)}
                  placeholder="12990"
                  accent={accent.ring}
                />
                <TextInput
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(value) => updateForm("stock", value)}
                  placeholder="10"
                  accent={accent.ring}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`mt-5 w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${accent.button}`}
            >
              {editingId ? "Guardar cambios" : "Crear producto"}
            </button>
          </form>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Preferencias</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Buen caso para cookies: configuracion liviana que puede viajar en
              futuras peticiones.
            </p>

            <div className="mt-5 grid gap-4">
              <TextInput
                label="Nombre de usuario"
                value={preferences.userName}
                onChange={(value) =>
                  setPreferences((current) => ({
                    ...current,
                    userName: value || "Invitado",
                  }))
                }
                accent={accent.ring}
              />

              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Color
                <select
                  value={preferences.accent}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      accent: event.target.value as Preferences["accent"],
                    }))
                  }
                  className={`rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:ring-4 ${accent.ring}`}
                >
                  <option value="teal">Verde</option>
                  <option value="rose">Rosa</option>
                  <option value="amber">Amarillo</option>
                </select>
              </label>

              <label className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 px-3 py-3 text-sm font-medium text-zinc-700">
                Vista compacta
                <input
                  type="checkbox"
                  checked={preferences.compact}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      compact: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-zinc-900"
                />
              </label>
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Productos" value={String(products.length)} />
            <Metric label="Unidades" value={String(totalStock)} />
            <Metric label="Inventario" value={money(totalValue)} />
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Hola, {preferences.userName}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  El filtro se guarda en sessionStorage y se pierde al cerrar la
                  pestaña.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  placeholder="Filtrar por nombre o categoria"
                  className={`min-h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:ring-4 ${accent.ring}`}
                />
                <button
                  type="button"
                  onClick={resetDemo}
                  className="min-h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold hover:bg-zinc-50"
                >
                  Restaurar demo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Producto</th>
                    <th className="px-5 py-3 font-semibold">Categoria</th>
                    <th className="px-5 py-3 font-semibold">Precio</th>
                    <th className="px-5 py-3 font-semibold">Stock</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-zinc-100 align-middle"
                    >
                      <td
                        className={`px-5 font-medium text-zinc-950 ${
                          preferences.compact ? "py-3" : "py-5"
                        }`}
                      >
                        {product.name}
                      </td>
                      <td className="px-5 text-zinc-600">{product.category}</td>
                      <td className="px-5 text-zinc-600">
                        {money(product.price)}
                      </td>
                      <td className="px-5 text-zinc-600">{product.stock}</td>
                      <td className="px-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => editProduct(product)}
                            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
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

            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                No hay productos para el filtro actual.
              </div>
            ) : null}
          </div>

          <section className="grid gap-4 lg:grid-cols-3">
            <StorageNote
              title="localStorage"
              text="Ideal para datos persistentes del cliente, como este inventario de ejemplo. Sigue disponible despues de cerrar el navegador."
            />
            <StorageNote
              title="Cookies"
              text="Utiles para preferencias pequenas o informacion que el servidor podria necesitar recibir con cada request."
            />
            <StorageNote
              title="sessionStorage"
              text="Perfecto para estado temporal de una pestana: filtros, borradores y pasos de un flujo que no deben quedar permanentes."
            />
          </section>
        </section>
      </section>
    </main>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  accent,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  accent: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <input
        type={type}
        value={value}
        min={type === "number" ? "0" : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`min-h-11 w-full min-w-0 rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:ring-4 ${accent} ${type === "number" ? "number-input" : ""}`}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function StorageBadge({ title, value }: { title: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase">{title}</p>
      <p className="mt-1 truncate text-sm">{value}</p>
    </div>
  );
}

function StorageNote({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </article>
  );
}
