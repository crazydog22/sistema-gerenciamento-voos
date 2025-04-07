import logger from '../config/logger.js';
import config from '../config/environment.js';

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log do erro
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      userId: req.user ? req.user._id : 'anonymous',
    },
  });

  // Resposta para o cliente
  const errorResponse = {
    status: err.status,
    message: err.message,
    ...(config.server.env === 'development' && {
      error: err,
      stack: err.stack,
    }),
  };

  // Tratamento específico para erros conhecidos
  if (err.name === 'ValidationError') {
    errorResponse.statusCode = 400;
    errorResponse.message = 'Dados inválidos';
    errorResponse.errors = Object.values(err.errors).map((e) => e.message);
  }

  if (err.code === 11000) {
    errorResponse.statusCode = 400;
    errorResponse.message = 'Dados duplicados';
    errorResponse.field = Object.keys(err.keyPattern)[0];
  }

  if (err.name === 'JsonWebTokenError') {
    errorResponse.statusCode = 401;
    errorResponse.message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse.statusCode = 401;
    errorResponse.message = 'Token expirado';
  }

  res.status(err.statusCode).json(errorResponse);
};

export { AppError, errorHandler };
