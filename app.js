const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSitemapXml = require('express-sitemap-xml');

const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');
const GlobalErrorHandler = require('./controllers/errorController');
const getUrls = require('./utils/getUrls');

// Start express app
const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());
app.use(cors());
app.use(helmet());
app.use(expressSitemapXml(getUrls, 'http://localhost:3000'));

// Limit request from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(cookieParser());
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'key-secret',
    key: 'session-key',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 60 * 1000
    },
    saveUninitialized: false,
    resave: true,
    ephemeral: true,
    rolling: true
  })
);
app.use(flash());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist: ['views', 'difficulty'] }));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/', apiRouter);
app.use('/', webRouter);

app.use(GlobalErrorHandler);

module.exports = app;
