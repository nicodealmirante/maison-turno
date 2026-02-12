export function Button({ children, className="", ...props }) {
  return (
    <button
      {...props}
      className={
        "rounded-xl px-4 py-2 font-medium border border-slate-200 bg-black text-white hover:opacity-90 active:opacity-80 disabled:opacity-50 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className="", ...props }) {
  return (
    <button
      {...props}
      className={
        "rounded-xl px-4 py-2 font-medium border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 " +
        className
      }
    >
      {children}
    </button>
  );
}
