# Propuesta piloto: sistema web de reservas para peluqueria/barberia

## Objetivo

Implementar una prueba piloto web para que los clientes puedan consultar servicios, registrarse y agendar citas desde el celular. El peluquero o administrador tendra un panel privado para controlar agenda, servicios, pagos manuales y datos del negocio.

## Alcance de la version piloto

La version piloto incluye:

- registro e inicio de sesion de clientes;
- vista de cliente separada del panel administrativo;
- listado de servicios con precio y duracion;
- calendario de reservas por fecha y hora;
- validacion para evitar citas duplicadas en el mismo horario;
- panel admin para ver todas las citas;
- cambio de estado de cita: pendiente, confirmada, atendida, cancelada o no asistio;
- registro manual de pagos: pendiente, abonado o pagado;
- historial de pagos para el admin;
- resumen contable basico para el admin;
- datos del negocio: nombre, direccion, telefono, Instagram, mapa y QR de pago;
- estado manual del peluquero: disponible, ocupado, pausado o fuera de horario;
- diseno responsive para celular, tablet y computador.

## Vista del cliente final

El cliente final puede:

- crear cuenta;
- iniciar sesion;
- elegir servicio;
- seleccionar fecha;
- escoger hora disponible;
- ver sus citas;
- cancelar una cita si esta permitido;
- consultar ubicacion;
- ver QR o instrucciones de pago.

El cliente no ve informacion administrativa, historial global de pagos, ingresos del negocio ni datos de otros clientes.

## Vista del peluquero/admin

El admin puede:

- ver la agenda completa;
- consultar datos del cliente;
- confirmar, completar, cancelar o marcar inasistencia;
- registrar pagos manuales;
- ver ingresos pagados, abonos y valores por cobrar;
- revisar historial de pagos;
- crear servicios;
- actualizar datos del negocio;
- cambiar estado de disponibilidad.

## Pagos

Para la prueba piloto se recomienda iniciar con pago por QR del negocio. El cliente paga por Nequi, Daviplata, Bancolombia u otro medio definido por el negocio. El admin registra manualmente si la cita esta pendiente, abonada o pagada.

La integracion automatica con Wompi se recomienda para una fase posterior, cuando el negocio valide que sus clientes si usan la plataforma.

## Publicacion piloto

La opcion inicial a evaluar es publicar en plataformas separadas:

- frontend en Vercel;
- backend Node.js en Render;
- base de datos PostgreSQL en Supabase.

Antes de publicar se deben revisar los costos vigentes en pesos colombianos, limites de planes gratuitos y estabilidad para una prueba piloto.

## No incluido en esta fase

No se incluye:

- app movil en Play Store o App Store;
- pagos automaticos con Wompi;
- WhatsApp automatico;
- facturacion electronica;
- multiples peluqueros;
- reportes avanzados;
- campanas de marketing;
- funciones no descritas en esta propuesta.

Estas funciones pueden cotizarse como fases adicionales.

## Forma de trabajo

El proyecto se trabaja por fases:

1. personalizacion de datos reales;
2. pruebas de flujo cliente/admin;
3. ajustes de demo;
4. publicacion piloto;
5. validacion con clientes reales;
6. mejoras posteriores segun uso real.

## Informacion requerida del negocio

Para personalizar la version piloto se necesita:

- nombre del negocio;
- direccion;
- telefono o WhatsApp;
- Instagram;
- servicios, precios y duracion;
- QR de pago;
- horarios de atencion;
- politicas de reserva y cancelacion;
- fotos reales y logo, si existen.
