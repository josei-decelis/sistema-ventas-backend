import { Router } from 'express';
import productoController from '../controllers/productoController';
import { validate } from '../middleware/validate';
import {
  createProductoSchema,
  createMultipleProductosSchema,
  updateProductoSchema,
  asignarIngredientesSchema,
} from '../utils/validations/productoValidation';

const router = Router();

router.post('/', validate(createProductoSchema), productoController.crear);
router.post('/bulk', validate(createMultipleProductosSchema), productoController.crearMultiples);
router.get('/', productoController.listar);
router.get('/:id', productoController.obtenerPorId);
router.get('/:id/costo', productoController.obtenerCostoEstimado);
router.put('/:id', validate(updateProductoSchema), productoController.actualizar);
router.put('/:id/ingredientes', validate(asignarIngredientesSchema), productoController.asignarIngredientes);
router.patch('/:id/ingredientes', validate(asignarIngredientesSchema), productoController.modificarIngredientes);
router.delete('/:id', productoController.eliminar);

export default router;
