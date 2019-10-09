const mongoose = require('mongoose');
const slugify = require('slugify');
const readingTime = require('reading-time');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Заполните SEO заголовок статьи'],
      unique: true,
      trim: true,
      maxlength: [255, 'SEO заголовок не должен превышать 255 символов'],
      minlength: [3, 'SEO заголовок должен быть длиннее 3-х символов']
    },
    description: {
      type: String,
      required: [true, 'Заполните SEO описание статьи'],
      trim: true,
      maxlength: [500, 'Описание статьи не должно превышать 500 символов'],
      minlength: [50, 'Описание статьи должно быть длиннее 50 символов']
    },
    keywords: [String],
    heading: {
      type: String,
      required: [true, 'Укажите заголовок статьи'],
      unique: true,
      trim: true,
      maxlength: [255, 'Заголовок не должен превышать 255 символов'],
      minlength: [3, 'Заголовок должен быть длиннее 3-х символов']
    },
    slug: String,
    content: {
      type: String,
      trim: true,
      minlength: [350, 'Минимальный объем статьи: 350 символов']
      // select: false
    },
    views: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Минимальное значение 1.0'],
      max: [5, 'Максимальное значение 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: Number,
      required: [true, 'Обязательно укажите сложность'],
      enum: {
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        message: 'Выберите уровень сложности от 1 до 10'
      }
    },
    type: {
      type: String,
      default: 'post',
      enum: {
        values: ['post', 'video', 'guide', 'collection'],
        message: 'Выберите тип публикации'
      }
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Публикация должна относиться к одной категории']
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Статься должна иметь автора']
    },
    status: {
      type: String,
      default: 'created',
      enum: {
        values: ['created', 'approved', 'rejected', 'published', 'archived'],
        message: 'Статус имеет не допустимое значение'
      }
    },
    rejectComment: {
      type: String,
      trim: true
    },
    cover: {
      type: String,
      required: [true, 'Загрузите обложку статьи']
    },
    galery: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatetAt: {
      type: Date,
      default: undefined
    },
    publishedAt: {
      type: Date,
      default: undefined
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.index({ slug: 1 });
postSchema.index(
  { heading: 'text', description: 'text', content: 'text' },
  { default_language: 'russian' },
  { weights: { heading: 5, description: 3, content: 1 }, name: 'TextIndex' }
);

postSchema.virtual('readTime').get(function() {
  const correctForm = (number, suffix) => {
    const keys = [2, 0, 1, 1, 1, 2];
    const mod = number % 100;
    const suffixKey = mod > 7 && mod < 20 ? 2 : keys[Math.min(mod % 10, 5)];
    return suffix[suffixKey];
  };
  const displayed = Math.ceil(readingTime(this.content).minutes.toFixed(2));
  const minutes = correctForm(displayed, ['минута', 'минуты', 'минут']);
  return `${displayed} ${minutes}`;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.heading, { lower: true });
  }
  next();
});

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: '-__v -passwordChangedAt -email -role'
  });

  this.populate({
    path: 'category',
    select: 'heading slug status cover'
  });

  this.populate({
    path: 'favorites',
    select: '-__v'
  });

  next();
});

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

postSchema.virtual('favorites', {
  ref: 'Favorite',
  foreignField: 'post',
  localField: '_id'
});

// AGGREGATION MIDDLEWARE
postSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { status: { $eq: 'published' } } });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
