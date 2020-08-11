const { Joi } = require('celebrate');

module.exports.signInSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^[-!@#%a-zA-Z0-9_{}\]\[\\\^\$\.\|\?\*\+\(\)]{3,30}$/), // экранирую спец символы
  }),
};
