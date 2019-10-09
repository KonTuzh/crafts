const { Router } = require('express');

const router = Router({ mergeParams: true });

const authController = require('../controllers/authController');
const categoryController = require('../controllers/api/categoryController');
const postRouter = require('./postRoutes');

router.post(
  '/upload-cover',
  authController.protect,
  categoryController.uploadImages,
  categoryController.resizeImages,
  categoryController.returnImage
);

router.use('/:catId/posts', postRouter);

router.route('/:slug').get(categoryController.findOne);

router
  .route('/:id')
  .get(categoryController.findById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.uploadImages,
    categoryController.resizeImages,
    categoryController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.delete
  );

router
  .route('/')
  .get(categoryController.findAll)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.setOwnerID,
    categoryController.create
  );

module.exports = router;
