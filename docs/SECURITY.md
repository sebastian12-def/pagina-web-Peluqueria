# Seguridad del proyecto

## Objetivo

Mantener la demo y el piloto protegidos contra errores comunes: acceso indebido, SQL injection, secretos filtrados, abuso del login, CORS mal configurado y cambios peligrosos en la base de datos.

## Estado actual

Controles ya presentes:

- contrasenas con `bcrypt`;
- JWT para sesion;
- roles `CLIENT` y `BARBER_ADMIN`;
- rutas cliente y admin separadas;
- `helmet` en Express;
- CORS configurado por `FRONTEND_URL`;
- validacion con `zod` en rutas principales;
- Prisma ORM sin SQL crudo detectado;
- `.env`, logs, bases locales y `node_modules` ignorados por Git.

## SQL injection

Reglas:

- Usar Prisma con `findMany`, `findUnique`, `create`, `update`, `upsert` y filtros tipados.
- No usar `$queryRawUnsafe` ni `$executeRawUnsafe`.
- No construir consultas concatenando strings con datos del usuario.
- Si algun dia se usa SQL raw, debe ser parametrizado y revisado por el agente de seguridad.
- Para valores tipo estado, rol, dia de semana, metodo de pago o ordenamiento, usar listas permitidas.

Referencia: OWASP recomienda consultas parametrizadas, validacion por lista permitida y minimo privilegio como defensas principales contra SQL injection.

## Autorizacion por rol

Cliente:

- solo ve sus propias citas;
- solo cancela sus propias citas;
- no ve ingresos, historial global, clientes ni configuracion.

Admin:

- ve agenda completa;
- gestiona servicios, pagos y negocio;
- requiere `requireAuth` y `requireRole("BARBER_ADMIN")`.

## Secretos

Nunca subir:

- `.env`;
- `DATABASE_URL`;
- `JWT_SECRET`;
- claves de Supabase;
- tokens de Render/Vercel;
- archivos `.db`;
- logs con datos sensibles.

Si un secreto se pega en chat, captura o repo, se debe rotar antes de produccion.

## JWT

Para produccion:

- `JWT_SECRET` debe ser largo, aleatorio y unico;
- no usar `dev-secret-change-me`;
- no reutilizar contrasenas personales;
- mantener expiracion razonable, por ejemplo `7d` para piloto.

## CORS

Para piloto:

- Render debe tener `FRONTEND_URL` con la URL exacta de Vercel;
- no usar `*` con credenciales;
- si hay varias URLs, separarlas por coma.

## Base de datos y migraciones

Antes de Supabase:

- confirmar `DATABASE_URL`;
- confirmar si se usara `DIRECT_URL`;
- cambiar Prisma a PostgreSQL;
- revisar migracion antes de ejecutarla;
- hacer backup o snapshot antes de cambios destructivos;
- no ejecutar seed destructivo contra datos reales.

## Checklist antes de publicar

- Build frontend correcto.
- Build backend correcto.
- No hay secretos en Git.
- Cliente/admin separados.
- Login admin y cliente probados.
- Reserva y cancelacion probadas.
- No hay SQL crudo inseguro.
- Rate limit activo en auth.
- `JWT_SECRET` fuerte en Render.
- `DATABASE_URL` correcta.
- `FRONTEND_URL` correcta.
- Contrasenas demo rotadas si se entrega a cliente real.
