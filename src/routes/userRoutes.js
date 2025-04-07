import express from 'express';
import UserController from '../controllers/UserController.js';
import auth from '../middleware/auth.js';
import { adminAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../validations/userValidation.js';

const router = express.Router();

// Rotas públicas
router.post('/register', validate(createUserSchema), UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);

// Rotas protegidas
router.use(auth);
router.get('/profile', UserController.getProfile);
router.patch('/profile', validate(updateUserSchema), UserController.updateProfile);
router.post('/change-password', UserController.changePassword);
router.post('/logout', UserController.logout);

// Rotas de admin
router.use(adminAuth);
router.get('/', UserController.getAllUsers);

export default router;
