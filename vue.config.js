'use strict'

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const isProd = process.env.NODE_ENV !== 'development'
console.log(isProd, 'isProd')

const ThemeColorReplacer = require('webpack-theme-color-replacer')
const CopyPlugin = require('copy-webpack-plugin')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
let optimization = {}
if (isProd) {
  optimization = {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
}

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    proxy: 'http://192.168.2.124:9186', // '192.168.2.117:9186', // 'http://192.168.2.107:8889'
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        // @是src的别名(only import individually is working)
        prependData: `
            @import "@/styles/variables/element-variables.scss";
            @import "@/styles/variables/custom-variables.scss";
          `
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'favicon.png',
      maskIcon: 'favicon.png',
      msTileImage: 'favicon.png'
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: 'cos-erp',
    resolve: {
      alias: {
        '@': resolve('src'),
        'bn.js': path.resolve(process.cwd(), 'node_modules', 'bn.js') // avoid repeat packaging
      }
    },
    plugins: [
      // build css which contains theme colors
      new ThemeColorReplacer({
        fileName: 'static/css/theme-colors.[contenthash:8].css',
        matchColors: forElementUI.getElementUISeries('#409EFF'),
        changeSelector: forElementUI.changeSelector
        // isJsUgly: isProd
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, './public/favicon.ico'), to: 'static' }
        ]
      })
    ],
    optimization
  },
  chainWebpack (config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })

      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }

}
