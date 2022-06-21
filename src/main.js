import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCompositionApi from '@vue/composition-api';
import "./icons"; /* 自定义全局组件 */
import './router/defend.js'
// 引入 全局方法  1、权限按钮-全局方法实现
import global from "./utils/global"
// 2、权限按钮-自定义权限按钮指令实现
import "./utils/btnPremission.js"
// 高德地图
import "./plugin/aMap";


Vue.use(VueCompositionApi);

Vue.use(ElementUI);

Vue.use(global); // 注册全局方法

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
