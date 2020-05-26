// импортируем модель
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
      }
      res.json(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'ENOTFOUND') {
        throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
      }
      next(err);
    });
};

module.exports.removeCardById = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        // если карта не нашлась
        // eslint-disable-next-line prefer-promise-reject-errors
        throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
      }
      const { owner } = card;
      return owner;
    })
    .then((owner) => {
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.cardId);
      }
      // если владельцы не совпали
      // eslint-disable-next-line prefer-promise-reject-errors

      throw new ForbiddenError('You are not owner of this card, therefore you can not delete this card');
    })
    .then(() => {
      res.send(`Card with ID ${req.params.cardId} is deleted`);
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => {
      if (like) {
        res.send({ data: like });
      } else {
        throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
      }
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((like) => {
      if (like) {
        res.send({ data: like });
      } else {
        throw new NotFoundError(`Card with ID ${req.params.cardId} does not exist`);
      }
    })
    .catch((err) => {
      next(err);
    });
};
