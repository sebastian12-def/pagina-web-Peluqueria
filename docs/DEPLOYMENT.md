# Despliegue piloto

## Arquitectura separada

Para el piloto se evaluara:

- frontend en Vercel;
- backend en Render;
- base de datos en Supabase PostgreSQL.

Esta opcion permite probar con bajo costo inicial y separar responsabilidades.

## Pendientes antes de publicar

- Prisma ya esta configurado para PostgreSQL.
- El backend ya tiene script `start`.
- Configurar variables de entorno en Render.
- Crear tablas en Supabase con `prisma db push`.
- Ejecutar seed desde el build de Render.
- Probar CORS entre Vercel y Render.
- Revisar costos actuales en COP.

## Configuracion de Render

En el servicio `Backend-Web`:

```txt
Root Directory: backend
Build Command: npm install && npm run render:build
Start Command: npm start
```

El comando `render:build` hace tres cosas:

```txt
prisma generate
prisma db push
npm run seed
```

Eso crea las tablas en Supabase y carga datos iniciales de demo.

## Variables de Render

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=
BUSINESS_NAME=
BUSINESS_ADDRESS=
BUSINESS_LAT=
BUSINESS_LNG=
```

## Variable de Vercel

```env
VITE_API_URL=
```

## Supabase

Se necesita obtener:

```env
DATABASE_URL=
```

Para Render se recomienda usar el `Session Pooler` de Supabase:

```env
DATABASE_URL=postgresql://postgres.mzorewreqsbdbyixytte:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres
```

Reemplazar `[YOUR-PASSWORD]` por la contrasena real directamente en Render. No guardar esa clave en GitHub.

No guardar secretos reales en GitHub.

## Costos

Los costos se deben investigar antes de decidir y documentar con:

- fecha de consulta;
- precio original;
- tasa de cambio usada;
- valor aproximado en COP;
- limites del plan gratuito o pago.
