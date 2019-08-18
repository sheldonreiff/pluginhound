const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/index.js', 'public/js')
   .sass('resources/sass/overrides.scss', 'public/css')
   .sass('resources/sass/icomoon.scss', 'public/css')
   .sass('resources/sass/app.scss', 'public/css')
   .sass('resources/sass/bootstrap.scss', 'public/css')
   .version();

mix.copyDirectory('resources/assets/images', 'public/images');
mix.copyDirectory('resources/assets/fonts', 'public/fonts');

mix.webpackConfig({
   watchOptions: {
      ignored: /node_modules/
    }
});