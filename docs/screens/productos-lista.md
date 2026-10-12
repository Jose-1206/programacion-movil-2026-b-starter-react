# Screen — Product List

> Product catalog main screen.

- **Route:** `/productos`
- **Feature:** Product Catalog
- **Design reference:** N/A

---

## Purpose

The user can view all products loaded from the API, search products by name, filter them by category, open a product detail, and navigate to the product creation form.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader`, `IonToolbar`, `IonTitle` | Displays the title "Productos". |
| Search | `IonSearchbar` | Filters products by name. |
| Category filters | `IonButton` | Five buttons: Todas, Bebidas, Snacks, Aseo and Hogar. |
| Body | `ProductCard` list | Displays the filtered products. |
| State feedback | `IonSpinner`, `EmptyState` or error message | Shows loading, empty, no-results or request-error states. |
| CTA | `IonButton` | Navigates to `/productos/nuevo`. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Products are being requested from the API | Spinner and loading message. |
| Loaded | Products were loaded successfully | Product cards, search field and category filters. |
| Empty | API returns an empty product list | Empty state indicating that there are no products. |
| No results | Search or category filter produces no matches | Message indicating that no products match the current filters. |
| Error | Request fails | Error message and `Reintentar` button. |
| Offline | API cannot be reached because connectivity is unavailable | Error message and retry action. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Enter text in search | Products are filtered by name | `filterProducts` |
| Tap `Todas` | Shows products from all categories | `filterProducts` |
| Tap `Bebidas` | Shows only products in the Bebidas category | `filterProducts` |
| Tap `Snacks` | Shows only products in the Snacks category | `filterProducts` |
| Tap `Aseo` | Shows only products in the Aseo category | `filterProducts` |
| Tap `Hogar` | Shows only products in the Hogar category | `filterProducts` |
| Tap a product card | Navigates to `/productos/:id` | View product detail |
| Tap create button | Navigates to `/productos/nuevo` | Create product |
| Tap `Reintentar` | Requests the product list again | Reload products |

---

## Accessibility

- [ ] All interactive elements have accessible labels.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp.
- [ ] Text scales with OS font-size setting.
- [ ] Contrast meets WCAG AA.