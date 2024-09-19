import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BitacoraSchema = new Schema({
    Aprendiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aprendiz', 
        required: true
    },
    fechaHora: {
        type: Date,
        required: true,
        default: Date.now 
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Asistió', 'No asistió', 'Con excusa'], 
        default: 'Pendiente'
    }
}, { timestamps: true });

const Bitacora = model('Bitacora', BitacoraSchema);

export default Bitacora;
