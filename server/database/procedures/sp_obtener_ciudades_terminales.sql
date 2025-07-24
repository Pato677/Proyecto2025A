-- Procedimiento almacenado para obtener ciudades con sus terminales
-- Versión compatible con MySQL/MariaDB

DROP PROCEDURE IF EXISTS sp_obtener_ciudades_terminales;

DELIMITER $$

CREATE PROCEDURE sp_obtener_ciudades_terminales()
BEGIN
    SELECT 
        c.id as ciudad_id,
        c.nombre as ciudad_nombre,
        c.created_at as ciudad_created_at,
        t.id as terminal_id,
        t.nombre as terminal_nombre,
        t.direccion as terminal_direccion,
        t.created_at as terminal_created_at
    FROM ciudades c
    LEFT JOIN terminales t ON c.id = t.ciudad_id
    ORDER BY c.nombre, t.nombre;
END$$

DELIMITER ;

-- Verificar que el procedimiento existe
SELECT ROUTINE_NAME, ROUTINE_SCHEMA 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_TYPE = 'PROCEDURE' AND ROUTINE_NAME = 'sp_obtener_ciudades_terminales';

-- Ejecutar el procedimiento para probar
CALL sp_obtener_ciudades_terminales();
