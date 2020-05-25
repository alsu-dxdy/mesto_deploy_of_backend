const router = require('express').Router();
const { celebrate } = require('celebrate');

// eslint-disable-next-line object-curly-newline
const { getUsers, getUserById, removeUserdById, updateUser, updateAvatarUser } = require('../controllers/users');
const { userIdSchema } = require('../schemas/userId');
const { nameAboutUser } = require('../schemas/nameAboutUser');


router.get('/', getUsers);
router.get('/:userId', celebrate(userIdSchema), getUserById);
router.delete('/:userId', celebrate(userIdSchema), removeUserdById);
router.patch('/me', celebrate(nameAboutUser), updateUser);
router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
