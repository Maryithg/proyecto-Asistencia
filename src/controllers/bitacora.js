import Bitacora from '../models/bitacora.js';
import Aprendices from '../models/aprendices.js';
import Fichas from '../models/fichas.js'

export const httpBitacora = {
    crearBitacora: async (req, res) => {
        try {
            const { Aprendiz } = req.body;
    
            // Verificar si se ha proporcionado el Aprendiz
            if (!Aprendiz) {
                return res.status(400).json({ msg: 'El aprendiz es obligatorio' });
            }
    
            // Buscar el aprendiz por CC
            const aprendizExistente = await Aprendices.findOne({ cc: Aprendiz });
    
            // Si no se encuentra el aprendiz, devolver un error
            if (!aprendizExistente) {
                return res.status(404).json({ msg: 'Aprendiz no encontrado' });
            }
    
            // Verificar si ya existe una bitácora para el aprendiz en el día actual
            const fechaInicioDate = new Date();
            fechaInicioDate.setHours(0, 0, 0, 0);
            const fechaFinDate = new Date(fechaInicioDate);
            fechaFinDate.setDate(fechaFinDate.getDate() + 1);
    
            const bitacoraExistente = await Bitacora.findOne({
                Aprendiz: aprendizExistente._id,
                fechaHora: {
                    $gte: fechaInicioDate,
                    $lt: fechaFinDate
                }
            });
    
            if (bitacoraExistente) {
                return res.status(400).json({ msg: 'Ya existe una bitácora para este aprendiz hoy' });
            }
    
            // Crear la bitácora con el ID del aprendiz encontrado
            const newBitacora = new Bitacora({
                Aprendiz: aprendizExistente._id,
            });
    
            const bitacoraSaved = await newBitacora.save();
            res.status(201).json(bitacoraSaved);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al crear la bitácora' });
        }
    },

    listarBitacoras: async (req, res) => {
        try {
            // Filtrar bitácoras donde Aprendiz no sea null y hacer populate de Aprendiz
            const bitacoras = await Bitacora.find({ Aprendiz: { $ne: null } }).populate({
                path: 'Aprendiz',
                populate: {
                    path: 'idFicha', 
                }
            });
            res.json(bitacoras);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Error al listar las bitácoras', error });
        }
    },

    listarBitacorasPorFichaFecha: async (req, res) => {
        const { ficha: idFicha, fechaInicio } = req.params;
    
        try {
            // Convertir la fecha de inicio y calcular el rango de un día
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaInicio);
            fechaFinDate.setDate(fechaFinDate.getDate() + 1);
    
            // Validar si la fecha es válida
            if (isNaN(fechaInicioDate.getTime())) {
                return res.status(400).json({ error: 'Fecha inválida' });
            }
    
            // Buscar la ficha por su código
            const buscarficha = await Fichas.findOne({ codigo: idFicha });
            if (!buscarficha) {
                return res.status(404).json({ message: "FICHA NO ENCONTRADA" });
            }
    
            // Buscar aprendices asociados a la ficha
            const buscaraprendices = await Aprendices.find({ idFicha: buscarficha._id });
            if (buscaraprendices.length === 0) {
                return res.status(404).json({ message: "APRENDICES NO ENCONTRADOS" });
            }
    
            // Obtener los IDs de los aprendices
            const idsAprendices = buscaraprendices.map(aprendiz => aprendiz._id);
    
            // Buscar bitácoras filtrando por fecha y aprendiz
            const bitacoras = await Bitacora.find({
                fechaHora: { 
                    $gte: fechaInicioDate,
                    $lt: fechaFinDate
                },
                Aprendiz: { $in: idsAprendices } // Filtramos las bitácoras por los IDs de los aprendices
            })
            .populate({
                path: 'Aprendiz',
                populate: {
                    path: 'idFicha'
                }
            });
    
            // Verificar si se encontraron bitácoras
            if (bitacoras.length === 0) {
                return res.status(404).json({ msg: `No se encontraron bitácoras para la ficha ${idFicha} en la fecha ${fechaInicio}` });
            }
    
            // Devolver los resultados
            res.status(200).json(bitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora para la ficha ${idFicha}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora para la ficha ${idFicha}` });
        }
    },
    
    
    
    

    

    listarBitacorasPorFecha: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.params;
    
            // Convertir los parámetros a objetos Date
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);
    
            // Validar que las fechas son válidas
            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                return res.status(400).json({ message: 'Formato de fecha no válido' });
            }
    
            // Buscar bitácoras dentro del rango de fechas
            const bitacoras = await Bitacora.find({
                fechaHora: { $gte: fechaInicioDate, $lte: fechaFinDate }
            }).populate('Aprendiz');
    
            // Devolver las bitácoras encontradas
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    listarBitacorasPorAprendiz: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find({ aprendiz: req.params.aprendiz });
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listarBitacorasAprendizPorFecha: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find({ aprendiz: req.params.aprendiz, fecha: { $gte: req.params.fechaInicio, $lte: req.params.fechaFin } });
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    listarBitacorasPorFicha: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find({ aprendiz: req.params.aprendiz }).populate('Aprendiz', 'Ficha');
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    aceptarBitacora: async (req, res) => {
        try {
            const bitacora = await Bitacora.findById(req.params.id);
            if (bitacora.estado === 'Pendiente' || bitacora.estado === 'No asistió' || bitacora.estado === 'Con excusa') {
                bitacora.estado = 'Asistió';
                await bitacora.save();
                res.status(200).json({ message: 'Bitacora aceptada' });
            } else {
                res.status(400).json({ message: 'Bitacora ya fue aceptada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    rechazarBitacora: async (req, res) => {
        try {
            const bitacora = await Bitacora.findById(req.params.id);
            if (bitacora.estado === 'Pendiente' || bitacora.estado === 'Asistió' || bitacora.estado === 'Con excusa') {
                bitacora.estado = 'No asistió';
                await bitacora.save();
                res.status(200).json({ message: 'Bitacora rechazada' });
            } else {
                res.status(400).json({ message: 'Bitacora ya fue aceptada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    excusarBitacora: async (req, res) => {
        try {
            const bitacora = await Bitacora.findById(req.params.id);
            if (bitacora.estado === 'Pendiente' || bitacora.estado === 'Asistió' || bitacora.estado === 'No asistió') {
                bitacora.estado = 'Con excusa';
                await bitacora.save();
                res.status(200).json({ message: 'Bitacora excusada' });
            } else {
                res.status(400).json({ message: 'Bitacora ya fue aceptada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default httpBitacora;