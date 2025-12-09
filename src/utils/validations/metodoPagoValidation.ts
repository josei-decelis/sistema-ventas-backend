import { z } from 'zod';

export const createMetodoPagoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export const updateMetodoPagoSchema = z.object({
  nombre: z.string().min(2).optional(),
  activo: z.boolean().optional(),
});

export type CreateMetodoPagoInput = z.infer<typeof createMetodoPagoSchema>;
export type UpdateMetodoPagoInput = z.infer<typeof updateMetodoPagoSchema>;
