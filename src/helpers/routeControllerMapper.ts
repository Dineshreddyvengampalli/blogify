import { Response } from 'express';
import { userController, postController, AuthenticatedRequest } from '../Controllers';

type Controller = {
  readById: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  read: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  create: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  update: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  put: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
  delete: (req: AuthenticatedRequest, res: Response) => Promise<Response>;
};

export default function routeControllerMapper(resource: string): Controller | null {
  switch (resource.toLowerCase()) {
    case 'user':
    case 'users':
      return userController;
    case 'post':
    case 'posts':
      return postController;
    default:
      return null;
  }
}
