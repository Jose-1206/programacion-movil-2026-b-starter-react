# Definition of Done (DoD)

The Product Catalog feature is **done only when all of the following requirements are verified**.

---

## Governance and documentation

- [x] `docs/features/productos.md` is completed and describes the Product Catalog feature.
- [x] `docs/screens/productos-lista.md` is completed.
- [x] `docs/screens/producto-detalle.md` is completed.
- [x] `docs/screens/producto-formulario.md` is completed.
- [x] `docs/decisions/ADR-001-estado.md` documents the state-management decision.
- [x] `docs/decisions/ADR-002-consumo-api.md` documents API consumption and error handling.
- [x] `docs/api/products-endpoints.md` documents all five product endpoints.
- [x] `docs/api/product-entity.md` documents the Product model and in-memory persistence.
- [x] The documentation commit was created before the first implementation-code commit.

---

## Express API

- [x] `GET /api/products` returns the product list with HTTP 200.
- [x] `GET /api/products` supports the optional `search` filter.
- [x] The `search` filter matches product names without distinguishing uppercase and lowercase letters.
- [x] `GET /api/products` supports the optional `category` filter.
- [x] The `category` filter uses an exact category match.
- [x] `GET /api/products/:id` returns an existing product with HTTP 200.
- [x] `GET /api/products/:id` returns HTTP 400 when the id is not numeric.
- [x] `GET /api/products/:id` returns HTTP 404 when the product does not exist.
- [x] `POST /api/products` creates a product and returns HTTP 201.
- [x] `PUT /api/products/:id` updates an existing product and returns HTTP 200.
- [x] `DELETE /api/products/:id` deletes an existing product and returns HTTP 204 without a response body.
- [x] New product ids are incremental.
- [x] Product changes are stored in memory and reset when the server restarts.

---

## Product validation

- [x] `name` is required.
- [x] `name` cannot be empty or contain only whitespace.
- [x] `name` has a maximum length of 60 characters.
- [x] `price` must be a number greater than 0.
- [x] `category` is required.
- [x] `category` only accepts `Bebidas`, `Snacks`, `Aseo` or `Hogar`.
- [x] `stock` must be an integer.
- [x] `stock` must be greater than or equal to 0.
- [x] POST and PUT apply the same validation rules.
- [x] Validation accumulates all detected problems.
- [x] Controlled errors use the format `{ "error": "mensaje", "details": ["..."] }`.

---

## Ionic application architecture

- [x] Product code is organized under `src/features/products/`.
- [x] The feature contains a `data` layer.
- [x] The feature contains a `domain` layer.
- [x] The feature contains a `presentation` layer.
- [x] The Product domain type contains `id`, `name`, `price`, `category` and `stock`.
- [x] Page state is managed with React `useState` and `useEffect`.
- [x] HTTP requests are centralized in the product `data` layer.
- [x] Presentation pages do not duplicate API configuration unnecessarily.

---

## HTTP client

- [x] `getProducts` loads the product list.
- [x] `getProduct` loads one product by id.
- [x] `createProduct` creates a product.
- [x] `updateProduct` updates a product.
- [x] `deleteProduct` deletes a product.
- [x] `API_URL` is used for API configuration.
- [x] `ApiError` is used to distinguish API failures.
- [x] Server validation messages from `details` can be displayed by the application.

---

## Product list

- [x] `/productos` loads products from the Express API.
- [x] The screen includes a text search control.
- [x] The screen includes the `Todas` category button.
- [x] The screen includes the `Bebidas` category button.
- [x] The screen includes the `Snacks` category button.
- [x] The screen includes the `Aseo` category button.
- [x] The screen includes the `Hogar` category button.
- [x] Search and category filtering use `filterProducts`.
- [x] Products are displayed using a typed `ProductCard` component.
- [x] The loading state is handled.
- [x] The empty catalog state is handled.
- [x] The no-results state is handled separately from the empty catalog state.
- [x] The request-error state is handled.
- [x] The error state includes a `Reintentar` action.
- [x] The user can navigate to the product creation screen.
- [x] The user can navigate from a product card to its detail screen.

---

## Product detail

- [x] `/productos/:id` loads the selected product.
- [x] The detail screen displays the product id.
- [x] The detail screen displays the product name.
- [x] The detail screen displays the product price.
- [x] The detail screen displays the product category.
- [x] The detail screen displays the product stock.
- [x] The loading state is handled.
- [x] General request errors are handled.
- [x] HTTP 404 displays a specific product-not-found state.
- [x] The screen includes an `Editar` action.
- [x] The screen includes an `Eliminar` action.
- [x] Deletion requires a confirmation step.
- [x] Cancelling the deletion keeps the product unchanged.
- [x] Confirming deletion calls `deleteProduct`.
- [x] After a successful deletion, the application returns to `/productos`.

---

## Product form

- [x] `/productos/nuevo` uses the shared product form.
- [x] `/productos/:id/editar` uses the same product form.
- [x] Edit mode loads the current product data.
- [x] The form includes the `name` field.
- [x] The form includes the `price` field.
- [x] The form includes the `category` field.
- [x] The form includes the `stock` field.
- [x] The form uses `validateProduct`.
- [x] Validation errors are displayed inline.
- [x] Invalid data is not submitted.
- [x] Create mode calls `createProduct`.
- [x] Edit mode calls `updateProduct`.
- [x] Server `details` validation messages are displayed when the API rejects the request.
- [x] Submission errors are handled without crashing the application.

---

## Product presentation

- [x] `formatCOP` formats product prices in Colombian peso format.
- [x] `toProductView` returns the formatted product price.
- [x] Stock equal to `0` is displayed as `Agotado`.
- [x] Stock lower than `5` is displayed as `Pocas unidades`.
- [x] Stock equal to or greater than `5` is displayed as `Disponible`.

---

## Kotlin

- [x] `kotlin/Product.kt` exists.
- [x] The Kotlin `Product` class contains `id`.
- [x] The Kotlin `Product` class contains `name`.
- [x] The Kotlin `Product` class contains `price`.
- [x] The Kotlin `Product` class contains `category`.
- [x] The Kotlin `Product` class contains nullable `stock`.
- [x] `val` and `var` are used appropriately.
- [x] `stockLabel(stock: Int?): String` is implemented.
- [x] `stockLabel(null)` returns `Sin dato`.
- [x] `stockLabel(0)` returns `Agotado`.
- [x] `stockLabel` returns `Pocas unidades` for stock lower than 5.
- [x] `stockLabel` returns `Disponible` for stock equal to or greater than 5.
- [x] `applyDiscount(price: Double, percent: Int): Double` is implemented.
- [x] `main()` creates and prints three products.
- [x] `main()` prints the stock label for each product.
- [x] `main()` prints each product price with a 10% discount.
- [x] The Kotlin file compiles and runs in Kotlin Playground.

---

## Tests

- [x] At least two new domain/unit tests were added.
- [x] At least two new API tests were added using `startTestServer()`.
- [x] At least one test verifies product validation or domain transformation.
- [x] At least one API test verifies an invalid POST request.
- [x] At least one API test verifies a 404 or another required API error.
- [x] The starter 404/500 error-handling behavior can be explained.
- [x] `npm test` completes successfully.

---

## Environment and security

- [x] `.env.example` is present in the repository.
- [x] `.env` is ignored by Git.
- [x] `.env` is not committed.
- [x] `node_modules` is not committed.
- [x] No passwords, tokens, API keys or other secrets are committed.

---

## Code quality

- [x] `npm run lint` completes successfully.
- [x] `npm run build` completes successfully.
- [x] There are no unresolved TypeScript errors.
- [x] There are no unnecessary console errors during the main application flow.
- [x] Naming follows the project coding conventions.
- [x] The implementation remains organized by feature and layer.

---

## README

- [x] The README explains how to install dependencies.
- [x] The README explains how to configure `.env`.
- [x] The README explains how to start the Express API using `npm run server`.
- [x] The README explains how to start the Ionic application using `npm run dev`.
- [x] The README explains how to run tests.
- [x] The README contains the English section `State management decision`.
- [x] `State management decision` contains between 3 and 5 clear English sentences.
- [x] The README contains the English section `API error handling`.
- [x] `API error handling` contains between 3 and 5 clear English sentences.

---

## Git and delivery

- [x] Development was performed on `feature/catalogo-productos` or another valid `feature/...` / `feat/...` branch.
- [x] The repository contains at least six Conventional Commits.
- [x] Commit messages follow the `type(scope): summary` format.
- [x] Commits are small enough to show the development process.
- [x] The feature branch is pushed to the student's fork.
- [ ] A Pull Request is opened from the feature branch to `main` of the student's own fork.
- [ ] The Pull Request contains a clear description of the implemented work.
- [x] This Definition of Done checklist is verified before delivery.
- [ ] The Pull Request link is ready to be submitted in Moodle.

---

> The Product Catalog feature is considered done only after the applicable items above have been verified. Items should be marked as completed only after the corresponding implementation, test or delivery requirement has actually been checked.