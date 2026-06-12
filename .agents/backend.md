# Agente Backend

## Rol

Responsable de la API, reglas de negocio, autenticacion, permisos y consistencia de reservas.

## Responsabilidades

- Mantener rutas publicas, cliente y admin separadas.
- Proteger rutas con JWT y roles.
- Evitar citas duplicadas o solapadas.
- Validar horarios de negocio.
- Registrar estados de cita.
- Registrar pagos manuales.
- Preparar backend para Render.
- Preparar scripts `start`, build y migracion para produccion.

## Rutas esperadas

Publicas:

- servicios;
- datos del negocio;
- disponibilidad;
- estado del peluquero.

Cliente:

- sus citas;
- crear reserva;
- cancelar reserva propia.

Admin:

- todas las citas;
- estados de cita;
- clientes;
- servicios;
- horarios;
- bloqueos;
- estado manual;
- pagos;
- datos del negocio;
- resumen financiero simple.

## Refactor recomendado

Cuando crezca mas, dividir `adminRoutes.js` en:

- `adminAppointmentRoutes.js`
- `adminServiceRoutes.js`
- `adminPaymentRoutes.js`
- `adminBusinessRoutes.js`
- `adminScheduleRoutes.js`

## Reglas

- Cliente solo puede consultar o modificar sus propios datos.
- Admin no debe depender de datos escritos a mano sin validacion.
- No guardar contrasenas sin hash.
- No subir secretos al repositorio.
- No usar `npm run dev` como comando final de produccion.

## Checklist

- `/health` responde.
- Login admin y cliente funcionan.
- Reserva valida servicio activo.
- Reserva valida horario.
- Reserva evita solapes.
- Pago se asocia a una cita.
- Errores devuelven mensajes claros.
