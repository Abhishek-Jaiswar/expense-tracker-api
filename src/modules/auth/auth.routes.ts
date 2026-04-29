import { Router, type Router as ExpressRouter } from "express";
import { authController } from "./auth.controller.js";

const authRouter: ExpressRouter = Router();


authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

export default authRouter;


