# EasyStock - Sistema Web de Gestión de Inventario Interno

## Introducción

**EasyStock** es una aplicación web desarrollada para resolver el problema del control manual de inventario en pequeñas y medianas organizaciones. Muchas empresas gestionan su stock mediante planillas físicas o registros informales, lo que genera pérdida de control sobre el stock real, errores humanos en el registro de entradas y salidas, y falta de trazabilidad en los movimientos de productos.

Este sistema busca digitalizar y centralizar la gestión de inventario, permitiendo el registro, seguimiento y control de productos con alertas de stock bajo y roles diferenciados de administrador y usuario.

El proyecto nació como una maqueta estática en HTML5/CSS3 y se encuentra actualmente **en migración a una Single Page Application (SPA) con Angular**, aplicando arquitectura basada en componentes standalone, ruteo con rutas anidadas y formularios reactivos.

Proyecto desarrollado en el marco del módulo **Full Stack I** del **Instituto Superior Politécnico de Córdoba (ISPC)** - Año 2026.

---

## Funcionalidades

- **Inicio de sesión con roles**: Acceso diferenciado para Administrador y Usuario con validación de credenciales.
- **Panel de Administrador (Admin Dashboard)**: Visualización de métricas del sistema, gestión de productos (registrar, modificar, actualizar precio, eliminar) y asignación de roles.
- **Panel de Usuario (User Dashboard)**: Registro de movimientos de inventario (entradas, salidas y ajustes de stock), búsqueda de productos y visualización del historial.
- **Página principal (Landing Page)**: Presentación del sistema con navegación general.
- **Quiénes Somos**: Información del equipo y propósito del proyecto.
- **Página 404**: Vista personalizada para rutas inexistentes.

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Angular | 22.1.3 |
| Node.js | 24.15.0 |
| Angular CLI | 22.1.5 |
| Bootstrap | 5.3.3 |
| TypeScript | ~6.0.2 |

---

## Instrucciones para ejecutar el proyecto (Angular)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/FullStackers-ISPC/ABP-FullStackers.git
   ```
2. Navegar a la carpeta `frontend/`:
   ```bash
   cd ABP-FullStackers/frontend
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```
4. Levantar el servidor de desarrollo:
   ```bash
   ng serve --open
   ```
   Esto abre automáticamente el navegador en [http://localhost:4200](http://localhost:4200). Si no se abre solo, se puede acceder manualmente a esa dirección.

5. Para generar el build de producción:
   ```bash
   ng build
   ```
   Los archivos compilados se generan en `frontend/dist/`.

6. Para correr las pruebas unitarias:
   ```bash
   ng test
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
│   │   ├── assets/
│   │   └── img/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Servicios, guards e interceptores transversales
│   │   │   ├── features/           # Lógica de negocio agrupada por dominio
│   │   │   ├── footer/             # Componente de pie de página compartido
│   │   │   ├── landing/            # Página principal (Home)
│   │   │   ├── layouts/            # Layouts compartidos
│   │   │   ├── navbar-horizontal/  # Navbar compartida (sitio público)
│   │   │   ├── pages/
│   │   │   │   ├── account/        # Registro / recuperación de cuenta
│   │   │   │   ├── dashboard-user/ # Panel de usuario
│   │   │   │   ├── login/          # Inicio de sesión
│   │   │   │   └── not-found/      # Página 404
│   │   │   ├── public-layout/      # Layout del sitio público (navbar + footer + router-outlet)
│   │   │   ├── quienes-somos/      # Página institucional
│   │   │   ├── shared/             # Componentes, pipes y directivas reutilizables
│   │   │   ├── app.config.ts
│   │   │   ├── app.css
│   │   │   ├── app.html
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── index.html
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
├── Maqueta/                        # Maqueta original en HTML5/CSS3 (referencia de diseño)
└── backend/
```

> La carpeta `Maqueta/` se conserva como referencia visual y de contenido durante la migración, pero el desarrollo activo ocurre exclusivamente en `frontend/`.

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