-- ====================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - SISTEMA DE TRANSPORTE
-- Versión: 2.0 - Arquitectura Multi-Rol
-- Fecha: 2025-07-24
-- ====================================================================

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS sistema_transporte;
USE sistema_transporte;

-- ====================================================================
-- TABLA PRINCIPAL: USUARIOS (Datos comunes para todos los roles)
-- ====================================================================
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    rol ENUM('usuario', 'cooperativa', 'superusuario') NOT NULL,
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    email_verificado BOOLEAN DEFAULT FALSE,
    fecha_ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimización
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
);

-- ====================================================================
-- TABLA: USUARIOS FINALES (Datos específicos para usuarios regulares)
-- ====================================================================
DROP TABLE IF EXISTS usuarios_finales;
CREATE TABLE usuarios_finales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE,
    fecha_nacimiento DATE,
    genero ENUM('masculino', 'femenino', 'otro'),
    direccion TEXT,
    ciudad VARCHAR(50),
    foto_perfil VARCHAR(255),
    preferencias_notificacion JSON,
    puntos_fidelidad INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relación con tabla usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_cedula (cedula),
    INDEX idx_nombres (nombres, apellidos)
);

-- ====================================================================
-- TABLA: USUARIOS COOPERATIVAS (Datos específicos para cooperativas)
-- ====================================================================
DROP TABLE IF EXISTS usuarios_cooperativas;
CREATE TABLE usuarios_cooperativas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_cooperativa VARCHAR(150) NOT NULL,
    ruc VARCHAR(20) UNIQUE NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    representante_legal VARCHAR(150) NOT NULL,
    cedula_representante VARCHAR(20) NOT NULL,
    direccion_matriz TEXT NOT NULL,
    ciudad_matriz VARCHAR(50) NOT NULL,
    telefono_fijo VARCHAR(15),
    pagina_web VARCHAR(255),
    logo_cooperativa VARCHAR(255),
    fecha_constitucion DATE,
    numero_socios INT DEFAULT 0,
    estado_juridico ENUM('activa', 'inactiva', 'en_tramite') DEFAULT 'en_tramite',
    documentos_legales JSON, -- Para almacenar rutas de documentos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relación con tabla usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Índices
    INDEX idx_ruc (ruc),
    INDEX idx_nombre_cooperativa (nombre_cooperativa),
    INDEX idx_estado_juridico (estado_juridico)
);

-- ====================================================================
-- TABLAS EXISTENTES ACTUALIZADAS
-- ====================================================================

-- Tabla ciudades (sin cambios)
DROP TABLE IF EXISTS ciudades;
CREATE TABLE ciudades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla terminales (sin cambios)
DROP TABLE IF EXISTS terminales;
CREATE TABLE terminales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion TEXT,
    ciudadId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ciudadId) REFERENCES ciudades(id) ON DELETE CASCADE
);

-- Tabla cooperativas (ACTUALIZADA - ahora referencia a usuarios_cooperativas)
DROP TABLE IF EXISTS cooperativas;
CREATE TABLE cooperativas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_cooperativa_id INT NOT NULL,
    codigo_cooperativa VARCHAR(20) UNIQUE NOT NULL,
    estado_operativo ENUM('operativa', 'suspendida', 'revision') DEFAULT 'revision',
    rutas_asignadas JSON,
    flota_total INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_cooperativa_id) REFERENCES usuarios_cooperativas(id) ON DELETE CASCADE,
    INDEX idx_codigo (codigo_cooperativa)
);

-- Tabla conductores (ACTUALIZADA)
DROP TABLE IF EXISTS conductores;
CREATE TABLE conductores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT, -- Puede ser NULL si el conductor no tiene cuenta de usuario
    cooperativa_id INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    licencia_conducir VARCHAR(50) NOT NULL,
    tipo_licencia ENUM('C', 'D', 'E') NOT NULL,
    fecha_vence_licencia DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT,
    foto VARCHAR(255),
    estado ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo',
    fecha_ingreso DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (cooperativa_id) REFERENCES cooperativas(id) ON DELETE CASCADE,
    
    INDEX idx_cedula (cedula),
    INDEX idx_licencia (licencia_conducir)
);

-- Tabla unidades (ACTUALIZADA)
DROP TABLE IF EXISTS unidades;
CREATE TABLE unidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cooperativa_id INT NOT NULL,
    conductor_id INT NULL,
    numero_unidad VARCHAR(20) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    año INT NOT NULL,
    capacidad_pasajeros INT NOT NULL,
    tipo_combustible ENUM('diesel', 'gasolina', 'gas', 'electrico') DEFAULT 'diesel',
    estado ENUM('activo', 'mantenimiento', 'fuera_servicio') DEFAULT 'activo',
    fecha_revision_tecnica DATE,
    numero_chasis VARCHAR(50),
    numero_motor VARCHAR(50),
    color VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cooperativa_id) REFERENCES cooperativas(id) ON DELETE CASCADE,
    FOREIGN KEY (conductor_id) REFERENCES conductores(id) ON DELETE SET NULL,
    
    INDEX idx_placa (placa),
    INDEX idx_numero_unidad (numero_unidad)
);

-- Tabla rutas (sin cambios significativos)
DROP TABLE IF EXISTS rutas;
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cooperativa_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    origen_id INT NOT NULL,
    destino_id INT NOT NULL,
    distancia_km DECIMAL(8,2),
    tiempo_estimado TIME,
    precio DECIMAL(8,2) NOT NULL,
    paradas JSON,
    estado ENUM('activa', 'inactiva', 'mantenimiento') DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cooperativa_id) REFERENCES cooperativas(id) ON DELETE CASCADE,
    FOREIGN KEY (origen_id) REFERENCES terminales(id),
    FOREIGN KEY (destino_id) REFERENCES terminales(id)
);

-- Tabla viajes (ACTUALIZADA)
DROP TABLE IF EXISTS viajes;
CREATE TABLE viajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    unidad_id INT NOT NULL,
    conductor_id INT NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada_estimada DATETIME NOT NULL,
    fecha_llegada_real DATETIME NULL,
    precio DECIMAL(8,2) NOT NULL,
    asientos_disponibles INT NOT NULL,
    asientos_ocupados INT DEFAULT 0,
    estado ENUM('programado', 'en_curso', 'completado', 'cancelado') DEFAULT 'programado',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
    FOREIGN KEY (unidad_id) REFERENCES unidades(id) ON DELETE CASCADE,
    FOREIGN KEY (conductor_id) REFERENCES conductores(id) ON DELETE CASCADE,
    
    INDEX idx_fecha_salida (fecha_salida),
    INDEX idx_estado (estado)
);

-- Tabla boletos (ACTUALIZADA - referencia a usuarios)
DROP TABLE IF EXISTS boletos;
CREATE TABLE boletos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL, -- Referencia a la tabla usuarios
    viaje_id INT NOT NULL,
    numero_asiento INT NOT NULL,
    precio DECIMAL(8,2) NOT NULL,
    estado ENUM('reservado', 'pagado', 'usado', 'cancelado') DEFAULT 'reservado',
    codigo_qr VARCHAR(255) UNIQUE,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_uso TIMESTAMP NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'paypal') DEFAULT 'efectivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (viaje_id) REFERENCES viajes(id) ON DELETE CASCADE,
    
    INDEX idx_codigo_qr (codigo_qr),
    INDEX idx_fecha_compra (fecha_compra)
);

-- Tabla pasajeros_boletos (ACTUALIZADA - maneja múltiples pasajeros por boleto)
DROP TABLE IF EXISTS pasajeros_boletos;
CREATE TABLE pasajeros_boletos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    boleto_id INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    es_titular BOOLEAN DEFAULT FALSE, -- Indica si es el usuario que compró el boleto
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (boleto_id) REFERENCES boletos(id) ON DELETE CASCADE,
    INDEX idx_cedula (cedula)
);

-- ====================================================================
-- DATOS INICIALES
-- ====================================================================

-- Insertar usuarios del sistema (superusuarios predeterminados)
INSERT INTO usuarios (email, password, telefono, rol, estado, email_verificado) VALUES
('admin@sistema.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0999999999', 'superusuario', 'activo', TRUE),
('superadmin@sistema.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0999999998', 'superusuario', 'activo', TRUE),
('soporte@sistema.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0999999997', 'superusuario', 'activo', TRUE);

-- Insertar ciudades
INSERT INTO ciudades (nombre) VALUES
('Quito'),
('Guayaquil'),
('Cuenca'),
('Ambato'),
('Riobamba'),
('Loja'),
('Machala'),
('Portoviejo'),
('Manta'),
('Esmeraldas');

-- Insertar terminales
INSERT INTO terminales (nombre, direccion, ciudadId) VALUES
-- Quito
('Quitumbe', 'Av. Morán Valverde y Amaru Ñan', 1),
('Carcelén', 'Av. Panamericana Norte', 1),
('Terminal Terrestre Norte', 'Av. De la Prensa y Galo Plaza Lasso', 1),
-- Guayaquil
('Terminal Terrestre de Guayaquil', 'Av. Jaime Roldós Aguilera', 2),
('Terminal Río Daule', 'Av. 25 de Julio', 2),
-- Cuenca
('Terminal Terrestre de Cuenca', 'Av. España y Av. Gil Ramírez Dávalos', 3),
-- Ambato
('Terminal Terrestre de Ambato', 'Av. Los Guaytambos', 4),
-- Riobamba
('Terminal Terrestre de Riobamba', 'Av. Daniel León Borja', 5),
-- Loja
('Terminal Terrestre de Loja', 'Av. Cuxibamba y 8 de Diciembre', 6),
-- Machala
('Terminal Terrestre de Machala', 'Vía Machala - Pasaje', 7);

-- Insertar usuarios de ejemplo (cooperativas y usuarios finales)
INSERT INTO usuarios (email, password, telefono, rol, estado, email_verificado) VALUES
-- Cooperativas
('info@transpquito.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0234567890', 'cooperativa', 'activo', TRUE),
('admin@coopersur.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0234567891', 'cooperativa', 'activo', TRUE),
('contacto@rutasandinas.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0234567892', 'cooperativa', 'activo', TRUE),
-- Usuarios finales
('juan.perez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', 'usuario', 'activo', TRUE),
('maria.garcia@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654322', 'usuario', 'activo', TRUE),
('carlos.lopez@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654323', 'usuario', 'activo', TRUE);

-- Insertar datos específicos de cooperativas
INSERT INTO usuarios_cooperativas (usuario_id, nombre_cooperativa, ruc, razon_social, representante_legal, cedula_representante, direccion_matriz, ciudad_matriz, telefono_fijo, fecha_constitucion, numero_socios, estado_juridico) VALUES
(4, 'Transportes Quito S.A.', '1791234567001', 'Compañía de Transportes Urbanos de Quito S.A.', 'Roberto Mantilla', '1712345678', 'Av. 10 de Agosto N24-57 y Colón', 'Quito', '023456789', '2010-03-15', 45, 'activa'),
(5, 'Cooperativa Sur', '1791234568001', 'Cooperativa de Transporte Interprovincial Sur', 'Ana Rodríguez', '1712345679', 'Av. Maldonado S1-156 y Morán Valverde', 'Quito', '023456790', '2008-07-22', 32, 'activa'),
(6, 'Rutas Andinas', '1791234569001', 'Cooperativa de Transportes Rutas Andinas', 'Miguel Torres', '1712345680', 'Av. América N39-123 y Naciones Unidas', 'Quito', '023456791', '2012-11-08', 28, 'activa');

-- Insertar datos específicos de usuarios finales
INSERT INTO usuarios_finales (usuario_id, nombres, apellidos, cedula, fecha_nacimiento, genero, direccion, ciudad) VALUES
(7, 'Juan Carlos', 'Pérez Morales', '1712345681', '1990-05-15', 'masculino', 'Av. República del Salvador N34-377', 'Quito'),
(8, 'María Elena', 'García Vásquez', '1712345682', '1985-08-22', 'femenino', 'Calle García Moreno N4-23', 'Quito'),
(9, 'Carlos Alberto', 'López Herrera', '1712345683', '1992-12-03', 'masculino', 'Av. Amazonas N21-147', 'Quito');

-- Insertar cooperativas en la tabla operativa
INSERT INTO cooperativas (usuario_cooperativa_id, codigo_cooperativa, estado_operativo, flota_total) VALUES
(1, 'COOP001', 'operativa', 15),
(2, 'COOP002', 'operativa', 12),
(3, 'COOP003', 'operativa', 10);

-- ====================================================================
-- PROCEDIMIENTO ALMACENADO ACTUALIZADO
-- ====================================================================
DELIMITER //

DROP PROCEDURE IF EXISTS sp_obtener_ciudades_terminales//

CREATE PROCEDURE sp_obtener_ciudades_terminales()
BEGIN
    SELECT 
        c.id as ciudad_id,
        c.nombre as ciudad_nombre,
        t.id as terminal_id,
        t.nombre as terminal_nombre,
        t.direccion as terminal_direccion,
        t.created_at
    FROM ciudades c
    LEFT JOIN terminales t ON c.id = t.ciudadId
    ORDER BY c.nombre, t.nombre;
END//

DELIMITER ;

-- ====================================================================
-- VISTAS ÚTILES PARA CONSULTAS COMPLEJAS
-- ====================================================================

-- Vista para usuarios completos con información específica
CREATE OR REPLACE VIEW vista_usuarios_completos AS
SELECT 
    u.id,
    u.email,
    u.telefono,
    u.rol,
    u.estado,
    u.email_verificado,
    u.fecha_ultimo_acceso,
    u.created_at,
    -- Datos específicos de usuarios finales
    uf.nombres as usuario_nombres,
    uf.apellidos as usuario_apellidos,
    uf.cedula as usuario_cedula,
    uf.fecha_nacimiento,
    uf.genero,
    uf.direccion as usuario_direccion,
    uf.ciudad as usuario_ciudad,
    uf.puntos_fidelidad,
    -- Datos específicos de cooperativas
    uc.nombre_cooperativa,
    uc.ruc,
    uc.razon_social,
    uc.representante_legal,
    uc.direccion_matriz,
    uc.ciudad_matriz,
    uc.estado_juridico
FROM usuarios u
LEFT JOIN usuarios_finales uf ON u.id = uf.usuario_id AND u.rol = 'usuario'
LEFT JOIN usuarios_cooperativas uc ON u.id = uc.usuario_id AND u.rol = 'cooperativa';

-- Vista para cooperativas con información completa
CREATE OR REPLACE VIEW vista_cooperativas_completas AS
SELECT 
    c.id as cooperativa_id,
    c.codigo_cooperativa,
    c.estado_operativo,
    c.flota_total,
    u.email,
    u.telefono,
    u.estado as estado_cuenta,
    uc.nombre_cooperativa,
    uc.ruc,
    uc.razon_social,
    uc.representante_legal,
    uc.cedula_representante,
    uc.direccion_matriz,
    uc.ciudad_matriz,
    uc.telefono_fijo,
    uc.fecha_constitucion,
    uc.numero_socios,
    uc.estado_juridico,
    c.created_at
FROM cooperativas c
INNER JOIN usuarios_cooperativas uc ON c.usuario_cooperativa_id = uc.id
INNER JOIN usuarios u ON uc.usuario_id = u.id;

-- ====================================================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- ====================================================================
CREATE INDEX idx_usuarios_rol_estado ON usuarios(rol, estado);
CREATE INDEX idx_usuarios_email_verificado ON usuarios(email_verificado);
CREATE INDEX idx_fecha_nacimiento ON usuarios_finales(fecha_nacimiento);
CREATE INDEX idx_cooperativas_estado ON usuarios_cooperativas(estado_juridico);

-- ====================================================================
-- COMENTARIOS FINALES
-- ====================================================================
-- Este script crea una arquitectura escalable y normalizada que permite:
-- 1. Manejo de múltiples roles con datos específicos separados
-- 2. Extensibilidad para agregar nuevos roles
-- 3. Integridad referencial completa
-- 4. Optimización con índices estratégicos
-- 5. Vistas para consultas complejas frecuentes
-- 6. Procedimientos almacenados para operaciones específicas
