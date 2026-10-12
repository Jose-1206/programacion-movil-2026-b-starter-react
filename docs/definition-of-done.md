# Definition of Done (DoD)

The Product Catalog feature is **done only when all of the following requirements are verified**.

---

## Governance and documentation

- [ ] `docs/features/productos.md` is completed and describes the Product Catalog feature.
- [ ] `docs/screens/productos-lista.md` is completed.
- [ ] `docs/screens/producto-detalle.md` is completed.
- [ ] `docs/screens/producto-formulario.md` is completed.
- [ ] `docs/decisions/ADR-001-estado.md` documents the state-management decision.
- [ ] `docs/decisions/ADR-002-consumo-api.md` documents API consumption and error handling.
- [ ] `docs/api/products-endpoints.md` documents all five product endpoints.
- [ ] `docs/api/product-entity.md` documents the Product model and in-memory persistence.
- [ ] The documentation commit was created before the first implementation-code commit.

---

## Express API

- [ ] `GET /api/products` returns the product list with HTTP 200.
- [ ] `GET /api/products` supports the optional `search` filter.
- [ ] The `search` filter matches product names without distinguishing uppercase and lowercase letters.
- [ ] `GET /api/products` supports the optional `category` filter.
- [ ] The `category` filter uses an exact category match.
- [ ] `GET /api/products/:id` returns an existing product with HTTP 200.
- [ ] `GET /api/products/:id` returns HTTP 400 when the id is not numeric.
- [ ] `GET /api/products/:id` returns HTTP 404 when the product does not exist.
- [ ] `POST /api/products` creates a product and returns HTTP 201.
- [ ] `PUT /api/products/:id` updates an existing product and returns HTTP 200.
- [ ] `DELETE /api/products/:id` deletes an existing product and returns HTTP 204 without a response body.
- [ ] New product ids are incremental.
- [ ] Product changes are stored in memory and reset when the server restarts.

---

## Product validation

- [ ] `name` is required.
- [ ] `name` cannot be empty or contain only whitespace.
- [ ] `name` has a maximum length of 60 characters.
- [ ] `price` must be a number greater than 0.
- [ ] `category` is required.
- [ ] `category` only accepts `Bebidas`, `Snacks`, `Aseo` or `Hogar`.
- [ ] `stock` must be an integer.
- [ ] `stock` must be greater than or equal to 0.
- [ ] POST and PUT apply the same validation rules.
- [ ] Validation accumulates all detected problems.
- [ ] Controlled errors use the format `{ "error": "mensaje", "details": ["..."] }`.

---

## Ionic application architecture

- [ ] Product code is organized under `src/features/products/`.
- [ ] The feature contains a `data` layer.
- [ ] The feature contains a `domain` layer.
- [ ] The feature contains a `presentation` layer.
- [ ] The Product domain type contains `id`, `name`, `price`, `category` and `stock`.
- [ ] Page state is managed with React `useState` and `useEffect`.
- [ ] HTTP requests are centralized in the product `data` layer.
- [ ] Presentation pages do not duplicate API configuration unnecessarily.

---

## HTTP client

- [ ] `getProducts` loads the product list.
- [ ] `getProduct` loads one product by id.
- [ ] `createProduct` creates a product.
- [ ] `updateProduct` updates a product.
- [ ] `deleteProduct` deletes a product.
- [ ] `API_URL` is used for API configuration.
- [ ] `ApiError` is used to distinguish API failures.
- [ ] Server validation messages from `details` can be displayed by the application.

---

## Product list

- [ ] `/productos` loads products from the Express API.
- [ ] The screen includes a text search control.
- [ ] The screen includes the `Todas` category button.
- [ ] The screen includes the `Bebidas` category button.
- [ ] The screen includes the `Snacks` category button.
- [ ] The screen includes the `Aseo` category button.
- [ ] The screen includes the `Hogar` category button.
- [ ] Search and category filtering use `filterProducts`.
- [ ] Products are displayed using a typed `ProductCard` component.
- [ ] The loading state is handled.
- [ ] The empty catalog state is handled.
- [ ] The no-results state is handled separately from the empty catalog state.
- [ ] The request-error state is handled.
- [ ] The error state includes a `Reintentar` action.
- [ ] The user can navigate to the product creation screen.
- [ ] The user can navigate from a product card to its detail screen.

---

## Product detail

- [ ] `/productos/:id` loads the selected product.
- [ ] The detail screen displays the product id.
- [ ] The detail screen displays the product name.
- [ ] The detail screen displays the product price.
- [ ] The detail screen displays the product category.
- [ ] The detail screen displays the product stock.
- [ ] The loading state is handled.
- [ ] General request errors are handled.
- [ ] HTTP 404 displays a specific product-not-found state.
- [ ] The screen includes an `Editar` action.
- [ ] The screen includes an `Eliminar` action.
- [ ] Deletion requires a confirmation step.
- [ ] Cancelling the deletion keeps the product unchanged.
- [ ] Confirming deletion calls `deleteProduct`.
- [ ] After a successful deletion, the application returns to `/productos`.

---

## Product form

- [ ] `/productos/nuevo` uses the shared product form.
- [ ] `/productos/:id/editar` uses the same product form.
- [ ] Edit mode loads the current product data.
- [ ] The form includes the `name` field.
- [ ] The form includes the `price` field.
- [ ] The form includes the `category` field.
- [ ] The form includes the `stock` field.
- [ ] The form uses `validateProduct`.
- [ ] Validation errors are displayed inline.
- [ ] Invalid data is not submitted.
- [ ] Create mode calls `createProduct`.
- [ ] Edit mode calls `updateProduct`.
- [ ] Server `details` validation messages are displayed when the API rejects the request.
- [ ] Submission errors are handled without crashing the application.

---

## Product presentation

- [ ] `formatCOP` formats product prices in Colombian peso format.
- [ ] `toProductView` returns the formatted product price.
- [ ] Stock equal to `0` is displayed as `Agotado`.
- [ ] Stock lower than `5` is displayed as `Pocas unidades`.
- [ ] Stock equal to or greater than `5` is displayed as `Disponible`.

---

## Kotlin

- [ ] `kotlin/Product.kt` exists.
- [ ] The Kotlin `Product` class contains `id`.
- [ ] The Kotlin `Product` class contains `name`.
- [ ] The Kotlin `Product` class contains `price`.
- [ ] The Kotlin `Product` class contains `category`.
- [ ] The Kotlin `Product` class contains nullable `stock`.
- [ ] `val` and `var` are used appropriately.
- [ ] `stockLabel(stock: Int?): String` is implemented.
- [ ] `stockLabel(null)` returns `Sin dato`.
- [ ] `stockLabel(0)` returns `Agotado`.
- [ ] `stockLabel` returns `Pocas unidades` for stock lower than 5.
- [ ] `stockLabel` returns `Disponible` for stock equal to or greater than 5.
- [ ] `applyDiscount(price: Double, percent: Int): Double` is implemented.
- [ ] `main()` creates and prints three products.
- [ ] `main()` prints the stock label for each product.
- [ ] `main()` prints each product price with a 10% discount.
- [ ] The Kotlin file compiles and runs in Kotlin Playground.

---

## Tests

- [ ] At least two new domain/unit tests were added.
- [ ] At least two new API tests were added using `startTestServer()`.
- [ ] At least one test verifies product validation or domain transformation.
- [ ] At least one API test verifies an invalid POST request.
- [ ] At least one API test verifies a 404 or another required API error.
- [ ] The starter 404/500 error-handling behavior can be explained.
- [ ] `npm test` completes successfully.

---

## Environment and security

- [ ] `.env.example` is present in the repository.
- [ ] `.env` is ignored by Git.
- [ ] `.env` is not committed.
- [ ] `node_modules` is not committed.
- [ ] No passwords, tokens, API keys or other secrets are committed.

---

## Code quality

- [ ] `npm run lint` completes successfully.
- [ ] `npm run build` completes successfully.
- [ ] There are no unresolved TypeScript errors.
- [ ] There are no unnecessary console errors during the main application flow.
- [ ] Naming follows the project coding conventions.
- [ ] The implementation remains organized by feature and layer.

---

## README

- [ ] The README explains how to install dependencies.
- [ ] The README explains how to configure `.env`.
- [ ] The README explains how to start the Express API using `npm run server`.
- [ ] The README explains how to start the Ionic application using `npm run dev`.
- [ ] The README explains how to run tests.
- [ ] The README contains the English section `State management decision`.
- [ ] `State management decision` contains between 3 and 5 clear English sentences.
- [ ] The README contains the English section `API error handling`.
- [ ] `API error handling` contains between 3 and 5 clear English sentences.

---

## Git and delivery

- [ ] Development was performed on `feature/catalogo-productos` or another valid `feature/...` / `feat/...` branch.
- [ ] The repository contains at least six Conventional Commits.
- [ ] Commit messages follow the `type(scope): summary` format.
- [ ] Commits are small enough to show the development process.
- [ ] The feature branch is pushed to the student's fork.
- [ ] A Pull Request is opened from the feature branch to `main` of the student's own fork.
- [ ] The Pull Request contains a clear description of the implemented work.
- [ ] This Definition of Done checklist is verified before delivery.
- [ ] The Pull Request link is ready to be submitted in Moodle.

---

> The Product Catalog feature is considered done only after the applicable items above have been verified. Items should be marked as completed only after the corresponding implementation, test or delivery requirement has actually been checked.