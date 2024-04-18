import express, { NextFunction, Request, Response } from "express";

import { MenuService } from "../services/menu.service";
import { validatorHandler } from "../middleware";
import {
  getMenuByCodeDto,
  getMenuDto,
  menuCreateDto,
  menuUpdateDto,
} from "../dtos/menu.dto";

export const router = express.Router();
const menuService = new MenuService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menus = await menuService.find();
    res.json(menus);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getMenuDto, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const menu = await menuService.findOne(id);
      res.json(menu);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/code/:code",
  validatorHandler(getMenuByCodeDto, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const menu = await menuService.findByCode(code);
      res.json(menu);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  validatorHandler(menuCreateDto, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      await menuService.create(body);
      res.status(201).json({ message: "menu creado" });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  validatorHandler(getMenuDto, "params"),
  validatorHandler(menuUpdateDto, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { body } = req;
      await menuService.update(id, body);
      res.status(201).json({ message: "menu actualizado" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  validatorHandler(getMenuDto, "params"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await menuService.remove(id);
      res.status(201).json({ message: "menu eliminado" });
    } catch (error) {
      next(error);
    }
  },
);
