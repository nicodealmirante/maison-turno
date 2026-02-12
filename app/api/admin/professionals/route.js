import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json().catch(() => ({}));

  const { name, bio, categories, active } = body || {};
  if (!name || !Array.isArray(categories) || categories.length === 0) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const professional = await prisma.professional.create({
    data: {
      name,
      bio: bio || null,
      categories,
      active: active !== false
    }
  });

  return NextResponse.json({ professional });
}
