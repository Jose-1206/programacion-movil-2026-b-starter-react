
# Product Catalog · Ionic React

Practical Exam · Second Term · Mobile Programming · CORHUILA · 2026-B

This project implements a complete product catalog composed of an Express REST API, an Ionic React application, a Kotlin exercise, automated tests and governance documentation based on the Mobile Governance Framework.

The project was developed individually on the `feature/catalogo-productos` branch.

---

## Project components

The repository contains the following parts:

- **Express API** (`server/`): product CRUD, validation, filters and centralized error handling.
- **Ionic React application** (`src/`): product list, search, category filters, detail, create, edit and delete flows.
- **Kotlin exercise** (`kotlin/Product.kt`): Product model, nullable stock handling and discount calculation.
- **Documentation** (`docs/`): feature specification, screen documentation, ADRs, API documentation and Definition of Done.
- **Automated tests** (`src/features/products/__tests__/`): domain and API tests using Vitest.

---

## Requirements

- Node.js 22.12 or newer.
- npm.
- Git.

Check the installed versions with:

```bash
node --version
npm --version
git --version
```

---

## Installation

Clone the student's fork and enter the project directory.

```bash
git clone <YOUR-FORK-URL>
cd programacion-movil-2026-b-starter-react
```

Install the dependencies:

```bash
npm install
```

---

## Environment configuration

The repository contains `.env.example`.

Create the local `.env` file before running the application.

### PowerShell

```powershell
Copy-Item .env.example .env
```

### CMD

```cmd
copy .env.example .env
```

The application uses `VITE_API_URL` to locate the Express API.

Example:

```env
VITE_API_URL=http://localhost:3000
```

The `.env` file is ignored by Git and must not be committed. The `.env.example` file remains in the repository as the configuration reference.

---

## Running the project

The API and the Ionic application must run at the same time in separate terminals.

### Terminal 1 — Express API

```bash
npm run server
```

The API runs at:

```text
http://localhost:3000
```

### Terminal 2 — Ionic React application

```bash
npm run dev
```

The application runs at:

```text
http://localhost:5173
```

Open the application in a browser using:

```text
http://localhost:5173
```

---

## Quality commands

Run the automated tests with:

```bash
npm test
```

Run ESLint with:

```bash
npm run lint
```

Run TypeScript checking and the production build with:

```bash
npm run build
```

Before delivery, all three commands must complete without errors.

---

## Application routes

The Ionic React application provides the following routes:

| Route | Purpose |
|---|---|
| `/productos` | Product list, search and category filters |
| `/productos/nuevo` | Create a new product |
| `/productos/:id` | Product detail |
| `/productos/:id/editar` | Edit an existing product |

The root route redirects to:

```text
/productos
```

---

## Product model

Products use the following structure:

```ts
{
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}
```

Allowed categories are:

```text
Bebidas
Snacks
Aseo
Hogar
```

---

## Validation rules

The Ionic application and the Express API apply the same validation rules.

### Name

- Required.
- Must be a string.
- Cannot be empty or contain only whitespace.
- Maximum 60 characters.

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

The API accumulates validation problems and returns one entry in `details` for every detected error.

---

## Express API

Base resource:

```text
/api/products
```

### Endpoints

| Method and route | Success | Errors |
|---|---|---|
| `GET /api/products` | `200` + array | — |
| `GET /api/products/:id` | `200` + product | `400`, `404` |
| `POST /api/products` | `201` + created product | `400` |
| `PUT /api/products/:id` | `200` + updated product | `400`, `404` |
| `DELETE /api/products/:id` | `204` without body | `400`, `404` |

---

## Product filters

`GET /api/products` supports the following optional query parameters.

### Search

```text
GET /api/products?search=agua
```

The product name contains the provided text without distinguishing uppercase and lowercase letters.

### Category

```text
GET /api/products?category=Snacks
```

The category filter uses exact matching.

The filters can also be combined.

```text
GET /api/products?search=papas&category=Snacks
```

---

## API error format

Controlled API errors use the following structure:

```json
{
  "error": "mensaje",
  "details": [
    "detalle"
  ]
}
```

Example validation response:

```json
{
  "error": "Datos inválidos",
  "details": [
    "name es obligatorio",
    "price debe ser un número mayor que 0"
  ]
}
```

A non-numeric product id returns HTTP `400`.

A product that does not exist returns HTTP `404`.

A route that does not exist also returns HTTP `404` using the same error structure.

Unexpected server errors are handled by the centralized Express error middleware and return HTTP `500`.

---

## In-memory persistence

The server starts with eight products loaded from:

```text
server/data/products.json
```

Products are stored in memory while the Express server is running.

Create, update and delete operations modify the in-memory collection.

A new product receives an incremental id.

When the server restarts, the data returns to the initial contents of `products.json`.

---

## Application architecture

The product feature follows the framework layers:

```text
src/features/products/
├── data/
│   ├── api-error.ts
│   ├── config.ts
│   └── products-api.ts
├── domain/
│   └── product.ts
├── presentation/
│   ├── EmptyState.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailPage.tsx
│   ├── ProductFormPage.tsx
│   └── ProductListPage.tsx
└── __tests__/
    ├── product.test.ts
    ├── products-api.test.ts
    └── test-server.ts
```

The dependency direction is:

```text
presentation → domain
presentation → data
data → domain
domain → no external application layer
```

The domain layer contains pure types and functions and does not depend on React, Ionic or HTTP.

---

## Domain functions

### `formatCOP`

Formats prices using the required Colombian peso representation.

Example:

```text
1250000 → $ 1.250.000
```

### `toProductView`

Transforms a domain product into information ready for the UI.

Stock labels are:

| Condition | Label |
|---|---|
| `stock === 0` | `Agotado` |
| `stock < 5` and greater than 0 | `Pocas unidades` |
| `stock >= 5` | `Disponible` |

### `validateProduct`

Validates product form input using the same rules as the Express API.

### `filterProducts`

Filters products by text and exact category without modifying the original product array.

---

## Product list

The `/productos` screen loads the product collection from the API.

It supports:

- Search by product name.
- Category filtering.
- `Todas`.
- `Bebidas`.
- `Snacks`.
- `Aseo`.
- `Hogar`.
- Navigation to product detail.
- Navigation to product creation.

Each product is displayed using the reusable `ProductCard` component.

The list distinguishes the following UI states:

- Loading.
- Empty catalog.
- No search/filter results.
- API error with a `Reintentar` action.

---

## Product detail

The `/productos/:id` screen displays:

- Product id.
- Name.
- Formatted price.
- Category.
- Stock.
- Stock label.

The screen includes:

- Loading state.
- Error state.
- Product-not-found state.
- Edit action.
- Delete action.
- Delete confirmation.
- Cancel deletion.
- Return to the product list after successful deletion.

---

## Product form

The same form component is used for:

```text
/productos/nuevo
```

and:

```text
/productos/:id/editar
```

The form contains:

- Name.
- Price.
- Category.
- Stock.

The application validates the form using `validateProduct()` before submitting it.

Client-side validation messages are displayed next to their corresponding fields.

If the API rejects the request, the application also displays the server message and the entries returned in `details`.

---

## HTTP client

The `data` layer provides these functions:

```text
getProducts
getProduct
createProduct
updateProduct
deleteProduct
```

The client uses the configured `API_URL`.

HTTP errors are converted to `ApiError`.

A network failure is represented by an `ApiError` with a `null` status, while unsuccessful HTTP responses preserve the status code and server `details`.

---

## Automated tests

The project includes domain and API tests using Vitest.

Domain tests cover functionality such as:

- Product validation.
- Colombian peso formatting.
- Product view transformation.
- Stock labels.
- Search filtering.
- Category filtering.

API tests cover functionality such as:

- Unknown route returning `404`.
- Invalid POST returning `400`.
- Accumulated validation details.
- Product not found returning `404`.
- Valid creation returning `201`.
- Incremental ids.
- Invalid id returning `400`.
- Successful deletion returning `204`.

Run all tests with:

```bash
npm test
```

---

## Kotlin exercise

The Kotlin exercise is located at:

```text
kotlin/Product.kt
```

It contains a `Product` class with:

```text
id
name
price
category
stock
```

`stock` uses the nullable type:

```kotlin
Int?
```

The file also contains:

```kotlin
stockLabel(stock: Int?): String
```

with the following behavior:

```text
null → Sin dato
0 → Agotado
1–4 → Pocas unidades
5 or more → Disponible
```

and:

```kotlin
applyDiscount(price: Double, percent: Int): Double
```

The `main()` function creates three products and prints their stock labels and prices with a 10% discount.

The file can be tested using Kotlin Playground.

---

## Governance documentation

The project documentation is located in:

```text
docs/
```

Relevant documents include:

```text
docs/features/productos.md

docs/screens/productos-lista.md
docs/screens/producto-detalle.md
docs/screens/producto-formulario.md

docs/decisions/ADR-001-estado.md
docs/decisions/ADR-002-consumo-api.md

docs/api/products-endpoints.md
docs/api/product-entity.md

docs/definition-of-done.md
```

The governance documentation was created before the implementation-code commits.

---

## State management decision

The product screens use local state with React `useState` and `useEffect` because most of the state belongs to a single page. This approach keeps the feature simple and avoids adding an unnecessary global state dependency. The list, detail and form pages independently manage loading, errors and their specific UI data. If the application grows and several features need to share the same state, a centralized store or React Context could be evaluated.

---

## API error handling

The HTTP client distinguishes network failures from unsuccessful HTTP responses by using `ApiError` and its status value. Network failures use a `null` status, while API responses preserve the HTTP status and the `details` returned by the server. The Express application includes a 404 middleware for unknown routes and a centralized error middleware for unexpected failures. The user sees an appropriate error, validation, retry or not-found state depending on the type of failure.

---

## Git workflow

Development is performed on:

```text
feature/catalogo-productos
```

The project uses Conventional Commits.

Examples:

```text
docs(governance): define product catalog requirements
feat(api): implement products CRUD endpoints
test(api): add products endpoint tests
feat(products): implement domain and api client
feat(products): implement product catalog screens
feat(kotlin): add product exercise
docs(readme): complete setup and delivery documentation
```

The Pull Request must target the `main` branch of the student's own fork.

---

## Final verification

Before opening the Pull Request, run:

```bash
npm test
npm run lint
npm run build
```

Also verify:

- The Express API starts with `npm run server`.
- The Ionic application starts with `npm run dev`.
- The complete CRUD works against the API.
- `.env` is ignored.
- `.env.example` is committed.
- `node_modules` is not committed.
- No passwords, tokens or secrets are committed.
- The Definition of Done is reviewed.
- The feature branch has at least six Conventional Commits.

---

## Delivery

Push the feature branch to the student's fork.

Open a Pull Request:

```text
feature/catalogo-productos → main
```

The Pull Request must belong to the student's own fork, not the original teacher repository.

The PR description must summarize the implementation and include the Definition of Done checklist.

The final Moodle submission is the Pull Request link as online text. No project ZIP file is required.