import { Router } from 'express';
import { httpAprendices } from '../controllers/aprendices.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { aprendizHelper } from '../helpers/aprendices.js';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validarJWT.js';


const router = Router();

router.get('/listar',
    validarJWT,
    httpAprendices.listarAprendices);

router.post('/insertar', [
    validarJWT,
    check('Fichas').notEmpty().withMessage('El código de la ficha es obligatorio'),
    check('cc').notEmpty().withMessage('La cédula es obligatoria'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('El email es obligatorio y debe ser válido'),
    check('telefono').notEmpty().withMessage('El telefono es obligatorio'),
    validarCampos
], httpAprendices.insertarAprendiz);


router.put('/modificar/:id', [
    validarJWT,
    check('id').custom(aprendizHelper.existeAprendizID),
    check('cc').optional().notEmpty().withMessage('La cédula no puede estar vacía'),
    check('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    check('email').optional().isEmail().withMessage('El email no puede estar vacío y debe ser válido'),
    check('telefono').optional().notEmpty().withMessage('El teléfono no puede estar vacío'),
    validarCampos
], httpAprendices.modificarAprendiz);


router.put('/activar/:id', [
    validarJWT,
    check('id').custom(aprendizHelper.existeAprendizID),
    validarCampos
], httpAprendices.activarAprendiz);

router.put('/desactivar/:id', [
    validarJWT,
    check('id').custom(aprendizHelper.existeAprendizID),
    validarCampos
], httpAprendices.desactivarAprendiz);

export default router;
