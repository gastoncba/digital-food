import Joi from "joi";

const id = Joi.number().positive();
const name = Joi.string().min(2).max(50);
const code = Joi.string().min(2).max(50);

export const menuCreateDto = Joi.object({
  name: name.required(),
  code: code.required()
});

export const menuUpdateDto = Joi.object({
  name,
  code
});

export const getMenuDto = Joi.object({
  id: id.required(),
});

export const getMenuByCodeDto = Joi.object({
  code: code.required()
})
