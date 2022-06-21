/**
 * 
 * 按钮权限设置
 * 
 *  */
import store from "@/store";

export function buttonPermissions(permission) {
    // 获取VUEX中的按钮权限数据
    let buttons = store.getters["app/buttonPermissions"]; // ['info.edit', 'info.delete']

    // 判断传入的值是否在buttons数组中存在，返回-1说明不存在，>=0说明存在
    return buttons.indexOf(permission) !== -1
}