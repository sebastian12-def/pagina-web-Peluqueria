# Conexion de Supabase, Render y Vercel

## Diagnostico del error de la imagen

El error mostrado es:

```txt
Access to fetch at http://localhost:4000/api/auth/login
from origin http://192.168.1.4:5173 has been blocked by CORS policy
```

Esto significa que el frontend esta abierto desde una IP de red (`192.168.1.4`) y el backend no permitia ese origen.

No significa necesariamente que Supabase este mal ni que la base de datos este desconectada. Es un problema de comunicacion navegador -> backend.

Para demo local:

- frontend: `http://192.168.1.4:5174`
- backend: `http://192.168.1.4:4000`

Si se prueba desde celular, no usar `localhost` para la API, porque `localhost` seria el celular. La app ahora detecta el hostname y usa el mismo host con puerto `4000` cuando no hay `VITE_API_URL`.

## Flujo final esperado

```txt
Cliente abre Vercel
  -> Vercel sirve el frontend
  -> frontend llama a Render usando VITE_API_URL
  -> Render ejecuta backend Node/Express
  -> backend consulta Supabase PostgreSQL usando DATABASE_URL
```

## Paso 1: Supabase

Objetivo: tener PostgreSQL para guardar usuarios, citas, servicios y pagos.

Debes hacer:

1. Entrar a Supabase.
2. Abrir el proyecto.
3. Click en `Connect`.
4. Copiar la connection string.

Para Render con backend persistente, usar preferiblemente:

- Direct connection si funciona desde Render.
- Shared Pooler session mode si hay problema de IPv4.

Supabase indica que la direct connection sirve para backends persistentes y migraciones. Tambien documenta que el Shared Pooler session mode sirve para aplicaciones persistentes en redes IPv4.

Debes pasarme:

```env
DATABASE_URL=
DIRECT_URL=
```

No lo subas a GitHub.

## Paso 2: Render

Objetivo: publicar el backend.

Debes hacer:

1. Entrar a Render.
2. Ir a `New > Web Service`.
3. Conectar el repositorio de GitHub.
4. Seleccionar el repo `pagina-web-Peluqueria`.
5. Configurar:

```txt
Root Directory: backend
Build Command: npm install && npm run render:build
Start Command: npm start
```

Variables necesarias:

```env
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=
BUSINESS_NAME=
BUSINESS_ADDRESS=
BUSINESS_LAT=
BUSINESS_LNG=
```

Render documenta que para una app Express se crea un Web Service conectado al repo y se definen comandos de build/start segun el proyecto.

## Paso 3: Vercel

Objetivo: publicar el frontend.

Debes hacer:

1. Entrar a Vercel.
2. Importar el repositorio de GitHub.
3. Configurar:

```txt
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Variable necesaria:

```env
VITE_API_URL=https://TU-BACKEND.onrender.com
```

Vercel documenta que las variables disponibles para Vite deben usar prefijo `VITE_`.

## Paso 4: conectar Render con Vercel

Cuando Vercel entregue una URL como:

```txt
https://tu-proyecto.vercel.app
```

En Render debes poner:

```env
FRONTEND_URL=https://tu-proyecto.vercel.app
```

Cuando Render entregue una URL como:

```txt
https://backend-web-fksu.onrender.com
```

En Vercel debes poner:

```env
VITE_API_URL=https://backend-web-fksu.onrender.com
```

## Paso 5: migrar de SQLite a Supabase

Antes de publicar:

1. Prisma ya quedo configurado para PostgreSQL.
2. Confirmar `DATABASE_URL` en Render.
3. Render ejecutara `prisma db push` durante el build.
4. Render ejecutara el seed durante el build.
5. Probar login admin/cliente.
6. Probar reserva.

Este paso lo debe hacer el desarrollador con cuidado. No hacerlo desde el panel a ciegas.

## Checklist que debes darme

```txt
URL de Vercel =
URL de Render =
DATABASE_URL de Supabase =
DIRECT_URL de Supabase =
Nombre del negocio =
Direccion =
Telefono =
Instagram =
Latitud =
Longitud =
URL del QR de pago =
Servicios con precio y duracion =
Horarios =
```

## Fuentes oficiales consultadas

- Render Docs: Deploy a Node Express App on Render.
- Vercel Docs: Vite on Vercel, variables de entorno con prefijo `VITE_`.
- Supabase Docs: Connect to your database, direct connection y poolers.
