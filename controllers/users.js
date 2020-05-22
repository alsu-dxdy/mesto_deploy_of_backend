const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

// const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET } = require('../config');

// импортируем модель
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with ID ${req.params.userId} does not exist`);
      }
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email: user.email });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'ENOTFOUND') {
        throw new NotFoundError('User file not found');
      }
      next(err);
    });
};

module.exports.removeUserdById = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with ID ${req.params.userId} does not exist`);
      }
      res.send('User is deleted');
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
    },
  )
    .then((updatedUser) => res.send({ data: updatedUser }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true, // передать обновлённый объект на вход обработчику then
      runValidators: true, // валидировать новые данные перед записью в базу
    },
  )
    .then((updatedAvatarUser) => res.send({ data: updatedAvatarUser }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((newUser) => {
      // не нашелся - отклоняем промис
      if (!newUser) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      // нашелся - сравниваем хеши
      return bcrypt.compare(password, newUser.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: newUser._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
