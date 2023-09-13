const mongoose = require('mongoose');
const cardModel = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFound = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardModel
    .create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      return next(e);
    });
};

const getCard = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  cardModel
    .findById(req.prams.cardId)
    .orFail()
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        return next(new ForbiddenError('В доступе отказано'));
      }
      return cardModel.deleteOne({ _id: req.params.cardId })
        .then((resObj) => ({ resObj, card }))
        .catch(next);
    })
    .then(({ resObj, card }) => {
      if (!resObj.deletedCount) return Promise.reject(new Error('Не удалять'));
      res.status(200).send({ data: card });
      return null;
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFound('Карточки с переданным _id не существует.', e.name, e.message));
      }
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Некорректный формат _id.', e.name, e.message));
      }
      return next(e);
    });
};

const likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFound('Карточки с переданным _id не существует.', e.name, e.message));
      }
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Некорректный формат _id.', e.name, e.message));
      }
      return next(e);
    });
};

const dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => {
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFound('Карточки с переданным _id не существует.', err.name, err.message));
      }
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Некорректный формат _id.', err.name, err.message));
      }
      return next(e);
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
};
