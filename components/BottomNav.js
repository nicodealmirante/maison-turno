"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Reservar", icon: "✂️" },
  { href: "/turnos", label: "Turnos", icon: "📅" },
  { href: "/admin", label: "Admin", icon: "⚙️" }
];

export default function BottomNav() {
  const p = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[920px] flex">
        {items.map((it) => {
          const active = p === it.href || (it.href !== "/" && p.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={"flex-1 py-3 text-center text-sm " + (active ? "text-orange-600" : "text-slate-500")}
            >
              <div className="text-lg leading-none">{it.icon}</div>
              <div className="mt-1">{it.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
