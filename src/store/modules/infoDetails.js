const state = {
    // 若页面没刷新，取的是vuex的值，否则取的本地的值
    id: "" || sessionStorage.getItem("infoId"),
    title: "" || sessionStorage.getItem("infoTitle"),
}
const getters = {
    infoId: state => {
        return state.id;
    },
    infoTitle: state => {
        return state.title;
    }
}
// 提交方法， 改变state中的值（同步）
const mutations = {
  SET_ID(state,value){ // 将id存在vuex中
    state.id = value;
    sessionStorage.setItem("infoId", value);
  },
  SET_TITLE(state,value){ // 将title存在vuex中
    state.title = value;
    sessionStorage.setItem("infoTitle", value);  
  }
}
const actions = {// 提交mutations中的方法并运行 (直接commit中的方法，或运行异步代码返回出去，回调处理事情)
  
}
export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}
