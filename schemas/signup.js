const { Joi } = require('celebrate');

module.exports.signUpSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
    avatar: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^[-!@#%a-zA-Z0-9_{}\]\[\\\^\$\.\|\?\*\+\(\)]{3,30}$/), // экранирую спец символы
  }),
};
