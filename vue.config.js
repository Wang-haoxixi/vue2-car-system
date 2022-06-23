console.log(111111)
console.log("-----------")
const path = require('path');
console.log("env: ", process.env.NODE_ENV, process.env.VUE_APP_API);
module.exports = {
  // 基本路径
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // 输出文件目录 (// 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）)
  outputDir: process.env.NODE_ENV === 'production' ? 'production_dist' : 'test_dist',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: false,
  // 生产环境是否生成 sourceMap 文件, 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // 在生产构建中使用babel & TS线程加载器 
  // 如果机器有超过1个核，则默认启用 
  parallel: require('os').cpus().length > 1,
  /**
   * css相关配置
   */
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        prependData: `@import "./src/styles/main.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
  },
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
  /**
   * 配置解析别名
   */
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue': "vue/dist/vue.js",
        '@': path.resolve(__dirname, './src'),
        '@c': path.resolve(__dirname, './src/components'),
      }
    }
  },
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  /**
   * webpack-dev-server 相关配置
   */
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
    before: app => {}
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
}