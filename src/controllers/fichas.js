import Fichas from '../models/fichas.js';

const httpFichas = {
    listarFichas: async (req, res) => {
        try {
            const fichas = await Fichas.find();
            res.json({ fichas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    insertarFichas: async (req, res) => {
        const { nombre, codigo, estado = 1 } = req.body;
    
        // Verificar que el código contenga solo números
        if (!/^\d+$/.test(codigo)) {
            return res.status(400).json({ error: "El código debe contener solo números." });
        }
    
        try {
            // Verificar si el código ya existe
            const fichaExistente = await Fichas.findOne({ codigo });
            if (fichaExistente) {
                return res.status(400).json({ error: "El código ya existe." });
            }
    
            const nuevaFicha = new Fichas({ nombre, codigo, estado });
            await nuevaFicha.save();
            res.status(201).json({ ficha: nuevaFicha });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    modificarFichas: async (req, res) => {
        const { id } = req.params;
        const { nombre, codigo } = req.body;
    
        try {
            // Buscar la ficha actual
            const fichaActual = await Fichas.findById(id);
    
            if (!fichaActual) {
                return res.status(404).json({ msg: "Ficha no encontrada" });
            }
    
            // Verificar si se está intentando actualizar el código
            if (codigo) {
                // Verificar que el código contenga solo números
                if (!/^\d+$/.test(codigo)) {
                    return res.status(400).json({ error: "El código debe contener solo números." });
                }
    
                // Verificar si el código ya existe y no es el mismo que el de la ficha actual
                const fichaExistente = await Fichas.findOne({ codigo });
                if (fichaExistente && fichaExistente._id.toString() !== id) {
                    return res.status(400).json({ error: "El código ya existe." });
                }
    
                // Actualizar el código si no hay conflictos
                fichaActual.codigo = codigo;
            }
    
            // Verificar si se está intentando actualizar el nombre
            if (nombre) {
                fichaActual.nombre = nombre;
            }
    
            await fichaActual.save();
    
            res.json({ msg: "Ficha Modificada Correctamente", ficha: fichaActual });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    

    activarFichas: async (req, res) => {
        const { id } = req.params;
        try {
            const fichaActivada = await Fichas.findByIdAndUpdate(id, { estado: 1 });
            if (fichaActivada) {
                res.json({ msg: "Ficha activada correctamente" });
            } else {
                res.status(404).json({ msg: "Ficha no encontrada" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    desactivarFichas: async (req, res) => {
        const { id } = req.params;
        try {
            const fichaDesactivada = await Fichas.findByIdAndUpdate(id, { estado: 0 });
            if (fichaDesactivada) {
                res.json({ msg: "Ficha desactivada correctamente" });
            } else {
                res.status(404).json({ msg: "Ficha no encontrada" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export {httpFichas} ;
