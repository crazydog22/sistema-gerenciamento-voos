import jwt from 'jsonwebtoken';
import config from '../config/environment.js';
import logger from '../config/logger.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findOne({
      _id: decoded.sub,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication failed', { error: error.message });
    res.status(401).json({ message: 'Por favor, autentique-se.' });
  }
};

export const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
  next();
};

export default auth;
