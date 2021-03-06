/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { signInSchema } = require('./schemas/signin');// for joi
const { signUpSchema } = require('./schemas/signup');

const { PORT, DATABASE_URL } = require('./config');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

const whitelist = [
  'http://localhost:8080',
  'https://alsu-dxdy.github.io',
  'https://www.placeimage.space',
  'http://www.placeimage.space',
  'https://placeimage.space',
  'http://placeimage.space',
];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // для передачи заголовка Access-Control-Allow-credentials
};

app.use(cors(corsOptions));

// подключаем helmet
app.use(helmet());

// подключаем rate-limiter
app.use(limiter);

// подключаемся к серверу mongo
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  // autoIndex: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate(signUpSchema), createUser);
app.post('/signin', celebrate(signInSchema), login);

// авторизация
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));


app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

// обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let status = err.statusCode || 500;
  let { message } = err;
  if (err.name === 'ValidationError') {
    message = 'ValidationError';
    status = 400;
  }

  if (err.message.includes('email') && err.message.includes('unique')) {
    message = 'User with email already exists';
    status = 400;
  }

  if (err.message.includes('password') && err.message.includes('pattern')) {
    message = 'Password must include symbols only from range: [a-zA-Z0-9] and spec symbols';
    status = 400;
  }

  if (status === 500) {
    // eslint-disable-next-line no-console
    console.error(err.stack || err);
    message = 'unexpected error';
  }
  res.status(status).send({ message });
});
