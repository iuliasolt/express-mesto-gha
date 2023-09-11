const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

const {
  validationUserId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../middlewares/validations');

router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validationUserId, getUserById);
router.get('/users', getUsers);
router.patch('/users/me', validationUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
