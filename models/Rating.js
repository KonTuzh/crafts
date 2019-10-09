const mongoose = require('mongoose');
const Post = require('./Post');

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Укажите оценку от 1 до 5']
    },
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Оценка должна относиться к какой-либо статье']
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Пожалуйста, авторизуйтесь.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ratingSchema.index({ post: 1, owner: 1, rating: 1 }, { unique: true });

ratingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: 'firstName lastName photo'
  });
  next();
});

ratingSchema.statics.calcAverageRatings = async function(postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId, rating: { $gte: 1 }, active: { $eq: true } }
    },
    {
      $group: {
        _id: '$post',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

ratingSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.post);
});

ratingSchema.pre(/^findOneAnd/, async function(next) {
  this.appraisal = await this.findOne();
  // console.log(this.appraisal);
  next();
});

ratingSchema.post(/^findOneAnd/, async function() {
  await this.appraisal.constructor.calcAverageRatings(this.appraisal.post);
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
