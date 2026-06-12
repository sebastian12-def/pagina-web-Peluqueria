# Roadmap del proyecto

## Diagnostico

El proyecto ya tiene una base funcional fuerte. El problema actual es que todavia se siente como prototipo que crecio rapido: codigo, documentos, scripts, archivos generados y decisiones de despliegue estan mezclados.

La prioridad no es agregar muchas funciones nuevas. La prioridad es convertirlo en una demo estable y facil de explicar.

## Bloques del producto

1. Producto: reservas para peluqueria/barberia.
2. Cliente final: se registra, mira servicios, reserva, ve ubicacion y QR.
3. Peluquero/admin: mira agenda, confirma citas, gestiona pagos, servicios y estado.
4. Negocio: datos reales, precios, horarios, politicas, QR y direccion.

## Fase actual: demo estable

Incluye:

- login y registro;
- vista cliente separada;
- vista admin separada;
- agenda de citas;
- pagos manuales;
- resumen contable basico;
- servicios configurables;
- datos del negocio;
- mapa y QR;
- README claro.

Pendientes:

- terminar limpieza menor de raiz cuando se cierren logs locales;
- confirmar que corre desde cero;
- dividir `frontend/src/App.jsx` en componentes;
- separar rutas admin del backend cuando empiece a crecer mas.

## Fase siguiente: piloto publicado

Arquitectura a investigar:

- Vercel para frontend;
- Render para backend;
- Supabase para PostgreSQL;
- dominio propio opcional.

Antes de publicar:

- cambiar Prisma de SQLite a PostgreSQL;
- obtener `DATABASE_URL` de Supabase;
- configurar variables de Render;
- configurar `VITE_API_URL` en Vercel;
- crear script `start` para backend;
- revisar costos en COP con fecha de consulta;
- rotar contrasenas compartidas o de prueba.

## Fases futuras

Operacion basica:

- filtros por fecha;
- horarios editables desde panel;
- bloqueo de agenda desde panel;
- reportes diarios/semanales/mensuales;
- editar/eliminar servicios;
- exportar pagos a CSV o Excel.

Avanzada:

- Wompi;
- WhatsApp automatico;
- multiples peluqueros;
- facturacion electronica;
- app movil;
- marketing y recordatorios.
