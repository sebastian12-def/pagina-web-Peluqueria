# Prototipo Web de Reservas para Peluqueria

Prototipo funcional para agendamiento de citas de peluqueria/barberia con roles de cliente y peluquero/admin.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + Prisma
- Base de datos local: SQLite
- Auth: JWT + bcrypt
- Mapa: Leaflet + OpenStreetMap

## Primer arranque

1. Instalar dependencias, si aun no estan instaladas:

```bash
npm install
```

2. Crear la base local y datos iniciales:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

3. Correr en local:

Terminal 1:

```bash
npm run dev --workspace backend
```

Terminal 2:

```bash
npm run dev --workspace frontend -- --port 5174
```

URLs locales:

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:4000`

Usuarios demo:

- Admin: `admin@peluqueria.com` / `Admin123*`
- Cliente: `cliente@demo.com` / `Cliente123*`

## Que incluye el prototipo

- Registro e inicio de sesion de clientes.
- Panel cliente para reservar, ver citas, cancelar y consultar ubicacion/QR.
- Panel admin para ver citas, cambiar estado, marcar pago pendiente/abonado/pagado.
- Gestion basica de servicios.
- Edicion de datos del negocio, direccion, redes, mapa y URL del QR.
- Validacion para evitar reservas duplicadas en el mismo horario.

## Lo que debes preparar por aparte

- Nombre real del negocio, direccion, telefono, Instagram y horarios.
- Lista final de servicios con precio y duracion.
- Foto o URL del QR de pago del negocio.
- Logo, fotos reales del local y trabajos realizados.
- Dominio y hosting si se va a publicar.
- Politicas de reserva: anticipo, cancelaciones y tiempo minimo para agendar.
