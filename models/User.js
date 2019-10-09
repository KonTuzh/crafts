const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Пожалуйста, укажите свое имя'],
    maxlength: [255, 'Допустимая длина имени: 255 символов']
  },
  lastName: {
    type: String,
    maxlength: [255, 'Допустимая длина фамилии: 255 символов']
  },
  email: {
    type: String,
    required: [true, 'Укажите Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Укажите корректный Email']
  },
  content: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    default: 'default'
  },
  url: String,
  role: {
    type: String,
    enum: ['user', 'writer', 'moderator', 'admin'],
    default: 'user'
  },
  agree: {
    type: Boolean,
    required: [
      true,
      'Вы не можете зарегистрироваться и использовать сайт без согласия с Политикой конфиденциальности'
    ]
  },
  password: {
    type: String,
    required: [true, 'Вы должны придумать пароль'],
    minlength: [8, 'Минимальная длина пороля: 8 символов'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Подтверлите пароль'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Подтверждение пароля не совпадает с паролем'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true
  },
  followerCount: {
    type: Number,
    default: 0
  },
  vkontakte: {
    id: Number,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    profileUrl: String,
    photo: String
  },
  twitter: {
    id: Number,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    profileUrl: String,
    photo: String
  },
  google: {
    id: Number,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    photo: String
  },
  facebook: {
    id: Number,
    email: String,
    displayName: String,
    firstName: String,
    lastName: String,
    profileUrl: String,
    photo: String
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, async function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.virtual('followers', {
  ref: 'Subscriber',
  foreignField: 'author',
  localField: '_id'
});

userSchema.virtual('fullName').get(function() {
  const fullName = this.lastName
    ? `${this.firstName} ${this.lastName}`
    : this.firstName;
  return fullName;
});

userSchema.methods.correctPassword = async function(candidate, userPassword) {
  return await bcrypt.compare(candidate, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // eslint-disable-next-line radix
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
