import express from "express";
import UserAuthController from "../../modules/user/user.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router: express.Router = express.Router();

router.post("/register", UserAuthController.register);
router.post("/login", UserAuthController.login);
router.post("/logout", authMiddleware, UserAuthController.logout);

export default router;
