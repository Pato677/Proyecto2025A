const { Compra, Pasajero, Boleto, ViajeAsiento, Viaje } = require('../models');
const sequelize = require('../config/sequelize.config');

// Función para generar código único de boleto
const generarCodigoBoleto = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BOL-${timestamp.slice(-6)}-${random}`;
};

// Función para generar código de compra
const generarCodigoCompra = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `COM-${timestamp.slice(-6)}-${random}`;
};

// Crear compra completa con pasajeros y boletos
const crearCompraCompleta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      pasajeros, 
      asientosSeleccionados, 
      viajeId, 
      formaPago 
    } = req.body;

    console.log('Datos recibidos:', { pasajeros, asientosSeleccionados, viajeId, formaPago });

    // Validaciones
    if (!pasajeros || !Array.isArray(pasajeros) || pasajeros.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere al menos un pasajero' 
      });
    }

    if (!asientosSeleccionados || !Array.isArray(asientosSeleccionados)) {
      return res.status(400).json({ 
        error: 'Se requieren asientos seleccionados' 
      });
    }

    if (pasajeros.length !== asientosSeleccionados.length) {
      return res.status(400).json({ 
        error: 'El número de pasajeros debe coincidir con el número de asientos seleccionados' 
      });
    }

    if (!viajeId) {
      return res.status(400).json({ 
        error: 'Se requiere el ID del viaje' 
      });
    }

    // Obtener datos del viaje para el precio
    const viaje = await Viaje.findByPk(viajeId);
    if (!viaje) {
      return res.status(404).json({ 
        error: 'Viaje no encontrado' 
      });
    }

    const precioBase = parseFloat(viaje.precio) || 12.25;

    // TODO: Verificar disponibilidad de asientos (comentado temporalmente)
    /*
    const asientosOcupados = await ViajeAsiento.findAll({
      where: { 
        viaje_id: viajeId,
        asiento_id: asientosSeleccionados
      }
    });

    if (asientosOcupados.length > 0) {
      const asientosNoDisponibles = asientosOcupados.map(va => va.asiento_id);
      return res.status(400).json({ 
        error: 'Algunos asientos ya están ocupados',
        asientosOcupados: asientosNoDisponibles
      });
    }
    */

    // 1. Crear todos los pasajeros
    const pasajerosCreados = [];
    for (const pasajeroData of pasajeros) {
      // Crear fecha de nacimiento en formato YYYY-MM-DD
      const fechaNacimiento = `${pasajeroData.anio}-${String(pasajeroData.mes).padStart(2, '0')}-${String(pasajeroData.dia).padStart(2, '0')}`;
      
      const pasajero = await Pasajero.create({
        nombres: pasajeroData.nombres,
        apellidos: pasajeroData.apellidos,
        fecha_nacimiento: fechaNacimiento,
        cedula: pasajeroData.cedula
      }, { transaction });
      
      pasajerosCreados.push(pasajero);
    }

    // 2. Crear la compra con el primer pasajero como titular
    const pasajeroTitular = pasajerosCreados[0];
    const primerPasajeroData = pasajeros[0];
    
    const compra = await Compra.create({
      fecha: new Date(),
      email_contacto: primerPasajeroData.correo,
      telefono_contacto: primerPasajeroData.telefono,
      pasajero_id: pasajeroTitular.id,
      viaje_id: parseInt(viajeId)
    }, { transaction });

    // 3. Crear boletos para cada pasajero
    const codigoCompra = generarCodigoCompra();
    const boletosCreados = [];
    
    for (let i = 0; i < pasajerosCreados.length; i++) {
      const pasajero = pasajerosCreados[i];
      const pasajeroData = pasajeros[i];
      
      // Calcular edad para determinar precio
      const fechaNacimiento = new Date(pasajero.fecha_nacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mesActual = hoy.getMonth();
      const diaActual = hoy.getDate();
      
      if (mesActual < fechaNacimiento.getMonth() || 
          (mesActual === fechaNacimiento.getMonth() && diaActual < fechaNacimiento.getDate())) {
        edad--;
      }
      
      const esMenor = edad < 18;
      const precio = esMenor ? precioBase / 2 : precioBase;
      
      // Crear código único para cada boleto
      const codigoBoleto = generarCodigoBoleto();
      
      const boleto = await Boleto.create({
        codigo: codigoBoleto,
        valor: precio,
        compra_id: compra.id,
        pasajero_id: pasajero.id
      }, { transaction });
      
      boletosCreados.push(boleto);
    }

    // 4. Crear registros en viaje_asientos
    const viajeAsientosCreados = [];
    for (let i = 0; i < asientosSeleccionados.length; i++) {
      const asientoId = asientosSeleccionados[i];
      
      // Generar ID único para viaje_asiento
      const viajeAsientoId = `${viajeId}-${asientoId}-${Date.now()}-${i}`;
      
      const viajeAsiento = await ViajeAsiento.create({
        id: viajeAsientoId,
        asiento_id: asientoId,
        viaje_id: parseInt(viajeId)
      }, { transaction });
      
      viajeAsientosCreados.push(viajeAsiento);
    }

    // Confirmar transacción
    await transaction.commit();

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Compra creada exitosamente',
      data: {
        id: compra.id,
        compra: compra,
        pasajeros: pasajerosCreados,
        boletos: boletosCreados,
        viajeAsientos: viajeAsientosCreados,
        codigoCompra: codigoCompra,
        totalPasajeros: pasajerosCreados.length,
        totalBoletos: boletosCreados.length,
        precioBase: precioBase
      }
    });

  } catch (error) {
    // Revertir transacción en caso de error
    await transaction.rollback();
    console.error('Error al crear compra:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Obtener todas las compras
const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      include: [
        {
          model: Pasajero,
          attributes: ['id', 'nombres', 'apellidos', 'cedula']
        },
        {
          model: Viaje,
          attributes: ['id', 'fecha_salida', 'precio']
        },
        {
          model: Boleto,
          attributes: ['codigo', 'valor']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: compras
    });
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Obtener compra por ID
const obtenerCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: Pasajero,
          attributes: ['id', 'nombres', 'apellidos', 'cedula', 'fecha_nacimiento']
        },
        {
          model: Viaje,
          attributes: ['id', 'fecha_salida', 'precio']
        },
        {
          model: Boleto,
          attributes: ['codigo', 'valor']
        }
      ]
    });

    if (!compra) {
      return res.status(404).json({
        error: 'Compra no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: compra
    });
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

// Verificar disponibilidad de asientos
const verificarDisponibilidadAsientos = async (req, res) => {
  try {
    const { viajeId, asientos } = req.body;

    if (!viajeId || !asientos || !Array.isArray(asientos)) {
      return res.status(400).json({
        error: 'Se requiere viajeId y lista de asientos'
      });
    }

    const asientosOcupados = await ViajeAsiento.findAll({
      where: { 
        viaje_id: viajeId,
        asiento_id: asientos
      }
    });

    const asientosNoDisponibles = asientosOcupados.map(va => va.asiento_id);
    const asientosDisponibles = asientos.filter(asiento => !asientosNoDisponibles.includes(asiento));

    res.status(200).json({
      success: true,
      data: {
        asientosDisponibles,
        asientosOcupados: asientosNoDisponibles,
        todosDisponibles: asientosNoDisponibles.length === 0
      }
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
};

module.exports = {
  crearCompraCompleta,
  obtenerCompras,
  obtenerCompraPorId,
  verificarDisponibilidadAsientos
};
