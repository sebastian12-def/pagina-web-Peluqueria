# Revisión de interfaz y base de datos

Fecha: 12 de junio de 2026

## Agente de interfaz

### Problema observado

En la vista publica se vieron textos incorrectos o poco profesionales:

- el botón de registro se veía como `Crema`;
- el campo de correo se veía como `Correcciones`;
- algunos textos aparecian sin tildes;
- algunos labels podian confundirse en celular.

### Acciones aplicadas

- Se reforzó el documento HTML como página en español y sin traducción automática del navegador.
- Se cambió `Correo` por `Correo electrónico`.
- Se cambió `Contrasena` por `Contraseña`.
- Se cambió `Telefono` por `Teléfono`.
- Se corrigieron textos de cliente y admin:
  - `Ubicacion`;
  - `Automatico`;
  - `Descripcion`;
  - `Duracion`;
  - mensajes de disponibilidad y errores.
- Se dejó explícito el botón `Crear cuenta`.
- Se agregó `type="submit"` al botón principal del formulario.
- Se agregaron ayudas `autoComplete` para correo, teléfono y contraseña.

## Agente de base de datos

### Veredicto

La base de datos actual sirve para la prueba piloto. Ya tiene relaciones principales:

- usuarios;
- servicios;
- citas;
- pagos;
- horarios;
- bloqueos;
- estado del peluquero;
- datos del negocio.

### Llaves y restricciones existentes

- `User.email` es único.
- `Service.name` es único.
- `BusinessHour.dayOfWeek` es único.
- `Payment.appointmentId` es único.
- Las citas relacionan cliente, servicio y creador admin.
- Los pagos se relacionan con una cita.

### Mejoras aplicadas

- Se agregaron índices para consultar agenda por cliente, servicio, estado y fecha.
- Se agregó índice para bloqueos de agenda por rango de tiempo.
- Se agregó índice para pagos por estado y fecha de actualización.
- Se agregó una llave única `key` en `BusinessSetting` para evitar múltiples filas de configuración del negocio.
- Se agregó una llave única `key` en `BarberStatus` para evitar múltiples filas de estado del peluquero.
- El backend ahora usa `upsert` por esa llave unica para actualizar negocio y estado.

### Riesgo pendiente para fase futura

La aplicación ya valida que no haya citas cruzadas antes de crear una reserva. Para una fase más avanzada, si el volumen sube, conviene agregar una restricción PostgreSQL de exclusión por rango de tiempo para blindar reservas simultáneas exactas a nivel base de datos.

Para esta prueba piloto, la validación actual más los índices nuevos son suficientes.

## Validación técnica

Resultado:

```txt
Backend build: correcto
Frontend build: correcto
Prisma schema validate: correcto
Búsqueda de textos erróneos principales en frontend/backend: sin coincidencias
```
