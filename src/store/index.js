import Vue from "vue";
import Vuex from "vuex";


Vue.use(Vuex);
// console.log(JSON.parse(Cookies.get("isCollapse")))


import app from './modules/app'
import login from './modules/login'
import common from './modules/common'
import infoDetails from './modules/infoDetails'
import permission from './modules/permission'
import config from './modules/config'
export default new Vuex.Store({

  modules: {
    app,
    login,
    common,
    infoDetails,
    permission,
    config
  },
});