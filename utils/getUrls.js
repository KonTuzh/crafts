const moment = require('moment');
const Post = require('./../models/Post');
const Category = require('./../models/Category');

async function getUrlsFromDatabase(urls) {
  try {
    const cats = await Category.find()
      .select('slug updatetAt')
      .sort('-publishedAt');

    const posts = await Post.find({ status: 'published' })
      .select('slug category updatetAt')
      .sort('-publishedAt');

    cats.forEach(el => {
      urls.push({
        url: `/${el.slug}`,
        lastMod: moment(el.updatetAt).format('YYYY-MM-DD'),
        changeFreq: 'always'
      });
    });

    posts.forEach(el => {
      urls.push({
        url: `/${el.category.slug}/${el.slug}`,
        lastMod: moment(el.updatetAt).format('YYYY-MM-DD'),
        changeFreq: 'always'
      });
    });
  } catch (error) {
    return urls;
  }
  return urls;
}

async function getUrls() {
  const lastMod = new Date('2019-09-12');
  const urls = [
    { url: '/', lastMod, changeFreq: 'weekly' },
    { url: '/auth/login', lastMod, changeFreq: 'yearly' },
    { url: '/auth/signup', lastMod, changeFreq: 'yearly' },
    { url: '/auth/logout', lastMod, changeFreq: 'yearly' },
    { url: '/auth/password-reset', lastMod, changeFreq: 'yearly' },
    { url: '/search', lastMod, changeFreq: 'weekly' },
    { url: '/agreement', lastMod, changeFreq: 'weekly' },
    { url: '/confidential', lastMod, changeFreq: 'weekly' }
  ];
  return await getUrlsFromDatabase(urls);
}

module.exports = getUrls;
