# EasyStock - Sistema Web de Gestión de Inventario Interno

## Introducción

**EasyStock** es una aplicación web desarrollada para resolver el problema del control manual de inventario en pequeñas y medianas organizaciones. Muchas empresas gestionan su stock mediante planillas físicas o registros informales, lo que genera pérdida de control sobre el stock real, errores humanos en el registro de entradas y salidas, y falta de trazabilidad en los movimientos de productos.

Este sistema busca digitalizar y centralizar la gestión de inventario, permitiendo el registro, seguimiento y control de productos con alertas de stock bajo y roles diferenciados de administrador y usuario.

El proyecto nació como una maqueta estática en HTML5/CSS3, luego se migró a una Single Page Application (SPA) con Angular y actualmente **se encuentra conectado a una API real con Django REST Framework y MySQL**. Los datos de productos, categorías, movimientos y usuarios se consumen de forma asíncrona mediante `HttpClient` y `Observable`, con vistas de backend basadas en `APIView`.

Proyecto desarrollado en el marco del módulo **Full Stack I** del **Instituto Superior Politécnico de Córdoba (ISPC)** - Año 2026.

---

## Funcionalidades

- **Inicio de sesión y registro con roles**: formularios reactivos conectados a Django, validación de credenciales, navegación protegida por rol en el frontend y cierre de sesión.
- **Panel de Administrador (Admin Dashboard)**: métricas calculadas desde la API, resumen de inventario, alertas de stock y últimos movimientos.
- **Gestión de Productos**: alta, edición, listado, búsqueda, filtros y eliminación con validaciones y protección de productos con movimientos asociados.
- **Gestión de Categorías**: listado, alta, edición y eliminación mediante formularios reactivos y la API Django; no permite eliminar categorías con productos asociados.
- **Gestión de Movimientos**: registro de entradas, salidas y ajustes, con verificación y actualización de stock en MySQL; historial de consulta sin edición ni eliminación.
- **Panel de Usuario (User Dashboard)**: búsqueda y filtro de productos por categoría, registro de movimientos e historial de movimientos propios.
- **Quiénes Somos**: información del equipo, obtenida dinámicamente desde json-server.
- **Página principal (Landing Page)**: presentación del sistema con navegación general.
- **Página 404**: vista personalizada para rutas inexistentes.
- **Interfaz adaptable**: estados de carga, error y vacío, identidad de la sesión y diseño responsive.

La sección pública “Quiénes somos” todavía obtiene integrantes desde json-server. Esta dependencia es independiente de Django, que sirve autenticación e inventario.

---

## Tecnologías utilizadas

Las versiones frontend exactas se registran en `frontend/package-lock.json`; las del backend, en `backend/requirements.txt`.

| Tecnología | Versión / uso |
|---|---|
| HTML5 y CSS3 | Estructura y estilos de la interfaz |
| Angular | 22.x; SPA y consumo de API mediante HttpClient |
| Angular CLI | 22.1.5 |
| Node.js | 24.x en el entorno utilizado |
| Bootstrap | 5.x; estilos y componentes de interfaz |
| TypeScript | 6.x |
| Python | 3.14 en el entorno probado |
| Django | 6.1.2 |
| Django REST Framework | 3.18.3; API REST con APIView |
| MySQL | 8.4.11 en el entorno probado |
| mysqlclient | 2.3.0; conexión Django–MySQL |
| json-server | 0.17.4; datos de integrantes de Quiénes Somos |
| Postman | Colección de pruebas de la API |
| W3C y Lighthouse | Validación y auditoría de calidad |

## Requisitos

- Node.js y npm compatibles con Angular 22. Entorno utilizado: Node.js 24.
- Python 3.14, utilizado en el entorno probado.
- MySQL **8.4 o superior compatible con Django**. Conexión verificada con 8.4.11; Django 6.1.2 rechaza MySQL 8.0.45.
- Dependencias frontend fijadas en `frontend/package-lock.json` y backend en `backend/requirements.txt` (Django 6.1.2, DRF 3.18.3, mysqlclient 2.3.0).

## Instrucciones para ejecutar el proyecto

Los comandos de Windows se ejecutan en **Símbolo del sistema (CMD)**.

Se necesitan MySQL y Django para los datos de inventario y autenticación, además de Angular para la interfaz. Para cargar también la información de integrantes, iniciar json-server en una terminal adicional. Las guías específicas están en los README de backend, frontend y base de datos.

```cmd
git clone https://github.com/FullStackers-ISPC/ABP-FullStackers.git
cd ABP-FullStackers
```

1. Preparar MySQL y el entorno Python siguiendo [backend/README.md](backend/README.md) y [backend/database/README.md](backend/database/README.md). El orden es crear base/usuario, aplicar migraciones y cargar el seed una sola vez.
2. Desde `backend/`, iniciar Django en Windows:

   ```cmd
   .venv\Scripts\python.exe manage.py runserver
   ```

3. En otra terminal, iniciar Angular:

   ```cmd
   cd frontend
   npm ci
   npm start
   ```

4. Para cargar integrantes de “Quiénes somos”, en una tercera terminal desde `frontend/`:

   ```cmd
   npx json-server --watch db.json --port 3000
   ```

| Servicio o vista | Dirección |
|---|---|
| Angular | `http://localhost:4200` |
| Login | `http://localhost:4200/login` |
| Dashboard administrador | `http://localhost:4200/admin/dashboard` |
| Dashboard usuario | `http://localhost:4200/dashboard/user` |
| Productos Django | `http://localhost:8000/api/v1/productos/` |
| Integrantes json-server | `http://localhost:3000/integrantes` |

El prefijo `/api/v1/` no tiene una vista índice propia; consultar los endpoints del README del backend.

### Credenciales de prueba

Disponibles después de cargar `backend/database/02_seed.sql`:

| Rol | Email | Contraseña |
|---|---|---|
| Usuario | `user@easystock.com` | `user1234` |
| Administrador | `admin@easystock.com` | `admin1234` |

Cuentas académicas locales, no productivas.

## Pruebas y build

Desde `frontend/`:

```cmd
npx ng test --watch=false
npm run build
```

Desde `backend/`, en Windows:

```cmd
.venv\Scripts\python.exe manage.py check --database default
.venv\Scripts\python.exe manage.py test test_dashboard_integracion catalogo --noinput
```

Los tests Django requieren permisos para una base temporal; consultar el README del backend. El build mantiene advertencias de tamaño de bundle y CSS.

Para auditar producción, servir `frontend/dist/frontend/browser` con un servidor estático con compresión y soporte de rutas SPA. Usar el puerto 4200 conserva el origen CORS configurado. No ejecutar simultáneamente ese servidor y `ng serve` en el mismo puerto. Generar el build no convierte un `ng serve` abierto en producción.

## Postman y calidad

- [Colección EV6](docs/postman/EasyStock_EV6.postman_collection.json): importar en Postman de escritorio, comprobar `base_url = http://localhost:8000/api/v1` y ejecutar completa en el orden incluido.
- Requiere Django, MySQL y las cuentas demo; no necesita Angular. Crea datos de prueba y deja movimientos persistentes: usar exclusivamente una base de desarrollo.
- Los informes/capturas Lighthouse, W3C y responsive se entregan por separado como material del documento de calidad/ABP y póster.
- Los cuatro CSS propios evaluados (global, dashboard admin, admin-layout y dashboard usuario) fueron informados sin errores en el perfil CSS 3 + SVG. Esto no certifica todos los estilos ni bibliotecas externas.
- La validación del HTML renderizado **no está aprobada sin errores**: se detectaron atributos Angular no admitidos por el validador y un error de posición de `base`. Consultar el informe; funcionamiento y conformidad HTML son comprobaciones distintas.

## Estructura del proyecto

```text
ABP-FullStackers/
├── backend/
│   ├── config/                       # Configuración Django y rutas raíz /api/v1/
│   │   ├── settings.py               # MySQL, aplicaciones y CORS
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── usuarios/                     # Modelos, serializers, APIViews y rutas de usuarios
│   │   └── migrations/
│   ├── catalogo/                     # Categorías y productos
│   │   └── migrations/
│   ├── movimientos/                  # Historial y registro con actualización de stock
│   │   └── migrations/
│   ├── database/
│   │   ├── 01_schema.sql             # Creación manual alternativa del esquema
│   │   ├── 02_seed.sql               # Datos iniciales académicos
│   │   └── README.md
│   ├── manage.py
│   ├── requirements.txt
│   ├── test_dashboard_integracion.py
│   └── README.md
├── frontend/
│   ├── public/
│   │   ├── assets/                   # Imágenes y recursos estáticos
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/           # Acceso a rutas según el rol de la sesión
│   │   │   │   ├── models/           # Interfaces y contratos de datos
│   │   │   │   ├── services/         # HTTP, autenticación y métricas del dashboard
│   │   │   │   └── utils/
│   │   │   ├── features/admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── categorias/
│   │   │   │   ├── categoria-form/
│   │   │   │   ├── productos/
│   │   │   │   ├── producto-form/
│   │   │   │   ├── movimientos/
│   │   │   │   └── movimiento-form/
│   │   │   ├── layouts/
│   │   │   │   ├── admin-layout/
│   │   │   │   └── auth-layout/
│   │   │   ├── pages/
│   │   │   │   ├── account/          # Registro y vista de recuperación
│   │   │   │   ├── dashboard-user/
│   │   │   │   ├── login/
│   │   │   │   └── not-found/
│   │   │   ├── landing/
│   │   │   ├── quienes-somos/        # Integrantes obtenidos desde json-server
│   │   │   ├── public-layout/
│   │   │   ├── navbar-horizontal/
│   │   │   ├── footer/
│   │   │   ├── shared/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── main.ts
│   ├── db.json                       # Datos de json-server; no es la base MySQL
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── docs/
│   └── postman/
│       └── EasyStock_EV6.postman_collection.json
├── Maqueta/                          # Referencia del diseño original
└── README.md
```

Los tests unitarios Angular (`*.spec.ts`) están junto a los componentes y servicios.


## Flujo de trabajo con Git

- Rama evaluada: `main`.
- Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `test:`).
- Cada integrante trabaja sobre el componente o sección de la que es responsable, evitando pisar código de otros módulos.
- Los cambios se comparten en `develop`, coordinando su integración con el equipo y conservando commits pequeños.

---

## Integrantes del Equipo

| Apellido y Nombre | Usuario de GitHub |
|---|---|
| Requelme, Kevin Agustin | [KevinRequelme](https://github.com/KevinRequelme) |
| Fili, Fausto Santino | [FausFili](https://github.com/FausFili) |
| Moreira, Ignacio Javier | [IgnacioMoreira21](https://github.com/IgnacioMoreira21) |
| Chavez Cuffa, Rodrigo Mateo | [rodrichc](https://github.com/rodrichc) |
| Gonzalez Lara, Daniel Esteban | [dgel92](https://github.com/dgel92) |

---

**Docentes:** Ivana Córsico / Carolina Ahumada
**Grupo:** FullStackers - Comisión B
