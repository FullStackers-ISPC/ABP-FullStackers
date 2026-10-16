CREATE DATABASE IF NOT EXISTS easystock
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'easystock_app'@'localhost'
    IDENTIFIED BY 'EasyStock2026!';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
ON easystock.* TO 'easystock_app'@'localhost';

FLUSH PRIVILEGES;

USE easystock;


-- =========================
-- TABLA ROL
-- =========================

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,

    CONSTRAINT chk_rol_nombre
        CHECK (nombre IN ('admin', 'usuario'))
) ENGINE=InnoDB;


-- =========================
-- TABLA USUARIO
-- =========================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_usuario_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) BETWEEN 2 AND 100),

    CONSTRAINT chk_usuario_apellido
        CHECK (CHAR_LENGTH(TRIM(apellido)) BETWEEN 2 AND 100),

    CONSTRAINT chk_usuario_email
        CHECK (email LIKE '%_@_%._%'),

    CONSTRAINT chk_usuario_password
        CHECK (CHAR_LENGTH(password) >= 8),

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================
-- TABLA CATEGORIAS
-- =========================

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_categorias_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) BETWEEN 3 AND 50)
) ENGINE=InnoDB;


-- =========================
-- TABLA PRODUCTOS
-- =========================

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    stock_actual INT UNSIGNED NOT NULL DEFAULT 0,
    stock_alerta INT UNSIGNED NOT NULL,
    stock_critico INT UNSIGNED NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_productos_codigo
        CHECK (CHAR_LENGTH(TRIM(codigo)) BETWEEN 3 AND 30),

    CONSTRAINT chk_productos_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) BETWEEN 3 AND 100),

    CONSTRAINT chk_productos_stock_actual
        CHECK (stock_actual >= 0),

    CONSTRAINT chk_productos_stock_alerta
        CHECK (stock_alerta >= 0),

    CONSTRAINT chk_productos_stock_critico
        CHECK (stock_critico >= 0),

    CONSTRAINT chk_productos_stock_critico_menor_alerta
        CHECK (stock_critico < stock_alerta),

    CONSTRAINT chk_productos_precio
        CHECK (precio > 0),

    CONSTRAINT fk_productos_categorias
        FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================
-- TABLA MOVIMIENTOS
-- =========================

CREATE TABLE movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,

    tipo ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL,

    cantidad INT NOT NULL,
    stock_anterior INT UNSIGNED NOT NULL,
    stock_resultante INT UNSIGNED NOT NULL,

    observacion VARCHAR(255),

    fecha_movimiento DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,

    CONSTRAINT chk_movimientos_cantidad_por_tipo
        CHECK (
            (tipo IN ('ENTRADA', 'SALIDA') AND cantidad > 0)
            OR
            (tipo = 'AJUSTE' AND cantidad <> 0)
        ),

    CONSTRAINT chk_movimientos_stock_anterior
        CHECK (stock_anterior >= 0),

    CONSTRAINT chk_movimientos_stock_resultante
        CHECK (stock_resultante >= 0),

    CONSTRAINT fk_movimientos_productos
        FOREIGN KEY (id_producto)
        REFERENCES productos(id_producto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_movimientos_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;


-- =========================
-- INDICES
-- =========================

CREATE INDEX idx_productos_categoria
    ON productos(id_categoria);

CREATE INDEX idx_movimientos_producto_fecha
    ON movimientos(id_producto, fecha_movimiento);

CREATE INDEX idx_movimientos_usuario_fecha
    ON movimientos(id_usuario, fecha_movimiento);
