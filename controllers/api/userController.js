const multer = require('multer');
const generator = require('generate-password');
const User = require('../../models/User');
const Factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

const {
  uploadPictureByUrl,
  uploadPictureByBuffer
} = require('../../utils/uploadImages');

const multerStorage = multer.memoryStorage();

const sizes = [
  { width: 500, height: 500, webp: true, jpeg: true },
  { width: 300, height: 300, webp: false, jpeg: true },
  { width: 150, height: 150, webp: false, jpeg: true },
  { width: 100, height: 100, webp: false, jpeg: true },
  { width: 50, height: 50, webp: false, jpeg: true }
];

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Не изображение! Пожалуйста, загружайте только изображения',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}`;
  await uploadPictureByBuffer(
    req.file.buffer,
    `public/images/users/${req.file.filename}`,
    sizes
  );
  next();
});

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'Эта ссылка не для обновления пароля. Используйте ссылку: /pass/update',
        400
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'url',
    'content'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.deactivate = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.activate = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: true });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.emailExists = catchAsync(async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  res.status(200).json({
    status: 'success',
    data: !!candidate
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.isAgree = catchAsync(async (req, res, next) => {
  if (!req.body.agree) {
    return next(
      new AppError(
        'Вы не можете зарегистрироваться и использовать сайт без согласия с Политикой конфиденциальности',
        400
      )
    );
  }
  next();
});

exports.findAll = Factory.getAll(User);
exports.findById = Factory.getOne(User);
exports.create = Factory.createOne(User);
exports.update = Factory.updateOne(User);
exports.delete = Factory.deleteOne(User);

const tieSocialNetworkToUser = async (user, update, photo) => {
  if (user.photo === 'default' && photo) {
    update.photo = `user-${user.id}`;
    try {
      await uploadPictureByUrl(
        photo,
        `public/images/users/${update.photo}`,
        sizes
      );
    } catch (error) {
      throw Error(`Ошибка загрузки фото! ${error}`);
    }
  }

  return await User.findByIdAndUpdate(user.id, update, {
    new: true,
    runValidators: true
  });
};

const createSocialUser = async (data, social) => {
  let newUser;
  const password = generator.generate({ length: 14, numbers: true });

  try {
    data.password = password;
    data.passwordConfirm = password;
    data.agree = true;
    newUser = await User.create(data);
  } catch (error) {
    throw Error(`Ошибка регистрации: ${error}`);
  }

  if (!newUser[social].photo) {
    newUser.generatePassword = password;
    return newUser;
  }

  try {
    await uploadPictureByUrl(
      newUser[social].photo,
      `public/images/users/user-${newUser.id}`,
      sizes
    );
  } catch (error) {
    throw Error(`Ошибка загрузки фото! ${error}`);
  }

  newUser = await User.findByIdAndUpdate(newUser.id, {
    photo: `user-${newUser.id}`
  });

  newUser.generatePassword = password;
  return newUser;
};

exports.findOrCreateUserVK = async (access, refresh, params, profile, done) => {
  let user = await User.findOne({ 'vkontakte.id': profile.id });
  if (user) return done(null, user);

  if (!params.email)
    return done({ message: 'Авторизация не возможна без email' }, null);

  user = await User.findOne({ email: params.email });

  const avatarUrl = profile.photos[1].value || undefined;
  const vkontakte = {
    id: profile.id,
    email: params.email,
    displayName: profile.name.displayName,
    firstName: profile.name.givenName || undefined,
    lastName: profile.name.familyName || undefined,
    profileUrl: profile.profileUrl,
    photo: avatarUrl
  };

  if (user) {
    try {
      const tie = await tieSocialNetworkToUser(user, { vkontakte }, avatarUrl);
      return done(null, tie);
    } catch (error) {
      return done(error, null);
    }
  }

  const dataUser = {
    firstName: profile.name.givenName || 'User',
    lastName: profile.name.familyName || undefined,
    email: params.email,
    photo: 'default',
    vkontakte
  };

  try {
    const newUser = await createSocialUser(dataUser, 'vkontakte');
    return done(null, newUser, true);
  } catch (error) {
    return done(error, null);
  }
};

exports.findOrCreateUserTwitter = async (token, tokenSecret, profile, done) => {
  console.log('findOrCreateUserTwitter', {
    token,
    tokenSecret,
    profile
  });
  done({ message: 'exit --> findOrCreateUserTwitter' }, null);
};

exports.findOrCreateUserGoogle = async (access, refresh, profile, done) => {
  let user = await User.findOne({ 'google.id': profile.id });
  if (user) return done(null, user);

  if (!profile._json.email)
    return done({ message: 'Авторизация не возможна без email' }, null);

  user = await User.findOne({ email: profile._json.email });

  const avatarUrl = profile._json.picture;
  const google = {
    id: profile.id,
    email: profile._json.email,
    displayName: profile.displayName,
    firstName: profile.name.givenName || undefined,
    lastName: profile.name.familyName || undefined,
    photo: avatarUrl
  };

  if (user) {
    try {
      const tie = await tieSocialNetworkToUser(user, { google }, avatarUrl);
      return done(null, tie);
    } catch (error) {
      return done(error, null);
    }
  }

  const dataUser = {
    firstName: profile.name.givenName || 'User',
    lastName: profile.name.familyName || undefined,
    email: profile._json.email,
    photo: 'default',
    google
  };

  try {
    const newUser = await createSocialUser(dataUser, 'google');
    return done(null, newUser, true);
  } catch (error) {
    return done(error, null);
  }
};

exports.findOrCreateUserFacebook = async (access, refresh, profile, done) => {
  let user = await User.findOne({ 'facebook.id': profile.id });
  if (user) return done(null, user);

  if (!profile._json.email)
    return done({ message: 'Авторизация не возможна без email' }, null, null);

  user = await User.findOne({ email: profile._json.email });

  const avatarUrl = `http://graph.facebook.com/${profile.id}/picture?type=large`;
  const facebook = {
    id: profile.id,
    email: profile._json.email,
    displayName: profile.displayName,
    firstName: profile.name.givenName || undefined,
    lastName: profile.name.familyName || undefined,
    profileUrl: profile.profileUrl,
    photo: avatarUrl
  };

  if (user) {
    try {
      const tie = await tieSocialNetworkToUser(user, { facebook }, avatarUrl);
      return done(null, tie);
    } catch (error) {
      return done(error, null);
    }
  }

  const dataUser = {
    firstName: profile.name.givenName || 'User',
    lastName: profile.name.familyName || undefined,
    email: profile._json.email,
    photo: 'default',
    facebook
  };

  try {
    const newUser = await createSocialUser(dataUser, 'facebook');
    return done(null, newUser, true);
  } catch (error) {
    return done(error, null);
  }
};
