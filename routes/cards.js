const router = require('express').Router();
const { celebrate } = require('celebrate');

// eslint-disable-next-line object-curly-newline
const { getCards, getCardById, createCard, removeCardById, likeCard, dislikeCard } = require('../controllers/cards');
const { postCardSchema } = require('../schemas/postCard');
const { cardIdSchema } = require('../schemas/cardId');

router.get('/', getCards);
router.get('/:cardId', celebrate(cardIdSchema), getCardById);
router.post('/', celebrate(postCardSchema), createCard);
router.delete('/:cardId', celebrate(cardIdSchema), removeCardById);
router.put('/:cardId/likes', celebrate(cardIdSchema), likeCard);
router.delete('/:cardId/likes', celebrate(cardIdSchema), dislikeCard);

module.exports = router;
