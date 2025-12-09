import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CreateIngredienteInput, CreateMultipleIngredientesInput, UpdateIngredienteInput } from '../utils/validations/ingredienteValidation';

class IngredienteService {
  async crearIngrediente(data: CreateIngredienteInput) {
    const ingredienteExiste = await prisma.ingrediente.findUnique({
      where: { nombre: data.nombre },
    });

    if (ingredienteExiste) {
      throw new AppError('Ya existe un ingrediente con ese nombre', 400);
    }

    return await prisma.ingrediente.create({
      data,
    });
  }

  async crearMultiplesIngredientes(ingredientes: CreateMultipleIngredientesInput) {
    const nombres = ingredientes.map(i => i.nombre);
    const ingredientesExistentes = await prisma.ingrediente.findMany({
      where: { nombre: { in: nombres } },
      select: { nombre: true },
    });

    if (ingredientesExistentes.length > 0) {
      const nombresExistentes = ingredientesExistentes.map(i => i.nombre).join(', ');
      throw new AppError(`Los siguientes ingredientes ya están registrados: ${nombresExistentes}`, 400);
    }

    await prisma.ingrediente.createMany({
      data: ingredientes,
      skipDuplicates: true,
    });

    return await prisma.ingrediente.findMany({
      where: { nombre: { in: nombres } },
    });
  }

  async listarIngredientes(page: number = 1, limit: number = 10, orderBy: string = 'nombre') {
    const skip = (page - 1) * limit;
    
    const orderByMap: Record<string, any> = {
      nombre: { nombre: 'asc' },
      costo: { costoUnitario: 'desc' },
    };

    const [ingredientes, total] = await Promise.all([
      prisma.ingrediente.findMany({
        skip,
        take: limit,
        orderBy: orderByMap[orderBy] || { nombre: 'asc' },
        include: {
          _count: {
            select: {
              productos: true,
            },
          },
        },
      }),
      prisma.ingrediente.count(),
    ]);

    return {
      ingredientes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerIngredientePorId(id: number) {
    const ingrediente = await prisma.ingrediente.findUnique({
      where: { id },
      include: {
        productos: {
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
      },
    });

    if (!ingrediente) {
      throw new AppError('Ingrediente no encontrado', 404);
    }

    return ingrediente;
  }

  async actualizarIngrediente(id: number, data: UpdateIngredienteInput) {
    const ingrediente = await prisma.ingrediente.findUnique({
      where: { id },
    });

    if (!ingrediente) {
      throw new AppError('Ingrediente no encontrado', 404);
    }

    if (data.nombre && data.nombre !== ingrediente.nombre) {
      const nombreExiste = await prisma.ingrediente.findUnique({
        where: { nombre: data.nombre },
      });

      if (nombreExiste) {
        throw new AppError('El nombre ya está en uso', 400);
      }
    }

    return await prisma.ingrediente.update({
      where: { id },
      data,
    });
  }



  async eliminarIngrediente(id: number) {
    const ingrediente = await prisma.ingrediente.findUnique({
      where: { id },
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });

    if (!ingrediente) {
      throw new AppError('Ingrediente no encontrado', 404);
    }

    if (ingrediente._count.productos > 0) {
      throw new AppError(
        'No se puede eliminar un ingrediente asignado a productos',
        400
      );
    }

    await prisma.ingrediente.delete({
      where: { id },
    });

    return { message: 'Ingrediente eliminado exitosamente' };
  }
}

export default new IngredienteService();
