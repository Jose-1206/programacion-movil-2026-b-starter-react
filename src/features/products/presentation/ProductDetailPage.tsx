import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useHistory,
  useParams,
} from 'react-router-dom';

import {
  ApiError,
  getErrorMessage,
} from '../data/api-error';

import {
  deleteProduct,
  getProduct,
} from '../data/products-api';

import {
  toProductView,
} from '../domain/product';

import type {
  ProductView,
} from '../domain/product';

import EmptyState from './EmptyState';

type LoadStatus =
  | 'loading'
  | 'ready'
  | 'error'
  | 'not-found';

const ProductDetailPage: React.FC = () => {
  const { id } =
    useParams<{ id: string }>();

  const history = useHistory();

  const productId = Number(id);

  const [product, setProduct] =
    useState<ProductView | null>(null);

  const [status, setStatus] =
    useState<LoadStatus>('loading');

  const [errorMessage, setErrorMessage] =
    useState('');

  const [
    isDeleteConfirmationVisible,
    setIsDeleteConfirmationVisible,
  ] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState('');

  const loadProduct = useCallback(
    async () => {
      setStatus('loading');
      setErrorMessage('');

      try {
        const result =
          await getProduct(productId);

        setProduct(
          toProductView(result),
        );

        setStatus('ready');
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 404
        ) {
          setStatus('not-found');
          return;
        }

        setErrorMessage(
          getErrorMessage(error),
        );

        setStatus('error');
      }
    },
    [productId],
  );

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteProduct(productId);

      history.replace('/productos');
    } catch (error) {
      setDeleteError(
        getErrorMessage(error),
      );

      setIsDeleting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/productos"
            />
          </IonButtons>

          <IonTitle>
            Detalle del producto
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {status === 'loading' && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
            <p>Cargando producto...</p>
          </div>
        )}

        {status === 'not-found' && (
          <EmptyState
            title="Producto no encontrado"
            message="El producto solicitado no existe."
            actionLabel="Volver a productos"
            onAction={() =>
              history.replace('/productos')
            }
          />
        )}

        {status === 'error' && (
          <EmptyState
            title="No se pudo cargar"
            message={errorMessage}
            actionLabel="Reintentar"
            onAction={() =>
              void loadProduct()
            }
          />
        )}

        {status === 'ready' &&
          product && (
            <>
              <IonList>
                <IonItem>
                  <IonLabel>
                    <strong>ID</strong>
                    <p>{product.id}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <strong>Nombre</strong>
                    <p>{product.name}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <strong>Precio</strong>
                    <p>
                      {product.priceLabel}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <strong>
                      Categoría
                    </strong>
                    <p>
                      {product.category}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <strong>Stock</strong>
                    <p>
                      {product.stock}
                    </p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <strong>
                      Estado del stock
                    </strong>
                    <p>
                      {product.stockLabel}
                    </p>
                  </IonLabel>
                </IonItem>
              </IonList>

              <IonButton
                expand="block"
                onClick={() =>
                  history.push(
                    `/productos/${product.id}/editar`,
                  )
                }
              >
                Editar
              </IonButton>

              {!isDeleteConfirmationVisible && (
                <IonButton
                  expand="block"
                  color="danger"
                  fill="outline"
                  onClick={() =>
                    setIsDeleteConfirmationVisible(
                      true,
                    )
                  }
                >
                  Eliminar
                </IonButton>
              )}

              {isDeleteConfirmationVisible && (
                <div className="ion-padding-top">
                  <IonText color="danger">
                    <h3>
                      ¿Eliminar este
                      producto?
                    </h3>

                    <p>
                      Esta acción eliminará
                      el producto de la
                      colección actual.
                    </p>
                  </IonText>

                  <IonButton
                    color="danger"
                    disabled={isDeleting}
                    onClick={() =>
                      void handleDelete()
                    }
                  >
                    {isDeleting
                      ? 'Eliminando...'
                      : 'Confirmar'}
                  </IonButton>

                  <IonButton
                    fill="outline"
                    disabled={isDeleting}
                    onClick={() => {
                      setIsDeleteConfirmationVisible(
                        false,
                      );

                      setDeleteError('');
                    }}
                  >
                    Cancelar
                  </IonButton>
                </div>
              )}

              {deleteError && (
                <IonText color="danger">
                  <p>{deleteError}</p>
                </IonText>
              )}
            </>
          )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;