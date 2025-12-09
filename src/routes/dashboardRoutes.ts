import { Router } from 'express';
import dashboardController from '../controllers/dashboardController';

const router = Router();

router.get('/estadisticas', dashboardController.obtenerEstadisticas);
router.get('/ventas-del-dia', dashboardController.obtenerVentasDelDia);
router.get('/ventas-por-mes', dashboardController.obtenerVentasPorMes);

export default router;
