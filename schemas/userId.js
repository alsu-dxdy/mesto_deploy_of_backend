const { Joi } = require('celebrate');

module.exports.userIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};
