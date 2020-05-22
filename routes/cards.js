const router = require('express').Router();
const { celebrate } = require('celebrate');

// eslint-disable-next-line object-curly-newline
const { getCards, getCardById, createCard, removeCardById, likeCard, dislikeCard } = require('../controllers/cards');
const { postCardSchema } = require('../schemas/postCard');

router.get('/', getCards);
router.get('/:cardId', getCardById);
router.post('/', celebrate(postCardSchema), createCard);
router.delete('/:cardId', removeCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
