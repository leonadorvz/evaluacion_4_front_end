import { ResourceFormState, CATEGORIES, STATUSES } from '@/types/Resource';

export interface ValidationErrors {
  name?: string;
  category?: string;
  quantity?: string;
  status?: string;
  location?: string;
  registrationDate?: string;
  responsible?: string;
  description?: string;
}

export function validateResourceForm(form: ResourceFormState): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Validate Name
  if (!form.name.trim()) {
    errors.name = "El nombre del recurso es obligatorio.";
  } else if (form.name.trim().length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }

  // Validate Category
  if (!form.category) {
    errors.category = "Debe seleccionar una categoría.";
  } else if (!(CATEGORIES as readonly string[]).includes(form.category)) {
    errors.category = "La categoría seleccionada no es válida.";
  }

  // Validate Quantity
  const qty = Number(form.quantity);
  if (form.quantity === undefined || form.quantity === null || String(form.quantity).trim() === "") {
    errors.quantity = "La cantidad es obligatoria.";
  } else if (isNaN(qty)) {
    errors.quantity = "La cantidad debe ser un valor numérico.";
  } else if (qty < 0) {
    errors.quantity = "La cantidad no puede ser negativa.";
  } else if (!Number.isInteger(qty)) {
    errors.quantity = "La cantidad debe ser un número entero.";
  }

  // Validate Status
  if (!form.status) {
    errors.status = "El estado es obligatorio.";
  } else if (!(STATUSES as readonly string[]).includes(form.status)) {
    errors.status = "El estado seleccionado no es válido.";
  }

  // Validate Location
  if (!form.location.trim()) {
    errors.location = "La ubicación es obligatoria.";
  }

  // Validate Registration Date
  if (!form.registrationDate) {
    errors.registrationDate = "La fecha de registro es obligatoria.";
  } else {
    const dateVal = new Date(form.registrationDate);
    if (isNaN(dateVal.getTime())) {
      errors.registrationDate = "La fecha ingresada no es válida.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
