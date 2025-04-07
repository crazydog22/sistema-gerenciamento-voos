import { AppError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

class BaseService {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName;
  }

  async create(data) {
    try {
      const doc = await this.model.create(data);
      logger.info(`${this.modelName} created`, { id: doc._id });
      return doc;
    } catch (error) {
      logger.error(`Error creating ${this.modelName}`, { error: error.message });
      throw error;
    }
  }

  async findById(id) {
    try {
      const doc = await this.model.findById(id);
      if (!doc) {
        throw new AppError(404, `${this.modelName} não encontrado`);
      }
      return doc;
    } catch (error) {
      logger.error(`Error finding ${this.modelName}`, { error: error.message });
      throw error;
    }
  }

  async exists(filter) {
    try {
      return await this.model.exists(filter);
    } catch (error) {
      logger.error(`Error checking ${this.modelName} existence`, { error: error.message });
      throw error;
    }
  }

  async find(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder };

      const [results, total] = await Promise.all([
        this.model.find(filter).sort(sortOptions).skip(skip).limit(limit),
        this.model.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        results,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      };
    } catch (error) {
      logger.error(`Error finding ${this.modelName}s`, { error: error.message });
      throw error;
    }
  }

  async findOne(filter) {
    try {
      const doc = await this.model.findOne(filter);
      if (!doc) {
        throw new AppError(404, `${this.modelName} não encontrado`);
      }
      return doc;
    } catch (error) {
      logger.error(`Error finding ${this.modelName}`, { error: error.message });
      throw error;
    }
  }

  async update(id, updateData, { new: newDoc = true, runValidators = true } = {}) {
    try {
      const doc = await this.model.findByIdAndUpdate(id, updateData, {
        new: newDoc,
        runValidators,
      });

      if (!doc) {
        throw new AppError(404, `${this.modelName} não encontrado`);
      }

      logger.info(`${this.modelName} updated`, { id });
      return doc;
    } catch (error) {
      logger.error(`Error updating ${this.modelName}`, { error: error.message });
      throw error;
    }
  }

  async delete(id) {
    try {
      const doc = await this.model.findByIdAndDelete(id);
      if (!doc) {
        throw new AppError(404, `${this.modelName} não encontrado`);
      }
      logger.info(`${this.modelName} deleted`, { id });
      return doc;
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}`, { error: error.message });
      throw error;
    }
  }
}

export default BaseService;
