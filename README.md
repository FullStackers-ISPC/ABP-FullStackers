# EasyStock - Sistema Web de Gestión de Inventario Interno

## Introducción

**EasyStock** es una aplicación web desarrollada para resolver el problema del control manual de inventario en pequeñas y medianas organizaciones. Muchas empresas gestionan su stock mediante planillas físicas o registros informales, lo que genera pérdida de control sobre el stock real, errores humanos en el registro de entradas y salidas, y falta de trazabilidad en los movimientos de productos.

Este sistema busca digitalizar y centralizar la gestión de inventario, permitiendo el registro, seguimiento y control de productos con alertas de stock bajo y roles diferenciados de administrador y usuario.

El proyecto nació como una maqueta estática en HTML5/CSS3, luego se migró a una Single Page Application (SPA) con Angular, y actualmente **se encuentra conectado a una API de prueba (json-server)**: los datos de productos, categorías, movimientos y usuarios ya no están hardcodeados en los componentes, sino que se consumen de forma asíncrona mediante `HttpClient` y `Observable`.

Proyecto desarrollado en el marco del módulo **Full Stack I** del **Instituto Superior Politécnico de Córdoba (ISPC)** - Año 2026.

---

## Funcionalidades

- **Inicio de sesión y registro con roles**: formularios reactivos conectados a json-server, con validación de credenciales.
- **Panel de Administrador (Admin Dashboard)**: métricas del sistema y gestión de productos (alta, edición, listado con alertas de stock bajo).
- **Gestión de Categorías**: listado, alta y edición de categorías conectado a json-server mediante formularios reactivos (GET, POST y PUT reales).
- **Gestión de Movimientos**: registro de entradas, salidas y ajustes de stock, persistidos en json-server.
- **Panel de Usuario (User Dashboard)**: búsqueda de productos y visualización del historial de movimientos.
- **Quiénes Somos**: información del equipo, obtenida dinámicamente desde json-server.
- **Página principal (Landing Page)**: presentación del sistema con navegación general.
- **Página 404**: vista personalizada para rutas inexistentes.

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Angular | 22.1.3 |
| Node.js | 24.15.0 |
| Angular CLI | 22.1.5 |
| Bootstrap | 5.3.3 |
| TypeScript | ~6.0.2 |
| json-server | usado como API de prueba (backend simulado) |

---

## Instrucciones para ejecutar el proyecto

Esta aplicación necesita **dos servidores corriendo en simultáneo**: Angular (frontend) y json-server (API de prueba). Sin json-server levantado, las pantallas que consumen datos (login, productos, categorías, movimientos, quiénes somos) van a fallar con un error de conexión.

### 1. Clonar el repositorio

```bash
git clone https://github.com/FullStackers-ISPC/ABP-FullStackers.git
cd ABP-FullStackers/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Instalar json-server (si no lo tenés ya)

```bash
npm install -g json-server
```

### 4. Levantar json-server

Desde la carpeta `frontend/` (donde está `db.json`), en una terminal:

```bash
json-server --watch db.json
```

Por defecto queda escuchando en `http://localhost:3000`. Verificá que loguee los endpoints disponibles: `usuarios`, `categorias`, `productos`, `movimientos`.

### 5. Levantar Angular

En **otra terminal**, sin cerrar la anterior:

```bash
ng serve --open
```

Esto abre automáticamente el navegador en [http://localhost:4200](http://localhost:4200). Si no se abre solo, se puede acceder manualmente a esa dirección.

### 6. Build de producción y tests

```bash
ng build   # genera frontend/dist/
ng test    # corre las pruebas unitarias
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Usuario | `user@easystock.com` | `user1234` |
| Administrador | `admin@easystock.com` | `admin1234` |

> Nota: credenciales de entorno de desarrollo/demo únicamente, no representan datos productivos.

---

## Estructura del Proyecto

```
ABP-FullStackers/
├── frontend/
│   ├── public/
│   │   └── img/
│   ├── db.json                     # Base de datos de prueba para json-server
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/         # Interfaces: Categoria, Producto, Movimiento, Usuario
│   │   │   │   └── services/       # CategoriasService, ProductosService, MovimientosService, AuthService
│   │   │   ├── features/
│   │   │   │   └── admin/
│   │   │   │       ├── dashboard/
│   │   │   │       ├── categorias/         # Listado de categorías
│   │   │   │       ├── categoria-form/     # Alta y edición de categorías (form reactivo)
│   │   │   │       ├── productos/
│   │   │   │       ├── producto-form/
│   │   │   │       ├── movimientos/
│   │   │   │       └── movimiento-form/
│   │   │   ├── footer/             # Componente de pie de página compartido
│   │   │   ├── landing/            # Página principal (Home)
│   │   │   ├── layouts/            # AdminLayout, AuthLayout, layouts compartidos
│   │   │   ├── navbar-horizontal/  # Navbar compartida (sitio público)
│   │   │   ├── pages/
│   │   │   │   ├── account/        # Registro / recuperación de cuenta
│   │   │   │   ├── dashboard-user/ # Panel de usuario
│   │   │   │   ├── login/          # Inicio de sesión
│   │   │   │   └── not-found/      # Página 404
│   │   │   ├── public-layout/      # Layout del sitio público (navbar + footer + router-outlet)
│   │   │   ├── quienes-somos/      # Página institucional (datos vía json-server)
│   │   │   ├── shared/             # Componentes, pipes y directivas reutilizables
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
├── Maqueta/                        # Maqueta original en HTML5/CSS3 (referencia de diseño)
└── backend/                        # Aún sin desarrollar; json-server actúa como API de prueba mientras tanto
```

---

## Flujo de trabajo con Git

- Rama evaluada: `main`.
- Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `test:`).
- Cada integrante trabaja sobre el componente o sección de la que es responsable, evitando pisar código de otros módulos.

---

## Integrantes del Equipo

| Apellido y Nombre | Usuario de GitHub |
|---|---|
| Requelme, Kevin Agustin | [@KevinRequelme](https://github.com/KevinRequelme) |
| Fili, Fausto Santino | [@FausFili](https://github.com/FausFili) |
| Moreira, Ignacio Javier | [@IgnacioMoreira21](https://github.com/IgnacioMoreira21) |
| Chavez Cuffa, Rodrigo Mateo | [@rodrichc](https://github.com/rodrichc) |
| Gonzalez Lara, Daniel Esteban | [@dgel92](https://github.com/dgel92) |

---

**Docentes:** Ivana Córsico / Carolina Ahumada
**Grupo:** FullStackers - Comisión B