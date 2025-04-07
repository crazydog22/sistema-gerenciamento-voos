import User from '../models/User.js';
import AuthService from '../services/AuthService.js';

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Verifica se o usuário já existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Cria o novo usuário
            const user = new User({ name, email, password });
            await user.save();

            // Gera o token
            const token = AuthService.generateToken(user._id);

            res.status(201).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Busca o usuário
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Email ou senha inválidos' });
            }

            // Verifica a senha
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Email ou senha inválidos' });
            }

            // Gera o token
            const token = AuthService.generateToken(user._id);

            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
        }
    }

    async me(req, res) {
        try {
            const user = req.user;
            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
        }
    }
}

export default new AuthController();
