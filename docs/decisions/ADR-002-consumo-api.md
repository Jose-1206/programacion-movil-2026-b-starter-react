# ADR-002 — Centralized API Consumption

- **ID:** ADR-002
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** José Miguel Aya Peralta

---

## Context

The Ionic application must communicate with the Express REST API to list, retrieve, create, update and delete products. All screens need consistent request behavior and a common way to distinguish successful responses from API errors.

The starter already provides `API_URL`, `ApiError` and `getProducts` as examples of the expected HTTP client structure. The remaining product operations must follow the same approach.

The Express API also returns controlled errors using the structure:

`{ "error": "message", "details": ["..."] }`

The application must preserve these server validation messages so that the product form can display them to the user.

**Known constraints:**
- The API base URL is obtained from the application configuration.
- HTTP access belongs in the product feature `data` layer.
- The application must implement `getProduct`, `createProduct`, `updateProduct` and `deleteProduct`.
- Server validation errors may contain multiple messages in `details`.
- HTTP status codes such as 400 and 404 must be distinguishable from successful responses.
- Network errors must also be handled.

---

## Decision

**We decided:** Centralize all product HTTP requests in the product feature `data` layer and use `ApiError` to represent API failures consistently.

**Justification:**

Keeping HTTP requests outside the presentation layer separates networking concerns from UI logic. Pages call reusable functions such as `getProducts`, `getProduct`, `createProduct`, `updateProduct` and `deleteProduct` instead of calling `fetch` directly.

When the API returns an unsuccessful HTTP response, the client converts the response into an `ApiError`. This allows the presentation layer to inspect the HTTP status and server-provided `details`, distinguishing validation errors, not-found responses and other failures.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| Centralized HTTP functions in the `data` layer with `ApiError` | Reusable, consistent, separates networking from UI and follows the starter structure | Requires maintaining a small client abstraction | — (chosen) |
| Call `fetch` directly from every page | Fast to implement initially | Duplicates URLs, headers and error handling across screens | Makes maintenance and testing harder |
| Add an external HTTP library | Can provide interceptors and additional utilities | Adds an unnecessary dependency | Native `fetch` is sufficient for the required API |

---

## Consequences

**Positive:**
- All product requests use the same API configuration.
- Request and error handling are consistent across screens.
- Presentation components remain focused on UI and state.
- Server `details` messages can be shown in the product form.
- HTTP client functions can be reused and tested independently.

**Negative / Trade-offs:**
- Every API operation must follow the same client abstraction.
- Changes to the API contract may require updates to the centralized client functions.

**Impact on the system:**
- Affected features/screens: Product List, Product Detail and Product Form.
- Documents to update: `features/productos.md`, API documentation and `README.md`.

---

## References

- Product API endpoints:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- Related to: `ADR-001`.