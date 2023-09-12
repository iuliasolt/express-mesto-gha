const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

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

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (e.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else next(e);
    });
};

const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.status(200).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch(() => {
      throw new AuthError('Необходима авторизация');
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
