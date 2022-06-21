const path = require('path');
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // 输出文件目录
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /**
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["./src/icons"]
      });
  },
  configureWebpack: (config) => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue': "vue/dist/vue.js",
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname, './src/components'),
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 如发现 css.modules 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      scss: {
        prependData: `@import "./src/styles/main.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    // proxy: { // string | Object  // 设置代理
    //   '/api': {
    //     /* 目标代理服务器地址 */
    //     // target: 'http://old.web-jshtml.cn/productapi/token', // api服务器地址
    //     target: 'http://old.web-jshtml.cn/vue_admin_api/token', // api服务器地址
    //     /* 允许跨域 */
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '' //规定请求地址以什么作为开头
    //     }
    //   },
    // },
    proxy: { // string | Object  // 设置代理
      [process.env.VUE_APP_API]: {
        /* 目标代理服务器地址 */
        // target: 'http://old.web-jshtml.cn/productapi/token', // api服务器地址
        // target: 'http://old.web-jshtml.cn/vue_admin_api/token', // api服务器地址
        target: 'http://old.web-jshtml.cn/api/cars', // api服务器地址
        /* 允许跨域 */
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API]: '' //规定请求地址以什么作为开头
        }
      },
    },
    overlay: { // 全屏模式下是否显示脚本错误
      warnings: true,
      errors: true
    },
    before: app => {
    }
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
}
