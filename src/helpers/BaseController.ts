import qs from 'qs';
import { Request, Response } from 'express';
import { Model, Document } from 'mongoose';
import { logger } from '../app';
import { AuthenticatedRequest } from '../Controllers';

export default class BaseController<T extends Document> {
  public model: Model<T>;
  public requiredFields: string[];
  public fields: string[];

  constructor(model: Model<T>) {
    this.model = model;
    this.fields = Object.keys(this.model.schema.paths);
    this.requiredFields = this.model.schema.requiredPaths();
  }

  private normalizeQuery(query: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {};
    for (const key in query) {
      const value = query[key];
      if (key.includes('.')) {
        const [prefix, field] = key.split('.');
        if (!normalized[prefix]) {
          normalized[prefix] = {};
        }
        normalized[prefix][field] = value;
      } else {
        normalized[key] = value;
      }
    }
    return normalized;
  }

  public async readById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const document = await this.model.findById(id);
    return res.status(200).json({
      success: true,
      data: document,
    });
  }

  public async read(req: Request, res: Response): Promise<Response> {
    try {
      const parsedQuery = qs.parse(req.query as any);
      const reqQuery = this.normalizeQuery(parsedQuery);
      const { filter, search } = reqQuery;
      let query: Record<string, any> = {};

      if (filter && typeof filter === 'object') {
        const filterKeys = Object.keys(filter);
        const invalidFilters = filterKeys.filter((key) => !this.fields.includes(key));
        if (invalidFilters.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid filter fields: ${invalidFilters.join(', ')}`,
          });
        }
        Object.entries(filter).forEach(([key, value]) => {
          query[key] = value;
        });
      }

      if (search && typeof search === 'object') {
        const searchKeys = Object.keys(search);
        const invalidSearches = searchKeys.filter((key) => !this.fields.includes(key));
        if (invalidSearches.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid search fields: ${invalidSearches.join(', ')}`,
          });
        }
        Object.entries(search).forEach(([key, value]) => {
          query[key] = { $regex: value, $options: 'i' };
        });
      }

      const documents = await this.model.find(query);
      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error: any) {
      logger.error('Error in read method:', error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    let data = req.body;
    if(req.authorId){
      data = {...req.body, authorId: req.authorId}
    }
    const missingFields = this.requiredFields.filter((field) => !(field in data));

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    try {
      const document = await this.model.create(data);
      return res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error: any) {
      logger.error(error, error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const updates = req.body;

    try {
      const invalidFields = Object.keys(updates).filter((key) => !this.fields.includes(key));
      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid fields in update: ${invalidFields.join(', ')}`,
        });
      }

      const updatedDocument = await this.model.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedDocument) {
        return res.status(404).json({
          success: false,
          message: `Document with id ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedDocument,
      });
    } catch (error: any) {
      logger.error(error, error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async put(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const data = req.body;

    try {
      const missingFields = this.requiredFields.filter((field) => !(field in data));
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields for PUT: ${missingFields.join(', ')}`,
        });
      }

      const invalidFields = Object.keys(data).filter((key) => !this.fields.includes(key));
      if (invalidFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid fields in PUT: ${invalidFields.join(', ')}`,
        });
      }

      const updatedDocument = await this.model.findOneAndReplace({ _id: id }, data, {
        new: true,
        upsert: false,
        runValidators: true,
      });

      if (!updatedDocument) {
        return res.status(404).json({
          success: false,
          message: `Document with id ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedDocument,
      });
    } catch (error: any) {
      logger.error(error, error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    try {
      const deletedDocument = await this.model.findByIdAndDelete(id);

      if (!deletedDocument) {
        return res.status(404).json({
          success: false,
          message: `Document with id ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error: any) {
      logger.error(error, error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}