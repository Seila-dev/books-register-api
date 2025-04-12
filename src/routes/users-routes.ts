import { Router } from "express";
import { UsersController } from "../http/controllers/users-controller";
import { authMiddleware } from "../middlewares/auth";

const usersRoutes = Router()

usersRoutes.post(
    "/check-email", 
    new UsersController().checkEmail
)

usersRoutes.post(
    "/", 
    new UsersController().create
)

usersRoutes.post(
    "/login", 
    new UsersController().login
)

usersRoutes.get(
    "/", 
    authMiddleware, 
    new UsersController().profile
)

export default usersRoutes