import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [services, packages, professionals, rules] = await Promise.all([
    prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.package.findMany({ orderBy: [{ createdAt: "desc" }] }),
    prisma.professional.findMany({ orderBy: [{ name: "asc" }] }),
    prisma.availabilityRule.findMany({ orderBy: [{ weekday: "asc" }, { startTime: "asc" }] })
  ]);

  return NextResponse.json({ services, packages, professionals, rules });
}
