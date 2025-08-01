const { QueryTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

// Obtener todas las ciudades con sus terminales usando el procedimiento almacenado
const getCiudadesConTerminales = async (req, res) => {
    try {
        // Ejecutar el procedimiento almacenado
        let resultados;
        try {
            resultados = await sequelize.query(
                'CALL sp_obtener_ciudades_terminales()',
                {
                    type: QueryTypes.SELECT
                }
            );
        } catch (procError) {
            // Si falla el procedimiento, usar consulta directa
            resultados = await sequelize.query(`
                SELECT 
                    c.id as ciudad_id,
                    c.nombre as ciudad_nombre,
                    t.id as terminal_id,
                    t.nombre as terminal_nombre,
                    t.direccion as terminal_direccion
                FROM ciudades c
                LEFT JOIN terminales t ON c.id = t.ciudad_id
                ORDER BY c.nombre, t.nombre
            `, { type: QueryTypes.SELECT });
        }

        // Si no hay resultados, devolver array vacío
        if (!resultados || resultados.length === 0) {
            return res.json({
                success: true,
                data: [],
                total: 0,
                message: 'No hay datos en las tablas ciudades o terminales'
            });
        }

        // Procesar los datos para agrupar terminales por ciudad
        const ciudadesMap = new Map();

        resultados.forEach(row => {
            const ciudadId = row.ciudad_id;
            
            // Si la ciudad no existe en el map, la creamos
            if (!ciudadesMap.has(ciudadId)) {
                ciudadesMap.set(ciudadId, {
                    id: row.ciudad_id,
                    nombre: row.ciudad_nombre,
                    terminales: []
                });
            }

            // Si hay terminal asociado, lo agregamos
            if (row.terminal_id) {
                ciudadesMap.get(ciudadId).terminales.push({
                    id: row.terminal_id,
                    nombre: row.terminal_nombre,
                    direccion: row.terminal_direccion,
                    ciudad_id: row.ciudad_id
                });
            }
        });

        // Convertir el Map a array
        const ciudades = Array.from(ciudadesMap.values());

        res.json({
            success: true,
            data: ciudades,
            total: ciudades.length
        });
    } catch (error) {
        console.error('Error al obtener ciudades con terminales:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
};

// Obtener ciudades con terminales en formato plano (para tabla)
const getCiudadesTerminalesPlano = async (req, res) => {
    try {
        // Intentar el procedimiento almacenado
        let resultados;
        try {
            resultados = await sequelize.query(
                'CALL sp_obtener_ciudades_terminales()',
                {
                    type: QueryTypes.SELECT
                }
            );
        } catch (procError) {
            // Si falla el procedimiento, usar consulta directa
            resultados = await sequelize.query(`
                SELECT 
                    c.id as ciudad_id,
                    c.nombre as ciudad_nombre,
                    t.id as terminal_id,
                    t.nombre as terminal_nombre,
                    t.direccion as terminal_direccion
                FROM ciudades c
                LEFT JOIN terminales t ON c.id = t.ciudad_id
                WHERE t.id IS NOT NULL
                ORDER BY c.nombre, t.nombre
            `, { type: QueryTypes.SELECT });
        }

        // Formatear datos para mostrar en tabla
        const datosPlanos = resultados
            .filter(row => row.terminal_id) // Solo mostrar ciudades que tienen terminales
            .map(row => ({
                id: `${row.ciudad_id}-${row.terminal_id}`,
                ciudad_id: row.ciudad_id,
                ciudad_nombre: row.ciudad_nombre,
                terminal_id: row.terminal_id,
                terminal_nombre: row.terminal_nombre,
                terminal_direccion: row.terminal_direccion
            }));

        res.json({
            success: true,
            data: datosPlanos,
            total: datosPlanos.length,
            message: datosPlanos.length === 0 ? 'No se encontraron terminales asociados a ciudades' : null
        });
    } catch (error) {
        console.error('Error al obtener datos planos de ciudades-terminales:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
};

module.exports = {
    getCiudadesConTerminales,
    getCiudadesTerminalesPlano
};
