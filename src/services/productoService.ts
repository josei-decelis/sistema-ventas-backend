import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { CreateProductoInput, CreateMultipleProductosInput, UpdateProductoInput, IngredienteItem } from '../utils/validations/productoValidation';

class ProductoService {
  async crearProducto(data: CreateProductoInput) {
    const { ingredientes, ...productoData } = data;

    return await prisma.$transaction(async (tx) => {
      const producto = await tx.producto.create({
        data: productoData,
      });

      if (ingredientes && ingredientes.length > 0) {
        await tx.productoIngrediente.createMany({
          data: ingredientes.map((ing) => ({
            productoId: producto.id,
            ingredienteId: ing.ingredienteId,
            cantidad: ing.cantidad,
          })),
        });
      }

      return await tx.producto.findUnique({
        where: { id: producto.id },
        include: {
          ingredientes: {
            include: {
              ingrediente: true,
            },
          },
        },
      });
    });
  }

  async crearMultiplesProductos(productos: CreateMultipleProductosInput) {
    const results = [];
    
    for (const productoData of productos) {
      const { ingredientes, ...data } = productoData;
      
      const producto = await prisma.producto.create({
        data,
        include: {
          ingredientes: {
            include: {
              ingrediente: true,
            },
          },
        },
      });
      
      if (ingredientes && ingredientes.length > 0) {
        await prisma.productoIngrediente.createMany({
          data: ingredientes.map((ing) => ({
            productoId: producto.id,
            ingredienteId: ing.ingredienteId,
            cantidad: ing.cantidad,
          })),
        });
      }
      
      results.push(producto);
    }
    
    return results;
  }

  async listarProductos(page: number = 1, limit: number = 10, activo?: string) {
    const skip = (page - 1) * limit;
    
    const where = activo !== undefined ? { activo: activo === 'true' } : {};

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        include: {
          ingredientes: {
            include: {
              ingrediente: true,
            },
          },
        },
      }),
      prisma.producto.count({ where }),
    ]);

    return {
      productos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerProductoPorId(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        ingredientes: {
          include: {
            ingrediente: true,
          },
        },
      },
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    return producto;
  }

  async actualizarProducto(id: number, data: UpdateProductoInput) {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    return await prisma.producto.update({
      where: { id },
      data,
    });
  }

  async asignarIngredientes(id: number, ingredientes: IngredienteItem[]) {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    // Verificar que todos los ingredientes existen
    const ingredienteIds = ingredientes.map((ing) => ing.ingredienteId);
    const ingredientesExisten = await prisma.ingrediente.findMany({
      where: { id: { in: ingredienteIds } },
    });

    if (ingredientesExisten.length !== ingredienteIds.length) {
      throw new AppError('Uno o más ingredientes no existen', 400);
    }

    return await prisma.$transaction(async (tx) => {
      // Eliminar ingredientes anteriores
      await tx.productoIngrediente.deleteMany({
        where: { productoId: id },
      });

      // Crear nuevos ingredientes
      await tx.productoIngrediente.createMany({
        data: ingredientes.map((ing) => ({
          productoId: id,
          ingredienteId: ing.ingredienteId,
          cantidad: ing.cantidad,
        })),
      });

      return await tx.producto.findUnique({
        where: { id },
        include: {
          ingredientes: {
            include: {
              ingrediente: true,
            },
          },
        },
      });
    });
  }

  async modificarIngredientes(id: number, ingredientes: IngredienteItem[]) {
    return await this.asignarIngredientes(id, ingredientes);
  }

  async obtenerCostoEstimado(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        ingredientes: {
          include: {
            ingrediente: true,
          },
        },
      },
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    const costoTotal = producto.ingredientes.reduce((total, pi) => {
      return total + (pi.cantidad * pi.ingrediente.costoUnitario);
    }, 0);

    const margenGanancia = producto.precioBase - costoTotal;
    const porcentajeMargen = producto.precioBase > 0 
      ? ((margenGanancia / producto.precioBase) * 100).toFixed(2) 
      : '0.00';

    return {
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precioBase: producto.precioBase,
      },
      costoEstimado: costoTotal,
      margenGanancia,
      porcentajeMargen: parseFloat(porcentajeMargen),
      ingredientes: producto.ingredientes.map((pi) => ({
        nombre: pi.ingrediente.nombre,
        cantidad: pi.cantidad,
        costoUnitario: pi.ingrediente.costoUnitario,
        costoTotal: pi.cantidad * pi.ingrediente.costoUnitario,
      })),
    };
  }

  async eliminarProducto(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        _count: {
          select: { ventaItems: true },
        },
      },
    });

    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (producto._count.ventaItems > 0) {
      throw new AppError(
        'No se puede eliminar un producto con ventas registradas',
        400
      );
    }

    await prisma.producto.delete({
      where: { id },
    });

    return { message: 'Producto eliminado exitosamente' };
  }
}

export default new ProductoService();
