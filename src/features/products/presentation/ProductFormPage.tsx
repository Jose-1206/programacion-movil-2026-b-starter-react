import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import {
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
  createProduct,
  getProduct,
  updateProduct,
} from '../data/products-api';

import {
  CATEGORIES,
  validateProduct,
} from '../domain/product';

import type {
  ProductInput,
} from '../domain/product';

const ProductFormPage: React.FC = () => {
  const { id } =
    useParams<{ id?: string }>();

  const history = useHistory();

  const isEditing =
    id !== undefined;

  const productId =
    isEditing ? Number(id) : null;

  const [name, setName] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [stock, setStock] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(isEditing);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    hasAttemptedSubmit,
    setHasAttemptedSubmit,
  ] = useState(false);

  const [loadError, setLoadError] =
    useState('');

  const [
    serverErrorMessage,
    setServerErrorMessage,
  ] = useState('');

  const [
    serverDetails,
    setServerDetails,
  ] = useState<string[]>([]);

  const buildInput = (): ProductInput => ({
    name,
    price:
      price.trim() === ''
        ? Number.NaN
        : Number(price),
    category,
    stock:
      stock.trim() === ''
        ? Number.NaN
        : Number(stock),
  });

  const validation =
    validateProduct(buildInput());

  useEffect(() => {
    if (
      !isEditing ||
      productId === null
    ) {
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const product =
          await getProduct(productId);

        if (!isMounted) {
          return;
        }

        setName(product.name);
        setPrice(
          String(product.price),
        );
        setCategory(
          product.category,
        );
        setStock(
          String(product.stock),
        );
      } catch (error) {
        if (isMounted) {
          setLoadError(
            getErrorMessage(error),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [isEditing, productId]);

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    setServerErrorMessage('');
    setServerDetails([]);

    const input =
      buildInput();

    const result =
      validateProduct(input);

    if (!result.isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (
        isEditing &&
        productId !== null
      ) {
        await updateProduct(
          productId,
          input,
        );
      } else {
        await createProduct(input);
      }

      history.replace('/productos');
    } catch (error) {
      setServerErrorMessage(
        getErrorMessage(error),
      );

      if (error instanceof ApiError) {
        setServerDetails(
          error.details,
        );
      }
    } finally {
      setIsSubmitting(false);
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
            {isEditing
              ? 'Editar producto'
              : 'Nuevo producto'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isLoading && (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
            <p>
              Cargando producto...
            </p>
          </div>
        )}

        {!isLoading &&
          loadError && (
            <div>
              <IonText color="danger">
                <h3>
                  No se pudo cargar
                </h3>
                <p>{loadError}</p>
              </IonText>

              <IonButton
                routerLink="/productos"
              >
                Volver a productos
              </IonButton>
            </div>
          )}

        {!isLoading &&
          !loadError && (
            <>
              <IonInput
                label="Nombre"
                labelPlacement="floating"
                fill="outline"
                value={name}
                maxlength={60}
                onIonInput={(event) =>
                  setName(
                    String(
                      event.detail.value ??
                        '',
                    ),
                  )
                }
              />

              {hasAttemptedSubmit &&
                validation.errors.name && (
                  <IonText color="danger">
                    <p>
                      {
                        validation.errors
                          .name
                      }
                    </p>
                  </IonText>
                )}

              <div className="ion-padding-top">
                <IonInput
                  label="Precio"
                  labelPlacement="floating"
                  fill="outline"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={price}
                  onIonInput={(event) =>
                    setPrice(
                      String(
                        event.detail
                          .value ?? '',
                      ),
                    )
                  }
                />
              </div>

              {hasAttemptedSubmit &&
                validation.errors
                  .price && (
                  <IonText color="danger">
                    <p>
                      {
                        validation.errors
                          .price
                      }
                    </p>
                  </IonText>
                )}

              <div className="ion-padding-top">
                <p>
                  <strong>
                    Categoría
                  </strong>
                </p>

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

              {hasAttemptedSubmit &&
                validation.errors
                  .category && (
                  <IonText color="danger">
                    <p>
                      {
                        validation.errors
                          .category
                      }
                    </p>
                  </IonText>
                )}

              <div className="ion-padding-top">
                <IonInput
                  label="Stock"
                  labelPlacement="floating"
                  fill="outline"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={stock}
                  onIonInput={(event) =>
                    setStock(
                      String(
                        event.detail
                          .value ?? '',
                      ),
                    )
                  }
                />
              </div>

              {hasAttemptedSubmit &&
                validation.errors
                  .stock && (
                  <IonText color="danger">
                    <p>
                      {
                        validation.errors
                          .stock
                      }
                    </p>
                  </IonText>
                )}

              {serverErrorMessage && (
                <IonText color="danger">
                  <h3>
                    {serverErrorMessage}
                  </h3>
                </IonText>
              )}

              {serverDetails.length >
                0 && (
                <IonText color="danger">
                  <ul>
                    {serverDetails.map(
                      (detail) => (
                        <li key={detail}>
                          {detail}
                        </li>
                      ),
                    )}
                  </ul>
                </IonText>
              )}

              <IonButton
                expand="block"
                className="ion-margin-top"
                disabled={isSubmitting}
                onClick={() =>
                  void handleSubmit()
                }
              >
                {isSubmitting
                  ? 'Guardando...'
                  : isEditing
                    ? 'Guardar cambios'
                    : 'Crear producto'}
              </IonButton>
            </>
          )}
      </IonContent>
    </IonPage>
  );
};

export default ProductFormPage;