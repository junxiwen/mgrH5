'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    isDebug: true,
    uriBase: '"/testApi"',
    cdnBase: '"http://192.168.0.150:8090"',
    // Various Dev Server settings
    host: '192.168.0.150', // can be overwritten by process.env.HOST
    port: 8090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/testApi': {
        target: 'http://192.168.0.150:5050',
        changeOrigin: true,
        pathRewrite: {
          '^/testApi/': '/'
        }
      }
    },
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    isDebug: false,

    /**
     * 线上
     */
    // uriBase: '"https://mgr.ganggaojuejin.net/ggjj2MgrApi"',
    // cdnBase: '"https://cdn.ganggaojuejin.net"',
    // assetsPublicPath: 'https://mgr.ganggaojuejin.net/',
    uriBase: '"http://106.12.18.6:80/ysMgrApi"',
    cdnBase: '"http://106.12.18.6:80"',
    assetsPublicPath: 'http://106.12.18.6:80',

    index: path.resolve(__dirname, '../ysMgr/index.html'),
    assetsRoot: path.resolve(__dirname, '../ysMgr'),
    assetsSubDirectory: 'static',

    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
