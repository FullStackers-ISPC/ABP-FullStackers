# Base de datos de EasyStock

## Requisitos

MySQL 8.4 o superior compatible con Django 6.1.2. Entorno verificado: 8.4.11.

Se necesita una conexión administrativa MySQL Workbench y el entorno Python descrito en [../README.md](../README.md).

## Inicialización recomendada para Django

### 1. Crear solamente la base y el usuario

Como administrador, ejecutar:

```sql
CREATE DATABASE IF NOT EXISTS easystock
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'easystock_app'@'localhost'
    IDENTIFIED BY 'EasyStock2026!';

GRANT ALL PRIVILEGES ON easystock.* TO 'easystock_app'@'localhost';
```

### 2. Crear tablas mediante migraciones

Desde `backend/`, en Windows:

```cmd
.venv\Scripts\python.exe manage.py check --database default
.venv\Scripts\python.exe manage.py migrate
```

No ejecutar `01_schema.sql` antes: las migraciones crean las tablas y registran su historial.

### 3. Cargar datos demo una sola vez

En Workbench, abrir y ejecutar `02_seed.sql` después de las migraciones y con las tablas de negocio vacías. Incluye `USE easystock;`.

Alternativa desde **CMD**, ubicado en `backend/` y con el cliente MySQL en PATH:

```cmd
mysql -u easystock_app -p easystock < database/02_seed.sql
```

Ejecutar este comando en Símbolo del sistema (CMD). El seed utiliza identificadores fijos: no repetirlo sobre datos existentes ni vaciar tablas para forzar su carga.

### 4. Verificar

```sql
USE easystock;
SHOW TABLES;
SELECT COUNT(*) AS roles FROM rol;
SELECT COUNT(*) AS usuarios FROM usuario;
SELECT COUNT(*) AS categorias FROM categorias;
SELECT COUNT(*) AS productos FROM productos;
SELECT COUNT(*) AS movimientos FROM movimiento;
```

Carga inicial esperada: 2 roles, 2 usuarios, 5 categorías, 22 productos y 8 movimientos. Las pruebas posteriores pueden cambiar las cantidades. Es una instantánea demo; importar los movimientos no vuelve a aplicarlos al stock.

Cuentas: `admin@easystock.com` / `admin1234` y `user@easystock.com` / `user1234`. Las contraseñas se almacenan sin hash en esta implementación académica.

## Script de esquema: alternativa, no paso adicional

`01_schema.sql` se entrega como script del modelo físico: crea base, usuario y tablas de negocio. No registra las migraciones ni crea todas las tablas internas de Django.

No mezclarlo con `migrate` sobre las mismas tablas ni usar `--fake` sin revisar la compatibilidad. Para reproducir el entorno comprobado con la aplicación, seguir base/usuario → migraciones → `02_seed.sql`.


