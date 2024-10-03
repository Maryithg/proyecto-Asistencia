// Importa módulos y dependencias
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importa rutas
import routesAprendices from '../routes/aprendices.js';
import routesBitacora from '../routes/bitacora.js';
import routesFichas from '../routes/fichas.js';
import routesUsuarios from '../routes/usuarios.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Cargar variables de entorno desde el archivo .env


        // Inicializar middlewares
        this.middlewares();

        // Inicializar rutas
        this.routes();
    }

    middlewares() {
        // Habilitar CORS
        this.app.use(express.static("public"));
        this.app.use(cors());

        // Parsear cuerpos de solicitudes JSON
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/api/aprendices', routesAprendices);
        this.app.use('/api/bitacora', routesBitacora);
        this.app.use('/api/fichas', routesFichas);
        this.app.use('/api/usuarios', routesUsuarios);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
            mongoose.connect(process.env.MONGODB_URI , )
            .then(() => console.log('Connected to MongoDB!'))
            .catch(err => console.error('Failed to connect to MongoDB', err));
        });
    }
}

// Crear una instancia de la clase Server y empezar a escuchar
export{Server};
