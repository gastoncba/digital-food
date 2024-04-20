import Joi from "joi";

const key = Joi.string().min(2).max(64);

export const loginDto = Joi.object({
  key: key.required()
})
