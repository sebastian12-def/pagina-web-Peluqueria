# Sistema de agentes del proyecto

Este proyecto usa agentes como roles de trabajo. No entrenan un modelo nuevo; ayudan a dividir decisiones, revisar calidad y mantener el proyecto ordenado.

## Agentes

- `arquitecto.md`: fases, alcance, arquitectura, despliegue y prioridades.
- `producto.md`: funciones de cliente, admin y negocio por fase.
- `frontend.md`: vistas React separadas por rol y experiencia movil.
- `backend.md`: API, permisos, reservas, pagos y reglas de negocio.
- `database.md`: Prisma, Supabase, migraciones y modelo de datos.
- `devops-costos.md`: Render, Vercel, Supabase, dominio y costos en COP.
- `seguridad.md`: permisos, SQL injection, secretos, JWT, CORS, migraciones y despliegue seguro.
- `asistente.md`: recordatorios, proximos pasos y explicaciones para el usuario.
- `reviewer.md`: seguridad, errores, permisos y calidad antes de entregar.
- `documentador.md`: README, manuales, demo, propuesta y entrega.

## Regla principal

Primero se estabiliza la version demo. No se agregan funciones grandes si antes no esta claro:

- que el proyecto corre desde cero;
- que cliente y admin ven vistas separadas;
- que no se suben `.env`, bases locales, logs ni builds generados;
- que el README explica como correr y presentar el prototipo;
- que existe una lista clara de pendientes por fase.

## Flujo recomendado

1. El arquitecto define fase y alcance.
2. Producto valida si la funcion pertenece a demo, piloto o fase futura.
3. Frontend/backend/database implementan solo lo necesario.
4. Seguridad revisa riesgos, secretos, permisos y base de datos.
5. Reviewer valida calidad, roles y funcionamiento.
6. Documentador actualiza instrucciones y material para cliente.
7. DevOps-costos revisa despliegue y costos cuando se vaya a publicar.
