-- Script para insertar datos de prueba en ciudades y terminales
-- Ejecutar este script si las tablas están vacías

-- Insertar ciudades de prueba (solo si no existen)
INSERT IGNORE INTO ciudades (nombre, created_at) VALUES
('Quito', NOW()),
('Guayaquil', NOW()),
('Cuenca', NOW()),
('Ambato', NOW()),
('Ibarra', NOW()),
('Loja', NOW()),
('Riobamba', NOW()),
('Babahoyo', NOW()),
('Manta', NOW()),
('Machala', NOW());

-- Insertar terminales de prueba (solo si no existen)
INSERT IGNORE INTO terminales (nombre, ciudad_id, direccion, created_at) VALUES
('Quitumbe', 1, 'Av. Morán Valverde y Amaru Ñan', NOW()),
('Carcelén', 1, 'Av. Panamericana Norte y García Moreno', NOW()),
('Terminal Terrestre de Guayaquil', 2, 'Av. Jaime Roldós Aguilera', NOW()),
('Terminal Terrestre de Cuenca', 3, 'Av. España y Huayna Cápac', NOW()),
('Terminal Terrestre de Ambato', 4, 'Av. de los Guaytambos y Unidad Nacional', NOW()),
('Terminal Terrestre de Ibarra', 5, 'Av. Teodoro Gómez de la Torre', NOW()),
('Terminal Terrestre de Loja', 6, 'Av. Gran Colombia y José Antonio Eguiguren', NOW()),
('Terminal Terrestre de Riobamba', 7, 'Av. La Prensa y Daniel León Borja', NOW()),
('Terminal Terrestre de Babahoyo', 8, 'Av. 10 de Agosto', NOW()),
('Terminal Terrestre de Manta', 9, 'Av. 4 de Noviembre', NOW()),
('Terminal Terrestre de Machala', 10, 'Av. Las Palmeras');

-- Verificar que se insertaron los datos
SELECT 'Ciudades insertadas:' as info;
SELECT id, nombre, created_at FROM ciudades ORDER BY id;

SELECT 'Terminales insertados:' as info;
SELECT t.id, t.nombre, c.nombre as ciudad, t.direccion, t.created_at 
FROM terminales t 
JOIN ciudades c ON t.ciudad_id = c.id 
ORDER BY c.nombre, t.nombre;
