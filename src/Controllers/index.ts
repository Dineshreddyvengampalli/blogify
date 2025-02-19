import BaseController from '../helpers/BaseController';
import { Post, IPost } from '../models/Post';
import { User, IUser } from '../models/User';

export const userController = new BaseController<IUser>(User);
export const postController = new BaseController<IPost>(Post);