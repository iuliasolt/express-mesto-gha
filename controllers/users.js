const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFoundError');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      if (e.message === 'NotFound') {
        next(new NotFound('Пользователь по указанному id не найден'));
      }
      next(e);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFound('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError' || e.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFound('Пользователь по указанному id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError' || e.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .onFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ user }))
    .catch((e) => {
      if (e.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (e.message === 'NotFound') {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      userModel.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные');
      } else if (e.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Аторизация пройдена успешно' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
  getCurrentUser,
  login,
};
