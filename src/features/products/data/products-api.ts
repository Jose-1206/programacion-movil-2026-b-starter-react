/**
 * Capa DATA: cliente HTTP de la API de productos.
 */

import type {
  Product,
  ProductInput,
} from '../domain/product';

import { ApiError } from './api-error';
import { API_URL } from './config';

/**
 * Ejecuta una petición HTTP contra la API.
 *
 * - Error de red: ApiError con status null.
 * - Respuesta HTTP no exitosa: ApiError con status y details.
 * - Respuesta 204: no contiene cuerpo.
 */
async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${API_URL}${path}`,
      init,
    );
  } catch {
    throw new ApiError(
      'No fue posible conectar con el servidor.',
      null,
    );
  }

  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => null);

    throw new ApiError(
      body?.error ?? `Error ${response.status}`,
      response.status,
      body?.details ?? [],
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Parámetros opcionales para consultar productos. */
export interface ProductQuery {
  search?: string;
  category?: string;
}

/**
 * GET /api/products?search=&category=
 */
export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.category) {
    params.set('category', query.category);
  }

  const queryString = params.toString();

  return request<Product[]>(
    `/api/products${
      queryString ? `?${queryString}` : ''
    }`,
  );
}

/**
 * GET /api/products/:id
 */
export async function getProduct(
  id: number,
): Promise<Product> {
  return request<Product>(
    `/api/products/${id}`,
  );
}

/**
 * POST /api/products
 */
export async function createProduct(
  input: ProductInput,
): Promise<Product> {
  return request<Product>(
    '/api/products',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  return request<Product>(
    `/api/products/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(
  id: number,
): Promise<void> {
  await request<void>(
    `/api/products/${id}`,
    {
      method: 'DELETE',
    },
  );
}