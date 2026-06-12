# Despliegue piloto

## Arquitectura separada

Para el piloto se evaluara:

- frontend en Vercel;
- backend en Render;
- base de datos en Supabase PostgreSQL.

Esta opcion permite probar con bajo costo inicial y separar responsabilidades.

## Pendientes antes de publicar

- Cambiar Prisma a PostgreSQL.
- Crear script `start` en backend.
- Configurar variables de entorno.
- Crear tablas en Supabase.
- Ejecutar seed.
- Probar CORS entre Vercel y Render.
- Revisar costos actuales en COP.

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
DIRECT_URL=
```

No guardar secretos reales en GitHub.

## Costos

Los costos se deben investigar antes de decidir y documentar con:

- fecha de consulta;
- precio original;
- tasa de cambio usada;
- valor aproximado en COP;
- limites del plan gratuito o pago.
