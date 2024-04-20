import Joi from "joi";

const id = Joi.number().positive().integer();
const name = Joi.string().min(2).max(255);
const photo = Joi.string().max(255).allow(null)

export const createMenuDto = Joi.object({
  name: name.required(),
  photo,
});

export const updateMenuDto = Joi.object({
  name,
  photo
});

export const getMenuDto = Joi.object({
  id: id.required(),
});
