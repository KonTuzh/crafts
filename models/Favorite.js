const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'Лайк должен относить к какой-либо записи']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Лайки могут ставить только авторизованные пользователи']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatetAt: {
      type: Date,
      default: undefined
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

favoriteSchema.index({ post: 1, user: 1 }, { unique: true });

favoriteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName photo'
  });
  next();
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
