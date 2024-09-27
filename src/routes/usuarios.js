import { Router } from 'express';
import { httpUsuarios } from '../controllers/usuarios.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { usuarioHelper } from '../helpers/usuarios.js';
import { check } from 'express-validator';
import { validarJWT } from '../middlewares/validarJWT.js';

const router = Router();

router.get('/listar', validarJWT,
 httpUsuarios.listarUsuarios);

router.post('/insertarU', [
    validarJWT,
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('El email es obligatorio y debe ser válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
], httpUsuarios.insertarUsuario);

router.post('/login', [
    check('email').notEmpty().isEmail().withMessage('El email es obligatorio y debe ser válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
], httpUsuarios.login);

router.put('/modificar/:id', [
    validarJWT,
    check('id').custom(usuarioHelper.existeUsuarioID),
    check('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    check('email').optional().isEmail().withMessage('El email debe ser válido'),
    check('password').optional().notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos
], httpUsuarios.modificarUsuario);

router.put('/activar/:id', [
    validarJWT,
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.activarUsuario);

router.put('/desactivar/:id', [
    validarJWT,
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.desactivarUsuario);

export default router;
