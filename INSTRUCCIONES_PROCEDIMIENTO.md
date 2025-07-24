# Instrucciones para el procedimiento almacenado de ciudades y terminales

## ✅ SISTEMA FUNCIONANDO

El sistema ya está configurado y funcionando correctamente con:

- ✅ Procedimiento almacenado `sp_obtener_ciudades_terminales`
- ✅ Controller con fallback a consulta directa
- ✅ Rutas API configuradas
- ✅ Componente React integrado

## 📋 URLs disponibles:

- **GET** `http://localhost:3000/ciudades-terminales` - Obtiene ciudades agrupadas con sus terminales
- **GET** `http://localhost:3000/ciudades-terminales/plano` - Obtiene datos planos para mostrar en tabla
## 🔧 Si necesitas verificar datos manualmente:

```sql
-- Verificar si hay ciudades
SELECT COUNT(*) as total_ciudades FROM ciudades;
SELECT * FROM ciudades LIMIT 5;

-- Verificar si hay terminales
SELECT COUNT(*) as total_terminales FROM terminales;
SELECT * FROM terminales LIMIT 5;

-- Verificar JOIN directo
SELECT 
    c.id as ciudad_id, c.nombre as ciudad_nombre,
    t.id as terminal_id, t.nombre as terminal_nombre
FROM ciudades c
LEFT JOIN terminales t ON c.id = t.ciudad_id
LIMIT 10;
```
## 📊 Si necesitas insertar datos de prueba:

```sql
-- Insertar ciudades de prueba
INSERT IGNORE INTO ciudades (nombre, created_at) VALUES
('Quito', NOW()),
('Guayaquil', NOW()),
('Cuenca', NOW()),
('Ambato', NOW()),
('Ibarra', NOW());

-- Insertar terminales de prueba
INSERT IGNORE INTO terminales (nombre, ciudad_id, direccion, created_at) VALUES
('Quitumbe', 1, 'Av. Morán Valverde y Amaru Ñan', NOW()),
('Carcelén', 1, 'Av. Panamericana Norte y García Moreno', NOW()),
('Terminal Terrestre de Guayaquil', 2, 'Av. Jaime Roldós Aguilera', NOW()),
('Terminal Terrestre de Cuenca', 3, 'Av. España y Huayna Cápac', NOW());
```
## 🏗️ Procedimiento almacenado (ya creado):

```sql
-- Eliminar procedimiento si existe
DROP PROCEDURE IF EXISTS sp_obtener_ciudades_terminales;

-- Crear procedimiento
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

-- Probar el procedimiento
CALL sp_obtener_ciudades_terminales();
```

## 4. URLs de la API disponibles

Una vez que tengas el servidor corriendo, podrás acceder a:

- **GET** `http://localhost:3000/ciudades-terminales` - Obtiene ciudades agrupadas con sus terminales
- **GET** `http://localhost:3000/ciudades-terminales/plano` - Obtiene datos planos para mostrar en tabla

## 5. Estructura de respuesta

### Para `/ciudades-terminales`:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Quito",
      "created_at": "2025-07-21T17:23:54.000Z",
      "terminales": [
        {
          "id": 1,
          "nombre": "Quitumbe",
          "direccion": "Av. Morán Valverde",
          "created_at": "2025-07-21T17:23:54.000Z",
          "ciudad_id": 1
        }
      ]
    }
  ],
  "total": 1
}
```

### Para `/ciudades-terminales/plano`:
```json
{
  "success": true,
  "data": [
    {
      "id": "1-1",
      "ciudad_id": 1,
      "ciudad_nombre": "Quito",
      "terminal_id": 1,
      "terminal_nombre": "Quitumbe",
      "terminal_direccion": "Av. Morán Valverde",
      "created_at": "2025-07-21T17:23:54.000Z"
    }
  ],
  "total": 1
}
```

## 6. Funcionalidades implementadas

✅ Procedimiento almacenado para obtener ciudades y terminales
✅ Controller con manejo de errores
✅ Rutas API configuradas
✅ Componente React actualizado con datos reales
✅ Paginación funcional
✅ Estados de carga y error
✅ Función de eliminación de terminales
✅ Recarga automática de datos

## 7. Próximos pasos sugeridos

- Implementar modal para agregar/editar ciudades y terminales
- Agregar validaciones en el frontend
- Implementar búsqueda/filtros
- Agregar más procedimientos almacenados según necesidades
