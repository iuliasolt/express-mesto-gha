const userModel = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/utils');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid Date' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server Error' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
};
