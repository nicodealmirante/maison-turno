import BookingWizard from "./wizard/BookingWizard";
import BottomNav from "../components/BottomNav";

export default function Home() {
  return (
    <main className="container-n">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Reservá tu turno</h1>
        <p className="text-slate-500 mt-1">Elegí, reservá y listo</p>
      </div>

      <BookingWizard />

      <BottomNav />
    </main>
  );
}
