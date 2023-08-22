const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND } = require('../utils/utils');

router.use(userRouter);
router.use(cardRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'User not found' });
});

module.exports = router;
