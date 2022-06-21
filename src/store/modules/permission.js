import { GetUserRole } from "@/api/user"
// 引入默认路由和动态路由，用于用户系统匹配
import { defaultRouterMap, asyncRouterMap } from "@/router";

function hasPermission(role, router) {
  // console.log(role); // ['sale', 'technician', 'manager',]用户的角色
  // console.log(router.meta.role); // ['sale']路由带的角色

  // router.meta存在并且角色存在的情况下执行路由匹配操作
  if (router.meta && router.meta.role) {
    // some()方法: 判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true
    // A.inindexOf(B): 获取B在A中的索引位置
    // 判断 用户所拥有的每项角色 是否 存在于 router.meta.role配置的角色中，处在就返回true
    let flag = role.some(item => {
      return router.meta.role.indexOf(item) >= 0
    })

    return flag;
  }

}


const state = {

  // 新增的路由
  newAddRouter: [],
  // 整体所有的路由 ,其默认等于 引入的默认路由
  allRouters: defaultRouterMap,
}
const getters = {

  newAddRouter: state => state.newAddRouter, // 新增的路由
  allRouters: state => state.allRouters, // 整体所有的路由
}
// 提交方法， 改变state中的值（同步）
const mutations = {

  // 设置路由
  SET_ROUTER(state, router) {
    state.newAddRouter = router; // 匹配出来的动态路由
    state.allRouters = defaultRouterMap.concat(router); // 整体所有路由 = 默认路由 + 匹配出来的动态路由
    // console.log(state.newAddRouter)
    // console.log(state.allRouters)
  }
}
const actions = {// 提交mutations中的方法并运行 (直接commit中的方法，或运行异步代码返回出去，回调处理事情)

  // 获取用户角色
  GET_USER_ROLE(content, state) {
    return new Promise((res, rej) => {
      GetUserRole().then(response => {
        let data = response.data.data;
        // GetUserRole接口需要调用成功后才能进入下一步
        res(data); // 告诉外面接口请求完毕  此时表示接口已经调用成功
      }).catch(error => { })
    })
  },

  // 创建动态路由
  GET_ASYNC_ROUTER(content, data) {
    return new Promise((res, rej) => {
      // ['infoSystem', 'userSystem',] 拿到data角色,将其存储起来,通过返回的角色来进行路由的匹配
      let role = data;

      let newAddRouter = [];

      if (role.includes("admin")) { // 超级管理员
        newAddRouter = asyncRouterMap;

      } else { // 普通管理员
        // 对引入的动态路由进行过滤，与role用户角色进行匹配，过滤出对应的动态路由
        newAddRouter = asyncRouterMap.filter(item => {
          if (hasPermission(role, item)) {

            /** 
             * ----------------2、以角色分配权限-------------
             * 
            */
            // 肯定需要优先判断子级路由,有就处理，反之不处理
            if (item.children && item.children.length > 0) {

              // 循环过滤子级 匹配符合的路由 将路由集交给当前的children
              item.children = item.children.filter(childItem => {
                if (hasPermission(role, childItem)) {
                  return childItem
                }
              })

            }

            return item; // 满足条件就过滤出改路由
          }



          /**
           * 
           * -------------------1、以下代码是以系统来分配路由-----------------
           * 
           */
          // ES6 includes() 数组方法判断动态路由中的每一项的system是否包含与role用户角色中，若是就将该路由返回出去赋值
          // if (role.includes(item.meta.system)) {
          //   return item;
          // }
        })

        // 最后需要将404页面加加进去，因为404每种情况都必须要有
        newAddRouter.push(asyncRouterMap[asyncRouterMap.length - 1]);
      };




      // 匹配得到该用户的角色所对应的动态路由后， 调用mutations中的SET_ROUTER方法，更新路由
      content.commit("SET_ROUTER", newAddRouter);

      // 处理完路由后要告诉外面路由已经更新完毕
      res("Route update completed.")
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
