import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { SectionService } from "../services/section.service";
import { validatorHandler } from "../middleware";
import { createSectionDto, getSectionByMenuDto, getSectionDto, updateSectionDto } from "../dtos/section.dto";

export const router = express.Router();
const sectionService = new SectionService();

router.get("/", passport.authenticate("api-key", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await sectionService.find();
    res.json(sections);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getSectionDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const section = await sectionService.findOne(id);
    res.json(section);
  } catch (error) {
    next(error);
  }
});

router.get("/menu/:menuId", validatorHandler(getSectionByMenuDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { menuId } = req.params;
    const sections = await sectionService.findByMenuId(menuId, ["id", "name"]);
    res.json(sections);
  } catch (error) {
    next(error);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), validatorHandler(createSectionDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const section = await sectionService.create(body);
    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getSectionDto, "params"), validatorHandler(updateSectionDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const section = await sectionService.update(id, body);
    res.status(201).json(section);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getSectionDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await sectionService.remove(id);
    res.status(201).json({ message: "Sección Eliminada" });
  } catch (error) {
    next(error);
  }
});
