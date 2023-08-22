const cardModel = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/utils');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardModel
    .create({ name, link, owner })
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(201).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid Date' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server Error' });
      }
    });
};

const getCard = (req, res) => {
  cardModel
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(card);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(201).send(card);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Invalid Date' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Server Error' });
      }
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
};
