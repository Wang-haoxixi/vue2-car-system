/**
 * 汽车品牌
 */
import service from "@/utils/request.js";
// 品牌LOGO
export function BrandLogo(data) {
    return service.request({
        method: 'post',
        url: '/brand/logo/',
        data,
    })
}
// 品牌新增
export function BrandAdd(data) {
    return service.request({
        method: 'post',
        url: '/brand/add/',
        data,
    })
}
// 品牌删除
export function BrandDelete(data) {
    return service.request({
        method: 'post',
        url: '/brand/delete/',
        data,
    })
}
// 品牌禁启用
export function BrandStatus(data) {
    return service.request({
        method: 'post',
        url: '/brand/status/',
        data,
    })
}
// 品牌详情
export function BrandDetailed(data) {
    return service.request({
        method: 'post',
        url: '/brand/detailed/ ',
        data,
    })
}
// 品牌修改
export function BrandEdit(data) {
    return service.request({
        method: 'post',
        url: '/brand/edit/ ',
        data,
    })
}