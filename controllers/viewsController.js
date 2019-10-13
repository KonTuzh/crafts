const mongoose = require('mongoose');
const moment = require('moment');
const Post = require('./../models/Post');
const User = require('./../models/User');
const Favorite = require('./../models/Favorite');
const Category = require('./../models/Category');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const JsonLd = require('./../utils/jsonLd');

const {
  Types: { ObjectId }
} = mongoose;

const validateObjectId = id =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;

module.exports.signup = (req, res) => {
  const head = {
    title: 'Регистрация',
    meta: [
      {
        name: 'description',
        content: `Регистрация на сайте ${process.env.SITE_NAME}`
      },
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: 'Регистрация'
      },
      {
        property: 'og:description',
        content: `Регистрация на сайте ${process.env.SITE_NAME}`
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:image',
        content: `${process.env.DOMAIN}/images/category-cover--homepage.jpg`
      },
      {
        property: 'og:url',
        content: `${process.env.DOMAIN}/auth/signup`
      },
      {
        property: 'og:site_name',
        content: process.env.SITE_NAME
      }
    ],
    canonical: `${process.env.DOMAIN}/auth/signup`
  };
  res.status(200).render('pages/auth/signup', {
    head,
    heading: 'Регистрация на сайте',
    bodyClass: 'page-login'
  });
};

module.exports.login = (req, res) => {
  const head = {
    title: 'Войти',
    meta: [
      {
        name: 'description',
        content: 'Авторизация на сайте'
      },
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: 'Войти'
      },
      {
        property: 'og:description',
        content: 'Авторизация на сайте'
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:image',
        content: `${process.env.DOMAIN}/images/category-cover--homepage.jpg`
      },
      {
        property: 'og:url',
        content: `${process.env.DOMAIN}/auth/login`
      },
      {
        property: 'og:site_name',
        content: process.env.SITE_NAME
      }
    ],
    canonical: `${process.env.DOMAIN}/auth/login`
  };

  res.status(200).render('pages/auth/login', {
    head,
    heading: 'Авторизация на сайте',
    bodyClass: 'page-login',
    errors: req.flash('error')
  });
};

module.exports.passwordForgot = (req, res) => {
  const head = {
    title: 'Войти',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/auth/password-reset`
  };

  res.status(200).render('pages/auth/password-forgot', {
    head,
    heading: 'Забыли пароль?',
    bodyClass: 'page-login'
  });
};

module.exports.passwordReset = (req, res) => {
  const { token } = req.params;

  const head = {
    title: 'Сброс пароля',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ]
  };

  res.status(200).render('pages/auth/password-reset', {
    head,
    heading: 'Задайте новый пароль',
    token,
    bodyClass: 'page-login'
  });
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.redirect('/');
};

module.exports.setLocalsFilter = catchAsync(async (req, res, next) => {
  const filterParams = req.query;
  const cats = await Category.find({ status: 'published' })
    .select('heading')
    .sort('-publishedAt');

  let active = 0;
  const data = [{ title: 'Все категории', value: '' }];

  cats.forEach((item, index) => {
    if (filterParams.category === item.id) active = index + 1;
    data.push({ title: item.heading, value: item.id });
  });

  const params = {
    type: {
      heading: 'Тип публикации',
      id: 'filter-type',
      type: 'checkbox',
      name: 'type',
      data: [
        {
          title: 'Статьи',
          value: 'post',
          active: false
        },
        {
          title: 'Видео',
          value: 'video',
          active: false
        },
        {
          title: 'Инструкции',
          value: 'guide',
          active: false
        },
        {
          title: 'Подборки',
          value: 'collection',
          active: false
        }
      ]
    },
    category: {
      heading: 'Выберите категорию',
      id: 'filter-category',
      type: 'dropdown',
      name: 'category',
      active,
      data
    },
    sort: {
      heading: 'Показывать вначале',
      id: 'filter-sort',
      type: 'radio',
      name: 'sort',
      data: [
        {
          title: 'Новое',
          value: '-publishedAt',
          active: false
        },
        {
          title: 'Популярное',
          value: '-views,-likes',
          active: false
        },
        {
          title: 'Релевантное',
          value: 'score',
          active: false
        },
        {
          title: 'Простое',
          value: 'difficulty',
          active: false
        },
        {
          title: 'Сложное',
          value: '-difficulty',
          active: false
        }
      ]
    }
  };

  if (typeof filterParams.type !== 'undefined') {
    if (filterParams.type !== '') {
      filterParams.type = filterParams.type.split(',');

      params.type.data.forEach(element => {
        if (filterParams.type.indexOf(element.value) !== -1) {
          element.active = true;
        }
      });
    } else {
      delete filterParams.type;
    }
  }

  params.sort.data.forEach(element => {
    if (filterParams.sort === element.value) {
      element.active = true;
    }
  });

  params.queryString = filterParams;
  res.locals.filter = params;

  if (req.cookies['filter--show'] === 'true') {
    res.locals.filterShow = true;
  }

  next();
});

module.exports.setLocalsCetegories = catchAsync(async (req, res, next) => {
  const data = await Category.find({ status: 'published' })
    .select('heading description slug cover')
    .sort('-publishedAt');

  res.locals.categories = {
    title:
      'Примеры великолепной ручной работы для тех, кто любит создавать поделки своими руками',
    subtitle:
      'Если вам нужны идеи новых поделок, мы собрали здесь коллекцию интересных пошаговых инструкций, чтобы дать вам возможность сделать следующий шаг.',
    data
  };

  next();
});

module.exports.setLocalsPopularPosts = catchAsync(async (req, res, next) => {
  const data = await Post.find()
    .select('heading slug views favorites cover commentsCount')
    .sort('-views')
    .skip(0)
    .limit(5);

  res.locals.popularPosts = {
    title: 'Популярные публикации',
    subtitle: 'Поделки пользующиеся популярностью у наших читателей',
    data
  };

  next();
});

const correctForm = (number, suffix) => {
  const keys = [2, 0, 1, 1, 1, 2];
  const mod = number % 100;
  const suffixKey = mod > 7 && mod < 20 ? 2 : keys[Math.min(mod % 10, 5)];
  return suffix[suffixKey];
};

module.exports.home = catchAsync(async (req, res, next) => {
  const content = await Post.find({ status: 'published' })
    .select('heading type difficulty slug views favorites cover commentsCount')
    .sort('-publishedAt')
    .skip(0)
    .limit(9);

  const jsonLd = new JsonLd();

  jsonLd.webpage({
    title: 'Поделки своими руками: мастер-классы и идеи уникальных подедлок',
    desc:
      'Онлайн сборник мастер-классов. Собираем поделки своими руками. Уроки различной сложности подойдут для детей и взрослых. Смотрите фото и видео и повторяйте.',
    alias: ''
  });

  jsonLd.breadcrumb([{ url: '', name: 'Главная' }]);

  const cover = `${jsonLd.domain}/images/category-cover--homepage.jpg`;

  res.status(200).render('pages/index', {
    head: {
      title: jsonLd.getPageTitle(),
      meta: [
        {
          name: 'description',
          content: jsonLd.getPageDescription()
        },
        {
          name: 'author',
          content: 'KonTuzh'
        }
      ],
      opengraph: [
        {
          property: 'og:title',
          content: jsonLd.getPageTitle()
        },
        {
          property: 'og:description',
          content: jsonLd.getPageDescription()
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:image',
          content: cover
        },
        {
          property: 'og:url',
          content: jsonLd.domain
        },
        {
          property: 'og:site_name',
          content: jsonLd.siteName
        }
      ],
      canonical: jsonLd.domain,
      jsonLd: jsonLd.output()
    },
    hero: {
      heading: 'Поделки своими руками',
      description: 'В основе творчества лежит тайна и еще удивление...',
      cover: {
        url: cover,
        alt: 'Поделки своими руками'
      }
    },
    content,
    pagination: {
      hasNext: true,
      page: 0,
      last: 1,
      link: `/search?sort=-publishedAt&page=`
    }
  });
});

module.exports.search = catchAsync(async (req, res, next) => {
  req.query.fields =
    'heading type difficulty slug views favorites cover commentsCount publishedAt updatetAt';
  if (req.query.sort === undefined) req.query.sort = '-publishedAt';
  const features = new APIFeatures(Post, req.query)
    .filter({ status: 'published' })
    .sortBy()
    .fields();

  const data = await features.pagination();

  const jsonLd = new JsonLd();

  jsonLd.webpage({
    title: 'Находите поделки, видео и инструкции',
    desc: 'Описание страницы поиска',
    alias: 'search'
  });

  jsonLd.breadcrumb([
    { url: '', name: 'Главная' },
    { url: 'search', name: 'Поиск по сайту' }
  ]);

  const head = {
    title: jsonLd.getPageTitle(),
    meta: [
      {
        name: 'description',
        content: jsonLd.getPageDescription()
      },
      {
        name: 'robots',
        content: 'noindex, follow'
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: jsonLd.getPageTitle()
      },
      {
        property: 'og:description',
        content: jsonLd.getPageDescription()
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:image',
        content: `${jsonLd.domain}/images/category-cover--homepage.jpg`
      },
      {
        property: 'og:url',
        content: req.originalUrl
      },
      {
        property: 'og:site_name',
        content: process.env.SITE_NAME
      }
    ],
    canonical: jsonLd.getBreadcrumb(1)['@id'],
    jsonLd: jsonLd.output()
  };

  const total = data.pagination.itemCount;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  const hero = {
    heading: `Вы искали: `,
    total: `${total} ${text}`
  };

  const { link } = data.pagination;
  const sort = link.indexOf('sort=') === -1 ? '&sort=-publishedAt' : '';

  data.pagination.link = `/search${link}${sort}&page=`;

  if (data.pagination.hasPrev) {
    head.prev = `${jsonLd.domain}${data.pagination.link}${data.pagination.prev}`;
  }

  if (data.pagination.hasNext) {
    head.next = `${jsonLd.domain}${data.pagination.link}${data.pagination.next}`;
  }

  res.status(200).render('pages/search', {
    head,
    hero,
    ...data
  });
});

module.exports.postOne = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({
    slug: req.params.slug,
    status: 'published'
  }).populate({
    path: 'comments',
    match: { active: { $eq: true } },
    fields: '-__v -post',
    options: { sort: { createdAt: -1 } }
  });

  if (!post || post.category.slug !== req.params.catSlug) {
    return next(
      new AppError(
        'Страница не найдена. Возможно, она была удалена или перенесена.',
        404
      )
    );
  }

  const relatedPosts = await Post.find({
    category: post.category._id,
    _id: { $ne: post._id },
    status: 'published'
  })
    .select('heading type difficulty slug views favorites cover commentsCount')
    .sort('-publishedAt -views')
    .skip(0)
    .limit(6);

  const jsonLd = new JsonLd();

  jsonLd.webpage({
    title: post.title,
    desc: post.description,
    alias: `${post.category.slug}/${post.slug}`
  });

  jsonLd.breadcrumb([
    { url: '', name: 'Главная' },
    { url: `${post.category.slug}`, name: post.category.heading },
    { url: `${post.category.slug}/${post.slug}`, name: post.heading }
  ]);

  jsonLd.mainEntityPost(post);

  const head = {
    title: jsonLd.getPageTitle(),
    meta: [
      {
        name: 'description',
        content: jsonLd.getPageDescription()
      },
      {
        name: 'author',
        content: jsonLd.getAuthor()
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: jsonLd.getPageTitle()
      },
      {
        property: 'og:description',
        content: jsonLd.getPageDescription()
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'article:published_time',
        content: post.publishedAt
      },
      {
        property: 'article:modified_time',
        content: post.updatetAt
      },
      {
        property: 'article:author',
        content: jsonLd.getAuthor()
      },
      {
        property: 'article:section',
        content: post.category.heading
      },
      {
        property: 'article:tag',
        content: post.keywords.join(', ')
      },
      {
        property: 'og:image',
        content: jsonLd.getPostImage('url')
      },
      {
        property: 'og:image:type',
        content: 'image/jpeg'
      },
      {
        property: 'og:image:width',
        content: jsonLd.getPostImage('width')
      },
      {
        property: 'og:image:height',
        content: jsonLd.getPostImage('height')
      },
      {
        property: 'og:url',
        content: jsonLd.getBreadcrumb(2)['@id']
      },
      {
        property: 'og:site_name',
        content: jsonLd.siteName
      }
    ],
    canonical: jsonLd.getBreadcrumb(2)['@id'],
    jsonLd: jsonLd.output(),
    breadcrumb: jsonLd.getBreadcrumb()
  };

  res.status(200).render('pages/post/single-post', {
    head,
    filterShow: false,
    moment,
    csrfToken: req.csrfToken(),
    post,
    relatedPosts
  });
});

module.exports.postsCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return next(new AppError('Страница не найдена', 404));

  req.query.fields =
    'heading type difficulty slug views favorites cover commentsCount publishedAt updatetAt';
  if (req.query.sort === undefined) req.query.sort = '-publishedAt';
  const features = new APIFeatures(Post, req.query)
    .filter({ category: category.id, status: 'published' })
    .sortBy()
    .fields();

  const posts = await features.pagination();

  if (posts.pagination.page > posts.pagination.last) {
    return next(new AppError('Страница не найдена', 404));
  }

  const jsonLd = new JsonLd();

  jsonLd.webpage({
    title: category.title,
    desc: category.description,
    alias: `${category.slug}`
  });

  jsonLd.breadcrumb([
    { url: '', name: 'Главная' },
    { url: `${category.slug}`, name: category.heading }
  ]);

  const author = category.owner.lastName
    ? `${category.owner.firstName} ${category.owner.lastName}`
    : category.owner.firstName;

  const head = {
    title: jsonLd.getPageTitle(),
    meta: [
      {
        name: 'description',
        content: jsonLd.getPageDescription()
      },
      {
        name: 'author',
        content: author
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: jsonLd.getPageTitle()
      },
      {
        property: 'og:description',
        content: jsonLd.getPageDescription()
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:image',
        content: `${jsonLd.domain}/images/cat/${category.cover}_1600.jpeg`
      },
      {
        property: 'og:url',
        content: jsonLd.getBreadcrumb(1)['@id']
      },
      {
        property: 'og:site_name',
        content: jsonLd.siteName
      }
    ],
    canonical: jsonLd.getBreadcrumb(1)['@id'],
    jsonLd: jsonLd.output()
  };

  posts.pagination.link = `/${category.slug}?page=`;

  const total = posts.pagination.itemCount;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  posts.pagination.total = `${total} ${text}`;

  if (posts.pagination.hasPrev) {
    head.prev = `${jsonLd.domain}${posts.pagination.link}${posts.pagination.prev}`;
  }

  if (posts.pagination.hasNext) {
    head.next = `${jsonLd.domain}${posts.pagination.link}${posts.pagination.next}`;
  }

  res.status(200).render('pages/post/category', {
    head,
    category,
    ...posts
  });
});

module.exports.postsUser = catchAsync(async (req, res, next) => {
  if (!validateObjectId(req.params.userId))
    return next(new AppError('Страница не найдена', 404));

  const author = await User.findOne({ _id: req.params.userId });
  if (!author) return next(new AppError('Страница не найдена', 404));

  req.query.fields =
    'heading type difficulty slug views favorites cover commentsCount publishedAt updatetAt';
  if (req.query.sort === undefined) req.query.sort = '-publishedAt';
  const features = new APIFeatures(Post, req.query)
    .filter({ owner: author.id, status: 'published' })
    .sortBy()
    .fields();

  const posts = await features.pagination();

  if (posts.pagination.page > posts.pagination.last) {
    return next(new AppError('Страница не найдена', 404));
  }

  const pageAuthor = author.lastName
    ? `${author.firstName} ${author.lastName}`
    : author.firstName;

  const jsonLd = new JsonLd();

  jsonLd.webpage({
    title: pageAuthor,
    desc: `${pageAuthor} - Статьи и подборки поделок на ${process.env.SITE_NAME}`,
    alias: `user/${author.id}`
  });

  jsonLd.breadcrumb([
    { url: '', name: 'Главная' },
    { url: `user/${author.id}`, name: pageAuthor }
  ]);

  jsonLd.mainEntityPerson(author);

  const head = {
    title: jsonLd.getPageTitle(),
    meta: [
      {
        name: 'description',
        content: jsonLd.getPageDescription()
      },
      {
        name: 'author',
        content: pageAuthor
      }
    ],
    opengraph: [
      {
        property: 'og:title',
        content: jsonLd.getPageTitle()
      },
      {
        property: 'og:description',
        content: jsonLd.getPageDescription()
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:image',
        content: jsonLd.getPerson('image')
      },
      {
        property: 'og:url',
        content: jsonLd.getBreadcrumb(1)['@id']
      },
      {
        property: 'og:site_name',
        content: jsonLd.siteName
      },
      {
        property: 'twitter:card',
        content: 'summary'
      },
      {
        property: 'twitter:site',
        content: jsonLd.getWebsite()
      },
      {
        property: 'twitter:title',
        content: jsonLd.getPageTitle()
      },
      {
        property: 'twitter:image:src',
        content: jsonLd.getPerson('image')
      },
      {
        property: 'twitter:url',
        content: jsonLd.getBreadcrumb(1)['@id']
      },
      {
        property: 'twitter:description',
        content: jsonLd.getPageDescription()
      }
    ],
    canonical: jsonLd.getBreadcrumb(1)['@id'],
    jsonLd: jsonLd.output()
  };

  author.content = author.content || jsonLd.getPerson('description');

  posts.pagination.link = `/user/${author.id}?page=`;

  const total = posts.pagination.itemCount;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  posts.pagination.total = `${total} ${text}`;

  if (posts.pagination.hasPrev) {
    head.prev = `${jsonLd.domain}${posts.pagination.link}${posts.pagination.prev}`;
  }

  if (posts.pagination.hasNext) {
    head.next = `${jsonLd.domain}${posts.pagination.link}${posts.pagination.next}`;
  }

  res.status(200).render('pages/post/author', {
    head,
    author,
    ...posts
  });
});

// Navigation in Cabinet
const cabinetNavigation = current => {
  const nav = [
    {
      url: '/me',
      name: 'Настройки',
      icon: 'settings',
      active: false,
      user: true,
      writer: true,
      moderator: true,
      admin: true
    },
    {
      url: '/favorites',
      name: 'Избранное',
      icon: 'favorite-fill',
      active: false,
      user: true,
      writer: true,
      moderator: true,
      admin: true
    },
    {
      url: '/posts',
      name: 'Посты',
      icon: 'post',
      active: false,
      user: false,
      writer: true,
      moderator: false,
      admin: true
    },
    {
      url: '/categories',
      name: 'Категории',
      icon: 'post',
      active: false,
      user: false,
      writer: false,
      moderator: false,
      admin: true
    }
  ];

  return nav.map(item => {
    if (item.url === current) item.active = true;
    return item;
  });
};

// Cabinet -- /me
module.exports.profile = (req, res, next) => {
  const head = {
    title: 'Кабинет пользователя',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/me`
  };

  res.status(200).render('pages/cabinet/profile', {
    cabinetNav: cabinetNavigation('/me'),
    head
  });
};

// Cabinet -- /favorites
module.exports.listFavorites = catchAsync(async (req, res, next) => {
  const posts = await Favorite.find({ user: req.user._id })
    .sort('-createdAt')
    .populate({ path: 'post' });

  const content = posts.map(item => {
    return {
      id: item.post.id,
      heading: item.post.heading,
      type: item.post.type,
      difficulty: item.post.difficulty,
      slug: item.post.slug,
      category: item.post.category,
      views: item.post.views,
      owner: item.post.owner,
      favorites: item.post.favorites,
      publishedAt: item.post.publishedAt,
      updatetAt: item.post.updatetAt,
      cover: item.post.cover
    };
  });

  const head = {
    title: 'Избранное',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/favorites`
  };

  const total = content.length;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  const hero = {
    heading: 'Вы сохранили: ',
    total: `${total} ${text}`
  };

  res.status(200).render('pages/cabinet/favorite-list', {
    head,
    hero,
    cabinetNav: cabinetNavigation('/favorites'),
    content
  });
});

// Cabinet -- /categories
module.exports.listCategories = catchAsync(async (req, res, next) => {
  req.query.fields =
    'heading cover status owner createdAt publishedAt updatetAt';
  if (req.query.sort === undefined) req.query.sort = '-createdAt';
  const features = new APIFeatures(Category, req.query)
    .filter()
    .sortBy()
    .fields();

  const data = await features.pagination();

  const head = {
    title: 'Список категорий',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/categories`
  };

  const total = data.pagination.itemCount;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  const hero = {
    heading: 'Найдено: ',
    total: `${total} ${text}`
  };

  const { link } = data.pagination;
  const sort = link.indexOf('sort=') === -1 ? '&sort=-createdAt' : '';

  data.pagination.link = `/categories${link}${sort}&page=`;

  res.status(200).render('pages/cabinet/category-list', {
    head,
    hero,
    cabinetNav: cabinetNavigation('/categories'),
    moment,
    ...data
  });
});

module.exports.newCategory = catchAsync(async (req, res, next) => {
  if (!res.locals.user) return next(new AppError('Страница не найдена', 404));
  const head = {
    title: 'Добавить категорию',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/categories/new`
  };

  const stats = [
    { val: 'created', name: 'Создать' },
    { val: 'approved', name: 'Принять' },
    { val: 'rejected', name: 'Отклонить' },
    { val: 'published', name: 'Опубликовать' },
    { val: 'archived', name: 'Архивировать' }
  ];

  res.status(200).render('pages/cabinet/category-edit', {
    head,
    stats,
    cabinetNav: cabinetNavigation('/categories'),
    category: {}
  });
});

module.exports.editCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('Страница не найдена', 404));

  const head = {
    title: 'Редактировать категорию',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/categories/${category.id}`
  };

  const stats = [
    { val: 'created', name: 'Создать' },
    { val: 'approved', name: 'Принять' },
    { val: 'rejected', name: 'Отклонить' },
    { val: 'published', name: 'Опубликовать' },
    { val: 'archived', name: 'Архивировать' }
  ];

  res.status(200).render('pages/cabinet/category-edit', {
    head,
    stats,
    cabinetNav: cabinetNavigation('/categories'),
    category
  });
});

// Cabinet -- /posts
module.exports.listPosts = catchAsync(async (req, res, next) => {
  req.query.fields =
    'heading type difficulty views favorites cover status commentsCount createdAt publishedAt updatetAt';
  if (req.query.sort === undefined) req.query.sort = '-createdAt';
  const features = new APIFeatures(Post, req.query)
    .filter()
    .sortBy()
    .fields();

  const data = await features.pagination();

  const head = {
    title: 'Список постов',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/posts`
  };

  const total = data.pagination.itemCount;
  const text = correctForm(total, ['запись', 'записи', 'записей']);
  const hero = {
    heading: `В базе данных: `,
    total: `${total} ${text}`
  };

  const { link } = data.pagination;
  const sort = link.indexOf('sort=') === -1 ? '&sort=-createdAt' : '';

  data.pagination.link = `/posts${link}${sort}&page=`;

  res.status(200).render('pages/cabinet/post-list', {
    head,
    hero,
    cabinetNav: cabinetNavigation('/posts'),
    ...data
  });
});

module.exports.editPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('Страница не найдена', 404));

  const head = {
    title: 'Редактировать пост',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/posts/${post.id}`
  };

  const types = [
    { id: 'post', heading: 'Статья' },
    { id: 'video', heading: 'Видео' },
    { id: 'guide', heading: 'Инструкция' },
    { id: 'collection', heading: 'Подборка' }
  ];

  const stats = [
    { val: 'created', name: 'Создать' },
    { val: 'approved', name: 'Принять' },
    { val: 'rejected', name: 'Отклонить' },
    { val: 'published', name: 'Опубликовать' },
    { val: 'archived', name: 'Архивировать' }
  ];

  res.status(200).render('pages/cabinet/post-edit', {
    head,
    types,
    stats,
    cabinetNav: cabinetNavigation('/posts'),
    post
  });
});

module.exports.newPost = catchAsync(async (req, res, next) => {
  if (!res.locals.user) return next(new AppError('Страница не найдена', 404));
  const head = {
    title: 'Добавить пост',
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ],
    canonical: `${process.env.DOMAIN}/posts/new`
  };

  const types = [
    { id: 'post', heading: 'Статья' },
    { id: 'video', heading: 'Видео' },
    { id: 'guide', heading: 'Инструкция' },
    { id: 'collection', heading: 'Подборка' }
  ];

  const stats = [
    { val: 'created', name: 'Создать' },
    { val: 'approved', name: 'Принять' },
    { val: 'rejected', name: 'Отклонить' },
    { val: 'published', name: 'Опубликовать' },
    { val: 'archived', name: 'Архивировать' }
  ];

  res.status(200).render('pages/cabinet/post-edit', {
    head,
    types,
    stats,
    cabinetNav: cabinetNavigation('/posts'),
    post: {
      keywords: ['фетр']
    }
  });
});

module.exports.confidential = (req, res) => {
  const head = {
    title: 'Политика конфиденциальности',
    meta: [{ name: 'robots', content: 'noindex' }],
    canonical: `${process.env.DOMAIN}/confidential`
  };

  res.status(200).render('pages/confidential', {
    head,
    domain: process.env.DOMAIN,
    email: 'support@example.com',
    heading: 'Политика конфиденциальности',
    bodyClass: 'document'
  });
};

module.exports.agreement = (req, res) => {
  const head = {
    title: 'Пользовательское соглашение',
    meta: [{ name: 'robots', content: 'noindex' }],
    canonical: `${process.env.DOMAIN}/agreement`
  };

  res.status(200).render('pages/agreement', {
    head,
    domain: process.env.DOMAIN,
    heading: 'Пользовательское соглашение',
    bodyClass: 'document'
  });
};

module.exports.redirect = (req, res) => {
  const { url } = req.query;
  console.log(url);

  const head = {
    title: 'Переход по внешней ссылке',
    meta: [{ name: 'robots', content: 'noindex nofollow' }],
    canonical: `${process.env.DOMAIN}/redirect`
  };

  res.status(200).render('pages/redirect', {
    head,
    url,
    heading: 'Переход на внешний ресурс',
    bodyClass: 'document'
  });
};

module.exports.notFound = (req, res, next) => {
  const msg = `Такая страница не существует на сайте. Возможно, она была удалена или перенесена.`;
  return next(new AppError(msg, 404));
};
