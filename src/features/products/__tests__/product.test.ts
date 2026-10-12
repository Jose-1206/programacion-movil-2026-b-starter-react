import {
  describe,
  expect,
  it,
} from 'vitest';

import seedProducts from '../../../../server/data/products.json';

import {
  CATEGORIES,
  filterProducts,
  formatCOP,
  LOW_STOCK_THRESHOLD,
  toProductView,
  validateProduct,
} from '../domain/product';

describe('datos semilla de la API', () => {
  it('trae 8 productos con ids 1 a 8', () => {
    expect(seedProducts).toHaveLength(8);

    expect(
      seedProducts.map((item) => item.id),
    ).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
    ]);
  });

  it('usa solo categorías permitidas y stock entero no negativo', () => {
    for (const item of seedProducts) {
      expect(CATEGORIES).toContain(
        item.category,
      );

      expect(
        Number.isInteger(item.stock),
      ).toBe(true);

      expect(
        item.stock,
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it('incluye productos agotados y con pocas unidades', () => {
    expect(
      seedProducts.some(
        (item) => item.stock === 0,
      ),
    ).toBe(true);

    expect(
      seedProducts.some(
        (item) =>
          item.stock > 0 &&
          item.stock <
            LOW_STOCK_THRESHOLD,
      ),
    ).toBe(true);
  });
});

describe('formatCOP', () => {
  it('separa los miles con punto y antepone el signo de pesos', () => {
    expect(formatCOP(1250000)).toBe(
      '$ 1.250.000',
    );

    expect(formatCOP(8500)).toBe(
      '$ 8.500',
    );

    expect(formatCOP(950)).toBe(
      '$ 950',
    );
  });
});

describe('validateProduct', () => {
  it('rechaza nombre vacío, precio inválido, categoría no permitida y stock negativo', () => {
    const result = validateProduct({
      name: '   ',
      price: 0,
      category: 'Tecnologia',
      stock: -1,
    });

    expect(result.isValid).toBe(false);

    expect(result.errors.name).toBeDefined();
    expect(result.errors.price).toBeDefined();
    expect(
      result.errors.category,
    ).toBeDefined();
    expect(result.errors.stock).toBeDefined();
  });

  it('acepta un producto válido', () => {
    const result = validateProduct({
      name: 'Cafe',
      price: 12000,
      category: 'Bebidas',
      stock: 10,
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('toProductView', () => {
  it('formatea el precio y marca correctamente los estados de stock', () => {
    const outOfStock = toProductView({
      id: 1,
      name: '  Cafe  ',
      price: 1250000,
      category: 'Bebidas',
      stock: 0,
    });

    expect(outOfStock.name).toBe('Cafe');
    expect(outOfStock.priceLabel).toBe(
      '$ 1.250.000',
    );

    expect(outOfStock.stockLabel).toBe(
      'Agotado',
    );

    expect(outOfStock.isOutOfStock).toBe(
      true,
    );

    expect(outOfStock.isLowStock).toBe(
      false,
    );

    const lowStock = toProductView({
      id: 2,
      name: 'Galletas',
      price: 8500,
      category: 'Snacks',
      stock: 3,
    });

    expect(lowStock.stockLabel).toBe(
      'Pocas unidades',
    );

    expect(lowStock.isLowStock).toBe(true);
    expect(lowStock.isOutOfStock).toBe(
      false,
    );

    const available = toProductView({
      id: 3,
      name: 'Detergente',
      price: 12000,
      category: 'Aseo',
      stock: 5,
    });

    expect(available.stockLabel).toBe(
      'Disponible',
    );

    expect(available.isLowStock).toBe(
      false,
    );

    expect(available.isOutOfStock).toBe(
      false,
    );
  });
});

describe('filterProducts', () => {
  const products = [
    {
      id: 1,
      name: 'Agua mineral',
      price: 1800,
      category: 'Bebidas',
      stock: 10,
    },
    {
      id: 2,
      name: 'Jugo de naranja',
      price: 5200,
      category: 'Bebidas',
      stock: 5,
    },
    {
      id: 3,
      name: 'Papas fritas',
      price: 3900,
      category: 'Snacks',
      stock: 8,
    },
  ];

  it('filtra por texto sin distinguir mayúsculas y por categoría exacta', () => {
    const byText = filterProducts(
      products,
      {
        search: 'AGUA',
        category: '',
      },
    );

    expect(byText).toHaveLength(1);
    expect(byText[0].name).toBe(
      'Agua mineral',
    );

    const byCategory = filterProducts(
      products,
      {
        search: '',
        category: 'Bebidas',
      },
    );

    expect(byCategory).toHaveLength(2);

    expect(
      byCategory.every(
        (product) =>
          product.category === 'Bebidas',
      ),
    ).toBe(true);
  });
});