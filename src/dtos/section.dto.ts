import Joi from "joi";

const id = Joi.number().positive().integer();
const name = Joi.string().min(2).max(255);
const menuId = Joi.number().positive().integer();

export const createSectionDto = Joi.object({
  name: name.required(),
  menuId: menuId.required(),
});

export const updateSectionDto = Joi.object({
  name,
  menuId,
});

export const getSectionDto = Joi.object({
  id: id.required(),
});

export const getSectionByMenuDto = Joi.object({
  menuId: menuId.required(),
});
