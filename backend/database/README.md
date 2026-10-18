# Base de datos de EasyStock

## Requisitos

- MySQL 8.0.16 o superior, porque el esquema usa restricciones `CHECK`.
- Un cliente MySQL, por ejemplo MySQL Workbench o la consola `mysql`.

## Archivos

- `01_schema.sql`: crea la base `easystock`, el usuario de aplicación, las tablas, claves foráneas, restricciones e índices.
- `02_seed.sql`: carga 2 roles, 2 usuarios de prueba, 5 categorías, 22 productos y 8 movimientos.

Los datos de usuarios son académicos. Las contraseñas se guardan sin hash porque ese mecanismo no forma parte del contenido trabajado por el equipo en esta evidencia.

## Carga manual del esquema y los datos

Desde MySQL Workbench, abrir y ejecutar primero `01_schema.sql` y luego `02_seed.sql`.

Desde la terminal, **Símbolo del sistema (CMD)**, ubicándose en la carpeta `Backend`:

```cmd
mysql -u root -p < database/01_schema.sql
mysql -u root -p easystock < database/02_seed.sql
```

## Verificación

```sql
USE easystock;

SHOW TABLES;
SELECT COUNT(*) AS categorias FROM categorias;
SELECT COUNT(*) AS productos FROM productos;
SELECT COUNT(*) AS movimientos FROM movimiento;
```

El resultado esperado es 5 categorías, 22 productos y 8 movimientos.

## Relación con las migraciones de Django

En desarrollo, Django debe crear la estructura mediante:

```powershell
python manage.py migrate
```

No se debe ejecutar el script y luego ejecutar migraciones sobre la misma base vacía, porque ambos intentan crear las mismas tablas. El script se entrega como creación reproducible y referencia del modelo físico; las migraciones son el mecanismo diario de Django.

El modelo `Categoria` de Django usa la tabla `categorias`. El modelo `Producto` debe usar una clave foránea llamada `categoria`, con `db_column='id_categoria'`, hacia esa tabla.
