const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDublicateFieldsErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Дубликат значения поля: ${value}. Пожалуйста, используйте другое значение!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Ошибка данных: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Не верный токен. Пожалуйста, авторизуйтесь заново!', 401);

const handleJWTExpiredError = () =>
  new AppError('Ваш токен просрочен. Пожалуйста, авторизуйтесь заново!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // RENDERED WEBSITE
  console.error('ERROR:', err);
  return res.status(err.statusCode).render('pages/error', {
    head: { title: `Ошибка ${err.statusCode}` },
    status: err.statusCode,
    url: `${req.get('host')}${req.originalUrl}`,
    message: 'Страница не найдена. Возможно, она была удалена или перенесена.',
    bodyClass: 'page-error'
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.error('ERROR:', err);
    return res.status(500).json({
      status: 500,
      message: 'Что-то пошло не так!'
    });
  }

  // RENDERED WEBSITE
  console.error('ERROR:', err);
  const status = err.isOperational ? err.statusCode : 500;
  const message = err.isOperational ? err.message : 'Что-то пошло не так!';
  return res.status(err.statusCode).render('pages/error', {
    head: { title: `Ошибка ${err.statusCode}` },
    status,
    message,
    url: `${req.get('host')}${req.originalUrl}`,
    bodyClass: 'page-error'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateFieldsErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
