/**
 * 用户
 */
import service from "@/utils/request.js";

// 获取角色
export function GetRoles(data) {
    return service.request({
        method: 'post',
        url: '/role/',
        data,
    })
}

// 获取菜单（根据系统类型获取）
export function GetSystem(data) {
    return service.request({
        method: 'post',
        url: '/system/',
        data,
    })
}

// 用户角色（登录获取权限）
export function GetUserRole(data) {
    return service.request({
        method: 'post',
        url: '/userRole/',
        data,
    })
}

// 获取按钮权限
export function GetPermButton(data) {
    return service.request({
        method: 'post',
        url: '/permButton/',
        data,
    })
}

// 添加用户
export function UserAdd(data) {
    return service.request({
        method: 'post',
        url: '/user/add/',
        data,
    })
}

// 编辑用户
export function UserEdit(data) {
    return service.request({
        method: 'post',
        url: '/user/edit/',
        data,
    })
}

// 删除用户
export function UserDelete(data) {
    return service.request({
        method: 'post',
        url: '/user/delete/',
        data,
    })
}

// 用户禁启用
export function UserActives(data) {
    return service.request({
        method: 'post',
        url: '/user/actives/',
        data,
    })
}

