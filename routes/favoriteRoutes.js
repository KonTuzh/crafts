const { Router } = require('express');

const router = Router({ mergeParams: true });

const authController = require('../controllers/authController');
const favoritesController = require('../controllers/api/favoritesController');

router
  .route('/:id')
  .get(favoritesController.findById)
  .patch(authController.protect, favoritesController.update)
  .delete(authController.protect, favoritesController.delete);

router
  .route('/')
  .get(favoritesController.findAll)
  .post(
    authController.protect,
    favoritesController.setPostOwnerIds,
    favoritesController.create
  );

module.exports = router;
