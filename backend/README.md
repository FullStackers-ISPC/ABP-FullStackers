## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

2. Crear y activar un entorno virtual:

```bash
python -m venv env
```

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

3. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

4. Ejecutar las migraciones:

```bash
python manage.py migrate
```

5. Iniciar el servidor:

```bash
python manage.py runserver
```

La aplicación estará disponible en `http://127.0.0.1:8000/`.


## Módulo: Usuarios y Autenticación

**Base URL:** `/api/v1/usuarios/`

### 1. Iniciar sesión (Login)

- **Método:** `POST`
- **Ruta:** `/api/v1/usuarios/login/`

**Request Body:**

```json
{
  "email": "admin@sistema.com",
  "password": "admin"
}
```

**Respuesta exitosa (`200 OK`):**

```json
{
  "id_usuario": 1,
  "nombre": "Admin",
  "apellido": "General",
  "email": "admin@sistema.com",
  "rol": "admin"
}
```

**Errores posibles:**
- `400 Bad Request`: campos faltantes.
- `401 Unauthorized`: credenciales inválidas.
- `403 Forbidden`: usuario inactivo.

### 2. Registro de Usuario

- **Método:** `POST`
- **Ruta:** `/api/v1/usuarios/registro/`

**Request Body:**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@test.com",
  "password": "Password123",
  "ciudad": "Córdoba",
  "provincia": "Córdoba",
  "id_rol": 2
}
```

**Respuesta exitosa (`201 Created`):**

```json
{
  "id_usuario": 2,
  "email": "juan@test.com",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "usuario"
}
```

**Errores posibles:**
- `400 Bad Request`: email duplicado o campos inválidos.

### 3. Listar Usuarios

- **Método:** `GET`
- **Ruta:** `/api/v1/usuarios/`

**Respuesta exitosa (`200 OK`):**

```json
[
  {
    "id_usuario": 1,
    "email": "admin@sistema.com",
    "nombre": "Admin",
    "apellido": "General",
    "id_rol": 1,
    "rol_nombre": "admin",
    "ciudad": "Córdoba",
    "provincia": "Córdoba",
    "activo": true
  },
  {
    "id_usuario": 1,
    ...
  },
]
```

### 4. Detalle de Usuario

- **Método:** `GET`
- **Ruta:** `/api/v1/usuarios/<id>/`

**Respuesta exitosa (`200 OK`):**

```json
{
  "id_usuario": 1,
  "email": "admin@sistema.com",
  "nombre": "Admin",
  "apellido": "General",
  "id_rol": 1,
  "rol_nombre": "admin",
  "ciudad": "Córdoba",
  "provincia": "Córdoba",
  "activo": true
}
```

**Errores posibles:**
- `404 Not Found`: usuario no encontrado.

### 5. Actualizar Usuario

- **Método:** `PUT`
- **Ruta:** `/api/v1/usuarios/<id>/`

**Request Body (parcial o total):**

```json
{
  "nombre": "Juan Carlos",
  "ciudad": "Villa Carlos Paz"
}
```

**Respuesta exitosa (`200 OK`):**

Devuelve el objeto `Usuario` actualizado.

**Errores posibles:**
- `400 Bad Request`: datos inválidos.
- `404 Not Found`: usuario no encontrado.

### 6. Eliminar Usuario

- **Método:** `DELETE`
- **Ruta:** `/api/v1/usuarios/<id>/`

**Respuesta exitosa (`204 No Content`):**

No devuelve contenido en el cuerpo de la respuesta.

**Errores posibles:**
- `404 Not Found`: usuario no encontrado.
