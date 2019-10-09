const { Router } = require('express');

const router = Router({ mergeParams: true });

const authController = require('../controllers/authController');
const postController = require('../controllers/api/postController');
const commentRouter = require('./commentRoutes');
const favoriteRoutes = require('./favoriteRoutes');

router.use('/:postId/comments', commentRouter);
router.use('/:postId/likes', favoriteRoutes);

router
  .route('/popular')
  .get(postController.sortByPopularity, postController.findAll);

router
  .route('/stats')
  .get(postController.sortByPopularity, postController.getPostStats);

router.get('/search', postController.search);

router.post(
  '/upload-images',
  authController.protect,
  postController.uploadImages,
  postController.upload
);

router.post(
  '/upload-post-images',
  authController.protect,
  postController.uploadImages,
  postController.resizeImages,
  postController.returnImage
);

router.post('/:id/views', postController.registerView);

router
  .route('/:id')
  .get(postController.findById)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'writer'),
    postController.uploadImages,
    postController.resizeImages,
    postController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.delete
  );

router
  .route('/')
  .get(postController.findAll)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'writer'),
    postController.setOwnerID,
    postController.create
  );

module.exports = router;
