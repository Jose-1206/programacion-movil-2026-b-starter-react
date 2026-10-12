/**
 * API de productos (Express).
 *
 * `createApp()` construye y devuelve la aplicación SIN ponerla a escuchar:
 *  - `server/index.js` la pone a escuchar en el puerto 3000 (`npm run server`);
 *  - las pruebas la levantan con `app.listen(0)` (puerto libre) y llaman con `fetch`
 *    (ver el helper `startTestServer()` en src/features/products/__tests__/test-server.ts).
 *
 * Contrato:
 *   GET    /api/products?search=&category=   200 + arreglo
 *   GET    /api/products/:id                 200 | 400 | 404
 *   POST   /api/products                     201 | 400
 *   PUT    /api/products/:id                 200 | 400 | 404
 *   DELETE /api/products/:id                 204 | 400 | 404
 *
 * Formato de error uniforme:
 *   { "error": "mensaje", "details": ["..."] }
 */

const express = require('express');
const cors = require('cors');
const seedProducts = require('./data/products.json');

const CATEGORIES = ['Bebidas', 'Snacks', 'Aseo', 'Hogar'];

/**
 * YA DADO.
 * Convierte el parámetro :id en número.
 * Devuelve null cuando el valor no contiene únicamente dígitos.
 */
function parseId(rawId) {
  return /^\d+$/.test(rawId) ? Number(rawId) : null;
}

/**
 * Valida el cuerpo utilizado por POST y PUT.
 *
 * La validación acumula todos los problemas encontrados
 * para devolver un mensaje en `details` por cada error.
 */
function validateProductInput(input) {
  const details = [];

  const { name, price, category, stock } = input;

  if (typeof name !== 'string' || name.trim() === '') {
    details.push('name es obligatorio');
  } else if (name.trim().length > 60) {
    details.push('name debe tener máximo 60 caracteres');
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    details.push('price debe ser un número mayor que 0');
  }

  if (typeof category !== 'string' || !CATEGORIES.includes(category)) {
    details.push(
      'category debe ser una de: Bebidas, Snacks, Aseo o Hogar'
    );
  }

  if (!Number.isInteger(stock) || stock < 0) {
    details.push('stock debe ser un entero mayor o igual que 0');
  }

  return details;
}

function createApp() {
  const app = express();

  // YA DADO: permite que la app Ionic/Vite consuma la API.
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    })
  );

  // YA DADO: convierte el cuerpo JSON en req.body.
  app.use(express.json());

  // Copia independiente de los datos iniciales.
  // Los cambios viven únicamente mientras el servidor está ejecutándose.
  const products = seedProducts.map((item) => ({ ...item }));

  // El siguiente id comienza después del id más alto de la semilla.
  let nextId =
    products.length > 0
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;

  /**
   * GET /api/products
   *
   * Devuelve todos los productos.
   *
   * Filtros opcionales:
   * - search: nombre contiene el texto sin distinguir mayúsculas.
   * - category: coincidencia exacta de categoría.
   */
  app.get('/api/products', (req, res) => {
    const { search, category } = req.query;

    let result = [...products];

    if (typeof search === 'string' && search.trim() !== '') {
      const normalizedSearch = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch)
      );
    }

    if (typeof category === 'string' && category !== '') {
      result = result.filter(
        (product) => product.category === category
      );
    }

    return res.status(200).json(result);
  });

  /**
   * GET /api/products/:id
   *
   * 200: producto encontrado.
   * 400: id no numérico.
   * 404: producto inexistente.
   */
  app.get('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    return res.status(200).json(product);
  });

  /**
   * POST /api/products
   *
   * 201: producto creado.
   * 400: datos inválidos.
   */
  app.post('/api/products', (req, res) => {
    const details = validateProductInput(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const { name, price, category, stock } = req.body;

    const product = {
      id: nextId,
      name: name.trim(),
      price,
      category,
      stock,
    };

    nextId += 1;

    products.push(product);

    return res.status(201).json(product);
  });

  /**
   * PUT /api/products/:id
   *
   * 200: producto actualizado.
   * 400: id o datos inválidos.
   * 404: producto inexistente.
   */
  app.put('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const productIndex = products.findIndex(
      (item) => item.id === id
    );

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    const details = validateProductInput(req.body);

    if (details.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details,
      });
    }

    const { name, price, category, stock } = req.body;

    const updatedProduct = {
      id,
      name: name.trim(),
      price,
      category,
      stock,
    };

    products[productIndex] = updatedProduct;

    return res.status(200).json(updatedProduct);
  });

  /**
   * DELETE /api/products/:id
   *
   * 204: eliminado correctamente y sin cuerpo.
   * 400: id no numérico.
   * 404: producto inexistente.
   */
  app.delete('/api/products/:id', (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: 'Id inválido',
        details: ['El id debe ser numérico'],
      });
    }

    const productIndex = products.findIndex(
      (item) => item.id === id
    );

    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        details: [`No existe un producto con id ${id}`],
      });
    }

    products.splice(productIndex, 1);

    return res.status(204).end();
  });

  /**
   * YA DADO:
   * Cualquier ruta que no exista llega a este middleware.
   */
  app.use((req, res) => {
    res.status(404).json({
      error: 'Ruta no encontrada',
      details: [`${req.method} ${req.originalUrl}`],
    });
  });

  /**
   * YA DADO:
   * Manejador central de errores.
   *
   * Express reconoce un middleware de errores porque tiene
   * cuatro parámetros.
   */
  // eslint-disable-next-line no-unused-vars -- Express exige 4 parámetros.
  app.use((err, _req, res, _next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({
        error: 'El cuerpo no es un JSON válido',
        details: [],
      });
    }

    console.error(err);

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: [],
    });
  });

  return app;
}

module.exports = {
  createApp,
  CATEGORIES,
  parseId,
};