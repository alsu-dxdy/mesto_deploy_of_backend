const { Joi } = require('celebrate');

module.exports.postCardSchema = {
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30),
    link: Joi.string()
      .required()
      .regex(/^http(s)?:\/\/(www\.)?(?!(www\.))(([0-2][0-5][0-5]\.){3}[0-2][0-5][0-5]|([a-z0-9]{2,}[-a-z0-9]*\.)+[a-z]{2,6})(\/)?(:\d{2,5})?([-?=&A-Za-z0-9.]{2,}\/?)*#?\d?$/),
  }),
};
