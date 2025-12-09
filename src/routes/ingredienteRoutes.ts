import { Router } from 'express';
import ingredienteController from '../controllers/ingredienteController';
import { validate } from '../middleware/validate';
import {
  createIngredienteSchema,
  createMultipleIngredientesSchema,
  updateIngredienteSchema,
} from '../utils/validations/ingredienteValidation';

const router = Router();

router.post('/', validate(createIngredienteSchema), ingredienteController.crear);
router.post('/bulk', validate(createMultipleIngredientesSchema), ingredienteController.crearMultiples);
router.get('/', ingredienteController.listar);
router.get('/:id', ingredienteController.obtenerPorId);
router.put('/:id', validate(updateIngredienteSchema), ingredienteController.actualizar);
router.delete('/:id', ingredienteController.eliminar);

export default router;
