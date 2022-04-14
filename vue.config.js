'use strict'
const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  publicPath: process.env.NODE_ENV === 'production' ? '/json-schema-editor/' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  configureWebpack: {
    name: 'json-schema-editor',
    /**
     * 快捷引用
     */
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin())
  }
}
