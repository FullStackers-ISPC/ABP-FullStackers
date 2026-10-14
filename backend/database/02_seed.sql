USE easystock;

-- Roles y usuarios de prueba. Las contraseñas se almacenan sin hash por alcance académico.
INSERT INTO rol (id_rol, nombre) VALUES
    (1, 'admin'),
    (2, 'usuario');

INSERT INTO usuario (
    id_usuario, nombre, apellido, email, password,
    id_rol, ciudad, provincia, activo
) VALUES
    (1, 'Administrador', 'EasyStock', 'admin@easystock.com', 'admin1234', 1, 'Córdoba', 'Córdoba', TRUE),
    (2, 'Usuario', 'Demo', 'user@easystock.com', 'user1234', 2, 'Córdoba', 'Córdoba', TRUE);

INSERT INTO categorias (id_categoria, nombre, descripcion) VALUES
    (1, 'Procesadores', 'CPUs de escritorio para gaming y productividad.'),
    (2, 'Tarjetas Gráficas', 'Placas de video para gaming, diseño y renderizado.'),
    (3, 'Memorias RAM', 'Módulos de memoria RAM DDR4 y DDR5.'),
    (4, 'Almacenamiento', 'Discos SSD, NVMe y HDD.'),
    (5, 'Placas Madre', 'Motherboards compatibles con los procesadores del catálogo.');

INSERT INTO productos (
    id_producto, codigo, nombre, descripcion, stock_actual,
    stock_alerta, stock_critico, precio, id_categoria, activo
) VALUES
    (1, 'CPU-001', 'AMD Ryzen 7 9800X3D', 'Procesador de alto rendimiento para gaming.', 15, 10, 5, 450.00, 1, TRUE),
    (2, 'CPU-002', 'Intel Core i7-14700K', NULL, 12, 10, 5, 400.00, 1, TRUE),
    (3, 'CPU-003', 'AMD Ryzen 7 7700', NULL, 9, 5, 2, 330.00, 1, TRUE),
    (4, 'GPU-001', 'XFX Radeon RX 9070 XT 16GB', 'Placa de video para gaming 4K.', 3, 5, 2, 850.00, 2, TRUE),
    (5, 'GPU-002', 'RTX 5070 Ti 16GB', NULL, 11, 10, 5, 750.00, 2, TRUE),
    (6, 'GPU-003', 'RTX 5060 Ti 8GB', NULL, 13, 10, 5, 400.00, 2, TRUE),
    (7, 'CPU-004', 'AMD Ryzen 5 5500', 'Procesador de entrada con buena relación calidad-precio.', 1, 5, 2, 100.00, 1, TRUE),
    (8, 'RAM-001', 'Kingston Fury Beast DDR5 32GB', NULL, 18, 10, 5, 120.00, 3, TRUE),
    (9, 'RAM-002', 'G.Skill Trident Z5 32GB', NULL, 14, 10, 5, 135.00, 3, TRUE),
    (10, 'RAM-003', 'Corsair Vengeance DDR5 16GB', NULL, 20, 10, 5, 65.00, 3, TRUE),
    (11, 'RAM-004', 'Corsair Vengeance DDR5 32GB 6000MHz', NULL, 4, 5, 2, 140.00, 3, TRUE),
    (12, 'CPU-005', 'AMD Ryzen 9 9950X', 'Procesador para productividad pesada.', 1, 5, 2, 650.00, 1, TRUE),
    (13, 'STO-001', 'Seagate Barracuda 4TB', NULL, 6, 10, 5, 85.00, 4, TRUE),
    (14, 'STO-002', 'WD Black SN850X 2TB', 'NVMe Gen4 de alta velocidad.', 17, 10, 5, 160.00, 4, TRUE),
    (15, 'STO-003', 'Kingston NV3 1TB', NULL, 21, 10, 5, 60.00, 4, TRUE),
    (16, 'GPU-004', 'AMD Radeon 6600XT 8GB', NULL, 5, 10, 2, 240.00, 2, TRUE),
    (17, 'GPU-005', 'RTX 4060 8GB', NULL, 16, 10, 5, 300.00, 2, TRUE),
    (18, 'GPU-006', 'RTX 4070 Super', NULL, 10, 5, 2, 600.00, 2, TRUE),
    (19, 'STO-004', 'Crucial P3 Plus 1TB', NULL, 19, 10, 5, 55.00, 4, TRUE),
    (20, 'STO-005', 'Samsung 990 PRO 2TB NVMe', NULL, 1, 5, 2, 170.00, 4, TRUE),
    (21, 'STO-006', 'Lexar NM790 2TB', NULL, 13, 10, 5, 130.00, 4, TRUE),
    (22, 'CPU-006', 'AMD Ryzen 5 5600', NULL, 7, 10, 5, 135.00, 1, TRUE);

INSERT INTO movimientos (
    id_movimiento, tipo, cantidad, stock_anterior, stock_resultante,
    observacion, fecha_movimiento, id_producto, id_usuario
) VALUES
    (1, 'ENTRADA', 5, 0, 5, 'Ingreso inicial de unidades.', '2026-05-08 09:00:00', 4, 1),
    (2, 'SALIDA', 2, 14, 12, 'Salida para armado de equipos.', '2026-05-09 10:30:00', 2, 2),
    (3, 'ENTRADA', 1, 0, 1, 'Ingreso de disco para reposición.', '2026-05-09 12:00:00', 20, 1),
    (4, 'AJUSTE', -3, 4, 1, 'Ajuste por inventario físico.', '2026-05-10 09:15:00', 7, 2),
    (5, 'SALIDA', 4, 8, 4, 'Salida para mantenimiento.', '2026-05-10 11:45:00', 11, 2),
    (6, 'ENTRADA', 10, 0, 10, 'Ingreso de proveedor.', '2026-05-10 15:00:00', 18, 1),
    (7, 'SALIDA', 2, 5, 3, 'Salida para venta interna.', '2026-05-11 10:00:00', 4, 2),
    (8, 'AJUSTE', 1, 0, 1, 'Corrección de conteo físico.', '2026-05-11 14:20:00', 12, 1);
