import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));

  const { name, description, durationMin, price, listPrice, active } = body || {};

  const service = await prisma.service.update({
    where: { id: params.id },
    data: {
      name: name ?? undefined,
      description: description === undefined ? undefined : (description || null),
      durationMin: durationMin === undefined ? undefined : parseInt(durationMin, 10),
      price: price === undefined ? undefined : parseInt(price, 10),
      listPrice: listPrice === undefined ? undefined : (listPrice ? parseInt(listPrice, 10) : null),
      active: active === undefined ? undefined : !!active
    }
  });

  return NextResponse.json({ service });
}

export async function DELETE(req, { params }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
