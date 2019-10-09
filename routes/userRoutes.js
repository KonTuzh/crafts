const { Router } = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/api/userController');

const router = Router({ mergeParams: true });

router.post('/signup', userController.isAgree, authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/pass/forgot', authController.forgotPassword);
router.patch('/pass/reset/:token', authController.resetPassword);
router.post('/email-exists', userController.emailExists);

router.use(authController.protect);

router.patch(
  '/update',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch('/pass/update', authController.updatePassword);
router.patch('/deactivate', userController.deactivate);
router.get('/me', userController.getMe, userController.findById);

router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.findById)
  .patch(userController.update)
  .delete(userController.delete);

router
  .route('/')
  .get(userController.findAll)
  .post(userController.isAgree, userController.create);

module.exports = router;
