/**
 * 车辆管理
 */
import service from "@/utils/request.js";

// 新增车辆
export function AddCar(data) {
    return service.request({
        method: 'post',
        url: '/cars/add/',
        data,
    })
}
// 车辆禁启用
export function carStatus(data) {
    return service.request({
        method: 'post',
        url: '/cars/status/',
        data,
    })
}
// 车辆删除
export function carDelete(data) {
    return service.request({
        method: 'post',
        url: '/cars/delete/',
        data,
    })
}
// 车辆详情
export function carDetailed(data) {
    return service.request({
        method: 'post',
        url: '/cars/detailed/',
        data,
    })
}
// 车辆编辑
export function carEdit(data) {
    return service.request({
        method: 'post',
        url: '/cars/edit/',
        data,
    })
}