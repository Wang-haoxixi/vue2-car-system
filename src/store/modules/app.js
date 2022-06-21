import { Login } from "@/api/login.js";
import Cookies from 'js-cookie'
import { setToken, setUserName, getUserName, removeToken, removeUserName } from "@/utils/app.js"

const state = {

  // 用户角色
  roles: [],
  // 按钮权限
  buttonPermissions: [],
  // 指令式按钮权限数据
  btnPerms: [],


  // 是否收缩菜单
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  // token
  token: "",
  // username
  username: getUserName() || "",


}
const getters = {
  // 获取
  roles: state => state.roles,
  buttonPermissions: state => state.buttonPermissions,
  btnPerms: state => state.btnPerms,
}
// 提交方法， 改变state中的值（同步）

const mutations = {

  // 修改roles值
  SET_ROLES(state, value) {
    state.roles = value;
    // console.log('roles:', state.roles)
  },
  // 修改button的权限值
  SET_BUTTON_PERMISSIONS(state, value) {
    state.buttonPermissions = value;
    // console.log('buttonPermissions:', state.buttonPermissions)
  },
  // 指令式修改按钮权限
  SET_BUTTON_PERMISSIONS_2(state, value) {
    state.btnPerms = value;
  },


  // 改变导航菜单收缩状态
  SET_COLLAPSE(state) {
    // 每次点击收缩菜单按钮都进行cookie存储状态值
    state.isCollapse = !state.isCollapse;
    // Cookies.set("isCollapse", state.isCollapse);
    sessionStorage.setItem("isCollapse", state.isCollapse);
  },
  // 设置token
  SET_TOKEN(state, val) {
    state.token = val;
  },
  // 设置username
  SET_USERNAME(state, val) {
    state.username = val;
  }
}
const actions = {// 提交mutations中的方法并运行 (直接commit中的方法，或运行异步代码返回出去，回调处理事情)
  // 登录操作
  LOGINING(content, data) {
    return new Promise((res, rej) => {
      Login(data).then((response) => {
        let data = response.data.data;
        // 将token和username存入状态机
        content.commit("SET_TOKEN", data.token);
        content.commit("SET_USERNAME", data.username);
        // 将token和username存入cookie中
        setToken(data.token);
        setUserName(data.username);
        // 成功的回调
        res(response);
      }).catch(err => {
        // 失败的回调
        rej(err);
      })
    })
  },
  // 退出操作
  EXIT({ commit }) {
    // 将结果回调出去
    return new Promise((res, rej) => {
      // 清除token和username
      removeToken();
      removeUserName();
      commit("SET_TOKEN", "");
      commit("SET_USERNAME", "");
      commit("SET_ROLES", []); // 清除roles
      res();//不传值了
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
