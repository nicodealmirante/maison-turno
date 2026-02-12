import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { buildSlotsForDate } from "../../../../lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // YYYY-MM-DD
  const professionalId = searchParams.get("professionalId");
  const durationMin = parseInt(searchParams.get("durationMin") || "30", 10);

  if (!date || !professionalId || !durationMin) {
    return NextResponse.json({ slots: [] });
  }

  const day = new Date(date + "T00:00:00Z");
  const weekday = day.getUTCDay(); // ok for date-only

  const rules = await prisma.availabilityRule.findMany({
    where: { professionalId, weekday, active: true }
  });

  const bookings = await prisma.booking.findMany({
    where: {
      professionalId,
      status: { in: ["confirmed", "pending"] },
      startAt: { gte: new Date(date + "T00:00:00"), lt: new Date(date + "T23:59:59") }
    },
    select: { startAt: true, endAt: true }
  });

  const busyRanges = bookings.map((b) => ({ start: b.startAt, end: b.endAt }));

  const slots = rules.flatMap((rule) =>
    buildSlotsForDate({
      dateISO: date,
      rule,
      durationMin,
      busyRanges
    })
  );

  return NextResponse.json({ slots });
}
