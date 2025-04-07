import logger from '../config/logger.js';

const requestLogger = (req, res, next) => {
  // Captura o tempo inicial
  const start = Date.now();

  // Processa a requisição
  next();

  // Após a resposta ser enviada
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent') || '-',
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user ? req.user._id : 'anonymous',
    };

    // Log diferente baseado no status da resposta
    if (res.statusCode >= 500) {
      logger.error('Server Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client Error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
};

export default requestLogger;
