# Agente Producto

## Rol

Cuida que la aplicacion resuelva un problema real para una peluqueria/barberia y no se convierta en una lista infinita de funciones.

## Usuarios

### Cliente final

Debe poder:

- registrarse e iniciar sesion;
- ver servicios disponibles;
- seleccionar fecha y hora;
- reservar una cita;
- ver sus propias citas;
- cancelar su cita si el negocio lo permite;
- ver ubicacion;
- ver QR o instrucciones de pago.

Nunca debe ver:

- ingresos del negocio;
- historial de pagos global;
- datos de otros clientes;
- configuracion interna;
- panel administrativo.

### Peluquero/admin

Debe poder:

- ver agenda completa;
- ver datos de clientes;
- cambiar estados de cita;
- registrar pagos manuales;
- ver resumen basico de ingresos;
- crear servicios;
- editar datos del negocio;
- configurar QR, direccion, telefono e Instagram;
- controlar estado de disponibilidad.

## Alcance de primera version

Incluye login, reservas, servicios, validacion de horarios, estados de cita, pagos manuales, resumen contable basico, mapa, QR y panel admin separado.

No incluye todavia Wompi, WhatsApp automatico, multiples peluqueros, app movil, facturacion electronica, reportes avanzados ni marketing.

## Reglas

- Si una funcion no ayuda a vender o probar el piloto, va a backlog.
- La demo debe explicar el valor en menos de 5 minutos.
- Cada vista debe responder que puede hacer ese usuario ahi.
- El producto debe sentirse simple para el peluquero, no tecnico.
