import prisma from '../prisma/client';

class DashboardService {
  async obtenerEstadisticas(fechaInicio?: string, fechaFin?: string) {
    const where: any = {
      OR: [
        { estado: 'completado' },
        { estado: 'completada' },
        { estado: 'Completada' },
      ],
    };

    if (fechaInicio || fechaFin) {
      where.createdAt = {};
      if (fechaInicio) where.createdAt.gte = new Date(fechaInicio);
      if (fechaFin) where.createdAt.lte = new Date(fechaFin);
    }

    // Ventas del mes (usa el filtro de fecha si existe, sino el mes actual)
    let whereVentasMes: any = {
      OR: [
        { estado: 'completado' },
        { estado: 'completada' },
        { estado: 'Completada' },
      ],
    };

    if (fechaInicio && fechaFin) {
      // Si hay filtro de fecha, usar ese período
      whereVentasMes.createdAt = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    } else {
      // Si no hay filtro, usar el mes actual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      whereVentasMes.createdAt = {
        gte: inicioMes,
      };
    }

    const ventasMes = await prisma.venta.aggregate({
      where: whereVentasMes,
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Ventas de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const ventasHoy = await prisma.venta.aggregate({
      where: {
        AND: [
          {
            OR: [
              { estado: 'completado' },
              { estado: 'completada' },
              { estado: 'Completada' },
            ],
          },
          {
            createdAt: {
              gte: hoy,
              lt: manana,
            },
          },
        ],
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Ventas del mismo día hace un mes
    const haceUnMes = new Date(hoy);
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    const mananaHaceUnMes = new Date(haceUnMes);
    mananaHaceUnMes.setDate(mananaHaceUnMes.getDate() + 1);

    const ventasHaceUnMes = await prisma.venta.aggregate({
      where: {
        AND: [
          {
            OR: [
              { estado: 'completado' },
              { estado: 'completada' },
              { estado: 'Completada' },
            ],
          },
          {
            createdAt: {
              gte: haceUnMes,
              lt: mananaHaceUnMes,
            },
          },
        ],
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Ventas del mes anterior (para comparación)
    const mesAnterior = new Date();
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    mesAnterior.setDate(1);
    mesAnterior.setHours(0, 0, 0, 0);
    const finMesAnterior = new Date(mesAnterior);
    finMesAnterior.setMonth(finMesAnterior.getMonth() + 1);
    finMesAnterior.setDate(0);
    finMesAnterior.setHours(23, 59, 59, 999);

    const ventasMesAnterior = await prisma.venta.aggregate({
      where: {
        OR: [
          { estado: 'completado' },
          { estado: 'completada' },
          { estado: 'Completada' },
        ],
        createdAt: {
          gte: mesAnterior,
          lte: finMesAnterior,
        },
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Total de clientes
    const totalClientes = await prisma.cliente.count();

    // Total de ventas (para mantener compatibilidad)
    const totalVentas = await prisma.venta.aggregate({
      where,
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Ventas por día
    const ventasPorDia = await prisma.venta.groupBy({
      by: ['createdAt'],
      where,
      _sum: {
        total: true,
      },
      _count: true,
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });

    // Producto más vendido
    const productosMasVendidos = await prisma.ventaItem.groupBy({
      by: ['productoId'],
      where: {
        venta: where,
      },
      _sum: {
        cantidad: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          cantidad: 'desc',
        },
      },
      take: 10,
    });

    const productosConInfo = await Promise.all(
      productosMasVendidos.map(async (item) => {
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId },
          select: { id: true, nombre: true, precioBase: true },
        });
        return {
          producto,
          cantidadVendida: item._sum.cantidad,
          totalGenerado: item._sum.subtotal,
        };
      })
    );

    // Cliente más frecuente
    const clientesMasFrecuentes = await prisma.venta.groupBy({
      by: ['clienteId'],
      where,
      _count: true,
      _sum: {
        total: true,
      },
      orderBy: {
        _count: {
          clienteId: 'desc',
        },
      },
      take: 10,
    });

    const clientesConInfo = await Promise.all(
      clientesMasFrecuentes.map(async (item) => {
        const cliente = await prisma.cliente.findUnique({
          where: { id: item.clienteId },
          select: { id: true, nombre: true, telefono: true },
        });
        return {
          cliente,
          cantidadCompras: item._count,
          totalGastado: item._sum.total,
        };
      })
    );

    // Ventas por método de pago
    const ventasPorMetodoPago = await prisma.venta.groupBy({
      by: ['metodoPagoId'],
      where,
      _count: true,
      _sum: {
        total: true,
      },
    });

    const metodosPagoConInfo = await Promise.all(
      ventasPorMetodoPago.map(async (item) => {
        const metodoPago = await prisma.metodoPago.findUnique({
          where: { id: item.metodoPagoId },
          select: { id: true, nombre: true },
        });
        return {
          metodoPago,
          cantidadVentas: item._count,
          totalGenerado: item._sum.total,
        };
      })
    );

    // Calcular diferencia porcentual día vs hace un mes
    const totalHoy = ventasHoy._sum.total || 0;
    const totalHaceUnMes = ventasHaceUnMes._sum.total || 0;
    let diferenciaPorcentualDia = 0;
    
    if (totalHaceUnMes > 0) {
      diferenciaPorcentualDia = ((totalHoy - totalHaceUnMes) / totalHaceUnMes) * 100;
    } else if (totalHoy > 0) {
      diferenciaPorcentualDia = 100; // 100% de incremento si antes era 0
    }

    // Calcular diferencia porcentual mes vs mes anterior
    const totalMes = ventasMes._sum.total || 0;
    const totalMesAnterior = ventasMesAnterior._sum.total || 0;
    let diferenciaPorcentualMes = 0;
    
    if (totalMesAnterior > 0) {
      diferenciaPorcentualMes = ((totalMes - totalMesAnterior) / totalMesAnterior) * 100;
    } else if (totalMes > 0) {
      diferenciaPorcentualMes = 100;
    }

    return {
      resumen: {
        ventasMes: totalMes,
        cantidadVentasMes: ventasMes._count,
        ventasMesAnterior: totalMesAnterior,
        diferenciaVsMesAnterior: Math.round(diferenciaPorcentualMes * 10) / 10,
        ventasHoy: totalHoy,
        cantidadVentasHoy: ventasHoy._count,
        ventasHoyHaceUnMes: totalHaceUnMes,
        diferenciaVsHaceUnMes: Math.round(diferenciaPorcentualDia * 10) / 10, // Redondear a 1 decimal
        totalClientes,
        totalVentas: totalVentas._sum.total || 0,
        cantidadVentas: totalVentas._count,
        promedioVenta: totalVentas._count > 0 
          ? (totalVentas._sum.total || 0) / totalVentas._count 
          : 0,
      },
      ventasPorDia: ventasPorDia.map(v => ({
        fecha: v.createdAt,
        total: v._sum.total,
        cantidad: v._count,
      })),
      productosMasVendidos: productosConInfo,
      clientesMasFrecuentes: clientesConInfo,
      ventasPorMetodoPago: metodosPagoConInfo,
    };
  }

  async obtenerVentasDelDia() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const ventas = await prisma.venta.findMany({
      where: {
        AND: [
          {
            createdAt: {
              gte: hoy,
              lt: manana,
            },
          },
          {
            OR: [
              { estado: 'completado' },
              { estado: 'completada' },
              { estado: 'Completada' },
            ],
          },
        ],
      },
      include: {
        cliente: {
          select: {
            nombre: true,
            telefono: true,
          },
        },
        metodoPago: {
          select: {
            nombre: true,
          },
        },
        items: {
          include: {
            producto: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalDelDia = ventas.reduce((sum, venta) => sum + venta.total, 0);

    return {
      fecha: hoy,
      cantidadVentas: ventas.length,
      totalDelDia,
      ventas,
    };
  }

  async obtenerVentasPorMes(cantidadMeses: number = 6) {
    const meses = [];
    const ahora = new Date();
    
    for (let i = cantidadMeses - 1; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);
      
      const ventas = await prisma.venta.findMany({
        where: {
          OR: [
            { estado: 'completado' },
            { estado: 'completada' },
            { estado: 'Completada' },
          ],
          createdAt: {
            gte: inicioMes,
            lte: finMes,
          },
        },
        select: {
          total: true,
        },
      });

      const cantidadVentas = ventas.length;
      const montoTotal = ventas.reduce((sum, venta) => sum + venta.total, 0);
      
      meses.push({
        mes: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        mesCompleto: fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        cantidadVentas,
        montoTotal: Math.round(montoTotal),
      });
    }
    
    return meses;
  }
}

export default new DashboardService();
