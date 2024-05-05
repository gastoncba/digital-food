import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { MenuService } from "../services/menu.service";
import { validatorHandler } from "../middleware";
import { getMenuDto, createMenuDto, updateMenuDto } from "../dtos/menu.dto";

export const router = express.Router();
const menuService = new MenuService();

router.get("/all", passport.authenticate("api-key", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await menuService.find();
    res.json(menus);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", passport.authenticate("api-key", { session: false }), validatorHandler(getMenuDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const menu = await menuService.findOne(id, ["id", "name", "photo"]);
    res.json(menu);
  } catch (error) {
    next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: any = req.user;
    const menuId = payload.sub;
    const menu = await menuService.findOne(menuId, ["id", "name", "photo"]);
    res.json(menu);
  } catch (error) {
    next(error);
  }
});

router.post("/", validatorHandler(createMenuDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    res.status(201).json(await menuService.create(body));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getMenuDto, "params"), validatorHandler(updateMenuDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const menu = await menuService.update(id, body);
    res.status(201).json(menu);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getMenuDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await menuService.remove(id);
    res.status(201).json({ message: "Menu eliminado" });
  } catch (error) {
    next(error);
  }
});
