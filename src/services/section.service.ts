import * as boom from "@hapi/boom";

import { Section } from "../models";
import { insert, remove, select, update } from "./private/database.service";

export class SectionService {
  constructor() {}

  async find(columns?: string[]) {
    const sections = await select<Section[]>({ table: "sections", columns });
    return sections;
  }

  async findOne(id: string, columns?: string[]) {
    const sections = await select<Section[]>({ table: "sections", columns, where: { id: { equal: id } } });
    if (sections.length === 0) throw boom.notFound("No se encontro seccion con #id" + id);
    return sections[0];
  }

  async findByMenuId(menuId: string, columns?: string[]) {
    const sections = await select<Section[]>({ table: "sections", columns, where: { menuId: { equal: menuId } } });
    return sections;
  }

  async create(newSection: { name: string; menuId: number }) {
    const result = await insert({ table: "sections", values: newSection });
    if (result) {
      return await this.findOne(result.insertId.toString());
    }
  }

  async update(id: string, changes: { name?: string; menuId?: number }) {
    await this.findOne(id);
    await update({ table: "sections", values: changes, where: { id: { equal: id } } });
    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await remove({ table: "sections", where: { id: { equal: id } } });
  }
}
