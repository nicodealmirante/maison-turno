import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.service.count();
  if (existing > 0) {
    console.log("Seed: ya hay datos, salteo.");
    return;
  }

  // BARBERÍA (según lo que pediste)
  const [corte, barba, corteBarba] = await prisma.$transaction([
    prisma.service.create({ data: { category: "barberia", name: "Corte de pelo", durationMin: 30, price: 20000 } }),
    prisma.service.create({ data: { category: "barberia", name: "Barba", durationMin: 20, price: 10000 } }),
    prisma.service.create({ data: { category: "barberia", name: "Corte + Barba", durationMin: 45, price: 27000 } })
  ]);

  // MANOS (efectivo / lista)
  const manos = await prisma.$transaction([
    prisma.service.create({ data: { category: "manicuria", name: "Esculpidas en gel", durationMin: 90, price: 27000, listPrice: 29500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Service", durationMin: 60, price: 25000, listPrice: 27500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Kapping gel", durationMin: 70, price: 24000, listPrice: 26500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Esmaltado Semi", durationMin: 45, price: 19000, listPrice: 21000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Esmaltado Semi OPI", durationMin: 45, price: 23000, listPrice: 25000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Retiro + Tratamiento fortalecedor OPI", durationMin: 30, price: 16000, listPrice: 18000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Retiro Acrilico / Polygel", durationMin: 20, price: 6000, listPrice: 8000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Esmalte OPI (adicional)", durationMin: 10, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Baby Boomers (adicional)", durationMin: 15, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Esculpidas / Largo N3 (adicional)", durationMin: 10, price: 2000, listPrice: 3000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Deco French todas las uñas", durationMin: 15, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Deco Cat Eyes", durationMin: 15, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Deco polvo (todas las uñas)", durationMin: 15, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Deco simple (todas las uñas)", durationMin: 20, price: 8000, listPrice: 9000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Caricatura (por uña)", durationMin: 10, price: 1500, listPrice: 2000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Deco (por uña)", durationMin: 10, price: 1000, listPrice: 1200 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Dijes / Apliques desde", durationMin: 10, price: 1500, listPrice: 2000 } })
  ]);

  // PIES
  await prisma.$transaction([
    prisma.service.create({ data: { category: "manicuria", name: "Pedicuría clínica (Esmaltado semi)", durationMin: 60, price: 26000, listPrice: 28500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Pedicuría sin esmalte", durationMin: 45, price: 25000, listPrice: 27500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Belleza de pies OPI (incluye esmaltado semi OPI)", durationMin: 60, price: 25000, listPrice: 27500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Belleza de pies (incluye esmalte semi)", durationMin: 55, price: 23000, listPrice: 25000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Pedicuría masculina", durationMin: 60, price: 26000, listPrice: 28500 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Jelly Spa (adicional)", durationMin: 10, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Baño de parafina (adicional)", durationMin: 10, price: 4000, listPrice: 5000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Masajes con aceites esenciales 10 min", durationMin: 10, price: 3000, listPrice: 4000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Envoltura con film osmótico", durationMin: 10, price: 3000, listPrice: 4000 } }),
    prisma.service.create({ data: { category: "manicuria", name: "Reflexología + aparatología 30 min", durationMin: 30, price: 15000, listPrice: 16500 } })
  ]);

  // Paquetes demo (como en tu screen)
  const semi = manos.find(s => s.name === "Esmaltado Semi");
  if (semi) {
    await prisma.package.create({
      data: {
        category: "manicuria",
        name: "Duo Manicuría",
        description: "2 servicios con descuento - perfecto para ir acompañada",
        durationMin: semi.durationMin * 2,
        price: semi.price * 2 - 1500,
        originalPrice: semi.price * 2,
        discountPct: 19,
        items: { create: [{ serviceId: semi.id, qty: 2 }] }
      }
    });
  }

  await prisma.package.create({
    data: {
      name: "Pack Familia Completo",
      description: "2 cortes + 2 semi - día de spa familiar",
      durationMin: 140,
      price: 2 * 20000 + 2 * 19000 - 4000,
      originalPrice: 2 * 20000 + 2 * 19000,
      discountPct: 22,
      items: { create: [{ serviceId: corte.id, qty: 2 }, { serviceId: semi?.id, qty: 2 }] }
    }
  });

  // Profesionales demo + disponibilidad
  await prisma.professional.create({
    data: {
      name: "Camila Rodríguez",
      bio: "Nail artist con técnicas de última generación",
      categories: ["manicuria"],
      availability: {
        create: [
          { weekday: 1, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 2, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 3, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 4, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 5, startTime: "10:00", endTime: "19:00", slotMin: 30 }
        ]
      }
    }
  });

  await prisma.professional.create({
    data: {
      name: "Valentina Sosa",
      bio: "Especialista en esculpidas y nail art",
      categories: ["manicuria"],
      availability: {
        create: [
          { weekday: 1, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 3, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 5, startTime: "10:00", endTime: "19:00", slotMin: 30 }
        ]
      }
    }
  });

  await prisma.professional.create({
    data: {
      name: "Bruno Barber",
      bio: "Fade, clásico y barba",
      categories: ["barberia"],
      availability: {
        create: [
          { weekday: 1, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 2, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 4, startTime: "10:00", endTime: "19:00", slotMin: 30 },
          { weekday: 6, startTime: "10:00", endTime: "14:00", slotMin: 30 }
        ]
      }
    }
  });

  console.log("Seed OK ✅");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
