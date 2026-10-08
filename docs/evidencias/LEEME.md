# Evidencias

## 1. Endpoints consumidos desde Swagger

Pruebas realizadas en Swagger UI (`http://127.0.0.1:8000/api/documentation`) con el usuario de prueba `cliente@example.com`, autenticado con el token Bearer que devuelve el inicio de sesión.

### Inicio de sesión: `POST /api/login`

![POST /api/login](01-swagger-login.jpg)

### Usuario autenticado: `GET /api/me`

![GET /api/me](02-swagger-me.jpg)

### Catálogo de productos: `GET /api/products`

![GET /api/products](03-swagger-products.jpg)

### Crear orden: `POST /api/orders`

![POST /api/orders](04-swagger-create-order.jpg)

### Confirmar pago con Stripe: `POST /api/orders/{order}/confirm-payment`

![POST /api/orders/{order}/confirm-payment](05-swagger-confirm-payment.jpg)

### Historial de órdenes: `GET /api/orders`

![GET /api/orders](06-swagger-orders.jpg)

## 2. Flujo completo de compra

### Catálogo

![Catálogo](10-catalogo.jpg)

### Detalle de producto

![Detalle de producto](11-detalle-producto.jpg)

### Carrito

![Carrito](12-carrito.jpg)

### Inicio de sesión

![Inicio de sesión](13-login.jpg)

### Checkout

![Checkout](14-checkout.jpg)

### Pago con tarjeta de prueba de Stripe

![Pago](15-pago.jpg)

### Compra confirmada

![Compra confirmada](16-confirmacion.jpg)

### Historial de compras

![Historial de compras](17-historial.jpg)

### Pago rechazado

![Pago rechazado](18-pago-rechazado.jpg)

## 3. Rendimiento con Lighthouse

Catálogo medido en modo producción (`npm run build` y `npm run start`).

![Reporte de Lighthouse](20-lighthouse-catalogo.jpg)
