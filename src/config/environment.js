/**
 * Configurações de ambiente da aplicação
 */
import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Configurações do banco de dados
  database: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/voos',
  },

  // Configurações de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'sua-chave-secreta-muito-segura',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30,
  },

  // Configurações de CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  // Configurações de email
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.EMAIL_FROM || 'noreply@voos.com',
  },

  // Configurações de rate limit
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: process.env.RATE_LIMIT_MAX || 100,
  },
};

export default config;
