import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));

  const { name, bio, categories, active } = body || {};

  const professional = await prisma.professional.update({
    where: { id: params.id },
    data: {
      name: name ?? undefined,
      bio: bio === undefined ? undefined : (bio || null),
      categories: categories === undefined ? undefined : categories,
      active: active === undefined ? undefined : !!active
    }
  });

  return NextResponse.json({ professional });
}

export async function DELETE(req, { params }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await prisma.professional.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
