import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { AuthService } from "../services/auth.service";
import { validatorHandler } from "../middleware";
import { loginDto } from "../dtos/login.dto";

export const router = express.Router();
const authService = new AuthService();

router.post("/login", validatorHandler(loginDto, "body"), passport.authenticate("custom", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menu: any = req.user;
    res.json(authService.signToken(menu));
  } catch (error) {
    next(error);
  }
});
