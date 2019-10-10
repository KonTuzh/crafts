const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const passport = require('passport');
const VKontakte = require('passport-vkontakte').Strategy;
const Google = require('passport-google-oauth20').Strategy;
const Facebook = require('passport-facebook').Strategy;
// const Twitter = require('passport-twitter').Strategy;

const User = require('./../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const {
  findOrCreateUserVK,
  // findOrCreateUserTwitter,
  findOrCreateUserGoogle,
  findOrCreateUserFacebook
} = require('./api/userController');

const passportOptions = {
  vk: {
    clientID: process.env.VKONTAKTE_APP_ID,
    clientSecret: process.env.VKONTAKTE_APP_SECRET,
    callbackURL: process.env.VKONTAKTE_CALLBACK_URL,
    profileFields: ['photo_max_orig']
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'name', 'email'],
    scope: ['public_profile', 'email'],
    enableProof: true
  }
};

passport.use(new VKontakte(passportOptions.vk, findOrCreateUserVK));
passport.use(new Google(passportOptions.google, findOrCreateUserGoogle));
passport.use(new Facebook(passportOptions.facebook, findOrCreateUserFacebook));
// passport.use(new Twitter(passportOptions.twitter, findOrCreateUserTwitter));

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const authSuccessful = async (req, res, user, reg = false) => {
  if (reg) {
    try {
      const url = `${req.protocol}://${req.get('host')}/me`;
      await new Email(user, url).sendWelcome(user.generatePassword);
    } catch (error) {
      console.warn(`Ошибка отправки приветственного письма! ${error}`);
    }
  }

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  let tmp = req.session.bounceTo;
  delete req.session.bounceTo;
  if (tmp.endsWith('/auth/login')) tmp = '/';
  res.cookie('jwt', token, cookieOptions).redirect(tmp);
};

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.signup = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'email',
    'password',
    'passwordConfirm',
    'agree'
  );
  const newUser = await User.create(filteredBody);

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Укажите email и пароль', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Не верный email или пароль', 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
};

exports.sendReferer = (req, res, next) => {
  if (req.session.bounceTo) return next();
  req.session.bounceTo = req.query.bounce
    ? req.query.bounce
    : req.header('Referer') || '/';
  return next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Ошибка авторизации! Пожалуйста, авторизуйтесь заново!', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const candidate = await User.findById(decoded.id);
  if (!candidate) {
    return next(
      new AppError('Ошибка авторизации! Пожалуйста, авторизуйтесь заново!', 401)
    );
  }
  // 4) Check if user changed password after the token was issued
  const changedPasswordAfter = candidate.changedPasswordAfter(decoded.iat);
  if (changedPasswordAfter) {
    return next(
      new AppError('Ошибка авторизации! Пожалуйста, авторизуйтесь заново!', 401)
    );
  }
  candidate.fullName = candidate.lastName
    ? `${candidate.firstName} ${candidate.lastName}`
    : candidate.firstName;
  req.user = candidate;
  res.locals.user = candidate;
  next();
});

// Только для веб страниц, без вызова ошибки
exports.isAuth = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const candidate = await User.findById(decoded.id);
      if (!candidate) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (candidate.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in User
      candidate.fullName = candidate.lastName
        ? `${candidate.firstName} ${candidate.lastName}`
        : candidate.firstName;
      res.locals.user = candidate;
      return next();
    } catch (error) {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('У Вас не хватает прав для этой операции!', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Укажите email', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Пользователь с таким email не найден.', 404));
  }

  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send Email
  try {
    const domain = `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${domain}/auth/password-reset/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Ссылка для сброса пароля выслана на указанный Email.'
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Ошибка отправки email. Попробуйте позже!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  // 2) If token has expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Токен недействителен или истек', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  const resetUrl = `${req.protocol}://${req.get('host')}/auth/password-reset`;
  await new Email(user, resetUrl).sendPasswordResetAfter();

  // 3) Update passwordChangedAt property for user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Не верное подтверждение пароля', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user is, send JWT
  createSendToken(user, 200, res);
});

// VK
exports.loginVkontakte = passport.authenticate('vkontakte', {
  session: false,
  scope: ['email']
});

exports.loginVkontakteCallback = (req, res) => {
  passport.authenticate(
    'vkontakte',
    { session: false },
    (err, user, reg = false) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/auth/login');
      }
      authSuccessful(req, res, user, reg);
    }
  )(req, res);
};

// Twitter
exports.loginTwitter = passport.authenticate('twitter', { session: false });

exports.loginTwitterCallback = (req, res) => {
  passport.authenticate(
    'twitter',
    { session: false },
    (err, user, reg = false) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/auth/login');
      }
      authSuccessful(req, res, user, reg);
    }
  )(req, res);
};

// Google
exports.loginGoogle = passport.authenticate('google', {
  session: false,
  scope: ['profile', 'email']
});

exports.loginGoogleCallback = (req, res) => {
  passport.authenticate(
    'google',
    { session: false },
    (err, user, reg = false) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/auth/login');
      }
      authSuccessful(req, res, user, reg);
    }
  )(req, res);
};

// Facebook
exports.loginFacebook = passport.authenticate('facebook', {
  session: false,
  authType: 'rerequest'
});

exports.loginFacebookCallback = (req, res) => {
  passport.authenticate(
    'facebook',
    { session: false },
    (err, user, reg = false) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/auth/login');
      }
      authSuccessful(req, res, user, reg);
    }
  )(req, res);
};
