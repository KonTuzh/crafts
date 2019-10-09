/* eslint-disable no-useless-escape */
const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const Post = require('../../models/Post');
const Factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const APIFeatures = require('./../../utils/apiFeatures');
const {
  uploadPictureByBuffer,
  uploadMultiplePicturesFromForm
} = require('../../utils/uploadImages');

const multerStorage = multer.memoryStorage();

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

exports.uploadImages = upload.fields([
  { name: 'upload', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'galery', maxCount: 100 }
]);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.cover) {
    const covername = slugify(
      req.files.cover[0].originalname.replace(/[\.\/]/g, '-'),
      { lower: true }
    );

    req.body.cover = `${covername}-${Date.now()}`;

    const sizesCover = [
      { width: 1600, height: 800, webp: true, jpeg: true },
      { width: 1080, height: 540, webp: true, jpeg: true },
      { width: 820, height: 410, webp: true, jpeg: true },
      { width: 680, height: 340, webp: true, jpeg: true },
      { width: 380, height: 190, webp: true, jpeg: true }
    ];

    // 1) Cover Image
    await uploadPictureByBuffer(
      req.files.cover[0].buffer,
      `public/images/posts/${req.body.cover}`,
      sizesCover
    );
  }

  // 2) Galery
  if (!req.files.galery) return next();
  req.body.galery = await uploadMultiplePicturesFromForm(
    req.files.galery,
    'public/images/uploads',
    1600
  );

  return next();
});

exports.returnImage = catchAsync(async (req, res) => {
  if (req.body.id && req.body.galery) {
    req.body.updatetAt = req.body.updatetAt || Date.now();
    const doc = await Post.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      res.status(500).json({
        status: 'error',
        message: 'Объект с таким ID не найден.'
      });
    }
  }

  if (req.body && req.body.cover) {
    res.status(200).json({
      status: 'success',
      cover: req.body.cover,
      size: '_1600.jpeg'
    });
  } else if (req.body && req.body.galery) {
    res.status(200).json({
      status: 'success',
      galery: req.body.galery,
      size: '.jpeg'
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Отправьте изображение для загрузки.'
    });
  }
});

exports.upload = async (req, res) => {
  if (!req.files) {
    res
      .status(500)
      .json({ error: { message: 'Отправьте изображение для загрузки.' } });
    return;
  }

  const originalname = slugify(
    req.files.upload[0].originalname.replace(/[\.\/]/g, '-'),
    { lower: true }
  );

  const filename = `${Date.now()}-${originalname}`;

  const jpeg = {
    quality: 60,
    progressive: true,
    chromaSubsampling: '4:4:4'
  };

  const sizes = [
    { width: 1600 },
    { width: 1080 },
    { width: 820 },
    { width: 680 },
    { width: 380 }
  ];

  try {
    await Promise.all(
      sizes.map(async s => {
        await sharp(req.files.upload[0].buffer)
          .resize(s.width)
          .toFormat('jpeg')
          .jpeg(jpeg)
          .toFile(`public/images/uploads/${filename}_${s.width}.jpeg`);
      })
    );

    res.status(200).json({
      urls: {
        default: `/images/uploads/${filename}_1080.jpeg`,
        '1600': `/images/uploads/${filename}_1600.jpeg`,
        '820': `/images/uploads/${filename}_820.jpeg`,
        '680': `/images/uploads/${filename}_680.jpeg`,
        '380': `/images/uploads/${filename}_380.jpeg`
      }
    });
  } catch (err) {
    res.status(500).json({
      error: {
        message: 'Это изображение не удалось загрузить.'
      }
    });
  }
};

exports.sortByPopularity = async (req, res, next) => {
  req.query.limit = '9';
  req.query.sort = '-views';
  req.query.fields =
    'heading description slug views favorites difficulty cover';
  next();
};

exports.findOne = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return next(new AppError('Запись не найдена', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.registerView = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('Запись не найдена', 404));
  }

  post.views += 1;
  post.save();

  res.status(200).json({
    status: 'success',
    data: post.views
  });
});

exports.setOwnerID = (req, res, next) => {
  if (!req.body.owner) req.body.owner = req.user.id;
  next();
};

exports.findAll = Factory.getAll(Post);
exports.findById = Factory.getOne(Post, { path: 'comments' });
exports.create = Factory.createOne(Post);
exports.update = Factory.updateOne(Post);
exports.delete = Factory.deleteOne(Post);

exports.getPostStats = catchAsync(async (req, res, next) => {
  const stats = await Post.aggregate([
    {
      $match: {
        views: { $gte: 0 }
      }
    },
    {
      $group: {
        _id: '$difficulty',
        countPosts: { $sum: 1 },
        avgLevel: { $avg: '$difficulty' },
        avgLikes: { $avg: '$likes' },
        minLikes: { $min: '$likes' },
        maxLikes: { $max: '$likes' },
        avgViews: { $avg: '$views' },
        minViews: { $min: '$views' },
        maxViews: { $max: '$views' }
      }
    },
    {
      $sort: { avgViews: 1 }
    }
    // {
    //   $match: { _id: { $ne: 1 } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.search = catchAsync(async (req, res, next) => {
  req.query.fields = 'heading slug status cover views favorites type owner';
  const features = new APIFeatures(Post, req.query)
    .filter({ status: 'published' })
    .sortBy()
    .fields();

  const data = await features.pagination();

  res.status(200).json({
    status: 'success',
    data
  });
});
