"use client";

import { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Input } from "../../components/Input";

const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

function money(n) {
  return new Intl.NumberFormat("es-AR").format(n);
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("ADMIN_TOKEN") || "";
}

export default function AdminPage() {
  const [tab, setTab] = useState("services");
  const [token, setToken] = useState(getToken());
  const [data, setData] = useState({ services: [], packages: [], professionals: [], rules: [] });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/overview", { headers: { "x-admin-token": token } });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "No autorizado");
      setData(d);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function saveToken() {
    localStorage.setItem("ADMIN_TOKEN", token);
    load();
  }

  async function api(path, method, body) {
    const r = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: body ? JSON.stringify(body) : undefined
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d?.error || "Error");
    return d;
  }

  async function addService() {
    const name = prompt("Nombre del servicio");
    if (!name) return;
    const category = prompt("Categoría (barberia/manicuria)", "manicuria") || "manicuria";
    const price = parseInt(prompt("Precio efectivo", "20000") || "0", 10);
    const listPriceStr = prompt("Precio lista (opcional)", "");
    const listPrice = listPriceStr ? parseInt(listPriceStr, 10) : null;
    const durationMin = parseInt(prompt("Duración (min)", "30") || "30", 10);
    await api("/api/admin/services", "POST", { name, category, price, listPrice, durationMin, active: true });
    load();
  }

  async function editService(s) {
    const name = prompt("Nombre", s.name) ?? s.name;
    const price = parseInt(prompt("Precio efectivo", String(s.price)) || String(s.price), 10);
    const listPriceStr = prompt("Precio lista (vacío = null)", s.listPrice ? String(s.listPrice) : "") ?? "";
    const listPrice = listPriceStr ? parseInt(listPriceStr, 10) : null;
    const durationMin = parseInt(prompt("Duración (min)", String(s.durationMin)) || String(s.durationMin), 10);
    const active = (prompt("Activo? (1=si / 0=no)", s.active ? "1" : "0") || "1") === "1";
    await api("/api/admin/services/" + s.id, "PUT", { name, price, listPrice, durationMin, active });
    load();
  }

  async function delService(s) {
    if (!confirm("Borrar " + s.name + "?")) return;
    await api("/api/admin/services/" + s.id, "DELETE");
    load();
  }

  async function addPro() {
    const name = prompt("Nombre del profesional");
    if (!name) return;
    const bio = prompt("Bio (opcional)", "") || "";
    const cats = prompt("Categorías (coma): barberia,manicuria", "manicuria") || "manicuria";
    const categories = cats.split(",").map((x) => x.trim()).filter(Boolean);
    await api("/api/admin/professionals", "POST", { name, bio, categories, active: true });
    load();
  }

  async function editPro(p) {
    const name = prompt("Nombre", p.name) ?? p.name;
    const bio = prompt("Bio", p.bio || "") ?? (p.bio || "");
    const cats = prompt("Categorías (coma)", (p.categories || []).join(",")) ?? (p.categories || []).join(",");
    const categories = cats.split(",").map((x) => x.trim()).filter(Boolean);
    const active = (prompt("Activo? (1=si / 0=no)", p.active ? "1" : "0") || "1") === "1";
    await api("/api/admin/professionals/" + p.id, "PUT", { name, bio, categories, active });
    load();
  }

  async function delPro(p) {
    if (!confirm("Borrar " + p.name + "?")) return;
    await api("/api/admin/professionals/" + p.id, "DELETE");
    load();
  }

  return (
    <main className="container-n">
      <h1 className="text-3xl font-bold">Administración</h1>

      <div className="mt-4">
        <Card className="p-4">
          <div className="text-sm font-medium mb-2">Admin token</div>
          <div className="flex gap-2">
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Pegá tu ADMIN_TOKEN" />
            <Button onClick={saveToken}>Entrar</Button>
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Se manda en header <code>x-admin-token</code>. Guardado en tu navegador.
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        <button onClick={() => setTab("services")} className={"px-3 py-2 rounded-xl border text-sm " + (tab === "services" ? "bg-white" : "bg-slate-50")}>
          Servicios
        </button>
        <button onClick={() => setTab("packages")} className={"px-3 py-2 rounded-xl border text-sm " + (tab === "packages" ? "bg-white" : "bg-slate-50")}>
          Paquetes
        </button>
        <button onClick={() => setTab("professionals")} className={"px-3 py-2 rounded-xl border text-sm " + (tab === "professionals" ? "bg-white" : "bg-slate-50")}>
          Profesionales
        </button>
        <button onClick={() => setTab("availability")} className={"px-3 py-2 rounded-xl border text-sm " + (tab === "availability" ? "bg-white" : "bg-slate-50")}>
          Disponibilidad
        </button>
      </div>

      {loading ? <div className="mt-4 text-slate-500">Cargando...</div> : null}

      {token && tab === "services" && (
        <div className="mt-4">
          <div className="flex justify-end">
            <Button onClick={addService}>+ Agregar</Button>
          </div>
          <div className="mt-4 space-y-3">
            {data.services.map((s) => (
              <div key={s.id} className="rounded-2xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    <span className="inline-block rounded-full border px-2 py-1 mr-2">{s.category}</span>
                    {s.durationMin} min <span className="mx-2">·</span> {s.active ? "activo" : "inactivo"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {s.listPrice ? <div className="text-xs line-through text-slate-400">{currency}{money(s.listPrice)}</div> : <div className="text-xs text-transparent">.</div>}
                    <div className="font-semibold text-orange-600">{currency}{money(s.price)}</div>
                  </div>
                  <button onClick={() => editService(s)} className="px-3 py-2 rounded-xl border">✏️</button>
                  <button onClick={() => delService(s)} className="px-3 py-2 rounded-xl border text-red-600">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {token && tab === "professionals" && (
        <div className="mt-4">
          <div className="flex justify-end">
            <Button onClick={addPro}>+ Agregar</Button>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.professionals.map((p) => (
              <div key={p.id} className="rounded-2xl border p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-500 mt-1">{p.bio || ""}</div>
                <div className="text-xs text-slate-500 mt-2">{(p.categories || []).join(", ")} · {p.active ? "activo" : "inactivo"}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => editPro(p)} className="px-3 py-2 rounded-xl border">✏️</button>
                  <button onClick={() => delPro(p)} className="px-3 py-2 rounded-xl border text-red-600">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {token && tab === "packages" && (
        <div className="mt-4 text-slate-500">
          Paquetes: vienen de seed (Duo Manicuría / Pack Familia). Si querés CRUD completo, se agrega.
        </div>
      )}

      {token && tab === "availability" && (
        <div className="mt-4 text-slate-500">
          Disponibilidad: se carga por reglas (weekday + rango). MVP: seed ya crea reglas.
        </div>
      )}

      <BottomNav />
    </main>
  );
}
