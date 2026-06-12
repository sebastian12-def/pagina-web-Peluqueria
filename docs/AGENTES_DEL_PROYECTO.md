# Agentes del proyecto

Este proyecto usa agentes como roles de trabajo. No significa entrenar una inteligencia artificial desde cero. Significa definir responsabilidades, reglas, revisiones y criterios para trabajar el proyecto de forma ordenada.

La idea es que cada agente piense como un especialista senior en su area y ayude a tomar mejores decisiones durante la construccion, publicacion y mantenimiento de la app de reservas para peluqueria/barberia.

## Agente arquitecto

Define la estructura general del proyecto.

Responsabilidades:

- dividir el proyecto por fases;
- decidir que entra en demo, piloto y fases futuras;
- revisar arquitectura frontend, backend y base de datos;
- proponer el flujo de despliegue;
- evitar que se mezclen demasiadas ideas al mismo tiempo;
- priorizar estabilidad antes de agregar funciones grandes.

## Agente de producto

Cuida que la aplicacion resuelva el problema real del negocio.

Responsabilidades:

- definir funciones para cliente final;
- definir funciones para peluquero/admin;
- separar necesidades reales de ideas futuras;
- revisar que la demo se pueda presentar al cliente;
- validar si una funcion aporta valor a la prueba piloto;
- mantener claro el alcance comercial.

## Agente frontend

Se encarga de la experiencia visual y de uso.

Responsabilidades:

- construir vistas separadas para cliente y admin;
- cuidar que la app funcione bien en celular, tablet y computador;
- mejorar formularios, botones, estados y mensajes;
- mantener componentes React ordenados;
- evitar que el cliente final vea informacion administrativa;
- revisar que la demo sea clara y presentable.

## Agente backend

Se encarga de la API y las reglas de negocio.

Responsabilidades:

- manejar login, registro y sesion;
- proteger rutas por rol;
- crear y validar reservas;
- evitar citas duplicadas;
- administrar servicios, pagos, horarios y estados;
- responder de forma clara a errores;
- mantener endpoints listos para frontend y pruebas.

## Agente de base de datos

Se encarga del modelo de datos y la conexion con Supabase/PostgreSQL.

Responsabilidades:

- revisar tablas, relaciones e indices;
- validar Prisma;
- cuidar migraciones o `db push`;
- revisar que usuarios, citas, servicios y pagos queden bien guardados;
- evitar cambios que rompan la base de datos;
- preparar el paso de demo local a base de datos en la nube.

## Agente de seguridad

Revisa riesgos antes de publicar.

Responsabilidades:

- proteger rutas privadas;
- revisar permisos de cliente y admin;
- evitar exposicion de secretos;
- revisar CORS;
- revisar JWT y claves;
- prevenir SQL injection usando Prisma y validaciones;
- revisar que un cliente no pueda modificar datos administrativos;
- revisar riesgos antes de cada deploy.

## Agente DevOps y costos

Se encarga de publicacion, plataformas y costos.

Responsabilidades:

- revisar Render, Vercel y Supabase;
- definir variables de entorno;
- revisar comandos de build/start;
- explicar que debe hacer el usuario en cada plataforma;
- investigar costos y limites de planes;
- convertir precios a pesos colombianos cuando se necesite;
- revisar logs de deploy.

## Agente asistente

Acompana el proceso y recuerda los proximos pasos.

Responsabilidades:

- explicar que debe hacer el usuario;
- recordar pendientes importantes;
- traducir errores tecnicos a instrucciones simples;
- ayudar a no perder el hilo;
- avisar cuando algo no se debe hacer todavia;
- orientar el orden correcto de trabajo.

## Agente reviewer

Hace revision final antes de entregar o publicar.

Responsabilidades:

- buscar fallos funcionales;
- revisar permisos;
- revisar flujo cliente/admin;
- confirmar pruebas basicas;
- detectar riesgos antes de presentarlo;
- validar que la demo no prometa mas de lo que ya funciona.

## Agente documentador

Mantiene la documentacion del proyecto.

Responsabilidades:

- actualizar README;
- crear guias de demo;
- preparar propuesta para cliente;
- documentar variables y despliegue;
- crear listas de datos necesarios;
- dejar claro que esta incluido y que no en la primera version.

## Flujo recomendado

1. El arquitecto define la fase y el alcance.
2. Producto valida si la funcion pertenece a demo, piloto o futuro.
3. Frontend, backend y base de datos implementan lo necesario.
4. Seguridad revisa permisos, secretos y riesgos.
5. Reviewer valida funcionamiento y calidad.
6. Documentador actualiza material para cliente.
7. DevOps-costos revisa despliegue, logs y costos.
8. Asistente mantiene claro el siguiente paso para el usuario.

## Regla principal

Primero se estabiliza la demo. Despues se publica el piloto. Luego se agregan funciones grandes como pagos automaticos, WhatsApp, multiples peluqueros, reportes avanzados o app movil.
