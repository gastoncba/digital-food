import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";

import { Menu } from "../models";
import { insert, remove, select, update } from "./private/database.service";
import { generateKey } from "../utils/generator";

export class MenuService {
  constructor() {}

  async find(columns?: string[]) {
    const menus = await select<Menu[]>({ table: "menus", columns });
    return menus;
  }

  async findOne(id: string, columns?: string[]) {
    const menus = await select<Menu[]>({ table: "menus", columns, where: { id: { equal: id } } });
    if (menus.length === 0) throw boom.notFound("No se encontro menu");
    return menus[0];
  }

  async create(newMenu: { name: string; photo: string }) {
    const key = generateKey();
    const hash = await bcrypt.hash(key, 10);

    const result = await insert({ table: "menus", values: { ...newMenu, code: hash } });
    if (result) {
      const menu = await this.findOne(result.insertId.toString(), ["id", "name", "photo"]);
      return { menu, key };
    }
  }

  async update(id: string, changes: { name?: string; code?: string; photo?: string }) {
    await this.findOne(id);
    await update({ table: "menus", values: changes, where: { id: { equal: id } } });
    return await this.findOne(id, ["id", "name", "photo"]);
  }

  async remove(id: string) {
    await remove({ table: "menus", where: { id: { equal: id } } });
  }
}
