const Favorite = require('../../models/Favorite');
const Factory = require('../handlerFactory');

exports.setPostOwnerIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.findAll = Factory.getAll(Favorite);
exports.findById = Factory.getOne(Favorite);
exports.create = Factory.createOne(Favorite);
exports.update = Factory.updateOne(Favorite);
exports.delete = Factory.deleteOne(Favorite);
