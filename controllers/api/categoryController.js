/* eslint-disable no-useless-escape */
const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const Factory = require('../handlerFactory');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('./../../utils/apiFeatures');
const Category = require('../../models/Category');
const Post = require('../../models/Post');

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

exports.uploadImages = upload.fields([{ name: 'cover', maxCount: 1 }]);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  if (!req.files.cover) return next();

  const covername = slugify(
    req.files.cover[0].originalname.replace(/[\.\/]/g, '-'),
    { lower: true }
  );

  req.body.cover = `${covername}-${Date.now()}.jpeg`;

  await sharp(req.files.cover[0].buffer)
    .resize(820, 410)
    .toFormat('jpeg')
    .jpeg({
      quality: 60,
      progressive: true,
      chromaSubsampling: '4:4:4'
    })
    .toFile(`public/images/categories/${req.body.cover}`);

  next();
});

exports.returnImage = async (req, res) => {
  if (req.body && req.body.cover) {
    res.status(200).json({
      status: 'success',
      cover: req.body.cover,
      size: ''
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Отправьте изображение для загрузки.'
    });
  }
};

exports.findOne = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new AppError('Запись не найдена', 404));
  }

  req.query.fields = 'heading type slug views favorites cover commentsCount';
  if (req.query.sort === undefined) req.query.sort = '-publishedAt';
  const features = new APIFeatures(Post, req.query)
    .filter({ category: category.id, status: 'published' })
    .sortBy()
    .fields();

  const posts = await features.pagination();

  res.status(200).json({
    status: 'success',
    data: {
      category,
      ...posts
    }
  });
});

exports.setOwnerID = (req, res, next) => {
  if (!req.body.owner) req.body.owner = req.user.id;
  next();
};

exports.findAll = Factory.getAll(Category);
exports.findById = Factory.getOne(Category, {
  path: 'posts',
  select: 'heading slug status cover views favorites type owner commentsCount'
});
exports.create = Factory.createOne(Category);
exports.update = Factory.updateOne(Category);
exports.delete = Factory.deleteOne(Category);
