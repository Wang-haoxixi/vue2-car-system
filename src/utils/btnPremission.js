import Vue from "vue";
import store from "@/store";
// 自定义指令
Vue.directive("btnPrem", {
    bind: function (el, bingind, vnode) { //进页面即调用,父节点未渲染
        // console.log(bingind) //可以拿到绑定的数据和方法

        /**
         * 操作DOM
         */
        let boo = bingind.def.hasPermission(bingind.value); //调用自定义方法 
        if (boo) { // hasPermission返回值为真时将按钮隐藏
            el.style.display = "block";
        }
    },
    inserted: function () { //插入DOM时调用,父节点已渲染

    },
    update: function () {

    },
    componentUpdated: function () {

    },
    unbind: function () {

    },

    // 自定义方法
    // 
    hasPermission: function (premission) {
        // console.log(premission)

        // 获取VUEX中的按钮权限数据 
        let buttons = store.getters["app/btnPerms"]; // ['info.edit', 'info.delete']
        // 获取角色
        let roles = store.getters["app/roles"]; // ['admin']

        // 判断当前用户是否有admin超管角色，若有就直接返回真
        if (roles.includes("admin")) { return true }; 

        // 判断传入的值是否在buttons数组中存在，返回-1说明不存在，>=0说明存在
        return buttons.indexOf(premission) !== -1
    }

    /**
     * 
     * .........这下面还可以设置自定义方法
     * 
     */
})