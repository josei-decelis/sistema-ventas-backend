import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CreateClienteInput, CreateMultipleClientesInput, UpdateClienteInput } from '../utils/validations/clienteValidation';

class ClienteService {
  async crearCliente(data: CreateClienteInput) {
    const clienteExiste = await prisma.cliente.findUnique({
      where: { telefono: data.telefono },
    });

    if (clienteExiste) {
      throw new AppError('Ya existe un cliente con ese teléfono', 400);
    }

    return await prisma.cliente.create({
      data,
    });
  }

  async crearMultiplesClientes(clientes: CreateMultipleClientesInput) {
    const telefonos = clientes.map(c => c.telefono);
    const clientesExistentes = await prisma.cliente.findMany({
      where: { telefono: { in: telefonos } },
      select: { telefono: true },
    });

    if (clientesExistentes.length > 0) {
      const telefonosExistentes = clientesExistentes.map(c => c.telefono).join(', ');
      throw new AppError(`Los siguientes teléfonos ya están registrados: ${telefonosExistentes}`, 400);
    }

    await prisma.cliente.createMany({
      data: clientes,
      skipDuplicates: true,
    });

    return await prisma.cliente.findMany({
      where: { telefono: { in: telefonos } },
    });
  }

  async listarClientes(page: number = 1, limit: number = 10, buscar: string = '') {
    const skip = (page - 1) * limit;
    
    const where = buscar
      ? {
          OR: [
            { nombre: { contains: buscar, mode: 'insensitive' as const } },
            { telefono: { contains: buscar } },
            { direccion: { contains: buscar, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          _count: {
            select: { ventas: true },
          },
        },
      }),
      prisma.cliente.count({ where }),
    ]);

    return {
      clientes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerClientePorId(id: number) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        ventas: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { ventas: true },
        },
      },
    });

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    return cliente;
  }

  async buscarCliente(termino: string) {
    return await prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { contains: termino, mode: 'insensitive' } },
          { telefono: { contains: termino } },
          { direccion: { contains: termino, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });
  }

  async actualizarCliente(id: number, data: UpdateClienteInput) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    if (data.telefono && data.telefono !== cliente.telefono) {
      const telefonoExiste = await prisma.cliente.findUnique({
        where: { telefono: data.telefono },
      });

      if (telefonoExiste) {
        throw new AppError('El teléfono ya está en uso', 400);
      }
    }

    return await prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async eliminarCliente(id: number) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        _count: {
          select: { ventas: true },
        },
      },
    });

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    if (cliente._count.ventas > 0) {
      throw new AppError(
        'No se puede eliminar un cliente con ventas registradas',
        400
      );
    }

    await prisma.cliente.delete({
      where: { id },
    });

    return { message: 'Cliente eliminado exitosamente' };
  }

  async obtenerHistorialVentas(clienteId: number) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      throw new AppError('Cliente no encontrado', 404);
    }

    const ventas = await prisma.venta.findMany({
      where: { clienteId },
      include: {
        items: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                precioBase: true,
              },
            },
          },
        },
        metodoPago: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const estadisticas = await prisma.venta.aggregate({
      where: { 
        clienteId,
        estado: 'Completada',
      },
      _sum: {
        total: true,
      },
      _count: true,
      _avg: {
        total: true,
      },
    });

    return {
      cliente,
      ventas,
      estadisticas: {
        totalGastado: estadisticas._sum.total || 0,
        cantidadCompras: estadisticas._count,
        ticketPromedio: estadisticas._avg.total || 0,
      },
    };
  }
}

export default new ClienteService();
