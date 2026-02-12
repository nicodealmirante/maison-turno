export default function Stepper({ step }) {
  const steps = [
    { n: 1, label: "Categoría" },
    { n: 2, label: "Servicio" },
    { n: 3, label: "Profesional" },
    { n: 4, label: "Fecha y hora" },
    { n: 5, label: "Confirmar" }
  ];
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {steps.map((s, idx) => (
        <div key={s.n} className="flex items-center gap-3">
          <div className={
            "h-9 w-9 rounded-full grid place-items-center text-sm font-semibold " +
            (s.n < step ? "bg-orange-500 text-white" : s.n === step ? "bg-black text-white" : "bg-slate-100 text-slate-400")
          }>
            {s.n < step ? "✓" : s.n}
          </div>
          <div className={"hidden sm:block text-xs " + (s.n === step ? "text-slate-900" : "text-slate-400")}>{s.label}</div>
          {idx !== steps.length - 1 && <div className="w-8 h-[2px] bg-slate-100" />}
        </div>
      ))}
    </div>
  );
}
