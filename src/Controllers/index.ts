import BaseController from "../helpers/BaseController";
import { Post } from "../models/Post";
import { User } from "../models/User";

export const userController = new BaseController(User)
export const postController = new BaseController(Post)