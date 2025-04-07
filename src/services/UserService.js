import BaseService from './BaseService.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import TokenService from './TokenService.js';
import logger from '../config/logger.js';

class UserService extends BaseService {
  constructor() {
    super(User, 'User');
  }

  async createUser(userData) {
    const existingUser = await this.exists({ email: userData.email });
    if (existingUser) {
      throw new AppError(400, 'Email já está em uso');
    }

    try {
      const user = await this.create(userData);
      const tokens = await TokenService.generateAuthTokens(user);
      logger.info('New user registered', { userId: user._id });
      return { user, tokens };
    } catch (error) {
      logger.error('User registration failed', { error: error.message });
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await this.findOne({ email });
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new AppError(401, 'Credenciais inválidas');
      }

      const tokens = await TokenService.generateAuthTokens(user);
      logger.info('User logged in', { userId: user._id });
      return { user, tokens };
    } catch (error) {
      logger.error('Login failed', { error: error.message });
      throw new AppError(401, 'Credenciais inválidas');
    }
  }

  async logoutUser(userId, refreshToken) {
    try {
      await TokenService.revokeToken(refreshToken);
      logger.info('User logged out', { userId });
    } catch (error) {
      logger.error('Logout failed', { error: error.message });
      throw error;
    }
  }

  async refreshUserToken(refreshToken) {
    try {
      const tokens = await TokenService.refreshAuth(refreshToken);
      return tokens;
    } catch (error) {
      logger.error('Token refresh failed', { error: error.message });
      throw new AppError(401, 'Token de refresh inválido');
    }
  }

  async updateProfile(userId, updateData) {
    const { ...safeUpdateData } = updateData;
    delete safeUpdateData.password;
    delete safeUpdateData.email;
    delete safeUpdateData.role;

    try {
      const user = await this.update(userId, safeUpdateData);
      logger.info('User profile updated', { userId });
      return user;
    } catch (error) {
      logger.error('Profile update failed', { error: error.message });
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.findById(userId);
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        throw new AppError(401, 'Senha atual incorreta');
      }

      user.password = newPassword;
      await user.save();
      logger.info('User password changed', { userId });
    } catch (error) {
      logger.error('Password change failed', { error: error.message });
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.findById(userId);
      return user;
    } catch (error) {
      logger.error('Get profile failed', { error: error.message });
      throw error;
    }
  }
}

export default new UserService();
