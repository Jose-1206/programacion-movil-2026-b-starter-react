# Screen — Product Form

> Shared form used to create and edit products.

- **Route:** `/productos/nuevo` and `/productos/:id/editar`
- **Feature:** Product Catalog
- **Design reference:** N/A

---

## Purpose

The user can create a new product or edit an existing product using the same form. The screen validates every field before sending data to the API and also displays validation messages returned by the server.

---

## UI regions

| Region | Component | Notes |
|--------|-----------|-------|
| Header | `IonHeader`, `IonToolbar`, `IonTitle` | Displays "Nuevo producto" or "Editar producto" depending on the route. |
| Name field | `IonInput` | Required text with a maximum length of 60 characters. |
| Price field | `IonInput` | Required numeric value greater than 0. |
| Category field | `IonSelect` | Required category: Bebidas, Snacks, Aseo or Hogar. |
| Stock field | `IonInput` | Required integer greater than or equal to 0. |
| Validation area | Validation messages | Displays local validation and API `details` messages. |
| CTA | `IonButton` | Saves the new or edited product. |

---

## States

| State | Trigger | UI |
|-------|---------|-----|
| Loading | Existing product is being loaded in edit mode | Spinner or loading message. |
| Loaded | Form is ready | Product form fields are displayed. |
| Validation error | One or more fields are invalid | Inline validation messages are displayed. |
| Submitting | Valid form is being sent to the API | Save action is disabled while the request is in progress. |
| Error | API rejects the request or request fails | Server error and `details` messages are displayed. |
| Offline | API cannot be reached | Network error message. |

---

## Actions

| User action | Result | Use case / event |
|-------------|--------|------------------|
| Enter product data | Updates local form state | Form state update |
| Submit invalid form | Displays inline validation errors | `validateProduct` |
| Submit valid new product | Creates the product through the API | `createProduct` |
| Open edit route | Loads the existing product into the form | `getProduct` |
| Submit valid edited product | Updates the existing product | `updateProduct` |
| Receive API validation errors | Displays the messages from `details` | `ApiError` handling |
| Cancel or go back | Returns to the previous screen | Navigation |

---

## Accessibility

- [ ] All interactive elements have accessible labels.
- [ ] Touch targets ≥ 44×44 pt / 48×48 dp.
- [ ] Text scales with OS font-size setting.
- [ ] Contrast meets WCAG AA.