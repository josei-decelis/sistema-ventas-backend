import { z } from 'zod';

export const ventaItemSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
});

export const createVentaSchema = z.object({
  clienteId: z.coerce.number().int().positive(),
  metodoPagoId: z.coerce.number().int().positive(),
  direccionEntrega: z.string().optional(),
  notas: z.string().optional(),
  items: z.array(ventaItemSchema).min(1, 'Debe incluir al menos un item'),
});

export const createMultipleVentasSchema = z.array(createVentaSchema);

export type CreateVentaInput = z.infer<typeof createVentaSchema>;
export type VentaItemInput = z.infer<typeof ventaItemSchema>;
