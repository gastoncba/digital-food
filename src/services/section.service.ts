import * as boom from "@hapi/boom";

import { Section } from "../models";
import { insert, remove, select, update } from "./private/database.service";

export class SectionService {
  constructor() {}

  async find() {
    const sections = await select<Section>({ table: "sections" })
    return sections;
  }

  async findOne(id: string) {
    const sections = await select<Section>({ table: "sections", where: { id: { equal: id } } })
    if(sections.length === 0) throw boom.notFound("No se encontro seccion con #id" + id);
    return sections;
  }

  async findByMenuId(menuId: string) {
    const sections = await select<Section>({ table: "sections", where: { menuId: { equal: menuId } } })
    if(sections.length === 0) throw boom.notFound("No se encontro seccion con #menuId " + menuId);
    return sections;
  }

  async create(newSection: { name: string, menuId: number }) {
    await insert({ table: "sections", values: newSection })
  }

  async update(id: string, changes: { name?: string, menuId?: number }) {
    await this.findOne(id);
    await update({ table: "sections", values: changes, where: { id: { equal: id } }})
  }

  async remove(id: string) {
    await this.findOne(id);
    await remove({ table: "sections", where: { id: { equal: id } } })
  }
}
