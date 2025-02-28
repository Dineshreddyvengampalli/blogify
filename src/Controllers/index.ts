import { Request, Response } from 'express';
import BaseController from '../helpers/BaseController';
import { Post, IPost } from '../models/Post';
import { User, IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user: { id: string };
  authorId?: string;
}

class PostController extends BaseController<IPost> {
  public create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    req.authorId = req.user.id;
    return super.create(req, res);
  }
}

export const userController = new BaseController<IUser>(User);
export const postController = new PostController(Post);
