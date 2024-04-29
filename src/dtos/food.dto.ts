import Joi from "joi";

const id = Joi.number().positive().integer();
const name = Joi.string().min(2).max(255);
const description = Joi.string().min(2).max(255);
const price = Joi.number().positive().min(5);
const ingredients = Joi.string().min(2).max(255).allow(null);
const sectionId = Joi.number().positive().integer();
const photo = Joi.string().min(2).max(255).allow(null);

export const createFoodDto = Joi.object({
  name: name.required(),
  description: description.required(),
  price: price.required(),
  ingredients: ingredients.required(),
  sectionId: sectionId.required(),
  photo: photo.required(),
});

export const updateFoodDto = Joi.object({
  name,
  description,
  price,
  ingredients,
  sectionId,
  photo,
});

export const getFoodDto = Joi.object({
  id: id.required(),
});

export const getFoodBySectionDto = Joi.object({
  sectionId: sectionId.required(),
});
