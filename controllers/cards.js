// импортируем модель
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.getCardById = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
    })
    .then((card) => {
      req.card = card;
      next();
    })
    .catch(next);
};

module.exports.sendOneCard = (req, res) => {
  res.json(req.card);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch(next);
};

module.exports.removeCardById = (req, res, next) => {
  // если владельцы не совпали
  if (req.user._id !== req.card.owner.toString()) {
    throw new ForbiddenError('You are not owner of this card, therefore you can not delete this card');
  }
  Card.remove({ _id: req.params.cardId })
    .then(() => {
      res.send({ data: `Card with ID ${req.params.cardId} is deleted` });
    })
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => res.send({ data: like }))
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => res.send({ data: like }))
    .catch(next);
};
