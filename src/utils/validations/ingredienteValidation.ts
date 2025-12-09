import { z } from 'zod';

export const createIngredienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  costoUnitario: z.number().positive('El costo debe ser mayor a 0'),
});

export const createMultipleIngredientesSchema = z.array(createIngredienteSchema);

export const updateIngredienteSchema = z.object({
  nombre: z.string().min(2).optional(),
  costoUnitario: z.number().positive().optional(),
});

export type CreateIngredienteInput = z.infer<typeof createIngredienteSchema>;
export type CreateMultipleIngredientesInput = z.infer<typeof createMultipleIngredientesSchema>;
export type UpdateIngredienteInput = z.infer<typeof updateIngredienteSchema>;
