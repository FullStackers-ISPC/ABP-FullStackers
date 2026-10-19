# Backend EasyStock

API Django REST Framework organizada en `usuarios`, `catalogo` (categorías y productos) y `movimientos`. Las vistas de la API heredan de `APIView`.

## Instalación local

Entorno probado: Python 3.14, Django 6.1.2 y MySQL 8.4.11. Dependencias exactas en `requirements.txt`. MySQL 8.0 no es compatible con la versión de Django instalada.

Desde la raíz del repositorio, en Símbolo del sistema (CMD):

```cmd
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

No es necesario activar el entorno si se utiliza su ejecutable directamente. En Linux/macOS, usar `python3 -m venv .venv` y `.venv/bin/python` en lugar del ejecutable de Windows; mysqlclient puede requerir herramientas y bibliotecas de compilación del sistema.

Preparar la base siguiendo [database/README.md](database/README.md): crear base y usuario, ejecutar migraciones y cargar los datos iniciales una sola vez. No crear las mismas tablas con el script de esquema y las migraciones.

Configuración actual de desarrollo en `config/settings.py`:

| Parámetro | Valor |
|---|---|
| Motor | `django.db.backends.mysql` |
| Base | `easystock` |
| Usuario | `easystock_app` |
| Contraseña demo | `EasyStock2026!` |
| Host / puerto | `localhost:3306` |

Comprobar y arrancar, desde `backend/`:

```cmd
.venv\Scripts\python.exe manage.py check --database default
.venv\Scripts\python.exe manage.py showmigrations
.venv\Scripts\python.exe manage.py runserver
```

API local: `http://localhost:8000/api/v1/`. El prefijo no tiene una vista índice: comprobar, por ejemplo, `/api/v1/productos/`. El administrador Django es `/admin/` y utiliza un superusuario creado por `createsuperuser`, distinto de los usuarios demo de EasyStock.

CORS admite `http://localhost:4200`. Si se cambia el origen frontend, revisar `CORS_ALLOWED_ORIGINS`; no desactivar CORS indiscriminadamente.

## Endpoints

Todas las rutas llevan barra final. `{id}` representa un identificador existente.

| Método | Ruta | Resultado habitual |
|---|---|---|
| POST | `/api/v1/usuarios/registro/` | 201; 400 si datos inválidos |
| POST | `/api/v1/usuarios/login/` | 200; 400 faltantes, 401 credenciales inválidas, 403 inactivo |
| GET | `/api/v1/usuarios/` | 200 |
| GET, PUT, DELETE | `/api/v1/usuarios/{id}/` | 200 lectura/actualización, 204 eliminación, 400 validación, 404 inexistente |
| GET, POST | `/api/v1/productos/categorias/` | 200 listado, 201 creación, 400 validación |
| GET, PUT, DELETE | `/api/v1/productos/categorias/{id}/` | 200, 204, 400 si inválida o con productos, 404 |
| GET, POST | `/api/v1/productos/` | 200 listado, 201 creación, 400 validación |
| GET, PUT, DELETE | `/api/v1/productos/{id}/` | 200, 204, 400 si inválido o con movimientos, 404 |
| GET, POST | `/api/v1/movimientos/` | 200 listado, 201 creación, 400 validación/stock |
| GET | `/api/v1/movimientos/{id}/` | 200 o 404 |

Movimientos permite filtrar por `?tipo=salida` y `?producto=1`. No se edita ni elimina su historial: PUT y DELETE devuelven 405. Las relaciones recibidas se validan y pueden devolver 400 por una referencia inválida; el POST de movimientos también consulta al usuario y puede devolver 404.

Los códigos de la tabla describen los flujos controlados; no garantizan que cualquier operación sobre referencias protegidas esté manejada. En particular, la eliminación de usuarios con movimientos requiere revisión: la vista actual no captura explícitamente la protección de la relación.

## Ejemplos JSON

Los IDs de estos ejemplos corresponden al seed. Usar códigos/emails nuevos si ya existen.

### Login

```json
{
  "email": "admin@easystock.com",
  "password": "admin1234"
}
```

Respuesta 200:

```json
{
  "id_usuario": 1,
  "nombre": "Administrador",
  "apellido": "EasyStock",
  "email": "admin@easystock.com",
  "rol": "admin"
}
```

Ejemplo de error de credenciales (401):

```json
{"error": "Credenciales inválidas."}
```

### Registro

```json
{
  "nombre": "Persona",
  "apellido": "Prueba",
  "email": "persona.prueba@example.com",
  "password": "Prueba1234",
  "ciudad": "Córdoba",
  "provincia": "Córdoba",
  "id_rol": 2
}
```

La respuesta 201 incluye `id_usuario`, `email`, `nombre`, `apellido` y `rol`. El listado y detalle usan `id_rol` y `rol_nombre` y no exponen la contraseña. El PUT de usuario admite actualización parcial en la implementación actual.

### Categoría

```json
{
  "nombre": "Accesorios de prueba",
  "descripcion": "Categoría de demostración"
}
```

### Producto

```json
{
  "codigo": "QA-DOC-001",
  "nombre": "Producto de prueba",
  "descripcion": "Ejemplo de alta",
  "stock_actual": 15,
  "stock_alerta": 10,
  "stock_critico": 5,
  "precio": "450.00",
  "categoria": 1
}
```

Código único de 3 a 30 caracteres, nombre de 3 a 100, descripción opcional, stocks no negativos, precio mínimo 0.01 y stock crítico menor que stock de alerta. `categoria` recibe el ID de una categoría existente.

### Movimiento

```json
{
  "producto": 1,
  "usuario": 2,
  "tipo": "salida",
  "cantidad": 2
}
```

Reglas implementadas:

- Entrada: cantidad positiva, suma stock.
- Salida: cantidad positiva, resta stock.
- Ajuste: diferencia con signo, distinta de cero; **se suma al stock actual**, no fija un stock absoluto.
- Si el resultado queda negativo, devuelve 400 sin registrar el movimiento ni cambiar stock.
- No permite movimientos sobre productos inactivos.
- Registro y actualización de stock se ejecutan en una transacción con bloqueo del producto.

Los errores de validación pueden ser objetos por campo (listas o mensajes); no todos usan la clave `error`. El frontend debe conservar el detalle útil.

## Pruebas

Desde `backend/`:

```cmd
.venv\Scripts\python.exe manage.py test test_dashboard_integracion catalogo --noinput
```

Django crea y elimina una base temporal, normalmente `test_easystock`. El permiso de la aplicación sobre `easystock.*` no concede automáticamente acceso a esa base. Si las pruebas fallan por permisos, el administrador puede conceder acceso **solo a la base temporal local**:

```sql
GRANT ALL PRIVILEGES ON test_easystock.* TO 'easystock_app'@'localhost';
```

No sustituir esta comprobación por tests que escriban sobre los datos demo. Evitar ejecuciones simultáneas sobre la misma base temporal.

La [colección Postman](../docs/postman/EasyStock_EV6.postman_collection.json) cubre casos correctos y de error. Importar en Postman de escritorio y ejecutar completa/en orden sobre una base de desarrollo con las cuentas demo. Crea datos persistentes; no usar en producción.

## Problemas frecuentes

- `No module named django/MySQLdb`: instalar requirements usando el Python de `.venv`.
- Error 1045: comprobar usuario, contraseña y permisos en la misma instancia/puerto de MySQL.
- Versión MySQL no compatible: usar 8.4 o superior compatible con Django; no omitir la comprobación de versión.
- Tabla inexistente: comprobar migraciones y base seleccionada.
- Login demo inválido: verificar que el seed fue cargado; la vieja base SQLite no se migra a MySQL automáticamente.
- Error CORS: usar frontend en `http://localhost:4200` o coordinar el cambio de configuración.

## Alcance y seguridad

Entorno académico con `DEBUG=True`, secretos de desarrollo en settings y contraseñas de usuarios sin hash. La sesión y el rol se guardan en el frontend; no hay autenticación/autorización de API equivalente a un despliegue productivo. No exponer a Internet ni usar información real. Las limitaciones no se solucionan solamente generando el build frontend.
