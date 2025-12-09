import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

// Importar rutas
import clienteRoutes from './routes/clienteRoutes';
import ingredienteRoutes from './routes/ingredienteRoutes';
import productoRoutes from './routes/productoRoutes';
import metodoPagoRoutes from './routes/metodoPagoRoutes';
import ventaRoutes from './routes/ventaRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Rutas
app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'API Sistema de Ventas de Pizzas',
    version: '1.0.0',
    endpoints: {
      clientes: '/api/clientes',
      ingredientes: '/api/ingredientes',
      productos: '/api/productos',
      metodosPago: '/api/metodos-pago',
      ventas: '/api/ventas',
      dashboard: '/api/dashboard',
    },
  });
});

app.use('/api/clientes', clienteRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/metodos-pago', metodoPagoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Ruta ${req.originalUrl} no encontrada`,
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
