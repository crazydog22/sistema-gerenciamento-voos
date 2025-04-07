import logger from '../config/logger.js';

const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, validationOptions);
    
    if (error) {
      logger.error('Validation error', { 
        path: req.path, 
        errors: error.details.map(x => x.message)
      });
      
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(x => x.message)
      });
    }

    req.body = value;
    return next();
  };
};

export default validate;
