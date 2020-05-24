const { Joi } = require('celebrate');

module.exports.userIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
};
