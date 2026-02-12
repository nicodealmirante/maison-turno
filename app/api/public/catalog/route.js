import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [services, packages, professionals] = await Promise.all([
    prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.package.findMany({ orderBy: [{ createdAt: "desc" }], include: { items: { include: { service: true } } } }),
    prisma.professional.findMany({ orderBy: [{ name: "asc" }] })
  ]);

  return NextResponse.json({ services, packages, professionals });
}
