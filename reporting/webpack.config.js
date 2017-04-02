/**
 * Created by Petr on 2/26/2017.
 */
const webpack = require('webpack');
const path = require('path');
const isProd = false; //set true for production

module.exports = function(){
    //Create vendor bundle
    plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: './src/main/webapp/resources/js/vendor.bundle.js',
            minChunks: Infinity,
        })
    ];
    //Minification for production
    if (isProd) {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        )
    }else {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        );
    }
    return {
        entry: {
            app: './src/main/js/app.js',
            vendor: [
                'lodash',
                'whatwg-fetch',
                'react',
                'react-dom',
                'react-redux',
                'react-router',
                'react-loader',
                'react-bootstrap',
                'redux',
                'redux-thunk',
                'redux-logger',
                'redux-promise-middleware',
                'babel-polyfill',
                'type-to-reducer'
            ]
        },
        devtool:  isProd ? 'source-map' : 'eval',
        output: {
            path: __dirname,
            filename: './src/main/webapp/resources/js/bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: [/node_modules/],
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react', 'stage-2'],
                            plugins: ['transform-decorators']
                        }
                    }],
                }
            ]
        },
        plugins
    };
};