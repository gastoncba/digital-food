import * as boom from "@hapi/boom";

import { Food } from "../models";
import { insert, remove, select, update } from "./private/database.service";

export class FoodService {
  async find(columns?: string[]) {
    const foods = await select<Food[]>({ table: "foods", columns });
    return foods;
  }

  async findOne(id: string, columns?: string[]) {
    console.log("columnas => ", columns)
    const foods = await select<Food[]>({ table: "foods", columns, where: { id: { equal: id } } });
    if (foods.length === 0) throw boom.notFound("No se encontro comida de #id" + id);
    return foods[0];
  }

  async create(newFood: { id: number; name: string; description: string; price: number; ingredients: string; sectionId: number; photo: string }) {
    const result = await insert({ table: "foods", values: newFood });
    if (result) {
      return await this.findOne(result.insertId.toString());
    }
  }

  async update(id: string, changes: { name?: string; description?: string; price?: number; ingredients?: string; sectionId?: number; photo?: string }) {
    await this.findOne(id);
    await update({ table: "foods", values: changes });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await remove({ table: "foods", where: { id: { equal: id } } });
  }
}
