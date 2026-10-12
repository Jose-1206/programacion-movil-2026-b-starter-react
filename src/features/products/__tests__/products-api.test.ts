// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { startTestServer } from './test-server';

let baseUrl = '';
let close: () => Promise<void>;

beforeEach(async () => {
  ({ baseUrl, close } = await startTestServer());
});

afterEach(async () => {
  await close();
});

describe('API de productos', () => {
  it('responde 404 con el formato de error en una ruta desconocida', async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      error: expect.any(String),
      details: expect.any(Array),
    });
  });

  it('responde 400 con error y details cuando POST recibe datos inválidos', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        price: 0,
        category: 'Tecnologia',
        stock: -1,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Datos inválidos');
    expect(Array.isArray(body.details)).toBe(true);

    expect(body.details).toEqual(
      expect.arrayContaining([
        'name es obligatorio',
        'price debe ser un número mayor que 0',
        'category debe ser una de: Bebidas, Snacks, Aseo o Hogar',
        'stock debe ser un entero mayor o igual que 0',
      ]),
    );
  });

  it('responde 404 cuando se consulta un producto inexistente', async () => {
    const response = await fetch(`${baseUrl}/api/products/999`);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('Producto no encontrado');
    expect(body.details).toEqual(
      expect.arrayContaining([
        expect.stringContaining('999'),
      ]),
    );
  });

  it('crea un producto válido con estado 201 e id incremental', async () => {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Cafe premium',
        price: 15000,
        category: 'Bebidas',
        stock: 10,
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(201);

    expect(body).toEqual({
      id: 9,
      name: 'Cafe premium',
      price: 15000,
      category: 'Bebidas',
      stock: 10,
    });
  });

  it('responde 400 cuando el id no es numérico', async () => {
    const response = await fetch(`${baseUrl}/api/products/abc`);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Id inválido');
    expect(body.details).toEqual(
      expect.arrayContaining([
        'El id debe ser numérico',
      ]),
    );
  });

  it('elimina un producto existente con estado 204 y sin cuerpo', async () => {
    const response = await fetch(`${baseUrl}/api/products/1`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');

    const getDeletedProduct = await fetch(`${baseUrl}/api/products/1`);

    expect(getDeletedProduct.status).toBe(404);
  });
});