import express from 'express'
import routeControllerMapper from '../helpers/routeControllerMapper'
import { userController } from '../Controllers'

const userRouter = express.Router()

userRouter.all("/", async (req, res)=> {
    await userController.create(req, res);
});


export default userRouter