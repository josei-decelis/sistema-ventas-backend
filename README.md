# Sistema de Ventas de Pizzas

API REST completa desarrollada con Node.js, Express, TypeScript y Prisma ORM para la gestión de ventas de pizzas.

## 🚀 Características

- ✅ Arquitectura modular y escalable
- ✅ TypeScript para type-safety
- ✅ Validación de datos con Zod
- ✅ Manejo de errores centralizado
- ✅ Logging de solicitudes
- ✅ Transacciones de base de datos con Prisma
- ✅ Paginación y filtros
- ✅ Dashboard con estadísticas

## 📋 Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd sistema-ventas
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
NODE_ENV=development
PORT=3005
DATABASE_URL="postgresql://user:password@localhost:5432/sistema_ventas?schema=public"
```

4. Ejecutar migraciones de base de datos:
```bash
npm run db:push
```

5. Generar cliente de Prisma:
```bash
npm run db:generate
```

6. (Opcional) Ejecutar seed para datos de prueba:
```bash
npm run db:seed
```

7. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3005`

## 📦 Scripts Disponibles

```json
{
  "dev": "Inicia el servidor en modo desarrollo con hot-reload",
  "build": "Compila TypeScript a JavaScript",
  "start": "Inicia el servidor en producción",
  "db:migrate": "Ejecuta migraciones de Prisma",
  "db:push": "Sincroniza el schema con la base de datos",
  "db:seed": "Ejecuta el seed de datos iniciales",
  "db:studio": "Abre Prisma Studio para explorar la BD",
  "db:generate": "Genera el cliente de Prisma"
}
```

## 📚 Documentación de API

### Base URL
```
http://localhost:3005/api
```

---

## 👥 Clientes

### Crear Cliente
```http
POST /api/clientes
```

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "telefono": "1234567890",
  "direccion": "Calle 123, Ciudad",
  "notas": "Cliente frecuente"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "cliente": {
      "id": 1,
      "nombre": "Juan Pérez",
      "telefono": "1234567890",
      "direccion": "Calle 123, Ciudad",
      "notas": "Cliente frecuente",
      "createdAt": "2025-12-06T10:00:00.000Z",
      "updatedAt": "2025-12-06T10:00:00.000Z"
    }
  }
}
```

### Listar Clientes
```http
GET /api/clientes?page=1&limit=10&buscar=juan
```

**Query Params:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 10)
- `buscar` (opcional): Buscar por nombre o teléfono

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "clientes": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Buscar Cliente
```http
GET /api/clientes/buscar?q=juan
```

### Obtener Cliente por ID
```http
GET /api/clientes/:id
```

### Actualizar Cliente
```http
PUT /api/clientes/:id
```

**Request Body:**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "direccion": "Nueva Dirección 456"
}
```

### Eliminar Cliente
```http
DELETE /api/clientes/:id
```

---

## 🧪 Ingredientes

### Crear Ingrediente
```http
POST /api/ingredientes
```

**Request Body:**
```json
{
  "nombre": "Queso Mozzarella",
  "costoUnitario": 0.02,
  "stockActual": 5000,
  "unidadMedida": "gramos"
}
```

### Listar Ingredientes
```http
GET /api/ingredientes?page=1&limit=10&orderBy=nombre
```

**Query Params:**
- `orderBy`: nombre | stock | costo

### Obtener Ingrediente por ID
```http
GET /api/ingredientes/:id
```

### Actualizar Ingrediente
```http
PUT /api/ingredientes/:id
```

### Actualizar Stock
```http
PATCH /api/ingredientes/:id/stock
```

**Request Body:**
```json
{
  "cantidad": 100
}
```
*Nota: Cantidad positiva suma, negativa resta*

### Ingredientes con Bajo Stock
```http
GET /api/ingredientes/bajo-stock?limite=10
```

### Eliminar Ingrediente
```http
DELETE /api/ingredientes/:id
```

---

## 🍕 Productos

### Crear Producto
```http
POST /api/productos
```

**Request Body:**
```json
{
  "nombre": "Pizza Margherita",
  "descripcion": "Pizza clásica con queso y tomate",
  "precioBase": 12.99,
  "ingredientes": [
    {
      "ingredienteId": 1,
      "cantidad": 200,
      "unidadMedida": "gramos"
    },
    {
      "ingredienteId": 2,
      "cantidad": 150,
      "unidadMedida": "gramos"
    }
  ]
}
```

### Listar Productos
```http
GET /api/productos?page=1&limit=10&activo=true
```

### Obtener Producto por ID
```http
GET /api/productos/:id
```

### Obtener Costo Estimado
```http
GET /api/productos/:id/costo
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "producto": {
      "id": 1,
      "nombre": "Pizza Margherita",
      "precioBase": 12.99
    },
    "costoEstimado": 5.5,
    "margenGanancia": 7.49,
    "porcentajeMargen": 57.66,
    "ingredientes": [...]
  }
}
```

### Actualizar Producto
```http
PUT /api/productos/:id
```

### Asignar/Modificar Ingredientes
```http
PUT /api/productos/:id/ingredientes
PATCH /api/productos/:id/ingredientes
```

**Request Body:**
```json
{
  "ingredientes": [
    {
      "ingredienteId": 1,
      "cantidad": 200,
      "unidadMedida": "gramos"
    }
  ]
}
```

### Eliminar Producto
```http
DELETE /api/productos/:id
```

---

## 💳 Métodos de Pago

### Crear Método de Pago
```http
POST /api/metodos-pago
```

**Request Body:**
```json
{
  "nombre": "Efectivo"
}
```

### Listar Métodos de Pago
```http
GET /api/metodos-pago
```

### Obtener Método de Pago por ID
```http
GET /api/metodos-pago/:id
```

### Actualizar Método de Pago
```http
PUT /api/metodos-pago/:id
```

### Eliminar Método de Pago
```http
DELETE /api/metodos-pago/:id
```

---

## 🛒 Ventas

### Crear Venta
```http
POST /api/ventas
```

**Request Body:**
```json
{
  "clienteId": 1,
  "metodoPagoId": 1,
  "direccionEntrega": "Calle 123, Ciudad",
  "notas": "Sin cebolla",
  "items": [
    {
      "productoId": 1,
      "cantidad": 2,
      "precioUnitario": 12.99
    },
    {
      "productoId": 2,
      "cantidad": 1,
      "precioUnitario": 15.99
    }
  ]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "venta": {
      "id": 1,
      "fecha": "2025-12-06T10:00:00.000Z",
      "total": 41.97,
      "estado": "completado",
      "cliente": {...},
      "metodoPago": {...},
      "items": [...]
    }
  }
}
```

### Listar Ventas
```http
GET /api/ventas?page=1&limit=10&fechaInicio=2025-12-01&fechaFin=2025-12-31&clienteId=1&metodoPagoId=1&estado=completado
```

**Query Params:**
- `page`, `limit`: Paginación
- `fechaInicio`, `fechaFin`: Filtrar por rango de fechas
- `clienteId`: Filtrar por cliente
- `metodoPagoId`: Filtrar por método de pago
- `estado`: completado | cancelado

### Obtener Venta por ID
```http
GET /api/ventas/:id
```

### Anular Venta
```http
PATCH /api/ventas/:id/anular
```

---

## 📊 Dashboard

### Obtener Estadísticas
```http
GET /api/dashboard/estadisticas?fechaInicio=2025-12-01&fechaFin=2025-12-31
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "resumen": {
      "totalVentas": 1500.50,
      "cantidadVentas": 45,
      "promedioVenta": 33.34
    },
    "ventasPorDia": [...],
    "productosMasVendidos": [...],
    "clientesMasFrecuentes": [...],
    "ventasPorMetodoPago": [...]
  }
}
```

### Obtener Ventas del Día
```http
GET /api/dashboard/ventas-del-dia
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "fecha": "2025-12-06T00:00:00.000Z",
    "cantidadVentas": 12,
    "totalDelDia": 350.75,
    "ventas": [...]
  }
}
```

---

## 🗂️ Estructura del Proyecto

```
sistema-ventas/
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   └── seed.ts                # Datos iniciales
├── src/
│   ├── controllers/           # Controladores (lógica de rutas)
│   │   ├── clienteController.ts
│   │   ├── ingredienteController.ts
│   │   ├── productoController.ts
│   │   ├── metodoPagoController.ts
│   │   ├── ventaController.ts
│   │   └── dashboardController.ts
│   ├── services/              # Servicios (lógica de negocio)
│   │   ├── clienteService.ts
│   │   ├── ingredienteService.ts
│   │   ├── productoService.ts
│   │   ├── metodoPagoService.ts
│   │   ├── ventaService.ts
│   │   └── dashboardService.ts
│   ├── routes/                # Definición de rutas
│   │   ├── clienteRoutes.ts
│   │   ├── ingredienteRoutes.ts
│   │   ├── productoRoutes.ts
│   │   ├── metodoPagoRoutes.ts
│   │   ├── ventaRoutes.ts
│   │   └── dashboardRoutes.ts
│   ├── middleware/            # Middlewares
│   │   ├── errorHandler.ts
│   │   ├── validate.ts
│   │   └── logger.ts
│   ├── utils/                 # Utilidades
│   │   ├── AppError.ts
│   │   ├── types.ts
│   │   └── validations/
│   │       ├── clienteValidation.ts
│   │       ├── ingredienteValidation.ts
│   │       ├── productoValidation.ts
│   │       ├── metodoPagoValidation.ts
│   │       └── ventaValidation.ts
│   ├── prisma/
│   │   └── client.ts          # Cliente de Prisma
│   ├── app.ts                 # Configuración de Express
│   └── server.ts              # Punto de entrada
├── .env.example               # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Modelo de Datos

### Clientes
- Información de contacto
- Relación 1:N con Ventas

### Ingredientes
- Costos y stock
- Relación N:N con Productos

### Productos
- Precios base
- Ingredientes asociados
- Cálculo de costos

### Ventas
- Items de venta
- Totales automáticos
- Estados (completado/cancelado)

### Métodos de Pago
- Efectivo, tarjeta, transferencia, etc.

## 🛡️ Manejo de Errores

La API maneja errores de forma centralizada:

- **400 Bad Request**: Errores de validación
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Errores del servidor

**Formato de error:**
```json
{
  "status": "fail",
  "message": "Descripción del error",
  "errors": [...]
}
```

## 🧪 Características Técnicas

### Validaciones
- Uso de Zod para validación de esquemas
- Validación en tiempo de ejecución
- Mensajes de error descriptivos

### Transacciones
- Operaciones atómicas con Prisma
- Rollback automático en caso de error

### Paginación
- Implementada en todos los listados
- Parámetros configurables

### Filtros y Ordenamiento
- Filtros por múltiples campos
- Ordenamiento configurable

## 📝 Licencia

ISC

## 👨‍💻 Autor

Sistema desarrollado con Node.js, Express, TypeScript y Prisma ORM
# sistema-ventas-backend
