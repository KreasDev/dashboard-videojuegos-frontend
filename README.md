# Dashboard de Videojuegos — Frontend

Práctica escolar: dashboard web con inicio de sesión, listado de videojuegos y
página para agregar nuevos elementos. El backend es un proyecto y repositorio
separado.

## Tecnologías

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- React Context (autenticación y listado de videojuegos)

## Uso

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # compilar para producción
npm run lint     # revisar el código con oxlint
```

## Rutas

| Ruta               | Descripción                               | Protegida |
| ------------------ | ----------------------------------------- | --------- |
| `/`                | Redirige a `/login`                       | No        |
| `/login`           | Inicio de sesión                          | No        |
| `/dashboard`       | Listado de videojuegos                    | Sí        |
| `/dashboard/nuevo` | Formulario para agregar un videojuego     | Sí        |

Las rutas protegidas redirigen a `/login` si no existe un JWT.

## Flujo de autenticación

```text
LoginPage → authService → POST ${VITE_LDAP_API_URL}/login (LDAP) → JWT
  → AuthContext (estado + localStorage auth_token)
  → videoGamesService → Authorization: Bearer <JWT> → backend (/api/games)
```

## Funcionamiento

- **Login con el API LDAP real:** `src/services/authService.ts` envía usuario y
  contraseña a `POST ${VITE_LDAP_API_URL}/login` y devuelve el JWT del campo
  `token` de la respuesta. El frontend no decodifica ni valida el JWT.
- **Distribución del JWT:** `AuthContext` recibe el token, lo imprime en consola
  (`JWT recibido: ...`), lo guarda en `localStorage` (`auth_token`) y lo
  comparte con el resto de la app mediante React Context.
- **Videojuegos desde el backend:** `src/services/videoGamesService.ts` hace
  `GET /api/games` y `POST /api/games` contra `dashboard-videojuegos-backend`.
  La única persistencia en el navegador es `auth_token`.
- **Bearer Token:** ambas peticiones envían el JWT obtenido de LDAP como
  `Authorization: Bearer <JWT>` (construido en `src/services/authHeaders.ts`),
  y el header se imprime en consola justo antes de cada petición.

## Ejecutar con LDAP y el backend

El API LDAP y el backend son proyectos separados y deben ejecutarse aparte:

```bash
# en ldap/ (API LDAP con Docker)
docker compose up -d openldap api   # http://localhost:8000

# en dashboard-videojuegos-backend
npm run dev                         # http://localhost:3000
```

Después, en este proyecto, crea `.env` a partir de `.env.example` y ejecuta
`npm run dev`. Si el API LDAP no responde, el login muestra "No se pudo
conectar con el servicio de autenticación."; si el backend no responde, el
dashboard muestra un error con opción de reintentar.

## Variables de entorno

Copia `.env.example` como `.env` y ajusta los valores:

| Variable               | Descripción                          |
| ---------------------- | ------------------------------------ |
| `VITE_LDAP_API_URL`    | URL base del API LDAP que emite el JWT (`http://localhost:8000`) |
| `VITE_BACKEND_API_URL` | URL base del backend de videojuegos (`http://localhost:3000`) |

Las variables `VITE_*` son visibles en el navegador: nunca deben contener
contraseñas ni secretos.

## Nota sobre el modo desarrollo

En `npm run dev`, React `StrictMode` monta los componentes dos veces para
detectar errores, por lo que al abrir el dashboard pueden verse **dos**
`GET /api/games` (y dos logs `Authorization: Bearer ...`). Es comportamiento
exclusivo de desarrollo: en la versión de producción (`npm run build`) solo se
hace una petición.

## Despliegue con Docker

Imagen multi-stage: build con Node (Vite) y servido por **nginx** (puerto interno
80, SPA fallback a `index.html`). Las variables `VITE_*` se inyectan en build-time
vía build args (URLs accesibles desde el navegador del host).

```bash
docker build \
  --build-arg VITE_LDAP_API_URL=http://localhost:8000 \
  --build-arg VITE_BACKEND_API_URL=http://localhost:3000 \
  -t dashboard-videojuegos-frontend .
docker run --rm -p 5173:80 dashboard-videojuegos-frontend
```

En el laboratorio no se ejecuta directamente, sino detrás del proxy nginx +
Fail2Ban del repo `ldap-jwt-api` (`security-stack/`), que publica el puerto 5173.
Los `console.log` que exponían el JWT / header Authorization fueron eliminados.
