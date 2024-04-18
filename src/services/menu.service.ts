import * as boom from "@hapi/boom";

import { Menu } from "../models";
import { insert, remove, select, update } from "./private/database.service";

export class MenuService {
  constructor() {}

  async find() {
    const menus = await select<Menu>({ table: "menus" })
    return menus;
  }

  async findOne(id: string) {
    const menus = await select<Menu>({ table: "menus", where: { id: { equal: `${id}` } }})
    if(menus.length === 0) throw boom.notFound("No se encontro menu")
    return menus[0];
  }

  async findByCode(code: string) {
    const menus = await select<Menu>({ table: "menus", where: { code: { equal: `${code}` } }})
    if(menus.length === 0) throw boom.notFound("No se encontro menu")
    return menus[0];
  }

  async create(newMenu: { name: string, code: string, photo: string }) {
    const { name, code, photo } = newMenu;
    await insert({ table: "menus", values: { name, code, photo  } })
  }

  async update(id: string, changes:  { name?: string, code?: string, photo?: string }) {
    await update({ table: "menus", values: changes, where: { id: { equal: id } } })
  }

  async remove(id: string) {
    await remove({ table: "menus", where: { id: { equal: id } }})
  }
}
