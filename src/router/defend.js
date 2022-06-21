
/**
 * 防止非法进入控制台(安全处理,通过有无token进行判断)  [路由守卫]
*/

import store from "../store/index"
import router from "./index";
import { getToken, removeToken, removeUserName } from '@/utils/app.js'
// 设置白名单
const whiteRoute = ["/login"];

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (getToken()) {
    /**
     * 1、to == /console
     * 2、tp == /index
    */
    // console.log('存在tk')
    if (to.path === "/login") {
      // 若用户直接退出到登录页，则清除token，再次进入控制台需要重新登录
      removeToken();
      removeUserName();
      store.commit("app/SET_TOKEN", "");
      store.commit("app/SET_USERNAME", "");
      next();
    } else {
      // 获取用户角色
      // 动态路由分配
      /**
       * 问题？
       * 1、什么时候处理动态路由 ----> 登录之后，进入主页之前
       * 2、以什么条件处理动态路由 ----> 通过登录时获取用户角色，判断用户所拥有的角色来处理动态路由
       */
      // console.log('defend_roles111:', store.getters["permission/roles"])
      // if (store.getters["app/roles"].length === 0) { // 判断vuex中的角色数组若为空，就调用vuex中获取角色的方法GET_USER_ROLE 得到角色数组
      //   store.dispatch("permission/GET_USER_ROLE").then(response => {
      //     // console.log('defend_roles222:', store.getters["permission/roles"])
      //     let role = response.role
      //     let button = response.button // 全局注册的按钮权限方式
      //     let btnPerms = response.btnPerm
      //     // 修改buttonPermissions的值
      //     store.commit("app/SET_BUTTON_PERMISSIONS", button);
      //     // 修改按钮权限
      //     store.commit("app/SET_BUTTON_PERMISSIONS_2", btnPerms);
      //     // 1、调用app中的 mutations中的 SET_ROLES 给roles赋值
      //     // 2、得到role用户角色后，再次调用VUEX中创建动态路由的方法GET_ASYNC_ROUTER,并传值,GET_ASYNC_ROUTER方式用于匹配路由
      //     store.commit("app/SET_ROLES", role);
      //     store.dispatch("permission/GET_ASYNC_ROUTER", role).then(response => {

      //       console.log(response);

      //       let newAddRouter = store.getters["permission/newAddRouter"]; //新增的动态路由
      //       let allRouters = store.getters["permission/allRouters"]; //全部路由

      //       // 向indexjs中添加动态路由
      //       router.addRoutes(newAddRouter);
      //       // 手动刷新router中routes数组,将获取的所有的的路由赋值给他
      //       // console.log(router)
      //       router.options.routes = allRouters;

      //       // ...to: 防止内容发生变化的情况
      //       next({ ...to, replace: true }); // 放行 // next() vue-router  @3.0.7版本不会报错冒红



      //     })
      //   })

      // } else {  // 不等于0说明已请求过，进去到首页了
      //   console.log('store.getters["permission/roles"].length 不等于 0, 说明已请求过获取用户角色的接口了,VUEX中已有用户角色role数据,直接放行.')
      //   next(); // 放行

      // }


      next(); // **放行进入到index控制台页面 直接放行当前的to.path，不会再进入beforeEach循环中**
    }
  } else {
    // console.log('不存在tk')
    if (whiteRoute.indexOf(to.path) === -1) {
      next('login') // 路由指向
    } else {
      next() // to
    }
    next()//放行
  }
  // console.log(to)//进入下一个页面
  // console.log(from)//离开之前的页面（上一个）
})