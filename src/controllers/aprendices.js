import Aprendiz from '../models/aprendices.js';
import Ficha from '../models/fichas.js';

export const httpAprendices = {
    listarAprendices: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find().populate('idFicha');
            res.json(aprendices);
        } catch (error) {
            res.status(500).json({ msg: 'Error al listar los aprendices', error });
        }
    },

    insertarAprendiz: async (req, res) => {
        try {
            const { cc, nombre, email, telefono, estado = 1, Fichas } = req.body; 

            if (!Fichas) {
                return res.status(400).json({ msg: 'El código de la ficha es obligatorio' });
            }
    
            // Buscar la ficha correspondiente por su código
            const ficha = await Ficha.findOne({ codigo: Fichas });
            
            if (!ficha) {
                return res.status(404).json({ msg: 'Ficha no encontrada' });
            }
    
            const newAprendiz = new Aprendiz({
                cc,
                nombre,
                email,
                telefono,
                estado,
                idFicha: ficha._id // Usar el _id de la ficha encontrada
            });
            const aprendizSaved = await newAprendiz.save();
            res.status(201).json(aprendizSaved);
        } catch (error) {
            console.error(error); 
            res.status(500).json({ msg: 'Error al crear aprendiz' });
        }
    },
    
    
    modificarAprendiz: async (req, res) => {
        const { id } = req.params;
        const { cc, nombre, email, telefono, estado, Fichas } = req.body;
        
        try {
            let ficha = null;
            if (Fichas) {
                ficha = await Ficha.findOne({ codigo: Fichas });
                if (!ficha) {
                    return res.status(404).json({ msg: "Ficha no encontrada!" });
                }
            }
            const updateData = {
                cc,
                nombre,
                email,
                telefono,
                estado
            };
    
            // Si se encontró una ficha, actualizar idFicha
            if (ficha) {
                updateData.idFicha = ficha._id;
            }
    
            // Actualizar el aprendiz en la base de datos
            const aprendiz = await Aprendiz.findByIdAndUpdate(id, updateData, { new: true });
            
            if (!aprendiz) {
                return res.status(404).json({ msg: "Aprendiz no encontrado!" });
            }
    
            res.json({ msg: "Aprendiz modificado correctamente!", aprendiz });
        } catch (error) {
            res.status(500).json({ msg: 'Error al modificar aprendiz', error: error.message });
        }
    },
    

    activarAprendiz: async (req, res) => {
        const { id } = req.params;
        try {
            const aprendizActivado = await Aprendiz.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!aprendizActivado) {
                return res.status(404).json({ msg: `Aprendiz no encontrado con ID: ${id}` });
            }
            res.json({ msg: 'Aprendiz Activado'});
        } catch (error) {
            res.status(500).json({ msg: 'Error al activar el aprendiz', error });
        }
    },

    desactivarAprendiz: async (req, res) => {
        const { id } = req.params;
        try {
            const aprendizDesactivado = await Aprendiz.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!aprendizDesactivado) {
                return res.status(404).json({ msg: `Aprendiz no encontrado con ID: ${id}` });
            }
            res.json({msg: 'Aprendiz Desactivado'});
        } catch (error) {
            res.status(500).json({ msg: 'Error al desactivar el aprendiz', error });
        }
    }
};
