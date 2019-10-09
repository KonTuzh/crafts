const Comment = require('../../models/Comment');
const Factory = require('../handlerFactory');
const catchAsync = require('../../utils/catchAsync');
const Email = require('../../utils/email');

exports.setPostOwnerIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.owner) req.body.owner = req.user.id;
  next();
};

exports.addComment = catchAsync(async (req, res, next) => {
  const doc = await Comment.create(req.body);

  doc.owner = req.user;

  if (doc) {
    const domain = `${req.protocol}://${req.get('host')}`;
    const url = `${domain}/comments/${doc.id}`;
    const admin = {
      email: process.env.EMAIL_ADMIN,
      firstName: 'ADMIN'
    };
    await new Email(admin, url).sendCommentNotification(doc);
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.findAll = Factory.getAll(Comment);
exports.findById = Factory.getOne(Comment);
exports.create = Factory.createOne(Comment);
exports.update = Factory.updateOne(Comment);
exports.delete = Factory.deleteOne(Comment);
