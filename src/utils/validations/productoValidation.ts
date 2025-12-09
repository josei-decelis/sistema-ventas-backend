import { z } from 'zod';

export const ingredienteItemSchema = z.object({
  ingredienteId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().positive(),
});

export const createProductoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().nullable().optional(),
  precioBase: z.coerce.number().positive('El precio debe ser mayor a 0'),
  ingredientes: z.array(ingredienteItemSchema).optional().default([]),
});

export const createMultipleProductosSchema = z.array(createProductoSchema);

export const updateProductoSchema = z.object({
  nombre: z.string().min(2).optional(),
  descripcion: z.string().optional(),
  precioBase: z.number().positive().optional(),
  activo: z.boolean().optional(),
});

export const asignarIngredientesSchema = z.object({
  ingredientes: z.array(ingredienteItemSchema).min(1),
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type CreateMultipleProductosInput = z.infer<typeof createMultipleProductosSchema>;
export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;
export type AsignarIngredientesInput = z.infer<typeof asignarIngredientesSchema>;
export type IngredienteItem = z.infer<typeof ingredienteItemSchema>;
