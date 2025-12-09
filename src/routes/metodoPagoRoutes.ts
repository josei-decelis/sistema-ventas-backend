import { Router } from 'express';
import metodoPagoController from '../controllers/metodoPagoController';
import { validate } from '../middleware/validate';
import {
  createMetodoPagoSchema,
  updateMetodoPagoSchema,
} from '../utils/validations/metodoPagoValidation';

const router = Router();

router.post('/', validate(createMetodoPagoSchema), metodoPagoController.crear);
router.get('/', metodoPagoController.listar);
router.get('/:id', metodoPagoController.obtenerPorId);
router.put('/:id', validate(updateMetodoPagoSchema), metodoPagoController.actualizar);
router.delete('/:id', metodoPagoController.eliminar);

export default router;
