const router = require('express').Router();
const { celebrate } = require('celebrate');

// eslint-disable-next-line object-curly-newline
const { getCards, getCardById, sendOneCard, createCard, removeCardById, likeCard, dislikeCard } = require('../controllers/cards');
const { postCardSchema } = require('../schemas/postCard');
const { cardIdSchema } = require('../schemas/cardId');

router.get('/', getCards);
router.get('/:cardId', celebrate(cardIdSchema), getCardById, sendOneCard);
router.post('/', celebrate(postCardSchema), createCard);
router.delete('/:cardId', celebrate(cardIdSchema), getCardById, removeCardById);
router.put('/:cardId/likes', celebrate(cardIdSchema), getCardById, likeCard);
router.delete('/:cardId/likes', celebrate(cardIdSchema), getCardById, dislikeCard);

module.exports = router;
