import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';

const router = Router();

// Endpoint temporal para verificar y crear tablas
router.post('/init-db', async (_req: Request, res: Response) => {
  try {
    console.log('🔧 Verificando conexión a la base de datos...');
    
    // Intentar ejecutar una query simple para verificar la conexión
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Conexión a base de datos exitosa');
    console.log('⚠️ Las tablas deben crearse manualmente con: prisma db push');
    console.log('💡 Ejecuta: npx prisma db push --accept-data-loss en el servidor');
    
    return res.status(200).json({
      status: 'success',
      message: 'Conexión a base de datos exitosa. Para crear tablas, el administrador debe ejecutar "prisma db push" en el servidor.',
      instruction: 'Usar Render Shell (plan pago) o contactar soporte para ejecutar: npx prisma db push --accept-data-loss',
    });
  } catch (error: any) {
    console.error('❌ Error de conexión a DB:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al conectar con la base de datos',
      error: error.message,
    });
  }
});

// Endpoint para verificar estado de tablas
router.get('/check-tables', async (_req: Request, res: Response) => {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return res.status(200).json({
      status: 'success',
      tables,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;
