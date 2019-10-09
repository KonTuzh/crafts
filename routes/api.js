const { Router } = require('express');

const router = Router({ mergeParams: true });

const AppError = require('../utils/appError');

const userRouter = require('./userRoutes');
const postRouter = require('./postRoutes');
const categoryRouter = require('./categoryRoutes');
const commentRouter = require('./commentRoutes');
const renderRoutes = require('./renderRoutes');
const favoriteRoutes = require('./favoriteRoutes');

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);
router.use('/render', renderRoutes);
router.use('/likes', favoriteRoutes);

// Error 404
router.all('*', async (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = router;
