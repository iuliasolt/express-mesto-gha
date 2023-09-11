const cardModel = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFound = require('../errors/NotFoundError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardModel
    .create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

const getCard = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return cardModel
    .findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указаным id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        cardModel.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      } else {
        throw new ForbiddenError('В доступе отказано');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFound('Передан несуществующий id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      if (e.name === 'NotFound') {
        next(new NotFound('Передан несуществующий id карточки'));
      }
      next(e);
    });
};

const dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFound('Передан несуществующий id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      if (e.name === 'NotFound') {
        next(new NotFound('Передан несуществующий id карточки'));
      }
      next(e);
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
};
