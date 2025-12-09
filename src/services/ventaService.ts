import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CreateVentaInput } from '../utils/validations/ventaValidation';

class VentaService {
  async crearVenta(data: CreateVentaInput) {
    const { items, ...ventaData } = data;

    // Verificar que el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId },
    });
    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    // Verificar que el método de pago existe
    const metodoPago = await prisma.metodoPago.findUnique({
      where: { id: data.metodoPagoId },
    });
    if (!metodoPago) {
      throw new AppError('Método de pago no encontrado', 404);
    }

    // Verificar que todos los productos existen
    const productoIds = items.map(item => item.productoId);
    const productos = await prisma.producto.findMany({
      where: { id: { in: productoIds } },
    });
    if (productos.length !== productoIds.length) {
      throw new AppError('Uno o más productos no existen', 400);
    }

    // Calcular el total
    const total = items.reduce((sum, item) => {
      return sum + (item.cantidad * item.precioUnitario);
    }, 0);

    return await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          ...ventaData,
          total,
        },
      });

      await tx.ventaItem.createMany({
        data: items.map(item => ({
          ventaId: venta.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.cantidad * item.precioUnitario,
        })),
      });

      return await tx.venta.findUnique({
        where: { id: venta.id },
        include: {
          cliente: true,
          metodoPago: true,
          items: {
            include: {
              producto: true,
            },
          },
        },
      });
    });
  }

  async listarVentas(
    page: number = 1,
    limit: number = 10,
    fechaInicio?: string,
    fechaFin?: string,
    clienteId?: number,
    metodoPagoId?: number,
    estado?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (fechaInicio || fechaFin) {
      where.createdAt = {};
      if (fechaInicio) where.createdAt.gte = new Date(fechaInicio);
      if (fechaFin) where.createdAt.lte = new Date(fechaFin);
    }

    if (clienteId) where.clienteId = clienteId;
    if (metodoPagoId) where.metodoPagoId = metodoPagoId;
    if (estado) where.estado = estado;

    const [ventas, total] = await Promise.all([
      prisma.venta.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
            },
          },
          metodoPago: {
            select: {
              id: true,
              nombre: true,
            },
          },
          items: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
      }),
      prisma.venta.count({ where }),
    ]);

    return {
      ventas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerVentaPorId(id: number) {
    const venta = await prisma.venta.findUnique({
      where: { id },
      include: {
        cliente: true,
        metodoPago: true,
        items: {
          include: {
            producto: {
              include: {
                ingredientes: {
                  include: {
                    ingrediente: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!venta) {
      throw new AppError('Venta no encontrada', 404);
    }

    return venta;
  }

  async anularVenta(id: number) {
    const venta = await prisma.venta.findUnique({
      where: { id },
    });

    if (!venta) {
      throw new AppError('Venta no encontrada', 404);
    }

    if (venta.estado === 'cancelado') {
      throw new AppError('La venta ya está cancelada', 400);
    }

    return await prisma.venta.update({
      where: { id },
      data: { estado: 'cancelado' },
      include: {
        cliente: true,
        metodoPago: true,
        items: {
          include: {
            producto: true,
          },
        },
      },
    });
  }

  async crearMultiplesVentas(ventas: CreateVentaInput[]) {
    const resultados = {
      exitosas: [] as any[],
      fallidas: [] as any[],
    };

    for (const ventaData of ventas) {
      try {
        const venta = await this.crearVenta(ventaData);
        resultados.exitosas.push(venta);
      } catch (error: any) {
        resultados.fallidas.push({
          data: ventaData,
          error: error.message,
        });
      }
    }

    return resultados;
  }
}

export default new VentaService();
