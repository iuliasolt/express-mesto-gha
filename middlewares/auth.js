const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { jwtMesto = null } = req.cookies;

  if (!jwtMesto) {
    return next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(jwtMesto, 'some-secret-key');
  } catch (e) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
  return null;
};
