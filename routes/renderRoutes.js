const { Router } = require('express');

const router = Router({ mergeParams: true });

const renderHtmlController = require('../controllers/renderHtmlController');

const { isAuth } = require('../controllers/authController');

router
  .route('/home')
  .get(isAuth, renderHtmlController.getPostsList, renderHtmlController.home);
router
  .route('/search')
  .get(isAuth, renderHtmlController.getPostsList, renderHtmlController.search);

module.exports = router;
