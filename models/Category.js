const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
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
      required: [true, 'Заполните SEO описание'],
      trim: true,
      maxlength: [500, 'Описание не должно превышать 500 символов'],
      minlength: [50, 'Описание должно быть длиннее 50 символов']
    },
    heading: {
      type: String,
      required: [true, 'Укажите заголовок'],
      unique: true,
      trim: true,
      maxlength: [255, 'Заголовок не должен превышать 255 символов'],
      minlength: [3, 'Заголовок должен быть длиннее 3-х символов']
    },
    slug: String,
    content: {
      type: String,
      trim: true,
      minlength: [50, 'Минимальный объем: 50 символов']
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
      required: [true, 'Загрузите обложку']
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Создатель категории не указан']
    },
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

categorySchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categorySchema.pre('save', function(next) {
  this.slug = slugify(this.heading, { lower: true });
  next();
});

categorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: '-__v -passwordChangedAt -email -role'
  });

  next();
});

// Virtual populate
categorySchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'category',
  localField: '_id'
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
