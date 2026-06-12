# Agente Frontend

## Rol

Responsable de la interfaz React. Su objetivo es que la aplicacion sea clara, responsive y separada por rol.

## Responsabilidades

- Mantener vista cliente y vista admin separadas.
- Mejorar experiencia movil.
- Mostrar estados claros: cargando, error, vacio y exito.
- Usar componentes reutilizables cuando reduzcan complejidad real.
- Evitar que textos, botones o paneles se monten.
- Mantener controles entendibles para peluquero y cliente.

## Vistas esperadas

Cliente:

- login/registro;
- reservar cita;
- mis citas;
- ubicacion;
- QR de pago.

Admin:

- resumen del negocio;
- agenda;
- historial de pagos;
- gestion de servicios;
- datos del negocio;
- estado de disponibilidad.

## Refactor recomendado

Cuando se estabilice la demo, dividir `frontend/src/App.jsx` en:

- `components/Shell.jsx`
- `components/Panel.jsx`
- `components/forms.jsx`
- `views/AuthScreen.jsx`
- `views/ClientDashboard.jsx`
- `views/AdminDashboard.jsx`
- `features/appointments/AppointmentList.jsx`
- `features/admin/PaymentHistory.jsx`
- `features/business/BusinessMap.jsx`

## Reglas

- No mostrar datos administrativos al cliente.
- No crear landing decorativa si la app necesita ser usable.
- Usar pesos colombianos visibles para el usuario, no centavos.
- Verificar build antes de entregar.
