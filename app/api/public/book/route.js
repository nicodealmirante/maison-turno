import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));

  const {
    category,
    type,
    serviceId,
    packageId,
    professionalId,
    startISO,
    customerName,
    phone,
    email
  } = body || {};

  if (!category || !type || !professionalId || !startISO || !customerName || !phone) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const startAt = new Date(startISO);
  if (Number.isNaN(+startAt)) return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });

  const item =
    type === "package"
      ? await prisma.package.findUnique({ where: { id: packageId } })
      : await prisma.service.findUnique({ where: { id: serviceId } });

  if (!item) return NextResponse.json({ error: "Servicio/paquete inválido" }, { status: 400 });

  const durationMin = item.durationMin;
  const endAt = new Date(startAt.getTime() + durationMin * 60 * 1000);

  // evitar choque
  const overlap = await prisma.booking.findFirst({
    where: {
      professionalId,
      status: { in: ["confirmed", "pending"] },
      OR: [
        { startAt: { lt: endAt }, endAt: { gt: startAt } }
      ]
    }
  });
  if (overlap) return NextResponse.json({ error: "Horario ocupado" }, { status: 409 });

  const booking = await prisma.booking.create({
    data: {
      status: "confirmed",
      category,
      serviceId: type === "service" ? serviceId : null,
      packageId: type === "package" ? packageId : null,
      professionalId,
      customerName,
      phone,
      email: email || null,
      startAt,
      endAt,
      price: item.price
    },
    include: {
      professional: true,
      service: true,
      package: true
    }
  });

  return NextResponse.json({
    booking: {
      id: booking.id,
      customerName: booking.customerName,
      startAt: booking.startAt,
      itemName: booking.service?.name || booking.package?.name,
      price: booking.price
    }
  });
}
