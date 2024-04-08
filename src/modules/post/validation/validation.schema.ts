import Joi from "joi";

export const post_schema = Joi.object({
  text: Joi.string().max(300).required(),
  media: Joi.string().length(24).optional().messages({
    'string.length': 'Invalid media id',
  }),
})

export const post_comment = Joi.object({
  text: Joi.string().max(300).required(),
})
