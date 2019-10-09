const csrf = require('csurf');
const bodyParser = require('body-parser');

exports.csrfProtection = csrf({ cookie: true });
exports.parseForm = bodyParser.urlencoded({ extended: false });
