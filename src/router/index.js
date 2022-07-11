import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/views/Layout"

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter);


/**
 * 
 *  1、系统分配
 *  2、角色分配
 * 
 * 
 */


/**
 * 
 * 系统分配：
 *      默认路由 ---> 所有人均可访问
 *      动态路由 ---> 拥有权限的人可以访问
 * 
 */

/**
 * 
 * 默认路由
 * 
 */
export const defaultRouterMap = [  // 暴露出去 ,然后到permission store模块中引入，用于匹配用户系统

  {
    path: "/",
    redirect: "login",
    hidden: true, // 隐藏菜单
    meta: {
      name: "主页",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/index.vue"),
    hidden: true,
    meta: {
      name: "登录",
    },
  },
  {
    path: "/console",
    name: "Console",
    redirect: "/index",
    component: Layout,
    meta: {
      name: "控制台",
      icon: "console",
    },
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("../views/Console/index.vue"),
        meta: {
          name: "首页",
        },
      },
    ]
  },

  // --------------------------------------------------
  // 租车管理端路由
  // --------------------------------------------------

  {
    path: "/parking",
    name: "Parking",
    component: Layout,
    meta: {
      name: "停车场",
      icon: "console",
    },
    children: [
      {
        path: "/parkingIndex",
        name: "ParkingIndex",
        component: () => import("../views/Parking/index.vue"),
        meta: {
          name: "停车场管理",
        },
      },
      {
        path: "/parkingAdd",
        name: "ParkingAdd",
        component: () => import("../views/Parking/add.vue"),
        meta: {
          name: "新增停车场",
        },
      },
    ]
  },
  {
    path: "/carBrand",
    name: "CarBrand",
    component: Layout,
    meta: {
      name: "车辆品牌",
      icon: "console",
    },
    children: [
      {
        path: "/carBrandIndex",
        name: "CarBrandIndex",
        component: () => import("../views/CarBrand/index.vue"),
        meta: {
          name: "品牌列表",
        },
      },
    ]
  },
  {
    path: "/cars",
    name: "Cars",
    component: Layout,
    meta: {
      name: "车辆管理",
      icon: "console",
    },
    children: [
      {
        path: "/carsIndex",
        name: "CarsIndex",
        component: () => import("../views/Cars/index.vue"),
        meta: {
          name: "车辆列表",
        },
      },
      {
        path: "/carsAdd",
        name: "CarsAdd",
        component: () => import("../views/Cars/add.vue"),
        meta: {
          name: "新增车辆",
        },
      },
      {
        path: "/attr",
        name: "Attr",
        component: () => import("../views/Cars/attrList.vue"),
        meta: {
          name: "车辆属性",
        },
      },
    ]
  },

  // 404页面
  {
    path: "/page404",
    component: Layout,
    hidden: true,
    meta: {
      name: "404",
      icon: "404",
    },
    // redirect: "/404",
    children: [
      {
        path: "/404",
        component: () => import("../views/page404.vue"),
        meta: {
          name: "404",
        },
      },
    ]
  },

  // --------------------------------------------------
  // 租车管理端路由
  // --------------------------------------------------

];





const routes = defaultRouterMap;
const router = new VueRouter({
  routes,
});

export default router;





/**
 * 
 * 动态路由  
 * 角色：[sale,technician,manager] [业务员,技术员,部门经理]
 * 
 */
export const asyncRouterMap = [ // 暴露出去


  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      role: ["sale", "manager"], // 分配角色
      system: "infoSystem", // 自定义属性key，可以通过登录的时候获取的用户角色来匹配该用户的系统权限
      name: "信息管理",
      icon: "info",
    },
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        component: () => import("../views/Info/index.vue"),
        meta: {
          role: ["sale"],
          name: "信息列表",
          keepAlive: true, // 是否需要缓存路由
        },
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        component: () => import("../views/Info/category.vue"),
        meta: {
          role: ["sale", "manager"],
          name: "信息分类",
          keepAlive: true, // 是否需要缓存路由
        },
      },
      {
        path: "/details",
        name: "Details",
        hide: true, //自定义hide属性用于判断改路由是否在左侧菜单显示
        component: () => import("../views/Info/details.vue"),
        meta: {
          role: ["sale"],
          name: "信息详情",
          keepAlive: true, // 是否需要缓存路由
        },
      },
    ]
  },

  {
    path: "/user",
    name: "User",
    component: Layout,
    meta: {
      role: ["sale"],
      system: "userSystem",
      name: "用户管理",
      icon: "user",
    },
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        component: () => import("../views/User/index.vue"),
        meta: {
          role: ["sale"],
          name: "用户列表",
        },
      },
    ]
  },

  // 404页面配置一定要放在所有路由的最末尾，不然有可能会一直匹配到星号，从而重定向到404页面
  {
    path: "*", // 地址匹配不到时就重定向至404页面
    redirect: "/404",
    hidden: true,
  }

];
