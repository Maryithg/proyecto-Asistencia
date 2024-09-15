import Bitacora from '../models/bitacora.js';
import Aprendices from '../models/aprendices.js';

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
        try {
            const fechaInicio = new Date(req.params.fecha);
            const fechaFin = new Date(req.params.fecha);
            fechaFin.setHours(23, 59, 59, 999); // Fin del día
    
            // Buscamos las bitácoras por ficha y por fecha
            const bitacoras = await Bitacora.find({
                'Aprendiz.idFicha': req.params.ficha, // Filtrar por ficha
                fecha: { $gte: fechaInicio, $lte: fechaFin } // Filtrar por una fecha específica
            }).populate({
                path: 'Aprendiz',
                populate: {
                    path: 'idFicha', 
                }
            });
    
            res.status(200).json(bitacoras);
        } catch (error) {
            res.status(500).json({ message: error.message });
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