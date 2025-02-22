import express, { Router, RequestHandler } from 'express';
import routeControllerMapper from '../helpers/routeControllerMapper';
import { verifyToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../Controllers';

const universalRouter: Router = express.Router();

universalRouter.use(verifyToken);

const universalHandler: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthenticatedRequest;
  const { resource, id } = authReq.params;
  const controller = routeControllerMapper(resource);

  if (!controller) {
    res.status(404).json({
      success: false,
      message: `Resource '${resource}' not found.`,
    });
    return;
  }

  try {
    const method = authReq.method.toUpperCase();
    if (method === 'GET') {
      if (id) {
        await controller.readById(authReq, res);
      } else {
        await controller.read(authReq, res);
      }
    } else if (method === 'POST') {
      await controller.create(authReq, res);
    } else if (method === 'PATCH') {
      await controller.update(authReq, res);
    } else if (method === 'PUT') {
      await controller.put(authReq, res);
    } else if (method === 'DELETE') {
      await controller.delete(authReq, res);
    } else {
      res.status(405).json({
        success: false,
        message: `Method '${method}' not allowed for resource '${resource}'.`,
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

universalRouter.all('/:resource/:id?', universalHandler);

export default universalRouter;