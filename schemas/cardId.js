const { Joi } = require('celebrate');

module.exports.cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};
