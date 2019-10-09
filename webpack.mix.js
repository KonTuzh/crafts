/* eslint-disable */
const path = require('path');
const mix = require('laravel-mix');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

require('laravel-mix-polyfill');

const PATHS = {
  source: path.join(__dirname, 'resources'),
  build: path.join(__dirname, 'public'),
  nm: path.join(__dirname, 'node_modules')
};

mix.webpackConfig({
  plugins: [
    new SVGSpritemapPlugin('resources/icons/*.svg', {
      output: {
        filename: 'public/sprite.svg',
        svgo: true
      },
      sprite: {
        prefix: false
      }
    })
  ]
});

// Client
mix
  .js(
    path.join(PATHS.source, 'js', 'app.js'),
    path.join(PATHS.build, 'js', 'app.js')
  )
  .polyfill({
    enabled: true,
    useBuiltIns: 'usage',
    targets: { firefox: '50', ie: 11 }
  });

mix.sass(
  path.join(PATHS.source, 'sass', 'app.scss'),
  path.join(PATHS.build, 'css', 'styles.css')
);
mix.sass(
  path.join(PATHS.source, 'sass', 'lg', 'lightgallery.scss'),
  path.join(PATHS.build, 'css', 'lightgallery.css')
);
mix.copy(path.join(PATHS.source, 'images'), path.join(PATHS.build, 'images'));

mix.copy(
  path.join(PATHS.nm, 'material-design-icons', 'iconfont'),
  path.join(PATHS.build, 'fonts', 'vendor', 'material-design-icons')
);

mix.copy(path.join(PATHS.source, 'fonts'), path.join(PATHS.build, 'fonts'));

// mix.copy(path.join(PATHS.nm, '@ckeditor/ckeditor5-build-inline/build/ckeditor.js'), path.join(PATHS.build, 'js'));

mix
  .js(
    path.join(PATHS.source, 'js', 'editor.js'),
    path.join(PATHS.build, 'js', 'editor.js')
  )
  .polyfill({
    enabled: true,
    useBuiltIns: 'usage',
    targets: { firefox: '50', ie: 11 }
  });