/**
 * Capa DOMAIN de la funcionalidad «Productos».
 *
 * Solo contiene tipos, constantes y funciones puras.
 * No depende de HTTP, React ni Ionic.
 */

/** Producto tal como lo entrega la API. */
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Datos que captura el formulario, todavía sin id. */
export interface ProductInput {
  name: string;
  price: number;
  category: string;
  stock: number;
}

/** Producto listo para mostrarse en la interfaz. */
export interface ProductView {
  id: number;
  name: string;
  /** Precio en pesos colombianos, por ejemplo "$ 1.250.000". */
  priceLabel: string;
  category: string;
  stock: number;
  /** "Agotado", "Pocas unidades" o "Disponible". */
  stockLabel: string;
  /** true cuando quedan entre 1 y LOW_STOCK_THRESHOLD - 1 unidades. */
  isLowStock: boolean;
  /** true cuando no quedan unidades. */
  isOutOfStock: boolean;
}

/** Campos del formulario que pueden tener un error de validación. */
export type ProductField = 'name' | 'price' | 'category' | 'stock';

/** Resultado de validar un ProductInput. */
export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<ProductField, string>>;
}

/** Filtros de la lista. category vacío significa «todas». */
export interface ProductFilters {
  search: string;
  category: string;
}

/** Categorías permitidas por la API y la aplicación. */
export const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'] as const;

/** Longitud máxima permitida para el nombre. */
export const NAME_MAX_LENGTH = 60;

/** Umbral de «pocas unidades». */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Formatea un número como pesos colombianos.
 *
 * Ejemplos:
 * formatCOP(1250000) -> "$ 1.250.000"
 * formatCOP(8500) -> "$ 8.500"
 */
export function formatCOP(value: number): string {
  const digits = Math.round(value).toString();
  return `$ ${digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Convierte un Product en un ProductView listo para la interfaz.
 */
export function toProductView(product: Product): ProductView {
  const isOutOfStock = product.stock === 0;

  const isLowStock =
    product.stock > 0 &&
    product.stock < LOW_STOCK_THRESHOLD;

  let stockLabel = 'Disponible';

  if (isOutOfStock) {
    stockLabel = 'Agotado';
  } else if (isLowStock) {
    stockLabel = 'Pocas unidades';
  }

  return {
    id: product.id,
    name: product.name.trim(),
    priceLabel: formatCOP(product.price),
    category: product.category,
    stock: product.stock,
    stockLabel,
    isLowStock,
    isOutOfStock,
  };
}

/**
 * Valida los datos del formulario con las mismas reglas de la API.
 */
export function validateProduct(input: ProductInput): ValidationResult {
  const errors: Partial<Record<ProductField, string>> = {};

  const trimmedName =
    typeof input.name === 'string'
      ? input.name.trim()
      : '';

  if (trimmedName === '') {
    errors.name = 'El nombre es obligatorio.';
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `El nombre debe tener máximo ${NAME_MAX_LENGTH} caracteres.`;
  }

  if (
    typeof input.price !== 'number' ||
    !Number.isFinite(input.price) ||
    input.price <= 0
  ) {
    errors.price = 'El precio debe ser un número mayor que 0.';
  }

  if (
    typeof input.category !== 'string' ||
    !CATEGORIES.includes(
      input.category as (typeof CATEGORIES)[number],
    )
  ) {
    errors.category =
      'La categoría debe ser Bebidas, Snacks, Aseo o Hogar.';
  }

  if (
    !Number.isInteger(input.stock) ||
    input.stock < 0
  ) {
    errors.stock =
      'El stock debe ser un entero mayor o igual que 0.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filtra productos por texto y categoría.
 *
 * - search: coincidencia parcial sin distinguir mayúsculas.
 * - category: coincidencia exacta.
 * - category vacío: todas las categorías.
 */
export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const normalizedSearch = filters.search
    .trim()
    .toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      normalizedSearch === '' ||
      product.name
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCategory =
      filters.category === '' ||
      product.category === filters.category;

    return matchesSearch && matchesCategory;
  });
}