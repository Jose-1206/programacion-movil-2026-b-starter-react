# Screen — Product Detail

> Product information and management screen.

- **Route:** `/productos/:id`
- **Feature:** Product Catalog
- **Design reference:** N/A

---

## Purpose

The user can view all information about a selected product and choose to edit or delete it. The screen also handles loading, request errors and products that do not exist.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader`, `IonToolbar`, `IonTitle` | Displays the product detail title and navigation controls. |
| Body | Product detail content | Displays id, name, formatted price, category, stock and stock label. |
| Actions | `IonButton` | Provides Editar and Eliminar actions. |
| Delete confirmation | Confirmation area | Requests confirmation before deleting the product. |
| State feedback | `IonSpinner` or error message | Displays loading, error and not-found states. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Product detail is being requested | Spinner and loading message. |
| Loaded | Product was found | All product fields and action buttons are displayed. |
| Empty | Not applicable | N/A |
| Error | API request fails | Error message. |
| Not found | API responds with 404 | Message indicating that the product does not exist. |
| Offline | API cannot be reached | Network error message. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Open product | Loads product using its route id | `getProduct` |
| Tap `Editar` | Navigates to `/productos/:id/editar` | Edit product |
| Tap `Eliminar` | Displays a confirmation before deletion | Delete confirmation |
| Confirm deletion | Deletes the product and returns to `/productos` | `deleteProduct` |
| Cancel deletion | Keeps the product unchanged | Cancel delete |
| Go back | Returns to the product list | Navigation |

---

## Accessibility

- [ ] All interactive elements have accessible labels.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp.
- [ ] Text scales with OS font-size setting.
- [ ] Contrast meets WCAG AA.