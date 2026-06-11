import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123*", 12);

  await prisma.user.upsert({
    where: { email: "admin@peluqueria.com" },
    update: {},
    create: {
      name: "Peluquero Admin",
      email: "admin@peluqueria.com",
      phone: "3000000000",
      passwordHash: adminPasswordHash,
      role: "BARBER_ADMIN",
      mustChangePassword: true
    }
  });

  const clientPasswordHash = await bcrypt.hash("Cliente123*", 12);
  await prisma.user.upsert({
    where: { email: "cliente@demo.com" },
    update: {},
    create: {
      name: "Cliente Demo",
      email: "cliente@demo.com",
      phone: "3101234567",
      passwordHash: clientPasswordHash,
      role: "CLIENT"
    }
  });

  const services = [
    { name: "Corte clasico", description: "Corte tradicional con acabado limpio.", priceCents: 2500000, durationMinutes: 30 },
    { name: "Degradado", description: "Fade moderno con maquina y tijera.", priceCents: 3000000, durationMinutes: 45 },
    { name: "Barba", description: "Perfilado y arreglo de barba.", priceCents: 1500000, durationMinutes: 20 },
    { name: "Corte + barba", description: "Servicio completo de corte y barba.", priceCents: 4000000, durationMinutes: 60 }
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service
    });
  }

  for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
    const exists = await prisma.businessHour.findFirst({ where: { dayOfWeek } });
    if (!exists) {
      await prisma.businessHour.create({
        data: { dayOfWeek, opensAt: "09:00", closesAt: "19:00", isOpen: true }
      });
    }
  }

  const status = await prisma.barberStatus.findFirst();
  if (!status) {
    await prisma.barberStatus.create({
      data: { status: "AVAILABLE", manualOverride: false }
    });
  }

  const setting = await prisma.businessSetting.findFirst();
  if (!setting) {
    await prisma.businessSetting.create({
      data: {
        name: process.env.BUSINESS_NAME || "Peluqueria Urbana",
        address: process.env.BUSINESS_ADDRESS || "Calle 45 #12-34, Bogota",
        phone: "3000000000",
        instagram: "@peluqueriaurbana",
        latitude: Number(process.env.BUSINESS_LAT || 4.711),
        longitude: Number(process.env.BUSINESS_LNG || -74.0721)
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
