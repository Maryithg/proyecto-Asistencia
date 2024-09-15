import { Router } from 'express';
import { httpBitacora } from '../controllers/bitacora.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validarJWT.js';

const router = Router();

// Crear una bitácora
router.post('/crear', [
    check('Aprendiz').notEmpty().withMessage('El aprendiz es obligatorio'),
    validarCampos
], httpBitacora.crearBitacora);

// Listar todas las bitácoras
router.get('/listar',
    httpBitacora.listarBitacoras);

// Listar bitácoras por fecha
router.get('/listarPorFecha/:fechaInicio/:fechaFin', [
    validarJWT,
    check('fechaInicio').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('fechaFin').notEmpty().withMessage('La fecha de fin es obligatoria'),
    validarCampos
], httpBitacora.listarBitacorasPorFecha);

// Listar bitácoras por aprendiz
router.get('/listarPorAprendiz/:aprendiz', [
    validarJWT,
    check('aprendiz').notEmpty().withMessage('El ID del aprendiz es obligatorio'),
    validarCampos
], httpBitacora.listarBitacorasPorAprendiz);

// Listar bitácoras por aprendiz y fecha
router.get('/listarPorAprendizFecha/:aprendiz/:fechaInicio/:fechaFin', [
    validarJWT,
    check('aprendiz').notEmpty().withMessage('El ID del aprendiz es obligatorio'),
    check('fechaInicio').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('fechaFin').notEmpty().withMessage('La fecha de fin es obligatoria'),
    validarCampos
], httpBitacora.listarBitacorasAprendizPorFecha);

// Listar bitácoras por ficha
router.get('/listarPorFicha/:aprendiz', [
    validarJWT,
    check('aprendiz').notEmpty().withMessage('El ID del aprendiz es obligatorio'),
    validarCampos
], httpBitacora.listarBitacorasPorFicha);

// Listar bitácoras por ficha y fecha
router.get('/listarPorFichaFecha/:ficha/:fecha', [
    validarJWT,
    check('ficha').notEmpty().withMessage('El ID de la ficha es obligatorio'),
    check('fecha').notEmpty().withMessage('La fecha es obligatoria'),
    validarCampos
], httpBitacora.listarBitacorasPorFichaFecha);

// Aceptar una bitácora
router.put('/aceptar/:id', [
    validarJWT,
    check('id').notEmpty().withMessage('El ID de la bitácora es obligatorio'),
    validarCampos
], httpBitacora.aceptarBitacora);

// Rechazar una bitácora
router.put('/rechazar/:id', [
    validarJWT,
    check('id').notEmpty().withMessage('El ID de la bitácora es obligatorio'),
    validarCampos
], httpBitacora.rechazarBitacora);

// Excusar una bitácora
router.put('/excusar/:id', [
    validarJWT,
    check('id').notEmpty().withMessage('El ID de la bitácora es obligatorio'),
    validarCampos
], httpBitacora.excusarBitacora);

export default router;