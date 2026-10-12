# ADR-001 — Local State Management

- **ID:** ADR-001
- **Date:** 2026-10-12
- **Status:** Accepted
- **Authors:** José Miguel Aya Peralta

---

## Context

The product catalog requires state for loading data, displaying errors, searching, filtering by category, selecting a product and managing form values. The application is small and the state is mainly associated with individual pages.

The practical exam explicitly requires the state to live in each page using React `useState` and `useEffect`. Introducing a global state library would add unnecessary complexity for the current scope.

**Known constraints:**
- The application uses Ionic React.
- State must be managed with React hooks.
- The feature must support loading, empty, no-results and error states.
- The solution must remain simple and easy to explain.
- The product data comes from an Express REST API.

---

## Decision

**We decided:** Use local page state with React `useState` and `useEffect` for the product catalog.

**Justification:**

Local state is enough because the information used by each screen belongs mainly to that screen. The product list manages products, loading, errors, search text and category filters. The detail page manages the selected product and its request state, while the form manages its own fields, validation errors and submission state.

This approach follows the exam requirements, keeps the implementation simple and avoids introducing an unnecessary global state dependency.

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|-------------|------|------|-----------------------|
| Local state with `useState` and `useEffect` | Simple, native to React, easy to understand and appropriate for page-level state | Some state logic can be repeated between pages | — (chosen) |
| React Context | Useful for sharing state between distant components | Adds global state that is not required for this feature | Product state does not need to be shared globally |
| External store such as Redux | Strong centralized state management and developer tools | Adds dependencies, configuration and complexity | Excessive for the scope of the product catalog |

---

## Consequences

**Positive:**
- The state remains close to the UI that uses it.
- The implementation follows the practical exam requirements.
- No additional state-management dependency is required.
- Pages are easier to understand and test independently.

**Negative / Trade-offs:**
- Some loading and error handling logic may be repeated between pages.
- If the application grows significantly, shared state may require a different solution.

**Impact on the system:**
- Affected features/screens: Product List, Product Detail and Product Form.
- Documents to update: `features/productos.md`, screen specifications and `README.md`.

---

## References

- React hooks: `useState` and `useEffect`.
- Related to: `ADR-002`.