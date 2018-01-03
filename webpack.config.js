/**
 * Created by shy on 2018-01-02.
 */

var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/src/public');
var APP_DIR = path.resolve(__dirname, 'public/src/app');

module.exports = function(env) {

    return {
        entry: [APP_DIR + '/index.jsx'],
        output: {
            filename: 'bundle.js',
            path: BUILD_DIR
            //path: path.resolve(__dirname, 'dist')
        },
        module: {
            loaders : [
                {
                    test : /\.jsx?/,
                    loader : 'babel-loader',
                    include : APP_DIR,
                    exclude: '/node_modules/'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        }
    }
};