import { Router, Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = Router();

router.post('/init-db', async (_req: Request, res: Response) => {
  try {
    console.log('🔧 Iniciando creación de tablas en la base de datos...');
    
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    
    console.log('✅ stdout:', stdout);
    if (stderr) console.log('⚠️ stderr:', stderr);
    
    return res.status(200).json({
      status: 'success',
      message: 'Base de datos inicializada correctamente',
      output: stdout,
    });
  } catch (error: any) {
    console.error('❌ Error al inicializar DB:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al inicializar la base de datos',
      error: error.message,
    });
  }
});

export default router;
