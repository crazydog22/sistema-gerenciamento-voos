import jwt from 'jsonwebtoken';
import config from '../config/environment.js';

class AuthService {
    generateToken(userId) {
        return jwt.sign({ id: userId }, config.jwt.secret, {
            expiresIn: '24h'
        });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            return null;
        }
    }
}

export default new AuthService();
