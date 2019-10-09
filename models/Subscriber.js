const mongoose = require('mongoose');
const User = require('./User');

const subscriberSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Подписаться могут только авторизованные пользователи']
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Ошибка! Не указан ID автора.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

subscriberSchema.index({ follower: 1, author: 1 }, { unique: true });

subscriberSchema.statics.followerCounter = async function(authorId) {
  const stats = await this.aggregate([
    { $match: { author: authorId } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(authorId, {
      followerCount: stats[0].count
    });
  } else {
    await User.findByIdAndUpdate(authorId, {
      followerCount: 0
    });
  }
};

subscriberSchema.post('save', function() {
  this.constructor.followerCounter(this.author);
});

subscriberSchema.pre(/^findOneAnd/, async function(next) {
  this.subscriber = await this.findOne();
  console.log(this.subscriber);
  next();
});

subscriberSchema.post(/^findOneAnd/, async function() {
  await this.subscriber.constructor.followerCounter(this.subscriber.author);
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
