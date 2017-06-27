/**
 * Created by Petr on 2/26/2017.
 */
const webpack = require('webpack');
const path = require('path');

module.exports = function(){
    const isProd = process.env.NODE_ENV === 'prod';
    //Create vendor bundle
    console.log('test enviromentu ', process.env.NODE_ENV);
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
            }),
            new webpack.DefinePlugin({
                BASE_URL: JSON.stringify('')
            })
        )
    }else {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new webpack.DefinePlugin({
                BASE_URL: JSON.stringify('http://localhost:8081/reporting')
            })
        );
    }
    return {
        entry: {
            app: './src/main/js/app.js',
            vendor: [
                'lodash',
                'whatwg-fetch',
                'recharts',
                'react',
                'react-dom',
                'react-redux',
                'react-router',
                'react-loader-advanced',
                'react-bootstrap',
                'redux',
                'redux-thunk',
                'redux-logger',
                'redux-promise-middleware',
                'babel-polyfill',
                'fastpriorityqueue',
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