import {
  IonBadge,
  IonItem,
  IonLabel,
} from '@ionic/react';

import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  /** Se invoca con el id del producto cuando la persona toca la tarjeta. */
  onSelect?: (id: number) => void;
}

/**
 * Tarjeta reutilizable de producto.
 *
 * Muestra nombre, categoría, precio y estado del stock.
 * La tarjeta no conoce la navegación: informa la selección mediante onSelect.
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const stockColor = product.isOutOfStock
    ? 'danger'
    : product.isLowStock
      ? 'warning'
      : 'success';

  return (
    <IonItem
      button={Boolean(onSelect)}
      detail={Boolean(onSelect)}
      onClick={() => onSelect?.(product.id)}
    >
      <IonLabel>
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <p>
          <strong>{product.priceLabel}</strong>
        </p>
      </IonLabel>

      <IonBadge
        slot="end"
        color={stockColor}
      >
        {product.stockLabel}
      </IonBadge>
    </IonItem>
  );
};

export default ProductCard;