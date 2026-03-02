# SIGDEP Caazapá

Sistema Inteligente de Gestión y Decisión Departamental para la Gobernación de Caazapá.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth (JWT con credenciales)
- Leaflet para mapa interactivo

## Puesta en marcha

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar entorno:
   ```bash
   cp .env.example .env
   ```
3. Definir `DATABASE_URL` en `.env`.
4. Ejecutar migraciones y seed:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
5. Levantar desarrollo:
   ```bash
   npm run dev
   ```

## Usuarios demo
- `gobernador@sigdep.gov.py` / `admin123`
- `secretario@sigdep.gov.py` / `admin123`
- `visitante@sigdep.gov.py` / `admin123`

## Estructura
- `app/(dashboard)` panel principal y panel del gobernador
- `app/api` CRUD de obras y distritos + análisis estratégico
- `components` UI modular
- `lib` autenticación, prisma, lógica de negocio estratégica
- `prisma` schema y seed
