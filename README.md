# Mostrador: Frontend E-commerce en Next.js

Aplicación web en **Next.js 16 (App Router) + TypeScript** que consume la API REST de e-commerce construida con **Laravel 12 + Sanctum + Swagger + Stripe**. Implementa el flujo completo de compra: catálogo, autenticación, carrito, creación de orden, pago con Stripe, confirmación e historial de compras.

Actividad evaluada: *Optimización Avanzada de Rendimiento: Dominio de Web Vitals y Mutaciones Asíncronas en el Servidor*.

## Stack

- Next.js 16.3 (App Router, Turbopack) y React 19
- TypeScript
- Tailwind CSS 4
- Server Components para lecturas y Server Actions para mutaciones
- Sin librerías adicionales: el bundle de JavaScript se mantiene pequeño a propósito

## Requisitos previos

- Node.js 20 o superior
- La API de Laravel funcionando en `http://127.0.0.1:8000` (con `php artisan serve`), con migraciones y seeders ejecutados y las llaves de prueba de Stripe en su `.env`

## Configuración del archivo `.env`

El proyecto incluye un `.env.example` con una sola variable:

```env
# URL base de la API de Laravel (incluye el prefijo /api, sin barra final).
API_BASE_URL=http://127.0.0.1:8000/api
```

`API_BASE_URL` **no** lleva el prefijo `NEXT_PUBLIC_` porque solo se usa en el servidor de Next.js. El navegador nunca habla directamente con la API, así que la URL y el token no quedan expuestos y no hace falta configurar CORS en Laravel.

## Pasos para ejecutar el proyecto

1. Encender la API de Laravel (en la carpeta de la API):

   ```bash
   php artisan serve
   ```

2. En la carpeta de este proyecto, instalar dependencias y crear el archivo de entorno.

   En Windows (CMD o PowerShell):

   ```bash
   npm install
   copy .env.example .env.local
   ```

   En macOS o Linux:

   ```bash
   npm install
   cp .env.example .env.local
   ```

3. Modo desarrollo:

   ```bash
   npm run dev
   ```

   Abrir `http://localhost:3000`.

4. Modo producción (el que se debe usar para medir con Lighthouse):

   ```bash
   npm run build
   npm run start
   ```

Usuario de prueba creado por los seeders de la API: `cliente@example.com` / `password123`. También se puede crear una cuenta nueva desde `/registro`.

## Rutas implementadas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Catálogo de productos con búsqueda (`?q=`) y paginación (`?page=`) |
| `/productos/[id]` | Público | Detalle de producto y selector de cantidad |
| `/carrito` | Público | Carrito (estado local): cambiar cantidades, quitar o vaciar |
| `/login` | Solo invitados | Inicio de sesión |
| `/registro` | Solo invitados | Registro de cuenta |
| `/checkout` | Protegida | Resumen del carrito y creación de la orden |
| `/checkout/[orderId]` | Protegida | Pago de la orden con tarjeta de prueba de Stripe |
| `/checkout/[orderId]/confirmacion` | Protegida | Confirmación de la compra |
| `/compras` | Protegida | Historial de compras del usuario |
| `POST /api/auth/logout` | Route Handler | Revoca el token en Laravel y borra las cookies |
| `GET /api/auth/expirada` | Route Handler | Limpia la sesión cuando la API responde 401 |

## Endpoints de la API consumidos

| Método | Endpoint | Dónde se usa |
|--------|----------|--------------|
| GET | `/api/products?search=&page=&per_page=` | Catálogo (Server Component) |
| GET | `/api/products/{id}` | Detalle de producto (Server Component) |
| POST | `/api/register` | Registro (Server Action) |
| POST | `/api/login` | Inicio de sesión (Server Action) |
| POST | `/api/logout` | Cierre de sesión (Route Handler) |
| POST | `/api/orders` | Crear orden (Server Action) |
| GET | `/api/orders/{id}` | Pago y confirmación (Server Component) |
| POST | `/api/orders/{id}/confirm-payment` | Pagar con Stripe (Server Action) |
| GET | `/api/orders?page=` | Historial (Server Component dentro de Suspense) |

## Cómo se cumple cada requisito

### Lecturas con Server Components

Todas las consultas a la API están en `lib/api.ts` (marcado con `server-only`, por lo que nunca llega al navegador). El catálogo y el detalle se cachean 60 segundos con el tag `products`; las órdenes del usuario usan `cache: "no-store"` porque son datos privados.

### Mutaciones con Server Actions

`actions/auth.ts` (login y registro) y `actions/orders.ts` (crear orden y pagar). Los formularios usan `useActionState` para mostrar el estado de envío y los errores de validación (422) que devuelve Laravel, campo por campo.

### Token seguro en cookie httpOnly

Al iniciar sesión, la Server Action guarda el token de Sanctum en la cookie `shop_token` con `httpOnly`, `sameSite=lax` y `secure` en producción. El JavaScript del navegador no puede leerla (protección contra XSS). Además:

- `proxy.ts` (el reemplazo de `middleware.ts` en Next.js 16) redirige a `/login?next=...` si se intenta entrar a `/checkout` o `/compras` sin sesión.
- El Route Handler `POST /api/auth/logout` revoca el token en Laravel y elimina las cookies.
- Si la API responde 401 (token vencido o revocado), el Route Handler `/api/auth/expirada` limpia la sesión y pide iniciar sesión otra vez.

### Carrito y orden

El carrito (`lib/cart.ts`) es estado local del navegador implementado con `useSyncExternalStore` y persistido en `localStorage`, sincronizado entre pestañas y sin errores de hidratación. No permite agregar más unidades que el stock disponible. La orden se crea con la Server Action `createOrderAction`, que envía `items` a `POST /api/orders`. Si Laravel responde con stock insuficiente (422), el mensaje se muestra en el checkout.

### Pago con Stripe

La API crea un `PaymentIntent` al generar la orden. La página de pago permite elegir una tarjeta de prueba de Stripe y la Server Action `payOrderAction` llama a `POST /api/orders/{id}/confirm-payment` con el método de pago:

| Tarjeta de prueba | `payment_method` | Resultado |
|-------------------|------------------|-----------|
| Visa terminada en 4242 | `pm_card_visa` | Pago aprobado |
| Mastercard terminada en 4444 | `pm_card_mastercard` | Pago aprobado |
| Visa terminada en 0002 | `pm_card_chargeDeclined` | Pago rechazado (402) |

El cobro se confirma desde el servidor, así que la llave secreta de Stripe nunca sale de Laravel. Si el pago se aprueba se muestra la confirmación de compra; si se rechaza, la orden queda como "Pago rechazado".

### Rendimiento y resiliencia

- **`loading.tsx`** en el catálogo (`app/loading.tsx`), detalle de producto, checkout y compras, con skeletons de tamaño similar al contenido final para reducir saltos de diseño (CLS).
- **`error.tsx`** en el catálogo, detalle de producto, checkout y compras, con botón para reintentar (`retry()`) y mensajes que explican qué falló.
- **`<Suspense>`** en la lista de productos (`components/ProductGrid.tsx`) y en el historial (`components/OrdersList.tsx`): el encabezado de la página aparece de inmediato mientras los datos llegan en streaming.
- **Sin interfaces desactualizadas después de mutaciones:**
  - Al crear una orden se llama `revalidateTag("products", { expire: 0 })`, porque la compra descontó stock, y `revalidatePath("/compras")`.
  - Al pagar se llama `revalidatePath("/compras")` y `revalidatePath("/checkout/{id}")`.
  - Al iniciar sesión se llama `revalidatePath("/", "layout")` para actualizar el encabezado.
- **Web Vitals:**
  - Las primeras 4 imágenes del catálogo se cargan con `loading="eager"` y `fetchPriority="high"` (mejora el LCP); el resto con carga diferida.
  - Todas las imágenes usan `next/image` con `sizes`, formatos AVIF/WebP y contenedores con proporción fija para evitar saltos de diseño (CLS).
  - Se usa la tipografía del sistema, sin descargar fuentes web.
  - El componente `components/WebVitals.tsx` usa `useReportWebVitals` para mostrar LCP, CLS, INP, FCP y TTFB en la consola del navegador.

## Estructura del proyecto

```
actions/          Server Actions (auth.ts, orders.ts)
app/              Rutas del App Router (page, loading, error por segmento)
  api/auth/       Route Handlers de sesión (logout, expirada)
components/       Componentes de servidor y cliente
lib/              Cliente de la API, sesión, carrito, tipos y formatos
proxy.ts          Protección de rutas según la cookie de sesión
```

## Evidencias

Las capturas están en [`docs/evidencias`](docs/evidencias/LEEME.md):

1. Endpoints de la API consumidos, probados desde Swagger UI (`http://127.0.0.1:8000/api/documentation`).
2. Flujo completo de compra en la tienda: catálogo, detalle, carrito, inicio de sesión, checkout, pago, confirmación e historial.
3. Reporte de rendimiento de Lighthouse del catálogo, medido en modo producción.

### Cómo medir con Lighthouse

1. Ejecutar el proyecto en modo producción (`npm run build` y luego `npm run start`). El modo desarrollo da puntajes mucho más bajos porque no está optimizado.
2. Abrir `http://localhost:3000` en una ventana de incógnito de Chrome (las extensiones afectan la medición).
3. Abrir DevTools (F12), pestaña **Lighthouse**, marcar Performance, Accessibility, Best Practices y SEO, y presionar **Analyze page load**.
4. Guardar el reporte desde el menú de tres puntos del reporte, con la opción **Save as HTML** o **Print** para PDF.
