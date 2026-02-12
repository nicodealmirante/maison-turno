import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));

  const { name, category, description, durationMin, price, listPrice, active } = body || {};
  if (!name || !category || !durationMin || !price) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name,
      category,
      description: description || null,
      durationMin: parseInt(durationMin, 10),
      price: parseInt(price, 10),
      listPrice: listPrice ? parseInt(listPrice, 10) : null,
      active: active !== false
    }
  });

  return NextResponse.json({ service });
}
