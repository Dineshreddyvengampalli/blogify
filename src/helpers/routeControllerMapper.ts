import { Request, Response } from 'express';
import { userController, postController } from '../Controllers';

type Controller = {
  readById: (req: Request, res: Response) => Promise<Response>;
  read: (req: Request, res: Response) => Promise<Response>;
  create: (req: Request, res: Response) => Promise<Response>;
  update: (req: Request, res: Response) => Promise<Response>;
  put: (req: Request, res: Response) => Promise<Response>;
  delete: (req: Request, res: Response) => Promise<Response>;
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