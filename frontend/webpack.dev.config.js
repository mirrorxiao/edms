const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, 'utf-8', function (err, written, buffer){});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: '../404.html',
            template: './src/template/index.ejs',
            inject: false
        }),
    ],
    devServer: {
        proxy: {
            '/auth-web': {
              target: 'https://edms.gd95009.com/',
              //pathRewrite: {'^/auth': '/web-auth'},
              secure: false,
              onProxyRes: function(proxyRes, req, res) {
                var cookies = proxyRes.headers['set-cookie'];
                var cookieRegex = /Path=\/auth-web/i;
                //修改cookie Path
                if (cookies) {
                  var newCookie = cookies.map(function(cookie) {
                    if (cookieRegex.test(cookie)) {
                      return cookie.replace(cookieRegex, 'Path=/');
                    }
                    return cookie;
                  });
                  //修改cookie path
                  delete proxyRes.headers['set-cookie'];
                  proxyRes.headers['set-cookie'] = newCookie;
                }
              }          
            }
        }
    }
});