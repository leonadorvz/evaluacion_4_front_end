export interface Resource {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'Disponible' | 'En uso' | 'En mantención';
  location: string;
  responsible?: string;
  registrationDate: string; // YYYY-MM-DD format
  description?: string;
}

export type ResourceFormState = Omit<Resource, 'id'>;

export const CATEGORIES = [
  "Redes",
  "Computación",
  "Electrónica/IoT",
  "Herramientas",
  "Insumos",
  "Otros"
] as const;

export const STATUSES = [
  "Disponible",
  "En uso",
  "En mantención"
] as const;
