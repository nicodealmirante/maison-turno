# Estilo & Cuidado (Turnos) — listo para Railway

App tipo “Reservá tu turno” como tus screens: flujo 5 pasos + Admin + Postgres.

## Stack
- Next.js 14 (App Router)
- Prisma + PostgreSQL
- Tailwind

## Deploy en Railway (rápido)
1) Subí este repo a GitHub.
2) En Railway: **New Project → Deploy from GitHub Repo**
3) Agregá un **PostgreSQL** (plugin).
4) Variables (Railway → Variables):
- `DATABASE_URL` (Railway la setea sola al linkear Postgres)
- `ADMIN_TOKEN` = lo que quieras (clave del admin)
- `NEXT_PUBLIC_BRAND_NAME` = "Estilo & Cuidado" (opcional)
- `NEXT_PUBLIC_CURRENCY` = "$" (opcional)

5) En Settings → Deploy:
- Build Command: `npm run build`
- Start Command: `npm start`

6) Después del primer deploy, corré (Railway → Service → Deployments → Run Command):
- `npm run db:migrate`
- `npm run db:seed`

Listo.

## URLs
- `/` reservar
- `/turnos` lista últimos turnos
- `/admin` panel (pega el token)

## Servicios cargados (seed)
Incluye los de tus fotos + barbería:
- Corte $20000
- Corte+Barba $27000
- Barba $10000
Más manos/pies/adicionales con efectivo y lista.

## Notas
- Evita doble reserva por overlap.
- Slots salen desde reglas de disponibilidad (seed trae reglas).
