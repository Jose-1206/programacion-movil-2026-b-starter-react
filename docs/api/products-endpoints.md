# Endpoint Integration — Products API

> This document describes how the Ionic application consumes the product endpoints exposed by the Express API.

- **Feature:** Product Catalog
- **Method + path:** Multiple endpoints under `/api/products`
- **Auth required:** No

---

## GET /api/products

Returns the complete product list. The endpoint also supports optional search and category filters.

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `search` | query | string | No | Filters products whose name contains the provided text. The comparison is case-insensitive. |
| `category` | query | string | No | Filters products by exact category. |

**Request body:** N/A

### Response

**Success — 200 OK**

```json
[
  {
    "id": 1,
    "name": "Cafe",
    "price": 12000,
    "category": "Bebidas",
    "stock": 8
  }
]
```

If there are no products, the API returns an empty array:

```json
[]
```

### Errors

This endpoint has no specific controlled error defined by the product contract. Unexpected server failures are handled by the global error handler.

---

## GET /api/products/:id

Returns one product using its numeric identifier.

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | number | Yes | Numeric product identifier. |

**Request body:** N/A

### Response

**Success — 200 OK**

```json
{
  "id": 1,
  "name": "Cafe",
  "price": 12000,
  "category": "Bebidas",
  "stock": 8
}
```

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | The id is not numeric | Show an error message |
| 404 | Product does not exist | Show the product not-found state |

Example controlled error:

```json
{
  "error": "Producto no encontrado",
  "details": []
}
```

---

## POST /api/products

Creates a new product.

The server generates a new incremental identifier.

### Request

| Field | In | Type | Required | Validation |
|-------|----|------|----------|------------|
| `name` | body | string | Yes | Non-empty text, maximum 60 characters |
| `price` | body | number | Yes | Must be greater than 0 |
| `category` | body | string | Yes | Must be `Bebidas`, `Snacks`, `Aseo` or `Hogar` |
| `stock` | body | integer | Yes | Must be greater than or equal to 0 |

**Request body:**

```json
{
  "name": "Cafe",
  "price": 12000,
  "category": "Bebidas",
  "stock": 8
}
```

### Response

**Success — 201 Created**

```json
{
  "id": 9,
  "name": "Cafe",
  "price": 12000,
  "category": "Bebidas",
  "stock": 8
}
```

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | Product data does not pass validation | Display all validation messages returned in `details` |

Example:

```json
{
  "error": "Datos inválidos",
  "details": [
    "name es obligatorio",
    "price debe ser mayor que 0"
  ]
}
```

The API accumulates validation problems instead of returning only the first error.

---

## PUT /api/products/:id

Updates an existing product.

### Request

| Param / Field | In | Type | Required | Validation |
|---------------|----|------|----------|------------|
| `id` | path | number | Yes | Must be numeric |
| `name` | body | string | Yes | Non-empty text, maximum 60 characters |
| `price` | body | number | Yes | Must be greater than 0 |
| `category` | body | string | Yes | Must be `Bebidas`, `Snacks`, `Aseo` or `Hogar` |
| `stock` | body | integer | Yes | Must be greater than or equal to 0 |

**Request body:**

```json
{
  "name": "Cafe premium",
  "price": 15000,
  "category": "Bebidas",
  "stock": 5
}
```

### Response

**Success — 200 OK**

```json
{
  "id": 1,
  "name": "Cafe premium",
  "price": 15000,
  "category": "Bebidas",
  "stock": 5
}
```

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | Invalid id or invalid product data | Show the corresponding error messages |
| 404 | Product does not exist | Show the product not-found state |

Validation errors use the following structure:

```json
{
  "error": "Datos inválidos",
  "details": [
    "name es obligatorio",
    "price debe ser mayor que 0"
  ]
}
```

---

## DELETE /api/products/:id

Deletes an existing product.

### Request

| Param | In | Type | Required | Notes |
|-------|----|------|----------|-------|
| `id` | path | number | Yes | Numeric product identifier |

**Request body:** N/A

### Response

**Success — 204 No Content**

The response does not contain a body.

### Errors

| Status | Meaning | App behavior |
|--------|---------|--------------|
| 400 | The id is not numeric | Show an error message |
| 404 | Product does not exist | Show the product not-found state |

After a successful deletion, the Ionic application returns to `/productos`.

---

## Validation rules

The Express API and the Ionic application apply the same product validation rules.

### Name

- Required.
- Must be a string.
- Cannot be empty.
- Maximum length of 60 characters.

### Price

- Required.
- Must be a number.
- Must be greater than 0.

### Category

- Required.
- Must be one of:
  - `Bebidas`
  - `Snacks`
  - `Aseo`
  - `Hogar`

### Stock

- Required.
- Must be an integer.
- Must be greater than or equal to 0.

When more than one field is invalid, the API returns one message in `details` for each validation problem.

---

## Error format

Controlled API errors use the following structure:

```json
{
  "error": "mensaje",
  "details": [
    "detalle"
  ]
}
```

The application uses `ApiError` to distinguish unsuccessful HTTP responses from successful responses.

The product form displays the validation messages returned by the server inside `details`.

The product detail screen distinguishes a `404` response from other request errors so it can display a specific not-found state.

---

## DTO → domain mapping

| DTO field | Domain field | Transform |
|-----------|--------------|-----------|
| `id` | `id` | Direct mapping |
| `name` | `name` | Direct mapping |
| `price` | `price` | Direct mapping |
| `category` | `category` | Direct mapping |
| `stock` | `stock` | Direct mapping |

The domain object can later be transformed for presentation using `toProductView`.

`toProductView` uses `formatCOP` to format the product price.

Example:

```text
1250000 → $ 1.250.000
```

The stock value is transformed into a presentation label:

| Condition | Label |
|-----------|-------|
| `stock === 0` | `Agotado` |
| `stock < 5` | `Pocas unidades` |
| `stock >= 5` | `Disponible` |

---

## App integration

The product feature consumes the API through functions located in the `data` layer.

Required client functions:

- `getProducts`
- `getProduct`
- `createProduct`
- `updateProduct`
- `deleteProduct`

The presentation layer does not need to repeat API URLs or HTTP configuration.

Pages call the data-layer functions and manage their own state using React `useState` and `useEffect`.

The application distinguishes:

- Loading state.
- Loaded state.
- Empty product list.
- Search or filter with no results.
- Request error.
- Product not found.
- Validation errors.

---

## Caching / offline

- **Strategy:** Online-only.
- **Cached entity:** N/A.
- **TTL / invalidation:** N/A.

The Ionic application does not store a local product cache.

If the Express API cannot be reached, the application displays an error state and provides retry behavior where required.