# Feature — Product Catalog

> This document describes the product catalog feature implemented in the Ionic React application.

- **Owner:** José Miguel Aya Peralta
- **Status:** In progress
- **Related stories:** Product catalog CRUD

---

## Purpose

The product catalog allows users to view, search, filter, create, edit, and delete products from the Ionic application. The feature consumes the Express REST API and keeps the user informed about loading, empty, error, and validation states.

---

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| Product List | `/productos` | Displays all products, supports text search and category filters, and provides access to product details and product creation. |
| Product Detail | `/productos/:id` | Displays all information for a selected product and provides actions to edit or delete it. |
| Product Form | `/productos/nuevo` | Creates a new product with client-side validation. |
| Product Form | `/productos/:id/editar` | Loads an existing product and allows the user to update it using the same form used for creation. |

> Each screen is documented separately using the screen template.

---

## State

- **Pattern:** Local page state using React hooks (`useState` and `useEffect`) inside the feature presentation layer.
- **State object(s):** Products list, selected product, loading state, error message, search text, selected category, form values and validation errors.
- **Key transitions:** idle → loading → loaded / empty / error; form editing → validating → submitting → success / error.

State is kept close to each page because the catalog does not require shared global state. This keeps the implementation simple and follows the requirements of the starter project.

---

## Data

- **Use cases:** Load products, get product detail, create product, update product, delete product, validate product, filter products and transform product data for presentation.
- **Repositories:** N/A. The feature uses HTTP client functions in the `data` layer instead of a repository abstraction.
- **Remote sources / endpoints:**
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- **Local persistence:** N/A. Product data is obtained from the Express API and the server stores the data in memory.

---

## Edge cases & states

- [x] Loading
- [x] Empty
- [x] Error / retry
- [x] Offline
- [ ] Permission denied (not applicable)

The product list distinguishes between an empty catalog and a search or category filter with no results. Network failures, including offline scenarios, are displayed as errors and allow the user to retry the request.

---

## Decisions

- [`ADR-001-estado.md`](../decisions/ADR-001-estado.md) — Local state management with React hooks.
- [`ADR-002-consumo-api.md`](../decisions/ADR-002-consumo-api.md) — Centralized REST API consumption and error handling.

---

## Tests

- **Unit:** `validateProduct`, `toProductView` and `filterProducts`.
- **Widget/UI:** Product list, product detail and product form states are verified during manual execution.
- **Integration/E2E:** API tests cover product creation, validation, retrieval and error responses using the test server.