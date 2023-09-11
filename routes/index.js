const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFoundError');

router.use(userRouter);
router.use(cardRouter);

router.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

module.exports = router;
