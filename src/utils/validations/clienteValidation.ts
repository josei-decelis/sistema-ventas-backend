import { z } from 'zod';

export const createClienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  direccion: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
});

export const createMultipleClientesSchema = z.array(createClienteSchema);

export const updateClienteSchema = z.object({
  nombre: z.string().min(2).optional(),
  telefono: z.string().min(8).optional(),
  direccion: z.string().optional(),
  notas: z.string().optional(),
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type CreateMultipleClientesInput = z.infer<typeof createMultipleClientesSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
