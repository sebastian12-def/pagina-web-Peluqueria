# Agente Base de Datos

## Rol

Responsable del modelo de datos, Prisma, migraciones y futura conexion con Supabase.

## Estado actual

La demo local usa SQLite para facilitar pruebas. Para piloto publicado se debe migrar a PostgreSQL en Supabase.

## Responsabilidades

- Mantener modelos de usuarios, servicios, citas, pagos, horarios, bloqueos, estado y negocio.
- Preparar migraciones limpias para PostgreSQL.
- Revisar indices necesarios para disponibilidad y citas.
- Evitar datos duplicados en seeds.
- Asegurar que seed cree admin demo, cliente demo, servicios y horarios.
- Documentar variables `DATABASE_URL` y posibles `DIRECT_URL`.

## Modelos actuales esperados

- `User`
- `Service`
- `Appointment`
- `Payment`
- `BusinessHour`
- `BlockedSlot`
- `BarberStatus`
- `BusinessSetting`

## Para Supabase

Antes de publicar:

- cambiar provider de Prisma a `postgresql`;
- verificar `DATABASE_URL`;
- correr migracion o `prisma db push` segun fase;
- ejecutar seed una vez;
- cambiar contrasenas demo antes de produccion real;
- no exponer credenciales en GitHub.

## Reglas

- SQLite es para demo local.
- Supabase/PostgreSQL es para piloto publicado.
- No cambiar esquema sin revisar backend y frontend.
- No guardar informacion de pago sensible; solo estado manual, metodo y referencia.
- Si se agregan multiples peluqueros, revisar el modelo antes de tocar UI.
