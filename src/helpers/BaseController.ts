import qs from "qs";
import { Request, Response } from "express";
import { Model } from "mongoose";
import { logger } from "../app";



export default class BaseController {
    public model: Model<any>;
    public requiredFeilds: string[];
    public feilds: string[];

    constructor(model: any){
        this.model = model;

        this.feilds = Object.keys(this.model.schema.paths).filter((field) => {
            const path = this.model.schema.paths[field];
            return path
          });

        this.requiredFeilds = this.model.schema.requiredPaths()
    }

    private normalizeQuery(query: Record<string, any>): any {
        const normalized: any = {};
    
        for (const key in query) {
            const value = query[key];
    
            if (key.includes(".")) {
                const [prefix, field] = key.split(".");
    
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
    
    public async readById(req: Request, res: Response){
        const id = req.params?.id

        const document = await this.model.findById(id)

        return res.status(200).json({
            success: true,
            data: document,
        });
    }

    public async read(req: Request, res: Response) {
        try {
            
            const parsedQuery = qs.parse(req.query as any);
            const reqQuery = this.normalizeQuery(parsedQuery);

            const { filter, search } = reqQuery;
            let query: any = {};

            if (filter && typeof filter === 'object') {
                const filterKeys = Object.keys(filter);
                const invalidFilters = filterKeys.filter((key) => !this.feilds.includes(key));

                if (invalidFilters.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid filter fields: ${invalidFilters.join(", ")}`,
                    });
                }

                Object.entries(filter).forEach(([key, value]) => {
                    query[key] = value;
                });
            }

            if (search && typeof search === 'object') {
                const searchKeys = Object.keys(search);
                const invalidSearches = searchKeys.filter((key) => !this.feilds.includes(key));

                if (invalidSearches.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid search fields: ${invalidSearches.join(", ")}`,
                    });
                }

                Object.entries(search).forEach(([key, value]) => {
                    query[key] = { $regex: value, $options: "i" };
                });
            }

            const documents = await this.model.find(query);

            return res.status(200).json({
                success: true,
                data: documents,
            });
        } catch (error) {
            console.error("Error in read method:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    public async create(req: Request, res: Response){
        const data = req.body;

            const missingFields = this.requiredFeilds.filter((field) => !(field in data));

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                });
            }

            try {
                const document = await this.model.create(data);
                return res.status(201).json({
                    success: true,
                    data: document,
                });

            } catch (error) {
                logger.error(error, error.message)
                return res.status(500).json({
                success: false,
                message: error.message,
                });
            }



            

    }

    public async update(req: Request, res: Response) {
        const id = req.params?.id;
        const updates = req.body;
    
        try {
            const invalidFields = Object.keys(updates).filter((key) => !this.feilds.includes(key));
            if (invalidFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid fields in update: ${invalidFields.join(", ")}`,
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
        } catch (error) {
            logger.error(error, error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }    

    public async delete(req: Request, res: Response) {
        const id = req.params?.id;
    
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
                message: "Document deleted successfully",
            });
        } catch (error) {
            logger.error(error, error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}