import Joi from "joi";

export const user_registration = Joi.object({
  firstname: Joi.string().max(255).required(),
  lastname: Joi.string().max(255).required(),
  username: Joi.string().max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const user_login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const token_refresh = Joi.object({
  refresh_token: Joi.string().required()
})

export const follow_user = Joi.object({
  followed_user_id: Joi.string().length(24).required().messages({
    'string.length': 'Invalid user id',
  }),
})
