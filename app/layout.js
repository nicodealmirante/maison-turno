import "./globals.css";

export const metadata = {
  title: process.env.NEXT_PUBLIC_BRAND_NAME || "Turnos",
  description: "Reservá tu turno"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
