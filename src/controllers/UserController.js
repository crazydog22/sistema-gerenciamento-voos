import UserService from '../services/UserService.js';
import { AppError } from '../middleware/errorHandler.js';

class UserController {
  async register(req, res, next) {
    try {
      const { user, tokens } = await UserService.createUser(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, 'Email e senha são obrigatórios');
      }

      const { user, tokens } = await UserService.loginUser(email, password);

      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await UserService.logoutUser(req.user._id, refreshToken);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError(400, 'Refresh token é obrigatório');
      }

      const tokens = await UserService.refreshUserToken(refreshToken);
      res.json({
        status: 'success',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserProfile(req.user._id);
      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await UserService.updateProfile(req.user._id, req.body);
      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError(400, 'Senha atual e nova senha são obrigatórias');
      }

      await UserService.changePassword(req.user._id, currentPassword, newPassword);
      res.json({
        status: 'success',
        message: 'Senha alterada com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page, limit, sortBy, sortOrder, ...filter } = req.query;
      const users = await UserService.find(filter, { page, limit, sortBy, sortOrder });
      res.json({
        status: 'success',
        data: {
          users: users.results.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          })),
          pagination: users.pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
