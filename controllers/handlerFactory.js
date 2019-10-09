const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Объект с таким ID не найден', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for GET comments on Post
    if (req.params.postId) req.query.filter = { post: req.params.postId };
    if (req.params.catId) req.query.filter = { post: req.params.catId };

    const features = new APIFeatures(Model, req.query)
      .filter()
      .sortBy()
      .fields();
    const data = await features.pagination();

    res.status(200).json({
      status: 'success',
      data
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    req.body.updatetAt = req.body.updatetAt || Date.now();
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('Объект с таким ID не найден', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Объект с таким ID не найден', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
