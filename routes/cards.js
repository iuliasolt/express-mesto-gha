const { createCard, deleteCard, getCard, likeCard, dislikeCard } = require('../controllers/cards');
const router = require('express').Router();

router.post('/cards', createCard);
router.get('/cards', getCard);
router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;