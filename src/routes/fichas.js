import { Router } from 'express';
import { httpFichas } from '../controllers/fichas.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { fichaHelper } from '../helpers/fichas.js';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validarJWT.js';

const router = Router();

router.get('/listar', validarJWT, 
httpFichas.listarFichas);

router.post('/insertar', [
    validarJWT,
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('codigo').notEmpty().withMessage('El código es obligatorio'),
    validarCampos
], httpFichas.insertarFichas);

router.put('/modificar/:id', [
    validarJWT,
    check('id').custom(fichaHelper.existeFichaID),
    check('nombre').optional().notEmpty(),
    check('codigo').optional().notEmpty(),
    validarCampos
], httpFichas.modificarFichas);

router.put('/activar/:id', [
    validarJWT,
    check('id').custom(fichaHelper.existeFichaID),
    validarCampos
], httpFichas.activarFichas);

router.put('/desactivar/:id', [
    validarJWT,
    check('id').custom(fichaHelper.existeFichaID),
    validarCampos
], httpFichas.desactivarFichas);

export default router;
