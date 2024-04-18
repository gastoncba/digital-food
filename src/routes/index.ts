import express, { Express } from "express";
import { router as menusRouter } from "./menus.router";
import { router as sectionsRouter } from "./menus.router";

export const routerApi = (app: Express) => {
  const router = express.Router();
  app.use("/api", router);
  router.use("/menus", menusRouter);
  router.use("/sections", sectionsRouter);
};
