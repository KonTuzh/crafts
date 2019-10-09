const { Router } = require('express');

const router = Router({ mergeParams: true });

const authController = require('../controllers/authController');
const commentsController = require('../controllers/api/commentsController');

const { csrfProtection, parseForm } = require('../utils/csrf');

router
  .route('/:id')
  .get(commentsController.findById)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    commentsController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    commentsController.delete
  );

router.post(
  '/add',
  authController.protect,
  parseForm,
  csrfProtection,
  commentsController.setPostOwnerIds,
  commentsController.addComment
);

router
  .route('/')
  // .get(commentsController.findAll)
  .post(
    authController.protect,
    parseForm,
    csrfProtection,
    commentsController.setPostOwnerIds,
    commentsController.create
  );

module.exports = router;
