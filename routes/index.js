const userRouter = require('./users');
const cardRouter = require('./cards');
const router = require('express').Router();

router.use(userRouter);
router.use(cardRouter);

module.exports = router;