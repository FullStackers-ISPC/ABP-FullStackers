# EasyStock - Sistema Web de Gestión de Inventario Interno

## Introducción

**EasyStock** es una aplicación web desarrollada para resolver el problema del control manual de inventario en pequeñas y medianas organizaciones. Muchas empresas gestionan su stock mediante planillas físicas o registros informales, lo que genera pérdida de control sobre el stock real, errores humanos en el registro de entradas y salidas, y falta de trazabilidad en los movimientos de productos.

Este sistema busca digitalizar y centralizar la gestión de inventario, permitiendo el registro, seguimiento y control de productos con alertas de stock bajo y roles diferenciados de administrador y usuario.

Proyecto desarrollado en el marco del módulo **Full Stack I** del **Instituto Superior Politécnico de Córdoba (ISPC)** - Año 2026.

---

## Funcionalidades

- **Inicio de sesión con roles**: Acceso diferenciado para Administrador y Usuario con validación de credenciales.
- **Panel de Administrador (Admin Dashboard)**: Visualización de métricas del sistema, gestión de productos (registrar, modificar, actualizar precio, eliminar) y asignación de roles.
- **Panel de Usuario (User Dashboard)**: Registro de movimientos de inventario (entradas, salidas y ajustes de stock), búsqueda de productos y visualización del historial.
- **Página principal (Landing Page)**: Presentación del sistema con navegación general.
- **Quiénes Somos**: Información del equipo y propósito del proyecto.

---

## Instrucciones para ejecutar la Maqueta

La maqueta está desarrollada exclusivamente con HTML5 y CSS3, sin dependencias externas ni frameworks.

1. Clonar o descargar el repositorio:
   ```
   git clone https://github.com/FullStackers-ISPC/ABP-FullStackers.git
   ```
2. Navegar a la carpeta `Maqueta/`:
   ```
   cd ABP-FullStackers/Maqueta
   ```
3. Abrir cualquiera de los archivos HTML directamente en el navegador:
   - `index.html` — Página principal / Landing Page
   - `login.html` — Inicio de sesión
   - `dashboard-user.html` — Panel de usuario
   - `dashboard-admin.html` — Panel de administrador
   - `quienes-somos.html` — Quiénes somos

No se requiere servidor ni instalación adicional.
Opcionalmente podría ejecutarlo con el plugin Live Server de Visual Studio Code.

---

## Estructura del Proyecto

```
ABP-FullStackers/
├── Maqueta/
│   ├── css/
│   │   ├── global.css
│   │   ├── home.css
│   │   ├── login.css
│   │   ├── dashboard-user.css
│   │   ├── dashboard-admin.css
│   │   └── quienes-somos.css
│   ├── img/
│   ├── index.html
│   ├── login.html
│   ├── dashboard-user.html
│   ├── dashboard-admin.html
│   └── quienes-somos.html
└── backend/
```

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
