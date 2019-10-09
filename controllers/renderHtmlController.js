const path = require('path');
const pug = require('pug');
const Post = require('../models/Post');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getPostsList = catchAsync(async (req, res, next) => {
  req.query.fields =
    'heading type difficulty slug views favorites cover publishedAt updatetAt commentsCount';
  if (req.query.sort === undefined) req.query.sort = '-publishedAt';
  const features = new APIFeatures(Post, req.query)
    .filter({ status: 'published' })
    .sortBy()
    .fields();

  res.locals.data = await features.pagination();

  next();
});

exports.home = catchAsync(async (req, res, next) => {
  const { data } = res.locals;

  data.pagination.hasNext = true;
  data.pagination.page = 0;
  data.pagination.last = 1;
  data.pagination.link = `/search?sort=-publishedAt&page=`;

  const template = path.join(__dirname, '..', `views/partials/posts-list.pug`);
  const html = pug.renderFile(template, { ...data, user: res.locals.user });

  res.status(200).json({
    status: 'success',
    total: data.pagination.itemCount,
    data: html
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const { data } = res.locals;
  const { link } = data.pagination;
  const amp = link.indexOf('?') !== -1 ? '&' : '?';
  const sort = link.indexOf('sort=') === -1 ? '&sort=-publishedAt' : '';

  data.pagination.link = `/search${link}${sort}${amp}page=`;

  const template = path.join(__dirname, '..', `views/partials/posts-list.pug`);
  const html = pug.renderFile(template, { ...data, user: res.locals.user });

  res.status(200).json({
    status: 'success',
    total: data.pagination.itemCount,
    data: html
  });
});
