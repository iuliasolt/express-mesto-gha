const router = require('express').Router();
const {
  createCard,
  deleteCard,
  getCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validations');

router.post('/cards', validationCreateCard, createCard);
router.get('/cards', getCard);
router.delete('/cards/:cardId', validationCardId, deleteCard);

router.put('/cards/:cardId/likes', validationCardId, likeCard);
router.delete('/cards/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
