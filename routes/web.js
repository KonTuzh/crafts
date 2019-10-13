const { Router } = require('express');

const {
  isAuth,
  protect,
  restrictTo,
  sendReferer,
  loginGoogle,
  loginFacebook,
  loginVkontakte,
  loginGoogleCallback,
  loginFacebookCallback,
  loginVkontakteCallback
} = require('../controllers/authController');

const viewsController = require('../controllers/viewsController');

const router = Router({ mergeParams: true });

const { csrfProtection } = require('../utils/csrf');

router.use((req, res, next) => {
  res.locals.nodeEnv = process.env.NODE_ENV;
  next();
});

// Authenticated
router.get('/auth/login', viewsController.login);
router.get('/auth/signup', viewsController.signup);
router.get('/auth/logout', isAuth, viewsController.logout);
router.get('/auth/password-reset', viewsController.passwordForgot);
router.get('/auth/password-reset/:token', viewsController.passwordReset);
router.get('/auth/vkontakte', sendReferer, loginVkontakte);
router.get('/auth/vkontakte/callback', loginVkontakteCallback);
router.get('/auth/facebook', sendReferer, loginFacebook);
router.get('/auth/facebook/callback', loginFacebookCallback);
router.get('/auth/google', sendReferer, loginGoogle);
router.get('/auth/google/callback', loginGoogleCallback);
// router.get('/auth/twitter', sendReferer, loginTwitter);
// router.get('/auth/twitter/callback', loginTwitterCallback);

// Information
router.get('/confidential', isAuth, viewsController.confidential);
router.get('/agreement', isAuth, viewsController.agreement);

router.get('/redirect', isAuth, viewsController.redirect);

// User All
router.get('/me', protect, viewsController.profile);
router.get('/favorites', protect, viewsController.listFavorites);

// Admin
router.get(
  '/categories',
  protect,
  restrictTo('admin'),
  viewsController.listCategories
);

router.get(
  '/categories/new',
  protect,
  restrictTo('admin'),
  viewsController.newCategory
);

router.get(
  '/categories/:id',
  protect,
  restrictTo('admin'),
  viewsController.editCategory
);

// Admin & Writer
router.get(
  '/posts',
  protect,
  restrictTo('admin', 'writer'),
  viewsController.listPosts
);

router.get(
  '/posts/new',
  protect,
  restrictTo('admin', 'writer'),
  viewsController.setLocalsCetegories,
  viewsController.newPost
);

router.get(
  '/posts/:id',
  protect,
  restrictTo('admin', 'writer'),
  viewsController.setLocalsCetegories,
  viewsController.editPost
);

// Далее должны быть только страницы с фильтром
router.use(isAuth, viewsController.setLocalsFilter);

// HomePage
router.get(
  '/',
  viewsController.setLocalsCetegories,
  viewsController.setLocalsPopularPosts,
  viewsController.home
);

// Search
router.get('/search', viewsController.search);

// Page Author
router.get('/user/:userId', viewsController.postsUser);

// One Category
router.get('/:slug', viewsController.postsCategory);

// Post One --- всегда последний роут
router.get('/:catSlug/:slug', csrfProtection, viewsController.postOne);

// Page Error 404. Not Found
router.all('*', viewsController.notFound);

module.exports = router;
