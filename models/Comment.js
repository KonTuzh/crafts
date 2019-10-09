const mongoose = require('mongoose');
const Post = require('./Post');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Комментарий не может быть пустым!']
    },
    active: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Комментарий должен относиться к какой-либо статье']
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Комментарий должен иметь автора']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: 'firstName lastName photo'
  });
  next();
});

commentSchema.statics.calcAverageRatings = async function(postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId, active: { $eq: true } }
    },
    {
      $group: { _id: '$post', count: { $sum: 1 } }
    }
  ]);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, { commentsCount: stats[0].count });
  } else {
    await Post.findByIdAndUpdate(postId, { commentsCount: 0 });
  }
};

commentSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.post);
});

commentSchema.pre(/^findOneAnd/, async function(next) {
  this.comment = await this.findOne();
  next();
});

commentSchema.post(/^findOneAnd/, async function() {
  await this.comment.constructor.calcAverageRatings(this.comment.post);
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
