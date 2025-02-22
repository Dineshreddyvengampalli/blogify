import express, { Request, Response, NextFunction, Router } from 'express';
import routeControllerMapper from '../helpers/routeControllerMapper';
import { verifyToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../Controllers';

const universalRouter: Router = express.Router();

universalRouter.use(verifyToken);

universalRouter.all('/:resource/:id?', async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { resource, id } = req.params;
  const controller = routeControllerMapper(resource);

  if (!controller) {
    res.status(404).json({
      success: false,
      message: `Resource '${resource}' not found.`,
    });
    return;
  }

  try {
    const method = req.method.toUpperCase();
    if (method === 'GET') {
      if (id) {
        await controller.readById(req, res);
      } else {
        await controller.read(req, res);
      }
    } else if (method === 'POST') {
      await controller.create(req, res);
    } else if (method === 'PATCH') {
      await controller.update(req, res);
    } else if (method === 'PUT') {
      await controller.put(req, res);
    } else if (method === 'DELETE') {
      await controller.delete(req, res);
    } else {
      res.status(405).json({
        success: false,
        message: `Method '${method}' not allowed for resource '${resource}'.`,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
      error: error.message,
    });
  }
});

export default universalRouter;