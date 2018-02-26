/**
 * Created by shy on 2018-01-02.
 */

var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/') // the project directory where compiled assets will be stored
    .setPublicPath('/build') // the public path used by the web server to access the previous directory
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // .enableVersioning(Encore.isProduction()) // uncomment to create hashed filenames (e.g. app.abc123.css)
    .addEntry('js/app', './assets/app/index.jsx') // uncomment to define the assets of the project
    .addStyleEntry('css/libs', './assets/styles/libs.scss')
    .addStyleEntry('css/app', './assets/styles/app.scss')
    .enableSassLoader() // uncomment if you use Sass/SCSS files
    .enableReactPreset()
    .configureBabel(function(babelConfig) {
        babelConfig.presets.push('es2017');
    })
;

module.exports = Encore.getWebpackConfig();