import { Router } from 'express';
import clienteController from '../controllers/clienteController';
import { validate } from '../middleware/validate';
import {
  createClienteSchema,
  createMultipleClientesSchema,
  updateClienteSchema,
} from '../utils/validations/clienteValidation';

const router = Router();

router.post('/', validate(createClienteSchema), clienteController.crear);
router.post('/bulk', validate(createMultipleClientesSchema), clienteController.crearMultiples);
router.get('/', clienteController.listar);
router.get('/buscar', clienteController.buscar);
router.get('/:id', clienteController.obtenerPorId);
router.get('/:id/ventas', clienteController.obtenerHistorialVentas);
router.put('/:id', validate(updateClienteSchema), clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

export default router;
