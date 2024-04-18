import express, { NextFunction, Request, Response } from "express";
import { SectionService } from "../services/section.service";

export const router = express.Router();
const sectionService = new SectionService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await sectionService.find();
    res.json(sections);
  } catch (error) {
    next(error);
  }
});
