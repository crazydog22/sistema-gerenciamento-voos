import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './src/config/environment.js';
import flightRoutes from './src/routes/flightRoutes.js';
import reservationRoutes from './src/routes/reservationRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import requestLogger from './src/middleware/requestLogger.js';
import logger from './src/config/logger.js';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = config.server.port;

// Configuração do Rate Limiter
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
});

// Middlewares
app.use(helmet()); // Segurança
app.use(limiter); // Rate Limiting

app.use(
  cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Conexão com o MongoDB
mongoose
  .connect(config.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('✅ Conectado ao MongoDB'))
  .catch((err) => logger.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/reservations', reservationRoutes);

// Rota de status
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: config.server.env,
  });
});

// Middleware de erro 404
app.use((_req, _res, next) => {
  const error = new Error('Rota não encontrada');
  error.status = 404;
  next(error);
});

// Tratamento de erros
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Iniciando graceful shutdown...');
  server.close(() => {
    logger.info('Server fechado');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB desconectado');
      process.exit(0);
    });
  });

  // Se o servidor não fechar em 10 segundos, força o encerramento
  setTimeout(() => {
    logger.error('Não foi possível fechar as conexões, forçando shutdown');
    process.exit(1);
  }, 10000);
};

// Inicia o servidor
const server = app.listen(PORT, () => {
  logger.info(`✈️ Servidor rodando na porta ${PORT}`);
  logger.info(`🌍 Ambiente: ${config.server.env}`);
});

// Handlers para graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);