import BottomNav from "../../components/BottomNav";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function money(n) {
  return new Intl.NumberFormat("es-AR").format(n);
}

export default async function TurnosPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startAt: "desc" },
    take: 50,
    include: { professional: true, service: true, package: true }
  });

  return (
    <main className="container-n">
      <h1 className="text-3xl font-bold">Turnos</h1>
      <p className="text-slate-500 mt-1">Últimos 50</p>

      <div className="mt-6 space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{b.customerName}</div>
                <div className="text-sm text-slate-600">{new Date(b.startAt).toLocaleString("es-AR")}</div>
                <div className="text-sm text-slate-600">{b.professional?.name}</div>
                <div className="text-xs text-slate-500 mt-1">{b.service?.name || b.package?.name}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-orange-600">${money(b.price)}</div>
                <div className="text-xs text-slate-400">{b.status}</div>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 ? <div className="text-slate-500">Todavía no hay turnos.</div> : null}
      </div>

      <BottomNav />
    </main>
  );
}
