import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CreateMetodoPagoInput, UpdateMetodoPagoInput } from '../utils/validations/metodoPagoValidation';

class MetodoPagoService {
  async crearMetodoPago(data: CreateMetodoPagoInput) {
    const metodoExiste = await prisma.metodoPago.findUnique({
      where: { nombre: data.nombre },
    });

    if (metodoExiste) {
      throw new AppError('Ya existe un método de pago con ese nombre', 400);
    }

    return await prisma.metodoPago.create({
      data,
    });
  }

  async listarMetodosPago() {
    return await prisma.metodoPago.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });
  }

  async obtenerMetodoPagoPorId(id: number) {
    const metodoPago = await prisma.metodoPago.findUnique({
      where: { id },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });

    if (!metodoPago) {
      throw new AppError('Método de pago no encontrado', 404);
    }

    return metodoPago;
  }

  async actualizarMetodoPago(id: number, data: UpdateMetodoPagoInput) {
    const metodoPago = await prisma.metodoPago.findUnique({
      where: { id },
    });

    if (!metodoPago) {
      throw new AppError('Método de pago no encontrado', 404);
    }

    if (data.nombre && data.nombre !== metodoPago.nombre) {
      const nombreExiste = await prisma.metodoPago.findUnique({
        where: { nombre: data.nombre },
      });

      if (nombreExiste) {
        throw new AppError('El nombre ya está en uso', 400);
      }
    }

    return await prisma.metodoPago.update({
      where: { id },
      data,
    });
  }

  async eliminarMetodoPago(id: number) {
    const metodoPago = await prisma.metodoPago.findUnique({
      where: { id },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });

    if (!metodoPago) {
      throw new AppError('Método de pago no encontrado', 404);
    }

    if (metodoPago._count.ventas > 0) {
      throw new AppError(
        'No se puede eliminar un método de pago con ventas registradas',
        400
      );
    }

    await prisma.metodoPago.delete({
      where: { id },
    });

    return { message: 'Método de pago eliminado exitosamente' };
  }
}

export default new MetodoPagoService();
