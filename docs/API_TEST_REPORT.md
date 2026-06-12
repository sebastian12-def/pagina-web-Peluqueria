# Reporte de pruebas API

Fecha de prueba: 12 de junio de 2026

## Resumen

Resultado general:

```txt
Pruebas ejecutadas: 32
Pruebas correctas: 32
Pruebas fallidas: 0
```

El backend local respondio correctamente en:

```txt
http://localhost:4000
```

El frontend local respondio correctamente en:

```txt
http://localhost:5174
```

## Veredicto de agentes

### Backend

La API actual permite un flujo normal de demo:

- consultar servicios;
- consultar negocio;
- consultar disponibilidad;
- registrar cliente;
- iniciar sesion;
- crear cita;
- bloquear cita duplicada;
- cancelar cita;
- administrar citas;
- administrar pagos;
- administrar servicios;
- administrar horarios;
- actualizar datos del negocio.

### Seguridad

Validado:

- cliente sin token recibe `401`;
- cliente intentando entrar a ruta admin recibe `403`;
- cita duplicada recibe `409`;
- no se detecto SQL crudo inseguro en el codigo backend;
- CORS permite origen local privado para demo;
- CORS no entrega headers a origen externo no permitido.

### Reviewer

La demo local esta conectada correctamente contra SQLite local. Esto no prueba Supabase/Render/Vercel todavia; esa sera otra fase cuando existan URLs y variables de entorno reales.

## Endpoints probados

### Salud y publicos

- `GET /health`
- `GET /api/public/services`
- `GET /api/public/business`
- `GET /api/public/barber-status`
- `GET /api/public/availability`

### Autenticacion

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

### Cliente

- `GET /api/client/appointments`
- `POST /api/client/appointments`
- `PATCH /api/client/appointments/:id/cancel`

### Admin

- `GET /api/admin/appointments`
- `POST /api/admin/appointments`
- `PATCH /api/admin/appointments/:id/status`
- `GET /api/admin/clients`
- `GET /api/admin/services`
- `POST /api/admin/services`
- `PATCH /api/admin/services/:id`
- `GET /api/admin/business-hours`
- `PUT /api/admin/business-hours`
- `POST /api/admin/blocked-slots`
- `PUT /api/admin/barber-status`
- `PUT /api/admin/payments/:appointmentId`
- `PUT /api/admin/business`

## Flujo probado

1. Crear usuario cliente temporal.
2. Iniciar sesion como cliente.
3. Consultar disponibilidad.
4. Crear cita.
5. Intentar crear cita duplicada y confirmar bloqueo.
6. Cancelar cita.
7. Iniciar sesion como admin.
8. Crear cita desde admin.
9. Registrar abono.
10. Registrar pago completo.
11. Cambiar cita a atendida.
12. Crear servicio temporal.
13. Desactivar servicio temporal.
14. Probar horarios.
15. Probar bloqueo de agenda.
16. Probar estado manual del peluquero y regresar a automatico.
17. Probar cambio de contrasena en usuario temporal.
18. Limpiar datos temporales de prueba.

## Error detectado y corregido

El error visto en DevTools:

```txt
Access to fetch at http://localhost:4000/api/auth/login
from origin http://192.168.1.4:5173 has been blocked by CORS policy
```

Causa:

El frontend estaba abierto desde una IP local de red (`192.168.1.4`) y el backend no permitia ese origen.

Correccion aplicada:

- En desarrollo se permiten `localhost`, `127.0.0.1`, `::1` y redes privadas (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`).
- En produccion se mantiene cerrado a `FRONTEND_URL`.
- El frontend detecta el host actual y llama a `http://mismo-host:4000` si no existe `VITE_API_URL`.

Resultado CORS:

```txt
Origin http://192.168.1.4:5173 -> permitido
Origin https://sitio-no-permitido.example -> sin headers CORS
```

## Datos temporales

Durante la prueba se crearon datos temporales con prefijos:

- `api-test-`
- `Servicio API Test`
- `Bloqueo temporal prueba API`

Despues de la prueba fueron eliminados de la base local.

## Pendiente para piloto publicado

Estas pruebas validan la demo local. Para probar el piloto publicado falta:

- cambiar Prisma de SQLite a PostgreSQL;
- conectar Supabase;
- configurar Render;
- configurar Vercel;
- definir `DATABASE_URL`;
- definir `VITE_API_URL`;
- definir `FRONTEND_URL`;
- probar el flujo desde la URL publica.
