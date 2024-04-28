import express, { NextFunction, Request, Response } from "express";
import passport from "passport";

import { FoodService } from "../services/food.service";
import { validatorHandler } from "../middleware";
import { createFoodDto, getFoodBySectionDto, getFoodDto, updateFoodDto } from "../dtos/food.dto";

export const router = express.Router();
const foodService = new FoodService();

router.get("/", passport.authenticate("api-key", { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foods = await foodService.find(["name", "photo"]);
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", validatorHandler(getFoodDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const food = await foodService.findOne(id);
    res.json(food);
  } catch (error) {
    next(error);
  }
});

router.get("/section/sectionId", validatorHandler(getFoodBySectionDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sectionId } = req.params;
    const food = await foodService.findBySectionId(sectionId);
    res.json(food);
  } catch (error) {
    next(error);
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), validatorHandler(createFoodDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const food = await foodService.create(body);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getFoodDto, "params"), validatorHandler(updateFoodDto, "body"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const food = await foodService.update(id, body);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", passport.authenticate("jwt", { session: false }), validatorHandler(getFoodDto, "params"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await foodService.remove(id);
    res.status(201).json({ message: "Comida eliminada" });
  } catch (error) {
    next(error);
  }
});
