import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Limpiando base de datos...');

  // Limpiar datos existentes
  await prisma.ventaItem.deleteMany();
  await prisma.venta.deleteMany();
  await prisma.productoIngrediente.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.ingrediente.deleteMany();
  await prisma.metodoPago.deleteMany();
  await prisma.cliente.deleteMany();

  // Resetear secuencias para que los IDs empiecen desde 1
  await prisma.$executeRaw`ALTER SEQUENCE clientes_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE ingredientes_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE metodos_pago_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE productos_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE productos_ingredientes_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE ventas_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE venta_items_id_seq RESTART WITH 1`;

  console.log('✅ Base de datos limpiada completamente');
  console.log('✅ Secuencias reseteadas - IDs empezarán desde 1');
  console.log('🎉 Base de datos lista para datos reales!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
