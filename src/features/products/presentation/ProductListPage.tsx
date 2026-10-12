import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useHistory } from 'react-router-dom';

import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';

import {
  CATEGORIES,
  filterProducts,
  toProductView,
} from '../domain/product';

import type { Product } from '../domain/product';

import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

type LoadStatus = 'loading' | 'ready' | 'error';

const ProductListPage: React.FC = () => {
  const history = useHistory();

  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] =
    useState<LoadStatus>('loading');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const isLoadingRef = useRef(false);

  const loadProducts = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await getProducts();

      setProducts(data);
      setStatus('ready');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  /**
   * Ionic conserva algunas páginas en memoria.
   * Esto permite actualizar la lista cuando se vuelve
   * después de crear, editar o eliminar un producto.
   */
  useIonViewWillEnter(() => {
    void loadProducts();
  });

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        category,
      }),
    [products, search, category],
  );

  const productViews = useMemo(
    () =>
      filteredProducts.map((product) =>
        toProductView(product),
      ),
    [filteredProducts],
  );

  const hasActiveFilters =
    search.trim() !== '' || category !== '';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {status === 'loading' && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
            <p>Cargando productos...</p>
          </div>
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() =>
              void loadProducts()
            }
          />
        )}

        {status === 'ready' && (
          <>
            <div className="ion-padding">
              <IonInput
                label="Buscar producto"
                labelPlacement="floating"
                fill="outline"
                placeholder="Escribe un nombre"
                value={search}
                clearInput
                onIonInput={(event) =>
                  setSearch(
                    String(
                      event.detail.value ?? '',
                    ),
                  )
                }
              />

              <div className="ion-padding-top">
                <IonButton
                  size="small"
                  fill={
                    category === ''
                      ? 'solid'
                      : 'outline'
                  }
                  onClick={() =>
                    setCategory('')
                  }
                >
                  Todas
                </IonButton>

                {CATEGORIES.map(
                  (itemCategory) => (
                    <IonButton
                      key={itemCategory}
                      size="small"
                      fill={
                        category ===
                        itemCategory
                          ? 'solid'
                          : 'outline'
                      }
                      onClick={() =>
                        setCategory(
                          itemCategory,
                        )
                      }
                    >
                      {itemCategory}
                    </IonButton>
                  ),
                )}
              </div>
            </div>

            {products.length === 0 && (
              <EmptyState
                title="No hay productos"
                message="El catálogo todavía está vacío."
                actionLabel="Crear producto"
                onAction={() =>
                  history.push(
                    '/productos/nuevo',
                  )
                }
              />
            )}

            {products.length > 0 &&
              productViews.length === 0 && (
                <EmptyState
                  title="Sin resultados"
                  message="No hay productos que coincidan con la búsqueda o categoría seleccionada."
                  actionLabel={
                    hasActiveFilters
                      ? 'Limpiar filtros'
                      : undefined
                  }
                  onAction={
                    hasActiveFilters
                      ? () => {
                          setSearch('');
                          setCategory('');
                        }
                      : undefined
                  }
                />
              )}

            {productViews.length > 0 && (
              <IonList>
                {productViews.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(id) =>
                        history.push(
                          `/productos/${id}`,
                        )
                      }
                    />
                  ),
                )}
              </IonList>
            )}

            <IonButton
              expand="block"
              className="ion-margin"
              onClick={() =>
                history.push(
                  '/productos/nuevo',
                )
              }
            >
              Nuevo producto
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductListPage;