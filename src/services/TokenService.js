import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import User from '../models/User.js';
import config from '../config/environment.js';
import logger from '../config/logger.js';

class TokenService {
  generateToken(userId, expires, type, secret = config.jwt.secret) {
    const payload = {
      sub: userId,
      type,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expires.getTime() / 1000),
    };
    return jwt.sign(payload, secret);
  }

  async saveToken(token, userId, expires, type) {
    const tokenDoc = await Token.create({
      token,
      userId,
      expires,
      type,
    });
    return tokenDoc;
  }

  async verifyToken(token, type) {
    try {
      const payload = jwt.verify(token, config.jwt.secret);
      const tokenDoc = await Token.findOne({
        token,
        type,
        userId: payload.sub,
        blacklisted: false,
      });

      if (!tokenDoc) {
        throw new Error('Token not found');
      }

      return tokenDoc;
    } catch (error) {
      logger.error('Token verification failed', { error: error.message });
      throw new Error('Token invalid');
    }
  }

  async generateAuthTokens(user) {
    const accessTokenExpires = new Date(
      Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000
    );
    const accessToken = this.generateToken(user.id, accessTokenExpires, 'access');

    const refreshTokenExpires = new Date(
      Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
    );
    const refreshToken = this.generateToken(user.id, refreshTokenExpires, 'refresh');
    await this.saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  }

  async refreshAuth(refreshToken) {
    try {
      const refreshTokenDoc = await this.verifyToken(refreshToken, 'refresh');
      const user = await User.findById(refreshTokenDoc.userId);
      if (!user) {
        throw new Error('User not found');
      }

      await Token.deleteOne({ _id: refreshTokenDoc._id });
      return this.generateAuthTokens(user);
    } catch (error) {
      logger.error('Refresh auth failed', { error: error.message });
      throw new Error('Invalid refresh token');
    }
  }

  async revokeToken(token) {
    const tokenDoc = await Token.findOne({ token, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }

    await Token.updateOne({ _id: tokenDoc._id }, { blacklisted: true });
  }
}

export default new TokenService();
