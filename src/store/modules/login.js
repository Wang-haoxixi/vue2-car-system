import { Login } from "@/api/login.js";
import Cookies from 'js-cookie'

const state = {
  // 是否收缩菜单
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
}
const getters = {}
// 提交方法， 改变state中的值（同步）

const mutations = {
  // 改变导航菜单收缩状态
  SET_COLLAPSE(state) {
    console.log('login..')
    // 每次点击收缩菜单按钮都进行cookie存储状态值
    state.isCollapse = !state.isCollapse;
    // Cookies.set("isCollapse", state.isCollapse);
    sessionStorage.setItem("isCollapse", state.isCollapse);
  },
}
const actions = {// 提交mutations中的方法并运行 (直接commit中的方法，或运行异步代码返回出去，回调处理事情)
  LOGINING(content, data) {
    return new Promise((res, rej) => {
      Login(data).then((response) => {
        // 成功的回调
        res(response)
      }).catch(err => {
        // 失败的回调
        rej(err)
      })
    })
  }
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
