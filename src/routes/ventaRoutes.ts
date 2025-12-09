import { Router } from 'express';
import ventaController from '../controllers/ventaController';
import { validate } from '../middleware/validate';
import { createVentaSchema, createMultipleVentasSchema } from '../utils/validations/ventaValidation';

const router = Router();

router.post('/', validate(createVentaSchema), ventaController.crear);
router.post('/bulk', validate(createMultipleVentasSchema), ventaController.crearMultiples);
router.get('/', ventaController.listar);
router.get('/:id', ventaController.obtenerPorId);
router.patch('/:id/anular', ventaController.anular);

export default router;
