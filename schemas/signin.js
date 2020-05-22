const { Joi } = require('celebrate');

module.exports.signInSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      .regex(/^[a-zA-Z0-9]{3,30}$/),
  }),
};
