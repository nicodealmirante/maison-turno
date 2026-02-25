"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, GhostButton } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";

const CATEGORIES = [
  { id: "barberia", label: "Barbería" },
  { id: "manicuria", label: "Manicuría" }
];

function money(n) {
  return new Intl.NumberFormat("es-AR").format(n || 0);
}

function toDateISO(d) {
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function toLocalTimeLabel(iso) {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function BookingWizard() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  const [category, setCategory] = useState("barberia");
  const [type, setType] = useState("service");
  const [serviceId, setServiceId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [date, setDate] = useState(toDateISO(new Date()));
  const [slots, setSlots] = useState([]);
  const [startISO, setStartISO] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      try {
        setLoading(true);
        const res = await fetch("/api/public/catalog", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;

        setServices(data.services || []);
        setPackages(data.packages || []);
        setProfessionals(data.professionals || []);
      } catch {
        if (!cancelled) setError("No pudimos cargar el catálogo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredServices = useMemo(
    () => services.filter((s) => s.active && s.category === category),
    [services, category]
  );
  const filteredPackages = useMemo(
    () => packages.filter((p) => p.active && (!p.category || p.category === category)),
    [packages, category]
  );
  const filteredProfessionals = useMemo(
    () => professionals.filter((p) => p.active && (p.categories || []).includes(category)),
    [professionals, category]
  );

  useEffect(() => {
    if (type === "service") {
      setServiceId(filteredServices[0]?.id || "");
    } else {
      setPackageId(filteredPackages[0]?.id || "");
    }
    setStartISO("");
    setSlots([]);
  }, [type, category, filteredServices, filteredPackages]);

  useEffect(() => {
    setProfessionalId(filteredProfessionals[0]?.id || "");
    setStartISO("");
    setSlots([]);
  }, [category, filteredProfessionals]);

  const selectedItem = useMemo(() => {
    if (type === "service") return filteredServices.find((s) => s.id === serviceId) || null;
    return filteredPackages.find((p) => p.id === packageId) || null;
  }, [type, serviceId, packageId, filteredServices, filteredPackages]);

  async function loadSlots() {
    if (!professionalId || !selectedItem || !date) return;
    setError("");
    setStartISO("");
    try {
      const qs = new URLSearchParams({
        professionalId,
        date,
        durationMin: String(selectedItem.durationMin)
      });
      const res = await fetch(`/api/public/slots?${qs.toString()}`, { cache: "no-store" });
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setError("No pudimos cargar horarios.");
    }
  }

  async function submitBooking(e) {
    e.preventDefault();
    if (!selectedItem || !professionalId || !startISO) return;

    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        category,
        type,
        serviceId: type === "service" ? serviceId : undefined,
        packageId: type === "package" ? packageId : undefined,
        professionalId,
        startISO,
        customerName,
        phone,
        email
      };

      const res = await fetch("/api/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo confirmar el turno.");
      } else {
        setResult(data.booking);
      }
    } catch {
      setError("Error inesperado al confirmar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mt-8 p-5 sm:p-6">
      <h2 className="text-xl font-semibold">Reservá en 5 pasos</h2>
      <p className="mt-1 text-sm text-slate-500">Elegí servicio, profesional, horario y tus datos.</p>

      {loading ? <div className="mt-4 text-slate-500">Cargando catálogo...</div> : null}
      {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <form className="mt-6 space-y-6" onSubmit={submitBooking}>
        <section>
          <div className="text-sm font-medium">1) Rubro</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={
                  "rounded-xl border px-3 py-2 text-sm " +
                  (category === c.id ? "border-black bg-black text-white" : "border-slate-200 bg-white")
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="text-sm font-medium">2) ¿Qué querés reservar?</div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setType("service")}
              className={"rounded-xl border px-3 py-2 text-sm " + (type === "service" ? "bg-black text-white" : "bg-white")}
            >
              Servicio
            </button>
            <button
              type="button"
              onClick={() => setType("package")}
              className={"rounded-xl border px-3 py-2 text-sm " + (type === "package" ? "bg-black text-white" : "bg-white")}
            >
              Paquete
            </button>
          </div>

          {type === "service" ? (
            <select className="mt-3 w-full rounded-xl border px-3 py-2" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {filteredServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.durationMin} min · ${money(s.price)}
                </option>
              ))}
            </select>
          ) : (
            <select className="mt-3 w-full rounded-xl border px-3 py-2" value={packageId} onChange={(e) => setPackageId(e.target.value)}>
              {filteredPackages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.durationMin} min · ${money(p.price)}
                </option>
              ))}
            </select>
          )}
        </section>

        <section>
          <div className="text-sm font-medium">3) Profesional y fecha</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <select className="w-full rounded-xl border px-3 py-2" value={professionalId} onChange={(e) => setProfessionalId(e.target.value)}>
              {filteredProfessionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={toDateISO(new Date())} />
          </div>
          <div className="mt-3">
            <GhostButton type="button" onClick={loadSlots} disabled={!selectedItem || !professionalId || !date}>
              Ver horarios
            </GhostButton>
          </div>
        </section>

        <section>
          <div className="text-sm font-medium">4) Elegí horario</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {slots.map((iso) => (
              <button
                key={iso}
                type="button"
                onClick={() => setStartISO(iso)}
                className={
                  "rounded-xl border px-3 py-2 text-sm " +
                  (startISO === iso ? "border-orange-600 bg-orange-50 text-orange-700" : "border-slate-200 bg-white")
                }
              >
                {toLocalTimeLabel(iso)}
              </button>
            ))}
            {slots.length === 0 ? <div className="text-sm text-slate-500">Sin horarios cargados todavía.</div> : null}
          </div>
        </section>

        <section>
          <div className="text-sm font-medium">5) Tus datos</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Input required placeholder="Nombre y apellido" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <Input required placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input className="sm:col-span-2" type="email" placeholder="Email (opcional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </section>

        <div className="rounded-2xl border bg-slate-50 p-4 text-sm">
          <div className="font-medium">Resumen</div>
          <div className="mt-1 text-slate-600">{selectedItem?.name || "—"} · {selectedItem?.durationMin || "—"} min</div>
          <div className="text-slate-600">Total: <span className="font-semibold text-orange-700">${money(selectedItem?.price)}</span></div>
          <div className="text-slate-600">Horario: {startISO ? new Date(startISO).toLocaleString("es-AR") : "Sin seleccionar"}</div>
        </div>

        <Button type="submit" disabled={submitting || !startISO || !selectedItem || !professionalId}>
          {submitting ? "Confirmando..." : "Confirmar turno"}
        </Button>
      </form>

      {result ? (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          ¡Turno confirmado para {result.customerName}! Código: <b>{result.id}</b>
        </div>
      ) : null}
    </Card>
  );
}
